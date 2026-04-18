"""
Landing Page View - Shows API welcome message and available endpoints
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def landing_page(request):
    """
    Welcome page for the AI Prosthetic Limb Control System API.
    Shows available endpoints and system status.
    """
    
    # Check if backend is healthy
    try:
        from core.models import SensorData, DeviceToken
        from django.utils import timezone
        from datetime import timedelta
        
        total_readings = SensorData.objects.count()
        
        # Check for active devices (seen in last 5 minutes)
        cutoff = timezone.now() - timedelta(minutes=5)
        active_devices = DeviceToken.objects.filter(
            is_active=True, 
            last_seen__gte=cutoff
        ).count()
        
        system_status = "healthy"
    except Exception as e:
        total_readings = 0
        active_devices = 0
        system_status = f"error: {str(e)}"
    
    data = {
        'message': '🦾 Welcome to the AI Prosthetic Limb Control System API!',
        'version': '1.0.0',
        'status': system_status,
        'description': 'Real-time bionic limb control with EMG monitoring and AI gesture prediction.',
        
        'available_endpoints': {
            'Authentication': {
                'POST /api/token/': 'Obtain JWT token (login)',
                'POST /api/token/refresh/': 'Refresh JWT token',
            },
            'Dashboard & Real-Time Data': {
                'GET /api/v1/dashboard/': 'Get dashboard stats (JWT required)',
                'GET /api/v1/sensors/': 'List sensor readings (JWT required)',
                'GET /api/v1/settings/current/': 'Get current limb settings (JWT required)',
                'GET /api/v1/logs/': 'Get system logs (JWT required)',
            },
            'Hardware Control': {
                'POST /api/v1/hardware/push/': 'Hardware sends sensor data (Device Token required)',
                'GET /api/v1/hardware/commands/': 'Hardware polls for commands (Device Token required)',
                'POST /api/v1/commands/send/': 'Send manual command (JWT required)',
                'POST /api/v1/commands/emergency-stop/': 'Emergency stop (JWT required)',
            },
            'Device Management': {
                'GET /api/v1/device-token/': 'Get hardware device token (JWT required)',
                'POST /api/v1/device-token/': 'Regenerate device token (JWT required)',
            },
            'Training Mode': {
                'POST /api/v1/training/record/': 'Record labeled gesture sample (JWT required)',
                'GET /api/v1/training/record/': 'Get training statistics (JWT required)',
            },
            'User Management': {
                'POST /api/v1/register/': 'Register new user',
                'GET /api/v1/profile/': 'Get user profile (JWT required)',
                'GET /api/v1/patients/': 'List patients (Healthcare/Admin only)',
            },
            'Admin & Analytics': {
                'GET /api/v1/aggregate-stats/': 'System-wide statistics (Healthcare/Admin only)',
                'GET /admin/': 'Django admin panel (staff only)',
            },
        },
        
        'system_stats': {
            'total_sensor_readings': total_readings,
            'active_hardware_devices': active_devices,
        },
        
        'quick_start': {
            'step_1': 'Login: POST /api/token/ with username/password',
            'step_2': 'Use returned access_token in Authorization header: Bearer <token>',
            'step_3': 'Access endpoints like /api/v1/dashboard/',
        },
        
        'documentation': {
            'frontend': 'http://localhost:5173',
            'admin': 'http://127.0.0.1:8000/admin/',
        },
    }
    
    return Response(data)
