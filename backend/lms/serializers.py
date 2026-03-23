from rest_framework import serializers
from .models import User, Course, Enrollment


class RegisterSerializer(serializers.ModelSerializer):
    # Handles new user signup, hashes password securely

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data.get('role', 'student')
        )
        return user 

    def validate_role(self, value):
        if value == 'admin':
            raise serializers.ValidationError(
                'Admin accounts cannot be self-registered'
            )
        return value


class UserSerializer(serializers.ModelSerializer):
    # Returns safe user data (no password)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']


class CourseSerializer(serializers.ModelSerializer):
    # Course data including who created it

    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'created_by', 'created_at']


class EnrollmentSerializer(serializers.ModelSerializer):
    # Shows enrolled course details, accepts course_id to enroll
    
    course = CourseSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        source='course',
        write_only=True
    )

    class Meta:
        model = Enrollment
        fields = ['id', 'course', 'course_id', 'enrolled_at']

    def validate(self, data):
        request = self.context.get('request')
        if request and Enrollment.objects.filter(
            student=request.user,
            course=data['course']
        ).exists():
            raise serializers.ValidationError('You are already enrolled in this course')
        return data
    