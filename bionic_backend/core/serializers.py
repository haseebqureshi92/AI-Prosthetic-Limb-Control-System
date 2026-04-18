from rest_framework import serializers
from .models import User, SensorData, LimbSettings, SystemLog, DeviceToken, ControlCommand


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role')


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data.get('role', 'patient')
        )
        return user


class SensorDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorData
        fields = '__all__'


class LimbSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LimbSettings
        fields = '__all__'


class SystemLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemLog
        fields = '__all__'


class DeviceTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceToken
        fields = ['token', 'device_name', 'is_active', 'last_seen', 'created_at']


class ControlCommandSerializer(serializers.ModelSerializer):
    class Meta:
        model = ControlCommand
        fields = ['id', 'command', 'status', 'issued_by', 'timestamp', 'executed_at']
