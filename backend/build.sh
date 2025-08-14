#!/bin/bash

#building the project
cd backend
echo "building the project..."
python3 -m ensurepip --default-pip
echo "pip install start................................................................"
python3 -m pip install -r ../backend/requirements.txt
echo "pip install done............"
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py collectstatic --noinput --clear

# Make the create_superuser.sh script executable
chmod +x create_superuser.sh

# Run the script to create a superuser if one doesn't exist
./create_superuser.sh
#python3 manage.py shell < "deletedb.py" 