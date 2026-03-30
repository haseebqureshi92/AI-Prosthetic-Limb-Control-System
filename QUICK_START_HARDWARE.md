# 🚀 QUICK START - Real-Time Readings

## ✅ Current Status

- ✅ Backend Server: Running on http://127.0.0.1:8000
- ✅ Database: Seeded with test data and device tokens
- ⏳ Frontend: Start with `npm run dev`
- ⏳ Hardware: Configure and upload firmware

---

## 🔥 5-Minute Setup (If You Have Hardware)

### 1️⃣ **Get Your Device Token** (30 seconds)

**Option A - Via Web Dashboard**:
1. Open: http://localhost:5173
2. Login: `patient1` / `bionic123`
3. Go to Settings → Copy Hardware Token

**Option B - Via Command** (faster):
```bash
cd "d:\AI Posthetic Limb Control System\bionic_backend"
..\venv\Scripts\python.exe manage.py shell
```
```python
from core.models import DeviceToken
t = DeviceToken.objects.get(user__username='patient1')
print(f"Your token: {t.token}")
exit()
```

**Copy this token** - you'll need it in Step 3!

---

### 2️⃣ **Find Your PC's IP Address** (10 seconds)

Run in PowerShell:
```powershell
ipconfig
```

Look for **IPv4 Address** (e.g., `192.168.1.100`)

---

### 3️⃣ **Update Firmware** (2 minutes)

Open: `hardware/prosthetic_limb.ino` in Arduino IDE

**Change these 4 lines** (around line 56-59):

```cpp
const char* WIFI_SSID     = "YOUR_WIFI_NAME";        // ← Your 2.4GHz WiFi
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";    // ← WiFi password
const char* SERVER_URL    = "http://192.168.1.X:8000";  // ← Your IP from Step 2
const char* DEVICE_TOKEN  = "PASTE_TOKEN_HERE";      // ← Token from Step 1
```

**Save** the file.

---

### 4️⃣ **Upload to ESP32** (2 minutes)

1. **Connect ESP32** via USB cable
2. **Select board**: Tools → Board → ESP32 Arduino → NodeMCU-32S
3. **Select port**: Tools → Port → COMx (Windows)
4. **Click Upload** button (→ arrow icon)

Wait ~30 seconds for upload to complete.

---

### 5️⃣ **Open Serial Monitor** (30 seconds)

1. **Tools** → Serial Monitor
2. **Baud rate**: 115200
3. **Press EN/RST button** on ESP32

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

✅ If you see this, hardware is transmitting!

---

### 6️⃣ **Check Web Dashboard** (30 seconds)

1. **Start frontend** (if not running):
   ```bash
   cd "d:\AI Posthetic Limb Control System"
   npm run dev
   ```
   
2. **Open**: http://localhost:5173

3. **Login**: `patient1` / `bionic123`

4. **Look at top-right corner**:
   - ✅ **"Hardware Live"** = Working!
   - ❌ **"Simulation Mode"** = Check Steps 1-5 again

5. **Watch the numbers update** every 3 seconds:
   - Battery % 
   - EMG Value (flex your muscle!)
   - Force (grip something!)
   - AI Gesture prediction

---

## 🎯 Verification Checklist

| Step | How to Verify | Expected Result |
|------|---------------|-----------------|
| **Backend Running** | Open http://127.0.0.1:8000/api/v1/dashboard/ | JSON or login prompt |
| **Token Generated** | Run shell command above | Shows long hex string |
| **Firmware Updated** | Check prosthetic_limb.ino | Has correct IP and token |
| **ESP32 Connected** | Serial Monitor shows logs | EMG/Force values updating |
| **HTTP POST Success** | Serial shows "[HTTP] POST success" | Command received from server |
| **Dashboard Live** | Top-right shows "Hardware Live" | Green indicator |
| **Real-Time Updates** | Watch battery/EMG values | Change every 3 seconds |

---

## 🐛 Common Issues & Quick Fixes

### ❌ "WiFi failed" in Serial Monitor
```cpp
// Check:
// 1. WiFi SSID/password correct?
// 2. Using 2.4GHz WiFi? (ESP32 doesn't support 5GHz)
// 3. WiFi signal strong enough?
```

### ❌ "[HTTP] Error 403" or "Invalid token"
```bash
# Regenerate token:
cd "d:\AI Posthetic Limb Control System\bionic_backend"
..\venv\Scripts\python.exe manage.py shell
```
```python
from core.models import DeviceToken
import secrets
t = DeviceToken.objects.get(user__username='patient1')
t.token = secrets.token_hex(32)
t.save()
print(f"New token: {t.token}")
exit()
```
Then update firmware and re-upload.

### ❌ "[HTTP] Connection refused"
```powershell
# Find your IP:
ipconfig

# Update SERVER_URL in firmware:
const char* SERVER_URL = "http://YOUR_IP:8000";

# Temporarily disable firewall for testing:
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False
```

### ❌ Dashboard still shows "Simulation Mode"
1. Check backend is running: http://127.0.0.1:8000
2. Check Serial Monitor shows `[HTTP] POST success`
3. Refresh dashboard page (Ctrl+R)
4. Logout and login again

---

## 📊 What Real-Time Looks Like

### Serial Monitor Output:
```
EMG:523.4 | Force:3.21N | X:0.15 Y:-0.02 Z:0.99 | Bat:85%
[HTTP] POST success → command: PINCH (gesture: Precision Pinch, conf: 94.2%)
[CMD] PINCH (motor_angles: thumb=70, index=75, middle=0, wrist=90)
```

### Web Dashboard Display:
```
┌─────────────────────────────────────┐
│ 🔋 85%          ⚡ 523.4   💪 3.21N │
│ Battery         EMG       Force     │
├─────────────────────────────────────┤
│ 🧠 AI: Precision Pinch (94.2%)      │
│ 🖐️ 3D arm fingers closing           │
└─────────────────────────────────────┘
```

Values update every 3 seconds when hardware is connected! ✅

---

## 🔑 Test Accounts

| Username | Password | Role |
|----------|----------|------|
| `patient1` | `bionic123` | Patient |
| `aree_fazal` | `bionic123` | Patient |
| `dr_smith` | `bionic123` | Doctor |

---

## 📞 Next Steps After Connection

Once hardware is working:

1. **Test all gestures**: Grip, Pinch, Rotate, Open
2. **Adjust sensitivity**: Settings page → Slider
3. **Monitor EMG charts**: EMGData page
4. **Train custom gestures**: Training mode
5. **View activity logs**: Logs & Reports page

---

**Need more help?** See full guide: `SETUP_REALTIME.md`

**Last updated**: March 30, 2026
