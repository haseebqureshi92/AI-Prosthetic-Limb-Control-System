from django.db import models
from django.contrib.auth.models import AbstractUser
import secrets

class User(AbstractUser):
    ROLE_CHOICES = (
        ('patient', 'Patient'),
        ('healthcare', 'Healthcare Professional'),
        ('admin', 'Administrator'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='patient')

    def __str__(self):
        return f"{self.username} ({self.role})"

class SensorData(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sensor_data')
    timestamp = models.DateTimeField(auto_now_add=True)
    emg_value = models.FloatField()
    force_value = models.FloatField()
    motion_x = models.FloatField(default=0.0)
    motion_y = models.FloatField(default=0.0)
    motion_z = models.FloatField(default=0.0)
    battery_level = models.IntegerField(default=100)
    # AI prediction fields - populated by ai_processing.py
    predicted_gesture = models.CharField(max_length=50, default='Unknown')
    ai_confidence = models.FloatField(default=0.0)

    class Meta:
        ordering = ['-timestamp']

class LimbSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='settings')
    sensitivity = models.IntegerField(default=75)
    speed = models.IntegerField(default=60)
    actuator_limit = models.IntegerField(default=100)
    is_active = models.BooleanField(default=True)
    last_updated = models.DateTimeField(auto_now=True)

class SystemLog(models.Model):
    LOG_LEVELS = (
        ('info', 'Info'),
        ('warning', 'Warning'),
        ('error', 'Error'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='logs')
    timestamp = models.DateTimeField(auto_now_add=True)
    event_name = models.CharField(max_length=100)
    message = models.TextField()
    level = models.CharField(max_length=10, choices=LOG_LEVELS, default='info')
    emp_id = models.CharField(max_length=50, blank=True, null=True)
    performance_metric = models.FloatField(default=0.0)

    def __str__(self):
        return f"[{self.level}] {self.event_name} - {self.timestamp}"


class DeviceToken(models.Model):
    """
    Hardware authentication model.
    Each patient gets a unique token that is flashed into the Arduino/ESP32 firmware.
    The hardware uses this token (X-Device-Token header) instead of JWT.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='device_token')
    token = models.CharField(max_length=64, unique=True)
    device_name = models.CharField(max_length=100, default='Prosthetic Limb v1')
    is_active = models.BooleanField(default=True)
    last_seen = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = secrets.token_hex(32)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Token for {self.user.username} [{self.device_name}]"


class ControlCommand(models.Model):
    """
    Command queue for the prosthetic limb hardware.
    
    The web system (or doctor) pushes commands here.
    The Arduino polls GET /api/v1/hardware/commands/ and executes the latest pending command.
    
    Command types (SRS §3.2):
    - GRIP        : Close hand (pinch/power grip)
    - RELEASE     : Open hand fully
    - ROTATE_CW   : Wrist rotate clockwise
    - ROTATE_CCW  : Wrist rotate counter-clockwise
    - PINCH       : Precision pinch (index + thumb)
    - STOP        : Emergency stop - freeze all movement (SRS §5.2)
    - SLEEP       : Enter low-power sleep mode
    - CALIBRATE   : Run calibration sequence
    """
    COMMAND_CHOICES = [
        ('GRIP',        'Close Hand (Grip)'),
        ('RELEASE',     'Open Hand (Release)'),
        ('ROTATE_CW',   'Wrist Rotate Clockwise'),
        ('ROTATE_CCW',  'Wrist Rotate Counter-Clockwise'),
        ('PINCH',       'Precision Pinch'),
        ('STOP',        'Emergency Stop'),
        ('SLEEP',       'Sleep Mode'),
        ('CALIBRATE',   'Calibrate Sensors'),
    ]
    STATUS_CHOICES = [
        ('pending',   'Pending'),
        ('delivered', 'Delivered to Hardware'),
        ('executed',  'Executed by Hardware'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='commands')
    command = models.CharField(max_length=20, choices=COMMAND_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    issued_by = models.CharField(max_length=100, default='web')  # 'web', 'ai', 'safety_trigger'
    timestamp = models.DateTimeField(auto_now_add=True)
    executed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.command} → {self.user.username} [{self.status}]"
