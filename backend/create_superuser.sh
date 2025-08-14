#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Check if required environment variables are set
if [ -z "$SUPERUSER_EMAIL" ] || [ -z "$SUPERUSER_PASSWORD" ] || [ -z "$SUPERUSER_FIRST_NAME" ] || [ -z "$SUPERUSER_LAST_NAME" ]; then
    echo "Error: SUPERUSER_EMAIL, SUPERUSER_PASSWORD, SUPERUSER_FIRST_NAME, and SUPERUSER_LAST_NAME environment variables must be set."
    exit 1
fi

echo "Checking for superuser with email: ${SUPERUSER_EMAIL}"

# Check if the superuser already exists.
if python3 manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); import sys; sys.exit(0) if User.objects.filter(email='${SUPERUSER_EMAIL}', is_superuser=True).exists() else sys.exit(1)"; then
    echo "Superuser with email ${SUPERUSER_EMAIL} already exists."
else
    echo "Superuser not found. Creating..."
    # Use a python script to create the superuser, as it's more robust for complex user models.
    python3 manage.py shell <<EOF
from django.contrib.auth import get_user_model
import os

User = get_user_model()

email = os.environ.get('SUPERUSER_EMAIL')
password = os.environ.get('SUPERUSER_PASSWORD')
first_name = os.environ.get('SUPERUSER_FIRST_NAME')
last_name = os.environ.get('SUPERUSER_LAST_NAME')

# Default values for other required fields
dob = '1970-01-01'
phone = '+1234567890'
gender = 'M'

if not User.objects.filter(email=email).exists():
    User.objects.create_superuser(
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        dob=dob,
        phone=phone,
        gender=gender
    )
    print(f"Superuser {email} created successfully.")
else:
    print(f"User with email {email} already exists, ensuring it is a superuser.")
    user = User.objects.get(email=email)
    user.is_staff = True
    user.is_superuser = True
    user.save()
    print(f"User {email} is now a superuser.")

EOF
fi
