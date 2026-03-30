"""
Quick Hardware Tester - Simple One-File Simulator
==================================================
The simplest way to test real-time readings without hardware.
Just run this script and watch the data flow!

Usage:
python quick_tester.py
"""

import requests
import time
import random

# Configuration
SERVER_URL = "http://127.0.0.1:8000/api/v1"

def get_token():
    """Get device token from database."""
    try:
        import os, django
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bionic_backend.settings')
        django.setup()
        
        from core.models import DeviceToken
        t = DeviceToken.objects.get(user__username='patient1')
        return t.token
    except:
        return None


print("⚡ Quick Hardware Tester - Real-Time Data Simulator")
print("=" * 50)

token = get_token()
if not token:
    print("❌ Could not get device token!")
    print("   Run: python seed_data.py first")
    exit(1)

print(f"✅ Using token: {token[:16]}...")
print("📡 Sending data every 100ms...\n")

gestures = ['IDLE', 'OPEN', 'GRIP', 'PINCH', 'ROTATE']
gesture_idx = 0
count = 0

try:
    while True:
        # Cycle through gestures
        gesture = gestures[gesture_idx % len(gestures)]
        gesture_idx += 1
        
        # Generate realistic sensor values
        if gesture == 'GRIP':
            emg = random.uniform(600, 750)
            force = random.uniform(5.0, 6.5)
        elif gesture == 'PINCH':
            emg = random.uniform(350, 450)
            force = random.uniform(2.0, 3.5)
        elif gesture == 'OPEN':
            emg = random.uniform(180, 250)
            force = random.uniform(0.1, 0.4)
        elif gesture == 'ROTATE':
            emg = random.uniform(130, 180)
            force = random.uniform(0.7, 1.3)
        else:  # IDLE
            emg = random.uniform(20, 60)
            force = random.uniform(0.0, 0.2)
        
        data = {
            'emg': round(emg, 2),
            'force': round(force, 2),
            'motion_x': round(random.uniform(-0.2, 0.2), 3),
            'motion_y': round(random.uniform(-0.2, 0.2), 3),
            'motion_z': round(0.98 + random.uniform(-0.05, 0.05), 3),
            'battery': max(15, 100 - count // 10),
        }
        
        # Send to backend
        try:
            response = requests.post(
                f"{SERVER_URL}/hardware/push/",
                json=data,
                headers={'X-Device-Token': token},
                timeout=1
            )
            
            if response.status_code == 200:
                result = response.json()
                
                # Show live data
                print(f"[{count+1:4d}] {gesture:6s} | "
                      f"EMG:{emg:6.1f} | Force:{force:4.2f}N | "
                      f"Battery:{data['battery']:3d}% | "
                      f"AI: {result.get('gesture', '?'):15s} "
                      f"({result.get('confidence', 0):5.1f}%)")
                
                count += 1
                
                # Show separator every 20 packets
                if count % 20 == 0:
                    print("-" * 50)
                    
            else:
                print(f"❌ HTTP Error: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error: {e}")
            print("   Is backend running? (python manage.py runserver)")
            time.sleep(1)
        
        # Change gesture every 10 packets (~1 second)
        if count % 10 == 0:
            gesture_idx += 1
        
        # Wait 100ms (same as ESP32 firmware)
        time.sleep(0.1)
        
except KeyboardInterrupt:
    print(f"\n\n✅ Stopped after {count} packets")
    print("   Check your dashboard for real-time updates!")
