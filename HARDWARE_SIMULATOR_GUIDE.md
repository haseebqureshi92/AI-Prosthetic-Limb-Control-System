# 🎮 Hardware Simulator Guide - Test Without Physical Hardware

## 🌟 Overview

**Don't have physical hardware?** No problem! 

I've created **3 Python-based hardware simulators** that act exactly like the real ESP32/Arduino device. They send realistic sensor data to your backend, allowing you to test the entire system end-to-end.

### What These Simulators Do:

✅ **Mimic real hardware** - Send data every 100ms (10Hz) just like ESP32  
✅ **Generate realistic values** - EMG, Force, IMU motion, Battery  
✅ **Test AI predictions** - Backend processes data and predicts gestures  
✅ **Verify real-time updates** - Watch dashboard update live  
✅ **Debug connectivity** - Confirm backend is receiving data  

---

## 🚀 Quick Start (Choose One)

### Option 1: **Quick Tester** ⚡ (Simplest - Recommended for First Time)

**Best for**: Quick verification that everything works

```bash
cd "d:\AI Posthetic Limb Control System\bionic_backend"
..\venv\Scripts\python.exe quick_tester.py
```

**What it does**:
- Sends sensor data every 100ms
- Cycles through all gestures automatically
- Shows live terminal output
- Runs immediately with no setup

**Expected Output**:
```
⚡ Quick Hardware Tester - Real-Time Data Simulator
==================================================
✅ Using token: 61905b15157869b4...
📡 Sending data every 100ms...

[   1] IDLE   | EMG:  45.2 | Force:0.12N | Battery:100% | AI: Idle / Resting    ( 92.3%)
[   2] OPEN   | EMG: 210.5 | Force:0.25N | Battery:100% | AI: Open Hand         ( 88.7%)
[   3] GRIP   | EMG: 680.3 | Force:5.42N | Battery:100% | AI: Power Grip        ( 94.1%)
...
```

**Open dashboard**: http://localhost:5173 → See real-time updates! ✅

---

### Option 2: **Interactive GUI Simulator** 🎮 (Best for Testing)

**Best for**: Manual gesture control and detailed testing

```bash
cd "d:\AI Posthetic Limb Control System\bionic_backend"
..\venv\Scripts\python.exe hardware_simulator_gui.py
```

**Features**:
- **Keyboard controls** - Press 1-5 to change gestures
- **Live display** - Beautiful terminal UI with stats
- **Manual control** - Test specific gestures on demand
- **Real-time feedback** - See AI predictions instantly

**Controls**:
```
[1] IDLE     - Resting state, low EMG
[2] OPEN     - Open hand gesture
[3] GRIP     - Power grip (high EMG)
[4] PINCH    - Precision pinch
[5] ROTATE   - Wrist rotation
[Q] Quit     - Stop simulator
```

**Expected Display**:
```
╔════════════════════════════════════════════╗
║   🦾 REAL-TIME HARDWARE SIMULATOR         ║
╚════════════════════════════════════════════╝

Current Gesture: GRIP

┌──────────────────────────────────────────┐
│ Sensor Values (Live)                   │
├──────────────────────────────────────────┤
│ 🔋 Battery:  100% ██████████              │
│ 💪 EMG:       680.3                      │
│ ⚡ Force:     5.42 N                     │
│ 📐 Motion:   X:+0.12 Y:-0.05 Z:+0.98    │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ AI Backend Response                    │
├──────────────────────────────────────────┤
│ 🧠 Prediction: Power Grip               │
│ 📊 Confidence:  94.1%                   │
│ 🎯 Command:    GRIP                     │
└──────────────────────────────────────────┘

Stats: 150 packets | 150 success | 100.0% | 15s
Controls: [1] IDLE  [2] OPEN  [3] GRIP  [4] PINCH  [5] ROTATE  [Q] Quit
```

---

### Option 3: **Full Simulator** 🔬 (Most Advanced)

**Best for**: Extended testing, statistics, production-like behavior

```bash
cd "d:\AI Posthetic Limb Control System\bionic_backend"
..\venv\Scripts\python.exe hardware_simulator.py
```

**Features**:
- Auto-cycles through gestures every 3 seconds
- Detailed packet statistics
- Wave pattern simulation (dynamic EMG changes)
- Production-level realism
- Success rate tracking

**Run this for**: Long-term testing, verifying stability

---

## 📊 How to Verify It's Working

### Step 1: Start Backend Server

Make sure Django backend is running:

```bash
cd "d:\AI Posthetic Limb Control System\bionic_backend"
..\venv\Scripts\python.exe manage.py runserver
```

Should see: `Starting development server at http://127.0.0.1:8000/`

---

### Step 2: Start Frontend (Optional but Recommended)

```bash
cd "d:\AI Posthetic Limb Control System"
npm run dev
```

Open: http://localhost:5173

Login: `patient1` / `bionic123`

---

### Step 3: Run a Simulator

Pick any simulator from above. Example:

```bash
cd "d:\AI Posthetic Limb Control System\bionic_backend"
..\venv\Scripts\python.exe quick_tester.py
```

---

### Step 4: Watch the Magic Happen ✨

#### In Terminal:
You'll see live data streaming:
```
[   1] IDLE   | EMG:  45.2 | Force:0.12N | Battery:100% | AI: Idle / Resting    ( 92.3%)
[   2] OPEN   | EMG: 210.5 | Force:0.25N | Battery:100% | AI: Open Hand         ( 88.7%)
```

#### In Web Dashboard:
- Top-right corner changes from **"Simulation Mode"** to **"Hardware Live"** ✅
- Battery % updates every 3 seconds
- EMG value fluctuates in real-time
- AI Gesture prediction changes
- 3D arm moves based on gesture

#### In Backend Logs:
You'll see POST requests:
```
[HTTP POST] /api/v1/hardware/push/ - 200 OK
Device authenticated: patient1
Sensor data saved: EMG=680.3, Force=5.42
AI Prediction: Power Grip (94.1%)
```

---

## 🎯 What Each Simulator Tests

| Component | Tested By | How |
|-----------|-----------|-----|
| **Backend API** | All simulators | HTTP POST to `/hardware/push/` |
| **Device Auth** | All simulators | X-Device-Token header validation |
| **AI Processing** | All simulators | Real-time gesture prediction |
| **Database** | All simulators | SensorData records created |
| **Frontend Polling** | Dashboard | Updates every 3 seconds |
| **Real-Time Charts** | EMGData page | Live waveform visualization |
| **Gesture Control** | GUI Simulator | Manual gesture switching |
| **System Load** | Full Simulator | Continuous data transmission |

---

## 🔍 Troubleshooting

### ❌ "Could not get device token"

**Solution**: Run seed_data.py first:
```bash
cd "d:\AI Posthetic Limb Control System\bionic_backend"
..\venv\Scripts\python.exe seed_data.py
```

---

### ❌ "Connection refused" or "Backend not responding"

**Cause**: Django server not running

**Solution**:
```bash
cd "d:\AI Posthetic Limb Control System\bionic_backend"
..\venv\Scripts\python.exe manage.py runserver
```

---

### ❌ "HTTP Error 403" or "Invalid token"

**Cause**: Wrong device token

**Solution**: Get fresh token:
```bash
cd "d:\AI Posthetic Limb Control System\bionic_backend"
..\venv\Scripts\python.exe manage.py shell
```
```python
from core.models import DeviceToken
t = DeviceToken.objects.get(user__username='patient1')
print(f"New token: {t.token}")
exit()
```

Then restart simulator.

---

### ❌ Dashboard still shows "Simulation Mode"

**Check**:
1. Simulator is running and sending data
2. Backend logs show successful POST requests
3. Refresh dashboard page (Ctrl+R)
4. Logout and login again

**Verify data is being received**:
```bash
cd "d:\AI Posthetic Limb Control System\bionic_backend"
..\venv\Scripts\python.exe manage.py shell
```
```python
from core.models import SensorData
print(f"Total readings: {SensorData.objects.count()}")
latest = SensorData.objects.first()
if latest:
    print(f"Latest: EMG={latest.emg_value}, Time={latest.timestamp}")
exit()
```

---

## 📈 Expected Results

### When Everything Works:

#### Terminal (Simulator):
```
[ 500] GRIP   | EMG: 720.5 | Force:5.89N | Battery: 95% | AI: Power Grip        ( 96.2%)
```

#### Web Dashboard:
- ✅ Green "Hardware Live" indicator
- 🔄 Values updating every 3 seconds
- 📊 EMG chart showing live waveform
- 🧠 AI predictions matching simulator gestures
- 🔋 Battery slowly decreasing

#### Database:
```python
>>> from core.models import SensorData
>>> SensorData.objects.count()
500  # Increases by 10 per second!
```

---

## 🎓 Learning Exercise

Try this sequence to understand the full system:

1. **Start backend**: `python manage.py runserver`
2. **Start frontend**: `npm run dev`
3. **Open dashboard**: Login as `patient1`
4. **Note current state**: Dashboard shows "Simulation Mode"
5. **Start simulator**: `python quick_tester.py`
6. **Watch dashboard**: Changes to "Hardware Live" within 3 seconds!
7. **Check EMGData page**: See live charts updating
8. **Change gestures** (GUI simulator): Press 3 for GRIP
9. **Observe AI**: Dashboard shows "Power Grip" prediction
10. **Stop simulator**: Dashboard returns to "Simulation Mode" after ~10 seconds

This demonstrates the **complete data flow**:
```
Simulator → Backend API → AI Processing → Database → Frontend → You!
```

---

## 🚀 Advanced Usage

### Custom Gesture Patterns

Edit `quick_tester.py` to add custom EMG patterns:

```python
# Add your own gesture
elif gesture == 'CUSTOM':
    emg = random.uniform(400, 500)  # Your custom EMG range
    force = random.uniform(3.0, 4.0)
```

### Multiple Users

Test with different patient accounts:

```python
# In simulator, change username
t = DeviceToken.objects.get(user__username='aree_fazal')  # Different patient
```

### Load Testing

Run multiple simulators simultaneously to test system capacity:

```bash
# Terminal 1
python quick_tester.py

# Terminal 2 (different user)
python quick_tester.py  # Edit to use different token
```

---

## 📞 Summary

### Without Hardware:

✅ Use `quick_tester.py` for instant verification  
✅ Use `hardware_simulator_gui.py` for interactive testing  
✅ Use `hardware_simulator.py` for extended runs  
✅ All simulators mimic real ESP32 behavior  
✅ Backend can't tell difference between simulator and real hardware  
✅ Dashboard shows "Hardware Live" when simulator is running  

### With Hardware:

When you get the ESP32, upload `hardware/prosthetic_limb.ino` and it will work identically to the simulators!

---

## 🎯 Next Steps After Testing

1. ✅ Verify simulators work
2. ✅ Check dashboard updates
3. ✅ Test all gestures
4. ✅ View EMG charts
5. ⏳ Order ESP32 hardware (when ready)
6. ⏳ Upload firmware
7. ⏳ Connect real sensors
8. ✅ Same workflow - just swap simulator for hardware!

---

**Created**: March 30, 2026  
**Purpose**: Test AI Prosthetic Limb system without physical hardware  
**Files Created**:
- `bionic_backend/quick_tester.py`
- `bionic_backend/hardware_simulator_gui.py`
- `bionic_backend/hardware_simulator.py`

**Happy Testing! 🎉**
