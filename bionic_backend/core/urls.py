from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SensorDataViewSet, LimbSettingsViewSet, SystemLogViewSet,
    DashboardStatsView, RegisterView, PatientListView,
    HardwarePushView, HardwareCommandView,
    SendCommandView, EmergencyStopView,
    DeviceTokenView, TrainingModeView, CommandHistoryView,
    UserProfileView, AggregateStatsView,
)

router = DefaultRouter()
router.register(r'sensors',  SensorDataViewSet,  basename='sensor')
router.register(r'settings', LimbSettingsViewSet, basename='setting')
router.register(r'logs',     SystemLogViewSet,    basename='log')

urlpatterns = [
    path('', include(router.urls)),

    # Dashboard & User
    path('dashboard/',        DashboardStatsView.as_view({'get': 'list'}), name='dashboard-stats'),
    path('register/',         RegisterView.as_view(),                       name='register'),
    path('patients/',         PatientListView.as_view(),                    name='patient-list'),
    path('profile/',          UserProfileView.as_view(),                    name='user-profile'),

    # Device Token (web users manage their hardware key)
    path('device-token/',     DeviceTokenView.as_view(),                   name='device-token'),

    # ──────────────────────────────────────────────────────────
    # HARDWARE ENDPOINTS  (used by Arduino/ESP32 firmware)
    # These use X-Device-Token header, NOT JWT
    # ──────────────────────────────────────────────────────────
    path('hardware/push/',     HardwarePushView.as_view(),     name='hardware-push'),
    path('hardware/commands/', HardwareCommandView.as_view(),  name='hardware-commands'),

    # ──────────────────────────────────────────────────────────
    # WEB CONTROL COMMANDS  (JWT authenticated)
    # ──────────────────────────────────────────────────────────
    path('commands/send/',            SendCommandView.as_view(),      name='send-command'),
    path('commands/emergency-stop/',  EmergencyStopView.as_view(),    name='emergency-stop'),
    path('commands/history/',         CommandHistoryView.as_view(),   name='command-history'),

    # ──────────────────────────────────────────────────────────
    # TRAINING MODE  (SRS §3.4 UC-4)
    # ──────────────────────────────────────────────────────────
    path('training/record/',  TrainingModeView.as_view(),      name='training-record'),

    # ──────────────────────────────────────────────────────────
    # AGGREGATE STATS  (Healthcare/Admin only — SDS §2.2)
    # ──────────────────────────────────────────────────────────
    path('aggregate-stats/',  AggregateStatsView.as_view(),    name='aggregate-stats'),
]
