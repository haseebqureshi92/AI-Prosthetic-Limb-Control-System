from rest_framework import viewsets, status, permissions, generics
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes as pc
from rest_framework.views import APIView
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Count, Avg

from .models import User, SensorData, LimbSettings, SystemLog, DeviceToken, ControlCommand
from .serializers import (
    UserSerializer, UserRegistrationSerializer, SensorDataSerializer,
    LimbSettingsSerializer, SystemLogSerializer, DeviceTokenSerializer, ControlCommandSerializer
)
from .ai_processing import predict_gesture, is_signal_noisy


# ──────────────────────────────────────────────────────────────────────────────
# AUTHENTICATION VIEWS
# ──────────────────────────────────────────────────────────────────────────────

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRegistrationSerializer


class UserProfileView(APIView):
    """
    GET /api/v1/profile/
    Returns the authenticated user's profile including their actual role.
    Used by the frontend after login to confirm the real role stored in the DB.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id':       user.id,
            'username': user.username,
            'email':    user.email,
            'role':     user.role,
        })


class PatientListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role in ('healthcare', 'admin'):
            return User.objects.filter(role='patient')
        return User.objects.filter(id=self.request.user.id)


# ──────────────────────────────────────────────────────────────────────────────
# SENSOR DATA
# ──────────────────────────────────────────────────────────────────────────────

class SensorDataViewSet(viewsets.ModelViewSet):
    queryset = SensorData.objects.all()
    serializer_class = SensorDataSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SensorData.objects.filter(patient=self.request.user)


# ──────────────────────────────────────────────────────────────────────────────
# LIMB SETTINGS
# ──────────────────────────────────────────────────────────────────────────────

class LimbSettingsViewSet(viewsets.ModelViewSet):
    queryset = LimbSettings.objects.all()
    serializer_class = LimbSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj, created = LimbSettings.objects.get_or_create(user=self.request.user)
        return obj

    @action(detail=False, methods=['get', 'patch'])
    def current(self, request):
        settings = self.get_object()
        if request.method == 'PATCH':
            serializer = self.get_serializer(settings, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        serializer = self.get_serializer(settings)
        return Response(serializer.data)


# ──────────────────────────────────────────────────────────────────────────────
# SYSTEM LOGS
# ──────────────────────────────────────────────────────────────────────────────

class SystemLogViewSet(viewsets.ModelViewSet):
    queryset = SystemLog.objects.all()
    serializer_class = SystemLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SystemLog.objects.filter(user=self.request.user)


# ──────────────────────────────────────────────────────────────────────────────
# DASHBOARD STATS
# ──────────────────────────────────────────────────────────────────────────────

class DashboardStatsView(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        user = request.user
        latest_data = SensorData.objects.filter(patient=user).first()
        settings = LimbSettings.objects.get_or_create(user=user)[0]

        # Get device token status
        try:
            device_token = DeviceToken.objects.get(user=user)
            hw_connected = device_token.is_active and device_token.last_seen is not None
            last_seen = device_token.last_seen.isoformat() if device_token.last_seen else None
        except DeviceToken.DoesNotExist:
            hw_connected = False
            last_seen = None

        # Latest AI prediction
        ai_result = None
        if latest_data:
            ai_result = predict_gesture(
                latest_data.emg_value, latest_data.force_value,
                latest_data.motion_x, latest_data.motion_y, latest_data.motion_z,
                settings.sensitivity
            )

        stats = {
            "battery_level":    latest_data.battery_level if latest_data else 100,
            "status":           "Online" if settings.is_active else "Sleep",
            "sensitivity":      settings.sensitivity,
            "speed":            settings.speed,
            "latest_emg":       latest_data.emg_value if latest_data else 0,
            "latest_force":     latest_data.force_value if latest_data else 0,
            "hw_connected":     hw_connected,
            "hw_last_seen":     last_seen,
            "ai_gesture":       ai_result['label'] if ai_result else "No Data",
            "ai_confidence":    ai_result['confidence_pct'] if ai_result else 0,
            "motor_angles":     ai_result['motor_angles'] if ai_result else {},
            "recent_logs":      SystemLogSerializer(
                                    SystemLog.objects.filter(user=user)[:5], many=True
                                ).data
        }
        return Response(stats)


# ──────────────────────────────────────────────────────────────────────────────
# DEVICE TOKEN MANAGEMENT
# ──────────────────────────────────────────────────────────────────────────────

class DeviceTokenView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Get or create the device token for this user's hardware."""
        token, created = DeviceToken.objects.get_or_create(user=request.user)
        return Response({
            'token':       token.token,
            'device_name': token.device_name,
            'is_active':   token.is_active,
            'last_seen':   token.last_seen.isoformat() if token.last_seen else None,
            'created_at':  token.created_at.isoformat(),
        })

    def post(self, request):
        """Regenerate a new token (e.g. after device is lost/replaced)."""
        import secrets
        token, created = DeviceToken.objects.get_or_create(user=request.user)
        token.token = secrets.token_hex(32)
        token.save()
        return Response({'token': token.token, 'message': 'Token regenerated. Re-flash firmware.'})


# ──────────────────────────────────────────────────────────────────────────────
# HARDWARE PUSH API  (SRS §4.4 — REST API for hardware communication)
# ──────────────────────────────────────────────────────────────────────────────

class HardwarePushView(APIView):
    """
    ┌─────────────────────────────────────────────────────────────────────┐
    │  ARDUINO / ESP32 ENDPOINT                                           │
    │  POST /api/v1/hardware/push/                                        │
    │  Header: X-Device-Token: <token from DeviceToken model>            │
    │                                                                     │
    │  Body (JSON):                                                       │
    │  {                                                                  │
    │    "emg": 512,        // raw ADC value 0–1023                      │
    │    "force": 2.4,      // Newtons from FSR                          │
    │    "motion_x": 0.12,  // MPU6050 X-axis                           │
    │    "motion_y": -0.05, // MPU6050 Y-axis                           │
    │    "motion_z": 0.98,  // MPU6050 Z-axis (gravity ≈ 1.0)          │
    │    "battery": 87      // battery % from voltage divider            │
    │  }                                                                  │
    │                                                                     │
    │  Response (JSON):                                                   │
    │  {                                                                  │
    │    "command":     "GRIP",                                           │
    │    "sensitivity": 75,                                               │
    │    "speed":       60,                                               │
    │    "gesture":     "Power Grip",                                     │
    │    "confidence":  94.8,                                             │
    │    "motor_angles": {...}                                            │
    │  }                                                                  │
    └─────────────────────────────────────────────────────────────────────┘
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # 1. Authenticate device via API key header
        token_value = request.headers.get('X-Device-Token')
        if not token_value:
            return Response({'error': 'Missing X-Device-Token header'}, status=401)

        try:
            device = DeviceToken.objects.select_related('user').get(
                token=token_value, is_active=True
            )
        except DeviceToken.DoesNotExist:
            return Response({'error': 'Invalid or inactive device token'}, status=403)

        user = device.user

        # 2. Update device last_seen timestamp
        device.last_seen = timezone.now()
        device.save(update_fields=['last_seen'])

        # 3. Parse incoming sensor data
        data = request.data
        try:
            emg_value   = float(data.get('emg', 0))
            force_value = float(data.get('force', 0))
            motion_x    = float(data.get('motion_x', 0))
            motion_y    = float(data.get('motion_y', 0))
            motion_z    = float(data.get('motion_z', 1))
            battery     = int(data.get('battery', 100))
        except (TypeError, ValueError):
            return Response({'error': 'Invalid sensor data format'}, status=400)

        # 4. Get user settings for AI sensitivity
        settings = LimbSettings.objects.get_or_create(user=user)[0]

        # 5. Run AI gesture prediction (SRS §3.1 UC-1)
        ai_result = predict_gesture(
            emg_value, force_value, motion_x, motion_y, motion_z,
            settings.sensitivity
        )

        # 6. Safety check — noisy signal triggers auto-freeze (SRS §5.2)
        if ai_result['is_noisy']:
            # Log a warning
            SystemLog.objects.create(
                user=user,
                event_name='Signal Noise Detected',
                message=f'EMG variance too high (EMG={emg_value:.1f}). Auto-freeze triggered.',
                level='warning',
                performance_metric=0.0
            )
            # Override command to STOP for safety
            ai_result['hw_command'] = 'STOP'

        # 7. Save sensor reading to database with AI prediction
        SensorData.objects.create(
            patient=user,
            emg_value=emg_value,
            force_value=force_value,
            motion_x=motion_x,
            motion_y=motion_y,
            motion_z=motion_z,
            battery_level=battery,
            predicted_gesture=ai_result['gesture'],
            ai_confidence=ai_result['confidence']
        )

        # 8. Check for any pending manual commands from the web (overrides AI)
        pending_cmd = ControlCommand.objects.filter(
            user=user, status='pending'
        ).first()

        final_command = ai_result['hw_command']
        if pending_cmd:
            final_command = pending_cmd.command
            pending_cmd.status = 'delivered'
            pending_cmd.executed_at = timezone.now()
            pending_cmd.save()

        # 9. Build response for Arduino
        return Response({
            'command':      final_command,
            'sensitivity':  settings.sensitivity,
            'speed':        settings.speed,
            'is_active':    settings.is_active,
            'gesture':      ai_result['label'],
            'confidence':   ai_result['confidence_pct'],
            'motor_angles': ai_result['motor_angles'],
            'filtered_emg': ai_result['filtered_emg'],
        })


# ──────────────────────────────────────────────────────────────────────────────
# HARDWARE COMMAND POLLING
# ──────────────────────────────────────────────────────────────────────────────

class HardwareCommandView(APIView):
    """
    GET /api/v1/hardware/commands/
    Header: X-Device-Token: <token>
    
    Returns the latest pending command for the device to execute.
    Used by hardware that can't always process the response from /push/.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        token_value = request.headers.get('X-Device-Token')
        try:
            device = DeviceToken.objects.select_related('user').get(
                token=token_value, is_active=True
            )
        except DeviceToken.DoesNotExist:
            return Response({'error': 'Invalid token'}, status=403)

        cmd = ControlCommand.objects.filter(
            user=device.user, status='pending'
        ).first()

        if cmd:
            cmd.status = 'delivered'
            cmd.executed_at = timezone.now()
            cmd.save()
            return Response({'command': cmd.command, 'id': cmd.id})

        return Response({'command': None})


# ──────────────────────────────────────────────────────────────────────────────
# WEB CONTROL COMMAND SENDER
# ──────────────────────────────────────────────────────────────────────────────

class SendCommandView(APIView):
    """
    POST /api/v1/commands/send/
    JWT authenticated — doctors or patients send commands from the web.
    
    Body: { "command": "GRIP" }
    """
    permission_classes = [permissions.IsAuthenticated]

    VALID_COMMANDS = ['GRIP', 'RELEASE', 'ROTATE_CW', 'ROTATE_CCW', 'PINCH', 'STOP', 'SLEEP', 'CALIBRATE']

    def post(self, request):
        command = request.data.get('command', '').upper()
        if command not in self.VALID_COMMANDS:
            return Response({'error': f'Invalid command. Choose from: {self.VALID_COMMANDS}'}, status=400)

        cmd = ControlCommand.objects.create(
            user=request.user,
            command=command,
            issued_by='web',
        )

        # Log the command (SRS §3.2)
        SystemLog.objects.create(
            user=request.user,
            event_name=f'Manual Command: {command}',
            message=f'Command "{command}" issued from web dashboard.',
            level='info' if command != 'STOP' else 'warning',
        )

        return Response({
            'status':  'queued',
            'command': command,
            'id':      cmd.id,
        })


# ──────────────────────────────────────────────────────────────────────────────
# EMERGENCY STOP  (SRS §5.2 Safety Requirements)
# ──────────────────────────────────────────────────────────────────────────────

class EmergencyStopView(APIView):
    """
    POST /api/v1/commands/emergency-stop/
    Immediately queues a STOP command AND disables the limb settings.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user

        # Disable limb at settings level
        settings = LimbSettings.objects.get_or_create(user=user)[0]
        settings.is_active = False
        settings.save()

        # Queue hardware STOP command
        ControlCommand.objects.create(
            user=user,
            command='STOP',
            issued_by='emergency',
        )

        # Log critical event
        SystemLog.objects.create(
            user=user,
            event_name='EMERGENCY STOP ACTIVATED',
            message='Emergency stop triggered from web dashboard. Limb movement frozen.',
            level='error',
            performance_metric=0.0,
        )

        return Response({'status': 'EMERGENCY STOP SENT', 'limb_active': False})


# ──────────────────────────────────────────────────────────────────────────────
# TRAINING MODE  (SRS §3.4 UC-4)
# ──────────────────────────────────────────────────────────────────────────────

class TrainingModeView(APIView):
    """
    POST /api/v1/training/record/
    Records a labeled gesture sample for future AI model training.
    
    Body: { "gesture": "GRIP", "duration_sec": 30 }
    Returns: training statistics summary
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        gesture_label = request.data.get('gesture', 'UNKNOWN').upper()
        
        # Get last 50 sensor readings for this user (training window)
        recent_readings = SensorData.objects.filter(patient=request.user)[:50]
        
        if not recent_readings:
            return Response({
                'status': 'error',
                'message': 'No sensor data found. Connect hardware or generate simulation data first.'
            }, status=400)

        # Update gesture labels on recent readings
        for reading in recent_readings:
            reading.predicted_gesture = gesture_label
            reading.save(update_fields=['predicted_gesture'])

        # Log training session
        SystemLog.objects.create(
            user=request.user,
            event_name=f'Training Session: {gesture_label}',
            message=f'Labeled {recent_readings.count()} samples as "{gesture_label}". Model update pending.',
            level='info',
            performance_metric=recent_readings.count(),
        )

        return Response({
            'status':        'recorded',
            'gesture':       gesture_label,
            'samples':       recent_readings.count(),
            'message':       f'{recent_readings.count()} samples labeled as "{gesture_label}". '
                             f'Continue collecting data for all gestures before retraining.',
            'next_step':     'Record samples for: OPEN, GRIP, PINCH, ROTATE, IDLE'
        })

    def get(self, request):
        """Get training data statistics for this user."""
        from django.db.models import Count
        stats = SensorData.objects.filter(patient=request.user).values(
            'predicted_gesture'
        ).annotate(count=Count('id')).order_by('-count')
        
        return Response({
            'training_stats': list(stats),
            'total_samples': SensorData.objects.filter(patient=request.user).count(),
            'recommendation': 'Collect at least 200 samples per gesture for reliable AI training.'
        })


# ──────────────────────────────────────────────────────────────────────────────
# COMMAND HISTORY  (for web dashboard display)
# ──────────────────────────────────────────────────────────────────────────────

class CommandHistoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        commands = ControlCommand.objects.filter(user=request.user)[:20]
        return Response(ControlCommandSerializer(commands, many=True).data)


# ──────────────────────────────────────────────────────────────────────────────
# AGGREGATE STATS  (Healthcare Portal — SDS §2.2 Admin/Healthcare view)
# ──────────────────────────────────────────────────────────────────────────────

class AggregateStatsView(APIView):
    """
    GET /api/v1/aggregate-stats/
    Returns system-wide aggregate statistics visible to healthcare/admin users.
    Includes: total patients, total readings, average battery, average AI confidence.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role not in ('healthcare', 'admin'):
            return Response({'error': 'Access restricted to healthcare personnel.'}, status=403)

        total_patients  = User.objects.filter(role='patient').count()
        total_readings  = SensorData.objects.count()
        total_commands  = ControlCommand.objects.count()
        total_logs      = SystemLog.objects.count()
        warning_logs    = SystemLog.objects.filter(level='warning').count()
        error_logs      = SystemLog.objects.filter(level='error').count()

        avg_battery     = SensorData.objects.aggregate(avg=Avg('battery_level'))['avg'] or 0
        avg_confidence  = SensorData.objects.aggregate(avg=Avg('ai_confidence'))['avg'] or 0

        # Gesture distribution
        gesture_counts  = SensorData.objects.values('predicted_gesture').annotate(
            count=Count('id')
        ).order_by('-count')[:5]

        # Connected devices
        from django.utils import timezone as tz
        from datetime import timedelta
        cutoff = tz.now() - timedelta(minutes=5)
        active_devices  = DeviceToken.objects.filter(
            is_active=True, last_seen__gte=cutoff
        ).count()

        return Response({
            'total_patients':    total_patients,
            'total_readings':    total_readings,
            'total_commands':    total_commands,
            'total_logs':        total_logs,
            'warning_logs':      warning_logs,
            'error_logs':        error_logs,
            'avg_battery':       round(avg_battery, 1),
            'avg_confidence':    round(avg_confidence * 100, 1),
            'active_devices':    active_devices,
            'gesture_breakdown': list(gesture_counts),
        })
