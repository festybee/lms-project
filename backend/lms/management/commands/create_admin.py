from django.core.management.base import BaseCommand
from lms.models import User

class Command(BaseCommand):
    help = 'Create default admin user'

    def handle(self, *args, **kwargs):
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                password='admin@1234',
                role='admin'
            )
            self.stdout.write('Admin user created successfully')
        else:
            self.stdout.write('Admin user already exists')