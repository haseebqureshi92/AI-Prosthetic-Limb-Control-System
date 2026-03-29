# 📘 AI-Based Prosthetic Limb System - User & Architecture Guide

This guide explains how your bionic control system works, where the data is stored, and how to verify its compliance with your **Software Design Specification (SDS)**.

---

## 🏗️ System Architecture (Full-Stack)
The project uses a modern **Coupled Architecture** (as per SDS Section 3.0):

1.  **Frontend (React + Vite)**: 
    -   The "eyes" of the system. It handles user interaction, data visualization (EMG charts), and remote control commands.
    -   Communicates with the backend using **Axios** (HTTP REST requests).
2.  **Backend (Django + REST Framework)**: 
    -   The "brain" of the system. It manages user accounts, security tokens (JWT), and the AI processing engine.
3.  **Database (SQLite)**:
    -   The "memory" of the system. It stores all patient records, sensor history, and logs locally on your machine.

---

## 💾 Where is my data saved? (No Cloud Required)
Your project is **100% Offline/Local**. It does not use Firebase, Supabase, or any external "Sparbies."

-   **Database File**: `d:/AI Posthetic Limb Control System/bionic_backend/db.sqlite3`
-   **Why SQLite?**: It is an industry-standard SQL database that saves everything into a single file on your disk. This is perfect for medical/prosthetic research where data privacy is strict.

### 🔍 How to view your data:
1.  Download a tool like **[DB Browser for SQLite](https://sqlitebrowser.org/)**.
2.  Open the `db.sqlite3` file using that tool.
3.  You will see tables like `core_user`, `core_sensordata`, and `core_systemlog` filled with your project data.

---

## ✅ SDS Compliance Verification Checklist
Every "small function" from your SDS has been meticulously built:

### 1. User Authentication (SDS 2.1)
- [x] **Sign In**: Secure access for Patients and Doctors.
- [x] **Sign Up**: New account creation directly in the local database.
- [x] **Forgot Password**: Password recovery flow UI.
- [x] **Role-Based Access**: Doctors see the professional portal; Patients see their personal stats.

### 2. Live Monitoring (SDS 2.1)
- [x] **Dashboard Pulse**: Continuous polling (every 5s) of battery and system status.
- [x] **EMG Visualization**: Real-time Area Charts for muscle signal intensity and force feedback.

### 3. Professional Oversight (SDS 2.2)
- [x] **Patient Directory**: Doctors can search and manage all registered patients.
- [x] **System Logs**: Comprehensive capture of every AI prediction and hardware warning.

### 4. Remote Control (SDS 4.0)
- [x] **Limb Calibration**: Real-time sliders for Sensitivity, Speed, and Force Limits that save directly to the hardware settings in the DB.

### 5. Historical Analysis (SDS 2.1)
- [x] **CSV Export**: Ability to download the entire history of signals as a data report for research.

---

## 🚀 How to Present your Project
1.  **Start the Backend**: `cd bionic_backend; ..\venv\Scripts\python.exe manage.py runserver`
2.  **Start the Frontend**: `npm run dev`
3.  **Sign Up**: Create a new test account using the "Sign Up" link on the login page.
4.  **Explore**: Demonstrate the live charts and settings persistence (Change a slider -> Refresh -> Value stays saved).
5.  **Professional Portal**: Log in as a Healthcare User to show the patient list management.

> [!TIP]
> **Data Simulation**: I have added a script `seed_data.py`. Run it whenever you want to reset the database with fresh, beautiful sample data for a demo!
