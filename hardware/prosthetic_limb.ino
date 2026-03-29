/*
 * ============================================================
 *  AI-BASED PROSTHETIC LIMB — ESP32 FIRMWARE
 *  File: prosthetic_limb.ino
 * ============================================================
 *  SRS Reference: §4.2 Hardware Interfaces, §4.4 Communication
 *
 *  HARDWARE REQUIRED:
 *  ┌─────────────────────────────────────────────────────────┐
 *  │  Board    : ESP32 (NodeMCU-32S or DevKit v1)            │
 *  │  OR       : Arduino Mega 2560 + ESP8266 WiFi module     │
 *  │             (change WIFI_ENABLED to false for serial)   │
 *  │                                                         │
 *  │  EMG      : MyoWare 2.0 / Grove EMG Sensor / Electrodes│
 *  │  IMU      : MPU6050 (GY-521 breakout board)            │
 *  │  Servos   : 4× SG90 or MG996R servo motors             │
 *  │  Battery  : 7.4V LiPo → voltage divider to A0          │
 *  └─────────────────────────────────────────────────────────┘
 *
 *  PIN CONNECTIONS:
 *  ┌──────────────┬─────────────┬──────────────────────────┐
 *  │ Component    │ ESP32 Pin   │ Notes                    │
 *  ├──────────────┼─────────────┼──────────────────────────┤
 *  │ EMG Signal   │ GPIO34      │ Analog input (ADC1)      │
 *  │ Force/FSR    │ GPIO35      │ Analog input (ADC1)      │
 *  │ MPU6050 SDA  │ GPIO21      │ I2C Data                 │
 *  │ MPU6050 SCL  │ GPIO22      │ I2C Clock                │
 *  │ Thumb Servo  │ GPIO13      │ PWM output               │
 *  │ Index Servo  │ GPIO12      │ PWM output               │
 *  │ Middle Servo │ GPIO14      │ PWM output               │
 *  │ Wrist Servo  │ GPIO27      │ PWM output               │
 *  │ Battery ADC  │ GPIO36      │ Voltage divider (10k+10k)│
 *  │ Status LED   │ GPIO2       │ Built-in LED             │
 *  └──────────────┴─────────────┴──────────────────────────┘
 *
 *  LIBRARIES REQUIRED (install via Arduino IDE Library Manager):
 *  - WiFi.h           (built-in for ESP32)
 *  - HTTPClient.h     (built-in for ESP32)
 *  - ArduinoJson v7   (search "ArduinoJson" by Benoit Blanchon)
 *  - Wire.h           (built-in)
 *  - MPU6050_light    (search "MPU6050_light" by rfetick)
 *  - ESP32Servo       (search "ESP32Servo" by Kevin Harrington)
 * ============================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <MPU6050_light.h>
#include <ESP32Servo.h>

// ─────────────────────────────────────────────
//  ★ CONFIGURE THESE BEFORE FLASHING ★
// ─────────────────────────────────────────────
const char* WIFI_SSID     = "YOUR_WIFI_NAME";       // ← change this
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";   // ← change this
const char* SERVER_URL    = "http://192.168.1.100:8000";  // ← your PC's local IP
const char* DEVICE_TOKEN  = "PASTE_YOUR_TOKEN_HERE";     // ← from web dashboard Settings page

// ─────────────────────────────────────────────
//  HARDWARE CONFIGURATION
// ─────────────────────────────────────────────
#define EMG_PIN         34      // EMG sensor analog input
#define FORCE_PIN       35      // Force sensor analog input
#define BATTERY_PIN     36      // Battery voltage divider
#define STATUS_LED      2       // Built-in LED

#define SERVO_THUMB     13      // Thumb servo signal pin
#define SERVO_INDEX     12      // Index finger servo
#define SERVO_MIDDLE    14      // Middle finger servo
#define SERVO_WRIST     27      // Wrist rotation servo

#define SEND_INTERVAL_MS  100   // POST data every 100ms (10Hz)
#define ADC_MAX           4095  // ESP32 12-bit ADC
#define BATTERY_DIVIDER   2.0   // Voltage divider ratio (2× 10kΩ)
#define BATTERY_FULL_V    8.4   // LiPo fully charged voltage
#define BATTERY_EMPTY_V   6.0   // LiPo cutoff voltage

// ─────────────────────────────────────────────
//  OBJECTS
// ─────────────────────────────────────────────
MPU6050 mpu(Wire);
Servo servoThumb, servoIndex, servoMiddle, servoWrist;

// ─────────────────────────────────────────────
//  GLOBAL STATE
// ─────────────────────────────────────────────
unsigned long lastSendTime  = 0;
bool isEmergencyStop        = false;
int currentSensitivity      = 75;
int currentSpeed            = 60;
String lastCommand          = "";

// EMG moving average filter (SRS §3.5)
const int FILTER_SIZE = 5;
float emgHistory[FILTER_SIZE] = {0};
int filterIndex = 0;

// ─────────────────────────────────────────────
//  SETUP
// ─────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  Serial.println("\n=== BionicAI Prosthetic Limb ===");
  Serial.println("Initializing...");

  // LED
  pinMode(STATUS_LED, OUTPUT);
  blinkLED(3);

  // Servo motors
  servoThumb.attach(SERVO_THUMB);
  servoIndex.attach(SERVO_INDEX);
  servoMiddle.attach(SERVO_MIDDLE);
  servoWrist.attach(SERVO_WRIST);
  setHandPosition(10, 10, 10, 90);  // Default: hand slightly open
  Serial.println("[OK] Servos initialized");

  // MPU6050 (IMU)
  Wire.begin();
  byte status = mpu.begin();
  if (status != 0) {
    Serial.println("[WARN] MPU6050 not found — using simulated motion data");
  } else {
    mpu.calcOffsets(); // Auto-calibrate gyro/accel
    Serial.println("[OK] MPU6050 calibrated");
  }

  // WiFi
  Serial.printf("Connecting to WiFi: %s\n", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf("\n[OK] WiFi connected! IP: %s\n", WiFi.localIP().toString().c_str());
  } else {
    Serial.println("\n[WARN] WiFi failed — will retry in loop");
  }

  blinkLED(5);
  Serial.println("=== Ready to transmit ===\n");
}

// ─────────────────────────────────────────────
//  MAIN LOOP
// ─────────────────────────────────────────────
void loop() {
  if (isEmergencyStop) {
    // SAFETY: hold position, blink red LED every 500ms
    digitalWrite(STATUS_LED, (millis() / 500) % 2);
    return;
  }

  // Update IMU
  mpu.update();

  // Send data at defined interval
  if (millis() - lastSendTime >= SEND_INTERVAL_MS) {
    lastSendTime = millis();
    readAndSendSensorData();
  }
}

// ─────────────────────────────────────────────
//  READ SENSORS + SEND TO WEB SERVER
// ─────────────────────────────────────────────
void readAndSendSensorData() {
  // 1. Read EMG (0–4095 raw ADC)
  int rawEMG = analogRead(EMG_PIN);
  float filteredEMG = applyMovingAverage((float)rawEMG);

  // 2. Read Force sensor (0–4095 → 0–10 N mapping)
  int rawForce = analogRead(FORCE_PIN);
  float forceN = (rawForce / (float)ADC_MAX) * 10.0;

  // 3. Read IMU (MPU6050)
  float accel_x = mpu.getAccX();
  float accel_y = mpu.getAccY();
  float accel_z = mpu.getAccZ();

  // 4. Read battery voltage
  int rawBattery = analogRead(BATTERY_PIN);
  float voltage   = (rawBattery / (float)ADC_MAX) * 3.3 * BATTERY_DIVIDER;
  int batteryPct  = constrain(
    map((int)(voltage * 100), (int)(BATTERY_EMPTY_V * 100), (int)(BATTERY_FULL_V * 100), 0, 100), 0, 100
  );

  // 5. Print to Serial Monitor for debugging
  Serial.printf("EMG:%6.1f | Force:%4.2fN | X:%5.2f Y:%5.2f Z:%5.2f | Bat:%3d%%\n",
    filteredEMG, forceN, accel_x, accel_y, accel_z, batteryPct);

  // 6. POST to server
  if (WiFi.status() == WL_CONNECTED) {
    sendToServer(filteredEMG, forceN, accel_x, accel_y, accel_z, batteryPct);
  } else {
    // Reconnect WiFi
    WiFi.reconnect();
    Serial.println("[WIFI] Reconnecting...");
  }
}

// ─────────────────────────────────────────────
//  HTTP POST TO DJANGO BACKEND  (SRS §4.4)
// ─────────────────────────────────────────────
void sendToServer(float emg, float force, float mx, float my, float mz, int battery) {
  HTTPClient http;
  String url = String(SERVER_URL) + "/api/v1/hardware/push/";

  http.begin(url);
  http.addHeader("Content-Type",    "application/json");
  http.addHeader("X-Device-Token",  DEVICE_TOKEN);   // Hardware authentication

  // Build JSON payload
  StaticJsonDocument<256> doc;
  doc["emg"]       = emg;
  doc["force"]     = force;
  doc["motion_x"]  = mx;
  doc["motion_y"]  = my;
  doc["motion_z"]  = mz;
  doc["battery"]   = battery;
  String payload;
  serializeJson(doc, payload);

  int httpCode = http.POST(payload);

  if (httpCode == 200) {
    String response = http.getString();
    processServerResponse(response);
    digitalWrite(STATUS_LED, HIGH); // LED on = connected
  } else if (httpCode > 0) {
    Serial.printf("[HTTP] Error %d\n", httpCode);
  } else {
    Serial.printf("[HTTP] Failed: %s\n", http.errorToString(httpCode).c_str());
    digitalWrite(STATUS_LED, LOW);
  }

  http.end();
}

// ─────────────────────────────────────────────
//  PROCESS COMMAND FROM SERVER
// ─────────────────────────────────────────────
void processServerResponse(String json) {
  StaticJsonDocument<512> doc;
  DeserializationError err = deserializeJson(doc, json);
  if (err) {
    Serial.println("[JSON] Parse error");
    return;
  }

  // Check if limb should be active
  bool isActive = doc["is_active"] | true;
  if (!isActive) {
    setHandPosition(10, 10, 10, 90); // Open/rest position
    return;
  }

  // Get global sensitivity/speed from server
  currentSensitivity = doc["sensitivity"] | 75;
  currentSpeed       = doc["speed"] | 60;

  // Get the command to execute
  const char* command = doc["command"] | "NONE";
  String cmd = String(command);

  if (cmd == lastCommand) return; // no change, avoid jitter
  lastCommand = cmd;

  Serial.printf("[CMD] %s (gesture: %s, conf: %.1f%%)\n",
    command,
    doc["gesture"] | "?",
    doc["confidence"] | 0.0);

  // Execute command
  executeCommand(cmd, doc["motor_angles"]);
}

// ─────────────────────────────────────────────
//  COMMAND EXECUTION → SERVO CONTROL  (SRS §4.2)
// ─────────────────────────────────────────────
void executeCommand(String command, JsonObject angles) {
  if (command == "STOP") {
    // EMERGENCY STOP — freeze all movement (SRS §5.2)
    Serial.println("[SAFETY] EMERGENCY STOP!");
    isEmergencyStop = true;
    blinkLED(10);
    return;
  }

  if (command == "SLEEP") {
    setHandPosition(10, 10, 10, 90);
    return;
  }

  if (command == "CALIBRATE") {
    runCalibrationSequence();
    return;
  }

  // Use motor angles from AI prediction if available
  if (!angles.isNull()) {
    int thumb  = angles["thumb"]  | 10;
    int index  = angles["index"]  | 10;
    int middle = angles["middle"] | 10;
    int wrist  = angles["wrist"]  | 90;
    setHandPosition(thumb, index, middle, wrist);
    return;
  }

  // Fallback hardcoded positions
  if      (command == "GRIP")       setHandPosition(80, 85, 85, 90);
  else if (command == "RELEASE")    setHandPosition(0,  0,  0,  90);
  else if (command == "PINCH")      setHandPosition(70, 75, 0,  90);
  else if (command == "ROTATE_CW")  setHandPosition(30, 30, 30, 135);
  else if (command == "ROTATE_CCW") setHandPosition(30, 30, 30, 45);
}

// ─────────────────────────────────────────────
//  SET HAND POSITION (smooth movement)
// ─────────────────────────────────────────────
void setHandPosition(int thumb, int index, int middle, int wrist) {
  // Clamp all values
  thumb  = constrain(thumb,  0, 90);
  index  = constrain(index,  0, 90);
  middle = constrain(middle, 0, 90);
  wrist  = constrain(wrist,  0, 180);

  // Calculate step size based on speed setting
  int speedDelay = map(currentSpeed, 0, 100, 20, 2); // faster speed = smaller delay

  int currentThumb  = servoThumb.read();
  int currentIndex  = servoIndex.read();
  int currentMiddle = servoMiddle.read();
  int currentWrist  = servoWrist.read();

  // Move smoothly (avoid sudden jerky movements — SRS §5.2)
  int maxSteps = max({
    abs(thumb  - currentThumb),
    abs(index  - currentIndex),
    abs(middle - currentMiddle),
    abs(wrist  - currentWrist)
  });

  for (int step = 1; step <= maxSteps; step++) {
    float t = (float)step / maxSteps;
    servoThumb.write( currentThumb  + (int)((thumb  - currentThumb)  * t) );
    servoIndex.write( currentIndex  + (int)((index  - currentIndex)  * t) );
    servoMiddle.write(currentMiddle + (int)((middle - currentMiddle) * t) );
    servoWrist.write( currentWrist  + (int)((wrist  - currentWrist)  * t) );
    delay(speedDelay);
  }
}

// ─────────────────────────────────────────────
//  CALIBRATION SEQUENCE  (SRS §3.3 UC-3)
// ─────────────────────────────────────────────
void runCalibrationSequence() {
  Serial.println("[CALIBRATION] Starting...");
  setHandPosition(0,   0,   0,   90);  delay(500);  // Full open
  setHandPosition(80,  85,  85,  90);  delay(500);  // Full grip
  setHandPosition(70,  75,  0,   90);  delay(500);  // Pinch
  setHandPosition(30,  30,  30,  135); delay(500);  // Rotate CW
  setHandPosition(30,  30,  30,  45);  delay(500);  // Rotate CCW
  setHandPosition(10,  10,  10,  90);  delay(500);  // Rest
  Serial.println("[CALIBRATION] Complete");
}

// ─────────────────────────────────────────────
//  EMG MOVING AVERAGE FILTER  (SRS §3.5)
// ─────────────────────────────────────────────
float applyMovingAverage(float newValue) {
  emgHistory[filterIndex] = newValue;
  filterIndex = (filterIndex + 1) % FILTER_SIZE;
  float sum = 0;
  for (int i = 0; i < FILTER_SIZE; i++) sum += emgHistory[i];
  return sum / FILTER_SIZE;
}

// ─────────────────────────────────────────────
//  UTILITIES
// ─────────────────────────────────────────────
void blinkLED(int times) {
  for (int i = 0; i < times; i++) {
    digitalWrite(STATUS_LED, HIGH); delay(100);
    digitalWrite(STATUS_LED, LOW);  delay(100);
  }
}
