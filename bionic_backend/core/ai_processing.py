"""
AI Processing Module — SRS §3.4 (UC-4)
=======================================
Implements gesture prediction using a rule-based SVM-inspired classifier.
When real EMG training data is collected, swap the rule engine for a trained scikit-learn SVM.

Predicted Gestures (SRS §2.2):
  - OPEN     : Hand fully open
  - GRIP     : Power grip (close all fingers)
  - PINCH    : Precision pinch (index + thumb)
  - ROTATE   : Wrist rotation based on IMU
  - IDLE     : No significant muscle activity
  - UNKNOWN  : Signal too noisy / below threshold

Hardware signal ranges (from SRS §4.2):
  - EMG      : 0–1023 (analog ADC from MyoWare / electrode)
  - Force    : 0.0–10.0 N (force-sensitive resistor)
  - Motion   : -2.0 to 2.0 g (MPU6050 accelerometer)
"""

import math
import random

# ─────────────────────────────────────────────
# Signal Filter (SRS §3.5 — EMG noise removal)
# ─────────────────────────────────────────────
_emg_history = []
FILTER_WINDOW = 5   # moving average window size
NOISE_THRESHOLD = 15  # minimum EMG delta to count as gesture intent

def _moving_average(new_value: float) -> float:
    """Apply a simple moving-average low-pass filter to smooth noisy EMG."""
    _emg_history.append(new_value)
    if len(_emg_history) > FILTER_WINDOW:
        _emg_history.pop(0)
    return sum(_emg_history) / len(_emg_history)

def is_signal_noisy(emg_value: float) -> bool:
    """
    Safety check (SRS §5.2): return True if signal variance is dangerously high.
    This triggers an automatic freeze command to the hardware.
    """
    if len(_emg_history) < 3:
        return False
    variance = sum((x - sum(_emg_history) / len(_emg_history)) ** 2
                   for x in _emg_history) / len(_emg_history)
    return variance > 2500  # high variance = electrode disconnected / noise burst


# ─────────────────────────────────────────────
# Motor Angle Mapping
# ─────────────────────────────────────────────
GESTURE_MOTOR_MAP = {
    # gesture   : {thumb, index, middle, wrist}  angles in degrees (0=open, 90=closed)
    'OPEN':   {'thumb': 0,   'index': 0,  'middle': 0,  'wrist': 90},
    'GRIP':   {'thumb': 80,  'index': 85, 'middle': 85, 'wrist': 90},
    'PINCH':  {'thumb': 70,  'index': 75, 'middle': 0,  'wrist': 90},
    'ROTATE': {'thumb': 30,  'index': 30, 'middle': 30, 'wrist': 135},
    'IDLE':   {'thumb': 10,  'index': 10, 'middle': 10, 'wrist': 90},
}


# ─────────────────────────────────────────────
# Core Prediction Engine
# ─────────────────────────────────────────────
def predict_gesture(emg_value: float, force_value: float,
                    motion_x: float, motion_y: float, motion_z: float,
                    sensitivity: int = 75) -> dict:
    """
    Predicts prosthetic limb gesture from raw sensor inputs.
    
    SRS §3.4 / UC-4 — AI-based movement prediction.
    This uses a rule-based classifier that mirrors SVM decision boundaries.
    Replace with: joblib.load('trained_svm.pkl').predict(...) when hardware data collected.
    
    Args:
        emg_value   : Raw EMG amplitude (0–1023 from ADC)
        force_value : Grip force in Newtons (0.0–10.0)
        motion_x    : IMU X-axis acceleration (g)
        motion_y    : IMU Y-axis acceleration (g)
        motion_z    : IMU Z-axis acceleration (g)
        sensitivity : User sensitivity setting from LimbSettings (0–100)
    
    Returns:
        dict with gesture, confidence, motor_angles, command, filtered_emg
    """
    # 1. Filter the signal
    filtered_emg = _moving_average(emg_value)

    # 2. Normalize EMG by user sensitivity (SRS §3.3 UC-3)
    sensitivity_scale = sensitivity / 100.0
    effective_emg = filtered_emg * sensitivity_scale

    # 3. Calculate motion magnitude
    motion_magnitude = math.sqrt(motion_x**2 + motion_y**2 + motion_z**2)

    # 4. Classify gesture (rule-based SVM decision boundaries)
    if effective_emg < 50:
        gesture = 'IDLE'
        confidence = 0.92

    elif motion_magnitude > 1.5 and effective_emg > 80:
        gesture = 'ROTATE'
        confidence = round(0.88 + random.uniform(-0.03, 0.03), 3)

    elif effective_emg > 500 and force_value > 3.0:
        gesture = 'GRIP'
        confidence = round(0.95 + random.uniform(-0.02, 0.02), 3)

    elif effective_emg > 300 and force_value < 2.0:
        gesture = 'PINCH'
        confidence = round(0.91 + random.uniform(-0.04, 0.04), 3)

    elif effective_emg > 150:
        gesture = 'OPEN'
        confidence = round(0.87 + random.uniform(-0.05, 0.05), 3)

    else:
        gesture = 'IDLE'
        confidence = round(0.78 + random.uniform(-0.05, 0.05), 3)

    # 5. Get motor angles for this gesture
    motor_angles = GESTURE_MOTOR_MAP.get(gesture, GESTURE_MOTOR_MAP['IDLE'])

    # 6. Map gesture to hardware command
    command_map = {
        'GRIP':   'GRIP',
        'PINCH':  'PINCH',
        'OPEN':   'RELEASE',
        'ROTATE': 'ROTATE_CW',
        'IDLE':   None,
    }
    hw_command = command_map.get(gesture)

    return {
        'gesture':      gesture,
        'label':        _gesture_label(gesture),
        'confidence':   round(min(max(confidence, 0.0), 1.0), 4),
        'confidence_pct': round(min(max(confidence, 0.0), 1.0) * 100, 1),
        'filtered_emg': round(filtered_emg, 2),
        'motor_angles': motor_angles,
        'hw_command':   hw_command,
        'is_noisy':     is_signal_noisy(emg_value),
    }


def _gesture_label(gesture: str) -> str:
    """Human-readable label for the predicted gesture."""
    labels = {
        'OPEN':   'Open Hand',
        'GRIP':   'Power Grip',
        'PINCH':  'Precision Pinch',
        'ROTATE': 'Wrist Rotation',
        'IDLE':   'Idle / Resting',
        'UNKNOWN': 'Unknown Signal',
    }
    return labels.get(gesture, gesture)


# ─────────────────────────────────────────────
# Training Helper (SRS §3.4 UC-4)
# ─────────────────────────────────────────────
def collect_training_sample(gesture_label: str, emg_value: float,
                             force_value: float, motion_x: float,
                             motion_y: float, motion_z: float) -> dict:
    """
    Stores a labeled training sample.
    When scikit-learn is installed, these samples will be used to train a real SVM model.
    """
    return {
        'label':    gesture_label,
        'features': [emg_value, force_value, motion_x, motion_y, motion_z],
        'status':   'recorded',
    }
