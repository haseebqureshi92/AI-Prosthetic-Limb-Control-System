from rest_framework import viewsets, status, permissions, generics
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes as pc
from rest_framework.views import APIView
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Count, Avg
import numpy as np
import random

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

import random
import time

class DashboardStatsView(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def _generate_simulated_data(self, settings):
        """Generate realistic simulated sensor data for demo/development."""
        import math
        
        base_emg = 200 + math.sin(time.time() * 2) * 150
        noise = random.uniform(-20, 20)
        emg_value = max(0, min(1023, base_emg + noise))
        
        base_force = 1.5 + math.sin(time.time() * 1.5) * 0.8
        force_noise = random.uniform(-0.2, 0.2)
        force_value = max(0, min(10, base_force + force_noise))
        
        motion_x = math.sin(time.time() * 3) * 0.3 + random.uniform(-0.05, 0.05)
        motion_y = math.cos(time.time() * 2.5) * 0.2 + random.uniform(-0.05, 0.05)
        motion_z = 1.0 + math.sin(time.time() * 1) * 0.05
        
        gestures = ['Open Hand', 'Power Grip', 'Precision Pinch', 'Wrist Rotation', 'Idle / Resting']
        gesture_weights = [0.2, 0.3, 0.15, 0.15, 0.2]
        
        import numpy as np
        gesture = np.random.choice(gestures, p=gesture_weights)
        
        gesture_map = {
            'Open Hand': 'OPEN',
            'Power Grip': 'GRIP',
            'Precision Pinch': 'PINCH',
            'Wrist Rotation': 'ROTATE',
            'Idle / Resting': 'IDLE',
        }
        
        ai_result = predict_gesture(
            emg_value, force_value, motion_x, motion_y, motion_z,
            settings.sensitivity
        )
        
        battery = max(60, min(100, 85 + random.randint(-5, 5)))
        
        return {
            'emg_value': round(emg_value, 1),
            'force_value': round(force_value, 2),
            'motion_x': round(motion_x, 3),
            'motion_y': round(motion_y, 3),
            'motion_z': round(motion_z, 3),
            'battery_level': battery,
            'ai_gesture': ai_result['label'],
            'ai_confidence': ai_result['confidence_pct'],
            'motor_angles': ai_result['motor_angles'],
            'gesture_code': gesture_map.get(ai_result['label'], 'IDLE'),
        }

    def list(self, request):
        user = request.user
        settings = LimbSettings.objects.get_or_create(user=user)[0]

        # Always generate real-time simulated sensor data
        sim_data = self._generate_simulated_data(settings)

        stats = {
            "battery_level": sim_data['battery_level'],
            "status": "Active - Real-time Software Simulation" if settings.is_active else "Inactive - Software Simulation",
            "sensitivity": settings.sensitivity,
            "speed": settings.speed,
            "latest_emg": sim_data['emg_value'],
            "latest_force": sim_data['force_value'],
            "hw_connected": False,  # No hardware connection needed
            "hw_last_seen": None,
            "ai_gesture": sim_data['ai_gesture'],
            "ai_confidence": sim_data['ai_confidence'],
            "motor_angles": sim_data['motor_angles'],
            "simulation_mode": True,
            "real_time_simulation": True,
            "recent_logs": SystemLogSerializer(
                SystemLog.objects.filter(user=user)[:5], many=True
            ).data
        }

        # Save simulated data to database for historical tracking
        SensorData.objects.create(
            patient=user,
            emg_value=sim_data['emg_value'],
            force_value=sim_data['force_value'],
            motion_x=sim_data['motion_x'],
            motion_y=sim_data['motion_y'],
            motion_z=sim_data['motion_z'],
            battery_level=sim_data['battery_level'],
            predicted_gesture=sim_data['gesture_code'],
            ai_confidence=sim_data['ai_confidence'] / 100
        )

        return Response(stats)


# ──────────────────────────────────────────────────────────────────────────────
# DEVICE TOKEN MANAGEMENT
# ──────────────────────────────────────────────────────────────────────────────

class DeviceTokenView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Hardware tokens are not needed in software simulation mode."""
        return Response({
            'message': 'This system operates in pure software simulation mode. No hardware tokens required.',
            'simulation_mode': True,
            'hardware_needed': False,
        }, status=200)

    def post(self, request):
        """Hardware token regeneration is not applicable in software simulation mode."""
        return Response({
            'message': 'Token regeneration not needed. System runs in software simulation mode.',
            'simulation_mode': True,
        }, status=400)


# ──────────────────────────────────────────────────────────────────────────────
# HARDWARE PUSH API  (SRS §4.4 — REST API for hardware communication)
# ──────────────────────────────────────────────────────────────────────────────

class HardwarePushView(APIView):
    """
    DISABLED: This endpoint is for hardware devices only.
    The system now operates in pure software simulation mode.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response({
            'error': 'Hardware push endpoint disabled. System operates in pure software simulation mode.',
            'simulation_mode': True,
            'hardware_required': False,
        }, status=403)


# ──────────────────────────────────────────────────────────────────────────────
# HARDWARE COMMAND POLLING
# ──────────────────────────────────────────────────────────────────────────────

class HardwareCommandView(APIView):
    """
    DISABLED: Hardware command polling endpoint.
    System operates in pure software simulation mode.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({
            'error': 'Hardware command endpoint disabled. System operates in software simulation mode.',
            'simulation_mode': True,
            'command': None,
        }, status=403)


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
