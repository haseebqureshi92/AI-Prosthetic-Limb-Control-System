# 🚀 ONE-PAGE SIMULATOR CONNECTION GUIDE

## ✅ Quick Answer - Connect in 3 Steps

### **Step 1: Start Backend** (Terminal 1)
```bash
cd "d:\AI Posthetic Limb Control System\bionic_backend"
..\venv\Scripts\Activate.ps1
python manage.py runserver
```
**Keep this terminal open!**

---

### **Step 2: Start Simulator** (Terminal 2)
```bash
cd "d:\AI Posthetic Limb Control System\bionic_backend"
..\venv\Scripts\Activate.ps1
python connect_simulator.py
```
**This connects the simulator automatically!**

---

### **Step 3: Open Dashboard** (Web Browser)
```
http://localhost:5173
Login: patient1 / bionic123
```
**Watch values update every 3 seconds!**

---

## 🎯 What You'll See

### **Terminal Output:**
```
╔══════════════════════════════════════════════════════╗
║   🦾 BIONIC LIMB - SIMULATOR CONNECTOR              ║
╚══════════════════════════════════════════════════════╝

✅ Token: 61905b15157869b4...
✅ Backend is online at http://127.0.0.1:8000

📊 Simulator is now connected to control system!
   • Sending data every 100ms (10 times/second)

[  20] GRIP   | EMG: 697.3 | Force:6.19N | Battery: 66% | AI: Open Hand (82.4%)
[  40] OPEN   | EMG: 200.8 | Force:0.28N | Battery: 66% | AI: Open Hand (85.3%)
[  60] PINCH  | EMG: 398.5 | Force:2.87N | Battery: 66% | AI: Precision Pinch (91.3%)
```

### **Dashboard Shows:**
- ✅ **"Hardware Live"** indicator (green)
- 🔄 Values updating every 3 seconds
- 📊 EMG charts moving in real-time
- 🧠 AI predictions changing

---

## 🔧 If Something Goes Wrong

### **"Backend not responding"**
→ Start backend first (Step 1 above)

### **"Could not fetch device token"**
→ Run: `python seed_data.py`

### **Dashboard shows "Simulation Mode"**
→ Refresh page (Ctrl+R) or logout/login again

### **Values not updating**
→ Check simulator terminal shows packets being sent
→ Verify backend logs show POST requests

---

## 📞 All Simulator Options

| Command | Best For |
|---------|----------|
| `python connect_simulator.py` | **Easiest** - Auto everything |
| `python quick_tester.py` | Simple automated testing |
| `python hardware_simulator_gui.py` | Manual gesture control |
| `python hardware_simulator.py` | Extended production-like runs |

All auto-connect - just run them!

---

## 🎓 How It Works (Simple)

```
Simulator → Backend (100ms) → Database → Frontend (3s) → You!
```

1. **Simulator** fetches device token from database
2. **Simulator** sends HTTP POST every 100ms with sensor data
3. **Backend** validates token, runs AI prediction
4. **Backend** saves to database
5. **Frontend** polls every 3 seconds
6. **Dashboard** updates with latest values
7. **You see** real-time readings!

---

## ✅ Connection Checklist

Before running simulator:
- [ ] Backend running (`python manage.py runserver`)
- [ ] Frontend running (`npm run dev`)
- [ ] Database seeded (`python seed_data.py`)

When simulator runs:
- [ ] Shows "✅ Token: ..."
- [ ] Shows "✅ Backend is online"
- [ ] Packets sending (count increasing)
- [ ] Success rate ~100%

In dashboard:
- [ ] Shows "Hardware Live" (not "Simulation Mode")
- [ ] Values updating every 3 seconds
- [ ] AI predictions showing

---

## 💡 Pro Tips

1. **Run backend in background** - Keep terminal open
2. **Use connect_simulator.py** - Easiest, zero config
3. **Try GUI version** - Press keys [1-5] to change gestures
4. **Check database** - `SensorData.objects.count()` should increase
5. **Multiple terminals** - Run different simulators simultaneously

---

## 📚 Full Documentation

For complete details, see:
- **[CONNECT_SIMULATOR_GUIDE.md](CONNECT_SIMULATOR_GUIDE.md)** - Complete guide (600+ lines)
- **[HARDWARE_SIMULATOR_GUIDE.md](HARDWARE_SIMULATOR_GUIDE.md)** - All simulators explained
- **[SIMULATOR_SUCCESS.md](SIMULATOR_SUCCESS.md)** - Success summary

---

## 🎉 That's It!

**One command to connect:**
```bash
python connect_simulator.py
```

**Everything else is automatic!** ✨

---

**Created:** March 30, 2026  
**Status:** ✅ Working - Tested live  
**Connection:** Automatic via HTTP POST  
**Files:** `connect_simulator.py` ← Use this!
