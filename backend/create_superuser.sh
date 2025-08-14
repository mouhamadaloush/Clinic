#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Check if required environment variables are set
if [ -z "$SUPERUSER_EMAIL" ] || [ -z "$SUPERUSER_USERNAME" ] || [ -z "$SUPERUSER_PASSWORD" ]; then
    echo "Error: SUPERUSER_EMAIL, SUPERUSER_USERNAME, and SUPERUSER_PASSWORD environment variables must be set."
    exit 1
fi

echo "Checking for superuser with email: ${SUPERUSER_EMAIL}"

# Check if the superuser already exists.
# The python script will exit with 0 if the user exists, and 1 if not.
if python3 manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); import sys; sys.exit(0) if User.objects.filter(email='${SUPERUSER_EMAIL}', is_superuser=True).exists() else sys.exit(1)"; then
    echo "Superuser with email ${SUPERUSER_EMAIL} already exists."
else
    echo "Superuser not found. Creating..."
    # Create the superuser using environment variables.
    # The DJANGO_SUPERUSER_PASSWORD environment variable is used by createsuperuser --no-input
    export DJANGO_SUPERUSER_PASSWORD="${SUPERUSER_PASSWORD}"
    python3 manage.py createsuperuser --no-input --username "${SUPERUSER_USERNAME}" --email "${SUPERUSER_EMAIL}"
    echo "Superuser ${SUPERUSER_USERNAME} created successfully."
fi
