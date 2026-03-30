"""
═══════════════════════════════════════════════════════════════
SIMPLE SIMULATOR CONNECTION SCRIPT
═══════════════════════════════════════════════════════════════

This is the SIMPLEST way to connect a simulator to your control system.
Just run this ONE script and it will:
1. Connect to the backend
2. Send real-time sensor data
3. Show live feedback
4. Update your dashboard automatically

USAGE:
python connect_simulator.py

That's it! No configuration needed.
═══════════════════════════════════════════════════════════════
"""

import requests
import time
import random
from datetime import datetime

# ════════════════════════════════════════════════════════════
# CONFIGURATION (Auto-detected, no changes needed!)
# ════════════════════════════════════════════════════════════
BACKEND_URL = "http://127.0.0.1:8000/api/v1"
DEVICE_TOKEN = None  # Will auto-fetch from database

print("╔══════════════════════════════════════════════════════╗")
print("║   🦾 BIONIC LIMB - SIMULATOR CONNECTOR              ║")
print("╚══════════════════════════════════════════════════════╝")
print("\n📡 Connecting simulator to control system...\n")


# ════════════════════════════════════════════════════════════
# STEP 1: Get Device Token from Database
# ════════════════════════════════════════════════════════════
def get_token():
    """Automatically fetch device token from database."""
    try:
        import os, django
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bionic_backend.settings')
        django.setup()
        
        from core.models import DeviceToken
        t = DeviceToken.objects.get(user__username='patient1')
        return t.token
    except Exception as e:
        print(f"❌ Error getting token: {e}")
        print("\n💡 Solution:")
        print("   Run: python seed_data.py")
        exit(1)


# ════════════════════════════════════════════════════════════
# STEP 2: Test Backend Connection
# ════════════════════════════════════════════════════════════
def test_backend():
    """Verify backend is running and accessible."""
    try:
        response = requests.get(f"{BACKEND_URL}/dashboard/", timeout=3)
        if response.status_code == 200 or response.status_code == 401:
            return True
        return False
    except:
        return False


# ════════════════════════════════════════════════════════════
# STEP 3: Generate Realistic Sensor Data
# ════════════════════════════════════════════════════════════
def generate_data():
    """Create realistic EMG, force, motion, and battery values."""
    gestures = ['IDLE', 'OPEN', 'GRIP', 'PINCH', 'ROTATE']
    gesture = random.choice(gestures)
    
    # Realistic EMG ranges per gesture
    emg_ranges = {
        'IDLE': (20, 60),
        'OPEN': (180, 250),
        'GRIP': (600, 750),
        'PINCH': (350, 450),
        'ROTATE': (130, 180),
    }
    
    emg_min, emg_max = emg_ranges[gesture]
    emg = random.uniform(emg_min, emg_max)
    
    # Force values (Newtons)
    force_map = {
        'IDLE': (0.0, 0.2),
        'OPEN': (0.1, 0.4),
        'GRIP': (5.0, 6.5),
        'PINCH': (2.0, 3.5),
        'ROTATE': (0.7, 1.3),
    }
    
    f_min, f_max = force_map[gesture]
    force = random.uniform(f_min, f_max)
    
    # IMU motion (MPU6050 accelerometer)
    motion_x = random.uniform(-0.2, 0.2)
    motion_y = random.uniform(-0.2, 0.2)
    motion_z = 0.98 + random.uniform(-0.05, 0.05)
    
    # Battery (slowly decreasing)
    battery = max(15, 100 - int(time.time() % 3600) // 36)
    
    return {
        'emg': round(emg, 2),
        'force': round(force, 2),
        'motion_x': round(motion_x, 3),
        'motion_y': round(motion_y, 3),
        'motion_z': round(motion_z, 3),
        'battery': battery,
    }, gesture


# ════════════════════════════════════════════════════════════
# STEP 4: Send Data to Backend
# ════════════════════════════════════════════════════════════
def send_to_backend(data, token):
    """POST sensor data to hardware endpoint."""
    url = f"{BACKEND_URL}/hardware/push/"
    headers = {
        'Content-Type': 'application/json',
        'X-Device-Token': token,
    }
    
    try:
        response = requests.post(url, json=data, headers=headers, timeout=2)
        if response.status_code == 200:
            return response.json()
        else:
            return {'error': f'HTTP {response.status_code}'}
    except Exception as e:
        return {'error': str(e)}


# ════════════════════════════════════════════════════════════
# MAIN EXECUTION
# ════════════════════════════════════════════════════════════

# Get device token
print("🔑 Fetching device token from database...")
DEVICE_TOKEN = get_token()
print(f"✅ Token: {DEVICE_TOKEN[:16]}...\n")

# Test backend
print("🔍 Testing backend connection...")
if test_backend():
    print("✅ Backend is online at http://127.0.0.1:8000\n")
else:
    print("❌ Backend not responding!")
    print("\n💡 Please start Django server:")
    print("   cd bionic_backend")
    print("   python manage.py runserver\n")
    input("Press Enter to continue anyway...")

# Start sending data
print("=" * 60)
print("🚀 STARTING REAL-TIME DATA TRANSMISSION")
print("=" * 60)
print("\n📊 Simulator is now connected to control system!")
print("   • Sending data every 100ms (10 times/second)")
print("   • Dashboard will update within 3 seconds")
print("   • Press Ctrl+C to stop\n")

packet_count = 0
success_count = 0
start_time = time.time()

try:
    while True:
        # Generate sensor data
        sensor_data, gesture = generate_data()
        
        # Send to backend
        response = send_to_backend(sensor_data, DEVICE_TOKEN)
        
        packet_count += 1
        if 'error' not in response:
            success_count += 1
            
            # Show status every 20 packets (~2 seconds)
            if packet_count % 20 == 0:
                elapsed = time.time() - start_time
                rate = packet_count / elapsed if elapsed > 0 else 0
                
                print(f"[{packet_count:4d}] {gesture:6s} | "
                      f"EMG:{sensor_data['emg']:6.1f} | "
                      f"Force:{sensor_data['force']:.2f}N | "
                      f"Battery:{sensor_data['battery']:3d}% | "
                      f"AI: {response.get('gesture', '?'):15s} "
                      f"({response.get('confidence', 0):5.1f}%) | "
                      f"Rate: {rate:.1f}/s")
                
                # Separator every 100 packets
                if packet_count % 100 == 0:
                    print("-" * 60)
        else:
            print(f"❌ Error: {response['error']}")
        
        # Wait 100ms (10Hz transmission rate)
        time.sleep(0.1)
        
except KeyboardInterrupt:
    elapsed = time.time() - start_time
    success_rate = (success_count / packet_count * 100) if packet_count > 0 else 0
    
    print(f"\n\n⏹️  Simulator stopped")
    print(f"\n📊 FINAL STATISTICS:")
    print(f"   Total packets:  {packet_count}")
    print(f"   Successful:     {success_count}")
    print(f"   Success rate:   {success_rate:.1f}%")
    print(f"   Duration:       {elapsed:.1f} seconds")
    print(f"   Average rate:   {packet_count/elapsed:.1f} packets/sec")
    print(f"\n✅ Check your dashboard at http://localhost:5173")
    print("   It should show 'Hardware Live' with updating values!\n")
