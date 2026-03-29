import os
import django
import random
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bionic_backend.settings')
django.setup()

from core.models import User, SensorData, SystemLog, LimbSettings, DeviceToken

GESTURE_LABELS = ['OPEN', 'GRIP', 'PINCH', 'ROTATE', 'IDLE']
GESTURE_HUMAN  = {
    'OPEN':   'Open Hand',
    'GRIP':   'Power Grip',
    'PINCH':  'Precision Pinch',
    'ROTATE': 'Wrist Rotation',
    'IDLE':   'Idle / Resting',
}

def seed_data():
    print("\nStarting data seeding...")

    # ──────────────────────────────────────────
    # 1. Create Patient Users
    # ──────────────────────────────────────────
    patients_data = [
        ('aree_fazal',  'Areej',   'Fazal',   'areej@example.com'),
        ('haseeb_h',    'Haseeb',  'Hassan',  'haseeb@example.com'),
        ('john_doe',    'John',    'Doe',     'john@example.com'),
        ('patient1',    'Sara',    'Ahmed',   'sara@example.com'),
    ]

    patients = []
    for username, first, last, email in patients_data:
        user, created = User.objects.get_or_create(
            username=username,
            defaults={'email': email, 'role': 'patient', 'first_name': first, 'last_name': last}
        )
        if created:
            user.set_password('bionic123')
            user.save()
            print(f"  + Patient: {username}")
        patients.append(user)

    # ──────────────────────────────────────────
    # 2. Create Healthcare User (doctor)
    # ──────────────────────────────────────────
    doctor, created = User.objects.get_or_create(
        username='dr_smith',
        defaults={'email': 'smith@hospital.com', 'role': 'healthcare', 'first_name': 'Dr.', 'last_name': 'Smith'}
    )
    if created:
        doctor.set_password('bionic123')
        doctor.save()
        print(f"  + Doctor: dr_smith")

    # ──────────────────────────────────────────
    # 3. Create Device Tokens for each patient
    #    (used by Arduino/ESP32 firmware)
    # ──────────────────────────────────────────
    print("\n  Creating hardware device tokens...")
    for patient in patients:
        token, created = DeviceToken.objects.get_or_create(
            user=patient,
            defaults={'device_name': f"BionicArm-{patient.username}"}
        )
        status = "NEW" if created else "EXISTS"
        print(f"  [{status}] {patient.username}: {token.token[:16]}...")

    # ──────────────────────────────────────────
    # 4. Generate Sensor Data, Logs, Settings
    # ──────────────────────────────────────────
    for patient in patients:
        print(f"\n  Generating data for {patient.username}...")

        # Settings
        LimbSettings.objects.get_or_create(
            user=patient,
            defaults={
                'sensitivity': random.randint(60, 90),
                'speed':       random.randint(50, 80),
                'actuator_limit': random.randint(80, 120),
            }
        )

        # 80 sensor data points (realistic EMG + motion trends)
        now = datetime.now()
        for i in range(80):
            ts       = now - timedelta(minutes=i * 0.75)
            gesture  = random.choice(GESTURE_LABELS)
            emg_base = {'GRIP': 650, 'PINCH': 380, 'OPEN': 200, 'ROTATE': 150, 'IDLE': 40}[gesture]
            emg_val  = max(0, min(1023, emg_base + random.uniform(-80, 80)))
            force    = {'GRIP': 5.5, 'PINCH': 2.5, 'OPEN': 0.2, 'ROTATE': 1.0, 'IDLE': 0.1}[gesture]
            conf     = random.uniform(0.82, 0.98)

            SensorData.objects.create(
                patient=patient,
                timestamp=ts,
                emg_value=round(emg_val, 2),
                force_value=round(force + random.uniform(-0.5, 0.5), 2),
                motion_x=round(random.uniform(-1.0, 1.0), 3),
                motion_y=round(random.uniform(-1.0, 1.0), 3),
                motion_z=round(random.uniform(0.8, 1.2), 3),
                battery_level=max(15, 100 - i),
                predicted_gesture=gesture,
                ai_confidence=round(conf, 4),
            )

        # System logs with realistic AI confidence data
        log_events = [
            ('Grip intent detected',    'info',    f'AI predicted {GESTURE_HUMAN["GRIP"]} with {random.uniform(90,98):.1f}% confidence.'),
            ('Battery critical',        'warning', 'Battery reached 20% critical threshold. Please charge device.'),
            ('Rest mode activated',     'info',    'User inactivity for 5 mins triggered sleep mode.'),
            ('Wrist rotation detected', 'info',    f'AI predicted wrist rotation with {random.uniform(85,95):.1f}% confidence.'),
            ('Actuator stress warning', 'error',   'Force limit exceeded (120N) on primary motor. Check hardware.'),
            ('Calibration complete',    'info',    f'Sensor calibration successful. Accuracy: {random.uniform(94,99):.1f}%.'),
            ('Signal noise detected',   'warning', 'High EMG variance detected. Auto-freeze applied per SRS §5.2.'),
        ]

        for event, level, message in log_events:
            SystemLog.objects.create(
                user=patient,
                event_name=event,
                level=level,
                message=message,
                timestamp=now - timedelta(hours=random.randint(1, 48)),
                emp_id=f"EMP-{random.randint(1000, 9999)}",
                performance_metric=round(random.uniform(85.0, 99.5), 2),
            )

    print(f"\n{'─'*50}")
    print("✅ Seeding completed successfully!")
    print("\n  LOGIN CREDENTIALS:")
    print("  Patient  → patient1 / bionic123")
    print("  Patient  → aree_fazal / bionic123")
    print("  Doctor   → dr_smith / bionic123")
    print(f"{'─'*50}\n")

if __name__ == "__main__":
    seed_data()
