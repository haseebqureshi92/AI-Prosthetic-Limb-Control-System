# 🚀 Complete Setup Guide for Real-Time Hardware Readings

## ✅ Prerequisites Checklist

Before connecting hardware, ensure ALL of these are complete:

### 1. **Backend Server Running** ✓
- Backend MUST be running on `http://127.0.0.1:8000`
- Check: Open browser → http://127.0.0.1:8000/api/v1/dashboard/
- Should see: JSON response or login prompt

### 2. **Frontend Server Running**
- Frontend MUST be running on `http://localhost:5173`
- Run in terminal:
```bash
cd "d:\AI Posthetic Limb Control System"
npm run dev
```

### 3. **Database Initialized with Seed Data**
Run this ONCE to create users and device tokens:
```bash
cd "d:\AI Posthetic Limb Control System\bionic_backend"
python seed_data.py
```

This creates:
- Test patient accounts
- Device tokens for each patient (needed for hardware)
- Sample sensor data

---

## 🔑 Step-by-Step Hardware Connection

### **Step 1: Get Your Device Token**

1. **Login to the web dashboard**:
   - Open: http://localhost:5173
   - Username: `patient1`
   - Password: `bionic123`

2. **Navigate to Settings page**:
   - Click "Settings" in sidebar
   - Look for "Hardware Token" section
   - Copy the token (looks like: `a1b2c3d4e5f6...`)

   **OR** run this command to see tokens:
   ```bash
   cd "d:\AI Posthetic Limb Control System\bionic_backend"
   python manage.py shell
   ```
   Then in Python shell:
   ```python
   from core.models import DeviceToken
   for t in DeviceToken.objects.all():
       print(f"{t.user.username}: {t.token}")
   exit()
   ```

### **Step 2: Configure Arduino Firmware**

1. **Open Arduino IDE**
2. **Load firmware**: `hardware/prosthetic_limb.ino`
3. **Update these lines** (around line 56-59):

```cpp
const char* WIFI_SSID     = "YOUR_WIFI_NAME";        // Your 2.4GHz WiFi network
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";    // WiFi password
const char* SERVER_URL    = "http://192.168.1.X:8000";  // Your PC's IP address
const char* DEVICE_TOKEN  = "PASTE_YOUR_TOKEN_HERE";    // From Step 1
```

**IMPORTANT**: 
- ESP32 only supports **2.4GHz WiFi** (not 5GHz)
- Use your PC's **local IP**, not localhost
- Find your PC IP by running: `ipconfig` in PowerShell
  - Look for "IPv4 Address" (usually 192.168.1.X or 192.168.0.X)

### **Step 3: Upload to ESP32**

1. **Install ESP32 board support** in Arduino IDE (if not done):
   - File → Preferences
   - Add to "Additional Board Manager URLs":
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Tools → Board → Boards Manager → Search "ESP32" → Install

2. **Install required libraries**:
   - Sketch → Include Library → Manage Libraries
   - Search and install:
     - `ArduinoJson` by Benoit Blanchon (v7+)
     - `MPU6050_light` by rfetick
     - `ESP32Servo` by Kevin Harrington

3. **Upload sketch**:
   - Select board: Tools → Board → ESP32 Arduino → NodeMCU-32S (or your board)
   - Select port: Tools → Port → COMx (Windows) or /dev/ttyUSB0 (Linux)
   - Click Upload button

### **Step 4: Monitor Serial Output**

1. **Open Serial Monitor** (Tools → Serial Monitor)
2. **Set baud rate**: 115200
3. **Reset ESP32** (press EN/RST button)

**Expected output**:
```
=== BionicAI Prosthetic Limb ===
Initializing...
[OK] Servos initialized
[OK] MPU6050 calibrated
Connecting to WiFi: YOUR_WIFI_NAME
[OK] WiFi connected! IP: 192.168.1.XXX
=== Ready to transmit ===

EMG:512.3 | Force:2.45N | X:0.12 Y:-0.05 Z:0.98 | Bat:87%
[HTTP] POST success → command: GRIP
```

If you see this, hardware is transmitting! ✅

### **Step 5: Verify in Web Dashboard**

1. **Open Patient Dashboard**: http://localhost:5173
2. **Check hardware status** (top-right corner):
   - ✅ Green "Hardware Live" indicator
   - ❌ If shows "Simulation Mode", hardware not connected yet

3. **Watch real-time readings**:
   - Battery % should update every 3 seconds
   - EMG value should fluctuate when you flex muscle
   - Force value changes when gripping
   - AI Gesture prediction updates in real-time

---

## 🔍 Troubleshooting

### **Problem: "WiFi failed" in Serial Monitor**

**Causes**:
- Wrong WiFi SSID/password
- 5GHz WiFi (ESP32 only supports 2.4GHz)
- Weak signal

**Fix**:
```cpp
// Try moving closer to router
// Double-check credentials
// Ensure 2.4GHz network (not 5GHz)
```

---

### **Problem: "[HTTP] Error 403" or "Invalid token"**

**Cause**: Wrong device token

**Fix**:
1. Regenerate token in Settings page
2. Update `DEVICE_TOKEN` in firmware
3. Re-upload to ESP32

---

### **Problem: "[HTTP] Failed: Connection refused"**

**Cause**: SERVER_URL incorrect or firewall blocking

**Fix**:
1. Find your PC's IP:
   ```powershell
   ipconfig
   ```
2. Update `SERVER_URL` in firmware:
   ```cpp
   const char* SERVER_URL = "http://192.168.1.100:8000";
   ```
3. **Disable Windows Firewall temporarily** (for testing):
   ```powershell
   Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False
   ```
   Or allow Python through firewall manually

---

### **Problem: Dashboard shows "Simulation Mode"**

**Causes**:
1. Backend not running
2. No device token generated
3. Hardware not transmitting

**Fix**:
1. Check backend is running: http://127.0.0.1:8000
2. Run seed_data.py to generate tokens
3. Check Serial Monitor for transmission logs
4. Verify token in firmware matches dashboard

---

### **Problem: Readings not updating in UI**

**Check**:
1. Browser console for errors (F12 → Console tab)
2. Backend logs for API requests
3. Network tab (F12 → Network) - look for failed requests

**Quick fix**:
- Refresh page (Ctrl+R)
- Logout and login again
- Clear browser cache

---

## 📊 Expected Real-Time Behavior

When everything works correctly:

### **Serial Monitor (ESP32)**:
```
EMG:523.4 | Force:3.21N | X:0.15 Y:-0.02 Z:0.99 | Bat:85%
[HTTP] POST success → command: PINCH (gesture: Precision Pinch, conf: 94.2%)
[CMD] PINCH (motor_angles: thumb=70, index=75, middle=0, wrist=90)
```

### **Web Dashboard**:
- **Battery**: Updates every 3 seconds (e.g., 87% → 86%)
- **EMG Value**: Changes when muscle flexes (0-1023 range)
- **Force**: Increases when gripping (0-10N range)
- **AI Gesture**: Shows "Power Grip", "Pinch", etc.
- **3D Arm**: Moves fingers based on gesture

### **EMGData Page**:
- **Area Chart**: Rolling EMG waveform (last 50 readings)
- **XYZ Graph**: 3 lines showing orientation
- **Force Graph**: Pressure over time

---

## 🎯 Quick Verification Commands

### Check if backend received data:
```bash
cd "d:\AI Posthetic Limb Control System\bionic_backend"
python manage.py shell
```
```python
from core.models import SensorData
print(f"Total readings: {SensorData.objects.count()}")
latest = SensorData.objects.first()
if latest:
    print(f"Latest: EMG={latest.emg_value}, Force={latest.force_value}")
    print(f"Time: {latest.timestamp}")
exit()
```

### Check device connection status:
```python
from core.models import DeviceToken
from datetime import datetime, timedelta
cutoff = datetime.now() - timedelta(minutes=5)
active = DeviceToken.objects.filter(last_seen__gte=cutoff)
print(f"Active devices: {active.count()}")
for d in active:
    print(f"  - {d.user.username}: last seen {d.last_seen}")
exit()
```

---

## 🔐 Login Credentials (After Running seed_data.py)

| Role | Username | Password |
|------|----------|----------|
| Patient | `patient1` | `bionic123` |
| Patient | `aree_fazal` | `bionic123` |
| Doctor | `dr_smith` | `bionic123` |

---

## 📝 Summary: Critical Requirements

✅ Backend running on `http://127.0.0.1:8000`  
✅ Frontend running on `http://localhost:5173`  
✅ Database seeded with `python seed_data.py`  
✅ Device token copied to firmware  
✅ Correct WiFi credentials (2.4GHz)  
✅ Correct SERVER_URL (PC's IP, not localhost)  
✅ All libraries installed  
✅ Firewall allows port 8000  

If ALL are met, you WILL see real-time readings! 🎉

---

**Last Updated**: March 30, 2026  
**System Version**: v1.0 - AI Prosthetic Limb Control System
