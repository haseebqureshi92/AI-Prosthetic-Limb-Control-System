"""
Real-Time Hardware Simulator with GUI Controls
===============================================
Interactive simulator with manual gesture control and live feedback.
Perfect for testing the system without physical hardware!

Features:
- Manual gesture selection buttons
- Real-time data visualization in terminal
- Live backend response display
- Adjustable simulation parameters

Usage:
python hardware_simulator_gui.py
"""

import requests
import time
import random
import math
import threading
from datetime import datetime

# Color codes for terminal output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

# Configuration
SERVER_URL = "http://127.0.0.1:8000/api/v1"
DEVICE_TOKEN = None  # Auto-fetch from database

# Gesture definitions
GESTURES = {
    '1': {'name': 'IDLE',   'emg': (40, 20),   'force': (0.1, 0.2)},
    '2': {'name': 'OPEN',   'emg': (200, 50),  'force': (0.2, 0.3)},
    '3': {'name': 'GRIP',   'emg': (650, 100), 'force': (5.0, 6.0)},
    '4': {'name': 'PINCH',  'emg': (380, 60),  'force': (2.0, 3.0)},
    '5': {'name': 'ROTATE', 'emg': (150, 40),  'force': (0.8, 1.2)},
}

current_gesture = '1'
running = True
stats = {'packets': 0, 'success': 0, 'start_time': time.time()}


def get_device_token():
    """Fetch device token from database."""
    global DEVICE_TOKEN
    
    try:
        import os, django
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bionic_backend.settings')
        django.setup()
        
        from core.models import DeviceToken
        token_obj = DeviceToken.objects.get(user__username='patient1')
        DEVICE_TOKEN = token_obj.token
        print(f"{Colors.OKGREEN}✅ Using token for patient1: {token_obj.token[:16]}...{Colors.ENDC}")
        return DEVICE_TOKEN
    except Exception as e:
        print(f"{Colors.WARNING}⚠️  Could not fetch token: {e}{Colors.ENDC}")
        DEVICE_TOKEN = input(f"{Colors.BOLD}Enter device token manually:{Colors.ENDC} ").strip()
        return DEVICE_TOKEN


def generate_sensor_data(gesture_key):
    """Generate realistic sensor data for selected gesture."""
    gesture = GESTURES[gesture_key]
    
    emg_base, emg_var = gesture['emg']
    force_min, force_max = gesture['force']
    
    # Add some noise and variation
    emg_value = emg_base + random.uniform(-emg_var, emg_var)
    emg_value = max(0, min(1023, emg_value))
    
    force_value = random.uniform(force_min, force_max)
    
    # IMU data with slight movement
    motion_x = random.uniform(-0.2, 0.2)
    motion_y = random.uniform(-0.2, 0.2)
    motion_z = 0.98 + random.uniform(-0.05, 0.05)
    
    # Battery slowly decreasing
    battery = max(15, 100 - int((time.time() - stats['start_time']) / 60))
    
    return {
        'emg': round(emg_value, 2),
        'force': round(force_value, 2),
        'motion_x': round(motion_x, 3),
        'motion_y': round(motion_y, 3),
        'motion_z': round(motion_z, 3),
        'battery': battery,
    }


def send_to_backend(data):
    """Send sensor data to backend and get AI prediction."""
    url = f"{SERVER_URL}/hardware/push/"
    headers = {
        'Content-Type': 'application/json',
        'X-Device-Token': DEVICE_TOKEN,
    }
    
    try:
        response = requests.post(url, json=data, headers=headers, timeout=2)
        if response.status_code == 200:
            return response.json()
        else:
            return {'error': f'HTTP {response.status_code}'}
    except Exception as e:
        return {'error': str(e)}


def display_status(sensor_data, backend_response):
    """Display current status in terminal."""
    # Clear previous line and move cursor to top
    print("\033[F\033[K" * 8, end='')
    
    elapsed = time.time() - stats['start_time']
    success_rate = (stats['success'] / stats['packets'] * 100) if stats['packets'] > 0 else 0
    
    print(f"{Colors.BOLD}{Colors.OKCYAN}╔════════════════════════════════════════════╗{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.OKCYAN}║   🦾 REAL-TIME HARDWARE SIMULATOR         ║{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.OKCYAN}╚════════════════════════════════════════════╝{Colors.ENDC}")
    
    gesture_name = GESTURES[current_gesture]['name']
    print(f"\n{Colors.BOLD}Current Gesture:{Colors.ENDC} {Colors.OKGREEN}{gesture_name}{Colors.ENDC}")
    
    print(f"\n┌──────────────────────────────────────────┐")
    print(f"│ Sensor Values (Live)                   │")
    print(f"├──────────────────────────────────────────┤")
    print(f"│ 🔋 Battery:  {sensor_data['battery']:3d}%{'█' * (sensor_data['battery']//10):<10}│")
    print(f"│ 💪 EMG:      {sensor_data['emg']:6.1f}{' ' * 12}│")
    print(f"│ ⚡ Force:    {sensor_data['force']:5.2f} N{' ' * 11}│")
    print(f"│ 📐 Motion:   X:{sensor_data['motion_x']:+5.2f} Y:{sensor_data['motion_y']:+5.2f} Z:{sensor_data['motion_z']:+5.2f}│")
    print(f"└──────────────────────────────────────────┘")
    
    if 'error' not in backend_response:
        ai_gesture = backend_response.get('gesture', 'Unknown')
        confidence = backend_response.get('confidence', 0)
        command = backend_response.get('command', 'NONE')
        
        print(f"\n┌──────────────────────────────────────────┐")
        print(f"│ AI Backend Response                    │")
        print(f"├──────────────────────────────────────────┤")
        print(f"│ 🧠 Prediction: {ai_gesture:<24}│")
        print(f"│ 📊 Confidence: {confidence:5.1f}%{' ' * 15}│")
        print(f"│ 🎯 Command:    {command:<24}│")
        print(f"└──────────────────────────────────────────┘")
    else:
        print(f"\n{Colors.FAIL}❌ Backend Error: {backend_response['error']}{Colors.ENDC}")
    
    print(f"\n📊 Stats: {stats['packets']} packets | {stats['success']} success | {success_rate:.1f}% | {elapsed:.0f}s")
    print(f"\n{Colors.BOLD}Controls:{Colors.ENDC} [1] IDLE  [2] OPEN  [3] GRIP  [4] PINCH  [5] ROTATE  [Q] Quit")


def input_listener():
    """Listen for keyboard input to change gestures."""
    global current_gesture, running
    
    while running:
        try:
            cmd = input().strip().upper()
            if cmd in GESTURES:
                current_gesture = cmd
                print(f"\n{Colors.OKBLUE}➡️  Gesture changed to {GESTURES[cmd]['name']}{Colors.ENDC}")
            elif cmd == 'Q':
                running = False
                break
        except:
            pass


def main():
    """Main simulator loop with keyboard control."""
    global running
    
    print("=" * 60)
    print(f"{Colors.BOLD}{Colors.OKBLUE}🦾 Interactive Hardware Simulator{Colors.ENDC}")
    print("=" * 60)
    print("\nThis simulator sends real-time sensor data to the backend")
    print("just like a physical ESP32/Arduino device would.\n")
    
    # Get device token
    token = get_device_token()
    
    print(f"\n{Colors.OKGREEN}✅ Connected to backend at {SERVER_URL}{Colors.ENDC}")
    print(f"🔑 Device Token: {token[:32]}...\n")
    
    # Test connection
    print("🔍 Testing connection...")
    test_data = generate_sensor_data('1')
    test_response = send_to_backend(test_data)
    
    if 'error' in test_response:
        print(f"{Colors.FAIL}❌ Backend not responding: {test_response['error']}{Colors.ENDC}")
        print(f"\n{Colors.WARNING}Please start Django server:{Colors.ENDC}")
        print("  cd bionic_backend")
        print("  python manage.py runserver\n")
        response = input("Continue anyway? (y/n): ").strip().lower()
        if response != 'y':
            return
    else:
        print(f"{Colors.OKGREEN}✅ Backend connected!{Colors.ENDC}")
        print(f"   AI Initial: {test_response.get('gesture', 'Unknown')} "
              f"({test_response.get('confidence', 0):.1f}%)\n")
    
    print("=" * 60)
    print(f"\n{Colors.BOLD}Starting simulation...{Colors.ENDC}\n")
    print("Use number keys [1-5] to change gestures")
    print("Press [Q] to quit\n")
    
    # Start input listener thread
    input_thread = threading.Thread(target=input_listener, daemon=True)
    input_thread.start()
    
    # Main transmission loop
    send_interval = 0.1  # 100ms
    
    try:
        while running:
            # Generate sensor data for current gesture
            sensor_data = generate_sensor_data(current_gesture)
            
            # Send to backend
            backend_response = send_to_backend(sensor_data)
            
            # Update stats
            stats['packets'] += 1
            if 'error' not in backend_response:
                stats['success'] += 1
            
            # Display status
            display_status(sensor_data, backend_response)
            
            # Wait for next interval
            time.sleep(send_interval)
            
    except KeyboardInterrupt:
        pass
    
    finally:
        running = False
    
    # Final statistics
    elapsed = time.time() - stats['start_time']
    success_rate = (stats['success'] / stats['packets'] * 100) if stats['packets'] > 0 else 0
    
    print(f"\n\n{Colors.BOLD}══════════════════════════════════════════════{Colors.ENDC}")
    print(f"{Colors.BOLD}Final Statistics{Colors.ENDC}")
    print(f"{Colors.BOLD}══════════════════════════════════════════════{Colors.ENDC}")
    print(f"  Total packets sent: {stats['packets']}")
    print(f"  Successful:         {stats['success']}")
    print(f"  Success rate:       {success_rate:.1f}%")
    print(f"  Duration:           {elapsed:.1f} seconds")
    print(f"  Average rate:       {stats['packets']/elapsed:.1f} packets/sec")
    print(f"{Colors.BOLD}══════════════════════════════════════════════{Colors.ENDC}\n")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n{Colors.FAIL}❌ Error: {e}{Colors.ENDC}")
        import traceback
        traceback.print_exc()
