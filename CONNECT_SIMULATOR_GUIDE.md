# 🔌 How to Connect Simulators to Control System - Complete Guide

## 🎯 Quick Answer

**The simulators connect automatically!** Just run the script and it will:
1. ✅ Auto-fetch device token from database
2. ✅ Auto-connect to backend at `http://127.0.0.1:8000`
3. ✅ Start sending real-time data every 100ms
4. ✅ Update dashboard within 3 seconds

---

## 🚀 **EASIEST METHOD - One-Click Connection**

### **Run This Single Command:**

```bash
cd "d:\AI Posthetic Limb Control System\bionic_backend"
..\venv\Scripts\Activate.ps1
python connect_simulator.py
```

**That's it!** The simulator will:
- Connect to your control system automatically
- Send sensor data (EMG, Force, IMU, Battery)
- Show live terminal output
- Update your web dashboard in real-time

### **Expected Output:**

```
╔══════════════════════════════════════════════════════╗
║   🦾 BIONIC LIMB - SIMULATOR CONNECTOR              ║
╚══════════════════════════════════════════════════════╝

📡 Connecting simulator to control system...

🔑 Fetching device token from database...
✅ Token: 61905b15157869b4...

🔍 Testing backend connection...
✅ Backend is online at http://127.0.0.1:8000

============================================================
🚀 STARTING REAL-TIME DATA TRANSMISSION
============================================================

📊 Simulator is now connected to control system!
   • Sending data every 100ms (10 times/second)
   • Dashboard will update within 3 seconds
   • Press Ctrl+C to stop

[  20] GRIP   | EMG: 680.3 | Force:5.42N | Battery:100% | AI: Power Grip      ( 94.1%) | Rate: 10.2/s
[  40] PINCH  | EMG: 398.5 | Force:2.87N | Battery: 99% | AI: Precision Pinch ( 91.3%) | Rate: 10.1/s
[  60] OPEN   | EMG: 215.7 | Force:0.23N | Battery: 99% | AI: Open Hand       ( 88.7%) | Rate: 10.0/s
```

---

## 📋 **Connection Architecture**

### **How Simulators Connect:**

```
┌─────────────────────────────────────────────────────────┐
│  STEP 1: Simulator Initialization                      │
├─────────────────────────────────────────────────────────┤
│  1. Import Django models                               │
│  2. Query DeviceToken table                            │
│  3. Get token for 'patient1' user                      │
│  4. Store token for HTTP requests                      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 2: Backend Connection Test                       │
├─────────────────────────────────────────────────────────┤
│  1. HTTP GET /api/v1/dashboard/                        │
│  2. Verify server responds                             │
│  3. Confirm connectivity                               │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 3: Real-Time Data Transmission                   │
├─────────────────────────────────────────────────────────┤
│  Every 100ms (10 times/second):                        │
│  1. Generate realistic sensor values                   │
│  2. Build JSON payload                                 │
│  3. HTTP POST to /api/v1/hardware/push/               │
│  4. Include X-Device-Token header                      │
│  5. Receive AI prediction response                     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 4: Backend Processing                            │
├─────────────────────────────────────────────────────────┤
│  1. Validate device token                              │
│  2. Parse sensor data                                  │
│  3. Run AI gesture prediction                          │
│  4. Save to SensorData table                           │
│  5. Return command + prediction                        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 5: Frontend Display                              │
├─────────────────────────────────────────────────────────┤
│  Every 3 seconds:                                      │
│  1. Frontend polls /api/v1/dashboard/                 │
│  2. Gets latest sensor readings                        │
│  3. Updates UI with new values                         │
│  4. Shows "Hardware Live" indicator                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 **Detailed Connection Methods**

### **Method 1: Simple Connector (RECOMMENDED)**

**File:** `connect_simulator.py`

**Best for:** First-time users, quick testing

**Command:**
```bash
cd "d:\AI Posthetic Limb Control System\bionic_backend"
..\venv\Scripts\Activate.ps1
python connect_simulator.py
```

**Features:**
- ✅ Fully automatic configuration
- ✅ Auto-fetches device token
- ✅ Tests backend connectivity
- ✅ Shows live statistics
- ✅ Zero setup required

---

### **Method 2: Quick Tester**

**File:** `quick_tester.py`

**Best for:** Continuous automated testing

**Command:**
```bash
cd "d:\AI Posthetic Limb Control System\bionic_backend"
..\venv\Scripts\Activate.ps1
python quick_tester.py
```

**Features:**
- ✅ Cycles through all gestures automatically
- ✅ Compact terminal output
- ✅ Good for extended runs
- ✅ Minimal resource usage

---

### **Method 3: Interactive GUI**

**File:** `hardware_simulator_gui.py`

**Best for:** Manual gesture control, detailed testing

**Command:**
```bash
cd "d:\AI Posthetic Limb Control System\bionic_backend"
..\venv\Scripts\Activate.ps1
python hardware_simulator_gui.py
```

**Controls:**
- **[1]** IDLE gesture
- **[2]** OPEN hand
- **[3]** GRIP (high EMG)
- **[4]** PINCH precision
- **[5]** ROTATE wrist
- **[Q]** Quit

**Features:**
- ✅ Beautiful terminal UI
- ✅ Manual gesture selection
- ✅ Real-time feedback display
- ✅ Keyboard shortcuts

---

### **Method 4: Full Simulator**

**File:** `hardware_simulator.py`

**Best for:** Production-like testing, load testing

**Command:**
```bash
cd "d:\AI Posthetic Limb Control System\bionic_backend"
..\venv\Scripts\Activate.ps1
python hardware_simulator.py
```

**Features:**
- ✅ Wave pattern simulation
- ✅ Auto-cycles gestures every 3 seconds
- ✅ Detailed packet statistics
- ✅ Success rate tracking
- ✅ Long-duration testing

---

## 🔍 **Connection Verification**

### **How to Know It's Connected:**

#### **1. Terminal Output Shows Success:**
```
✅ Token: 61905b15157869b4...
✅ Backend is online
[  20] GRIP | EMG: 680.3 | AI: Power Grip (94.1%)
```

#### **2. Web Dashboard Shows "Hardware Live":**

Open: http://localhost:5173 → Login → Check top-right corner

**Before Connection:**
```
❌ Simulation Mode
```

**After Connection:**
```
✅ Hardware Live (green indicator)
```

#### **3. Values Update Every 3 Seconds:**

Watch these change on dashboard:
- Battery percentage (e.g., 100% → 99% → 98%)
- EMG value (e.g., 45.2 → 680.3 → 215.7)
- Force reading (e.g., 0.12N → 5.42N → 0.23N)
- AI gesture prediction

#### **4. Backend Logs Show POST Requests:**

In Django server console, you should see:
```
[HTTP POST] /api/v1/hardware/push/ - 200 OK
Device authenticated: patient1
Sensor data saved: EMG=680.3, Force=5.42
AI Prediction: Power Grip (94.1%)
```

---

## 🛠️ **Troubleshooting Connection Issues**

### **Problem: "Could not fetch device token"**

**Cause:** Database not seeded or Django not initialized

**Solution:**
```bash
cd "d:\AI Posthetic Limb Control System\bionic_backend"
..\venv\Scripts\Activate.ps1
python seed_data.py
```

Then try connecting again.

---

### **Problem: "Backend not responding"**

**Cause:** Django server not running

**Solution:**
```bash
cd "d:\AI Posthetic Limb Control System\bionic_backend"
..\venv\Scripts\Activate.ps1
python manage.py runserver
```

Keep this terminal open while running simulator in another terminal.

---

### **Problem: "Connection refused" or Timeout**

**Cause:** Firewall blocking or wrong URL

**Solution:**

1. **Check backend is accessible:**
   ```bash
   curl http://127.0.0.1:8000/api/v1/dashboard/
   ```

2. **Temporarily disable firewall for testing:**
   ```powershell
   Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False
   ```

3. **Verify ALLOWED_HOSTS in settings.py:**
   ```python
   ALLOWED_HOSTS = ['*']  # Should allow all
   ```

---

### **Problem: Dashboard Still Shows "Simulation Mode"**

**Causes:**
1. Simulator not actually sending data
2. Backend not saving to database
3. Frontend not polling correctly

**Solution:**

**Step 1 - Verify simulator is transmitting:**
```bash
# Should see output like:
[  20] GRIP | EMG: 680.3 | Force:5.42N | Battery:100%
```

**Step 2 - Check database has data:**
```bash
cd "d:\AI Posthetic Limb Control System\bionic_backend"
..\venv\Scripts\python.exe manage.py shell
```
```python
from core.models import SensorData
print(f"Total: {SensorData.objects.count()} readings")
latest = SensorData.objects.first()
if latest:
    print(f"Latest: EMG={latest.emg_value} at {latest.timestamp}")
exit()
```

**Step 3 - Refresh dashboard:**
- Press Ctrl+R (hard refresh)
- Logout and login again
- Clear browser cache

---

### **Problem: "Invalid device token"**

**Cause:** Token mismatch between simulator and database

**Solution:**

1. **Get fresh token:**
   ```bash
   cd "d:\AI Posthetic Limb Control System\bionic_backend"
   ..\venv\Scripts\python.exe manage.py shell
   ```
   ```python
   from core.models import DeviceToken
   t = DeviceToken.objects.get(user__username='patient1')
   print(f"Token: {t.token}")
   exit()
   ```

2. **Simulators auto-fetch, so just restart:**
   ```bash
   python connect_simulator.py
   ```

---

## 📊 **Connection Flow Diagram**

```
┌──────────────┐
│  Simulator   │
│  Script      │
│              │
│  connect_    │
│  simulator.  │
│  py          │
└──────┬───────┘
       │
       │ 1. Fetch device token from database
       ▼
┌──────────────┐
│  Django      │
│  Database    │
│  (SQLite)    │
│              │
│  DeviceToken │
│  table       │
└──────┬───────┘
       │
       │ 2. Get token: "61905b15157869b4..."
       ▼
┌──────────────┐
│  Simulator   │
│  (ready to   │
│  send data)  │
└──────┬───────┘
       │
       │ 3. HTTP POST every 100ms
       │    URL: /api/v1/hardware/push/
       │    Headers: X-Device-Token
       │    Body: {emg, force, motion_x/y/z, battery}
       ▼
┌──────────────┐
│  Django      │
│  Backend     │
│              │
│  Hardware-   │
│  PushView    │
└──────┬───────┘
       │
       │ 4. Validate token
       │ 5. Process with AI
       │ 6. Save to database
       │ 7. Return prediction
       ▼
┌──────────────┐
│  Simulator   │
│  receives    │
│  response    │
│              │
│  {command,   │
│   gesture,   │
│   confidence}│
└──────┬───────┘
       │
       │ 8. Display in terminal
       ▼
┌──────────────┐
│  User sees   │
│  live data   │
│  streaming   │
└──────────────┘

Meanwhile...

┌──────────────┐
│  Web         │
│  Frontend    │
│  (React)     │
└──────┬───────┘
       │
       │ Every 3 seconds:
       │ HTTP GET /api/v1/dashboard/
       ▼
┌──────────────┐
│  Django      │
│  Backend     │
└──────┬───────┘
       │
       │ Returns latest data:
       │ - Battery
       │ - EMG
       │ - Force
       │ - AI predictions
       ▼
┌──────────────┐
│  Dashboard   │
│  updates     │
│  values      │
│              │
│  Shows       │
│  "Hardware   │
│  Live" ✅    │
└──────────────┘
```

---

## 🎯 **Connection Checklist**

Use this checklist to ensure proper connection:

### **Before Running Simulator:**

- [ ] Backend server running (`python manage.py runserver`)
- [ ] Frontend server running (`npm run dev`)
- [ ] Database seeded (`python seed_data.py`)
- [ ] Virtual environment activated

### **When Running Simulator:**

- [ ] No errors in terminal
- [ ] Shows "✅ Token: ..." message
- [ ] Shows "✅ Backend is online" message
- [ ] Packets being sent (count increasing)
- [ ] Success rate near 100%

### **In Web Dashboard:**

- [ ] Top-right shows "Hardware Live" (not "Simulation Mode")
- [ ] Green WiFi icon visible
- [ ] Battery % updating
- [ ] EMG values changing
- [ ] AI predictions showing

### **Verification Commands:**

```bash
# Check backend alive
curl http://127.0.0.1:8000/api/v1/dashboard/

# Check frontend alive
curl http://localhost:5173

# Check database has data
cd bionic_backend
python manage.py shell
>>> from core.models import SensorData
>>> SensorData.objects.count()
Should be increasing!
```

---

## 💡 **Key Connection Concepts**

### **1. Device Token = Hardware ID Card**

Each patient has a unique token stored in database. The simulator:
- Fetches this token automatically
- Includes it in every HTTP request
- Backend validates it before accepting data

**Without token = No connection!**

### **2. HTTP POST = Data Delivery Method**

Simulator uses standard HTTP POST requests:
- Same protocol websites use
- Works over network/WiFi
- Backend treats it like any web request

**This is how ESP32 hardware would connect too!**

### **3. Polling = Frontend Update Strategy**

Frontend doesn't get pushed data directly. Instead:
- Polls backend every 3 seconds
- Asks "Any new sensor data?"
- Backend returns latest readings
- Frontend updates display

**Like refreshing email inbox repeatedly.**

### **4. Backend = Middleman**

Django backend sits between:
- Simulator/Hardware (data source)
- Database (storage)
- Frontend (display)

**All communication flows through backend!**

---

## 🎓 **Summary**

### **To Connect Simulator:**

**Simplest:**
```bash
cd "d:\AI Posthetic Limb Control System\bionic_backend"
..\venv\Scripts\Activate.ps1
python connect_simulator.py
```

**That's one command!** The simulator handles everything else automatically.

### **What Happens:**

1. ✅ Fetches device token from database
2. ✅ Connects to backend at `http://127.0.0.1:8000`
3. ✅ Sends sensor data every 100ms
4. ✅ Backend processes with AI
5. ✅ Saves to database
6. ✅ Frontend displays within 3 seconds

### **Result:**

Your dashboard shows **"Hardware Live"** with real-time updating values!

---

## 📞 **Quick Reference**

| Need | Command |
|------|---------|
| **Connect simulator** | `python connect_simulator.py` |
| **Start backend** | `python manage.py runserver` |
| **Start frontend** | `npm run dev` |
| **Seed database** | `python seed_data.py` |
| **Check data** | `python manage.py shell` → `SensorData.objects.count()` |
| **Get token** | Automatic (or query DeviceToken table) |

---

**Created:** March 30, 2026  
**Purpose:** Complete guide to connecting simulators to control system  
**Files Referenced:**
- `bionic_backend/connect_simulator.py` ← Easiest connector
- `bionic_backend/quick_tester.py`
- `bionic_backend/hardware_simulator_gui.py`
- `bionic_backend/hardware_simulator.py`

**Happy Connecting! 🚀**
