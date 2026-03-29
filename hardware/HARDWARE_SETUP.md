# Hardware Setup Guide — AI Prosthetic Limb
## Step-by-Step Connection Guide (SRS §4.2 Hardware Interfaces)

---

## 🛒 Parts Required

| Component | Model | Quantity |
|---|---|---|
| Microcontroller | ESP32 DevKit v1 | 1 |
| EMG Sensor | MyoWare 2.0 | 1 |
| IMU (Motion) | MPU6050 (GY-521) | 1 |
| Finger Servos | SG90 Micro Servo | 3 (thumb, index, middle) |
| Wrist Servo | MG996R (metal gear) | 1 |
| Battery | 7.4V LiPo 2200mAh | 1 |
| Battery Charger | TP4056 / LiPo charger | 1 |
| Resistors | 10kΩ | 2 (voltage divider) |
| Breadboard | Standard | 1 |
| Jumper wires | M-M, M-F | Set |

**Estimated Cost: PKR 4,000–7,000 (Rs. 4k–7k)**

---

## 🔌 Wiring Diagram

```
ESP32 DevKit v1
┌─────────────────────────────────────────────┐
│                                             │
│  3.3V  ──┬──── MPU6050 (VCC)               │
│          └──── MyoWare (+)                  │
│                                             │
│  GND   ──┬──── MPU6050 (GND)               │
│          ├──── MyoWare (-)                  │
│          ├──── All Servo (GND)              │
│          └──── Battery divider (GND)        │
│                                             │
│  GPIO21 ─────── MPU6050 (SDA)              │
│  GPIO22 ─────── MPU6050 (SCL)              │
│                                             │
│  GPIO34 ─────── MyoWare (SIG out)          │
│  GPIO35 ─────── Force sensor (mid-point)   │
│  GPIO36 ─────── Battery divider (mid-point)│
│                                             │
│  GPIO13 ─────── Thumb Servo (signal/PWM)   │
│  GPIO12 ─────── Index Servo (signal/PWM)   │
│  GPIO14 ─────── Middle Servo (signal/PWM)  │
│  GPIO27 ─────── Wrist Servo (signal/PWM)   │
│                                             │
│  GPIO2  ─────── Status LED (built-in)      │
│                                             │
│  VIN (5V) ───── All Servo (VCC, red wire)  │
└─────────────────────────────────────────────┘

Battery Voltage Divider (for GPIO36):
  Battery+ ──── 10kΩ ──── GPIO36 ──── 10kΩ ──── GND
```

---

## 📲 Software Setup

### Step 1: Install Arduino IDE
Download from: https://www.arduino.cc/en/software

### Step 2: Add ESP32 Board
1. Open Arduino IDE → **File → Preferences**
2. Add to "Additional Boards Manager URLs":
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
3. Go to **Tools → Board → Boards Manager**
4. Search "esp32" → Install by Espressif Systems

### Step 3: Install Libraries
Go to **Tools → Manage Libraries** and install:
- `ArduinoJson` by Benoit Blanchon (version 7.x)
- `MPU6050_light` by rfetick
- `ESP32Servo` by Kevin Harrington

### Step 4: Get Your Device Token
1. Start the web system (`npm run dev` and Django server)
2. Login as your patient account
3. Go to **Settings** page
4. Copy your **Device Token** (shown at bottom of settings page)

### Step 5: Configure the Firmware
Open `hardware/prosthetic_limb.ino` and update:
```cpp
const char* WIFI_SSID     = "YourWiFiName";
const char* WIFI_PASSWORD = "YourWiFiPassword";
const char* SERVER_URL    = "http://192.168.1.100:8000"; // Your PC's IP
const char* DEVICE_TOKEN  = "abc123...";                 // From Settings page
```

**To find your PC's IP:**
```
Windows: ipconfig → Look for IPv4 Address
```
### Step 6: Flash the Firmware
1. Connect ESP32 via USB
2. Select **Tools → Board → ESP32 Dev Module**
3. Select correct **Port**
4. Click **Upload** (→)
5. Open **Serial Monitor** (115200 baud) — you should see:
   ```
   === BionicAI Prosthetic Limb ===
   [OK] Servos initialized
   [OK] MPU6050 calibrated
   [OK] WiFi connected! IP: 192.168.1.x
   === Ready to transmit ===
   EMG:  50.2 | Force: 0.00N | X: 0.01 Y: 0.02 Z: 0.99 | Bat: 85%
   ```

---

## ✅ Test Checklist

- [ ] Open Serial Monitor — see sensor readings every 100ms
- [ ] Open web dashboard — battery level updates from real hardware
- [ ] Flex muscle (contract) — EMG value rises above 300
- [ ] Web dashboard shows "Power Grip" in AI Inference card
- [ ] Click "Open Hand" button on web — servo opens
- [ ] Click "Emergency STOP" — servo freezes immediately
- [ ] Tilt IMU — motion chart (XYZ) reacts on web

---

## ⚠️ Safety Notes (SRS §5.2)
- Never run servos without proper power supply (servos need 5V, NOT 3.3V)
- Always have Emergency STOP accessible when testing limb movement
- Keep battery voltage above 6V to prevent MCU brownout
- The firmware automatically triggers STOP if EMG signal is too noisy
