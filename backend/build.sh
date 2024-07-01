#!/bin/bash

#building the project
cd backend
echo "building the project..."
python3 -m ensurepip --default-pip
echo "pip install start................................................................"
python3 -m pip install -r ../backend/requirements.txt
echo "pip install done............"
python3 manage.py makemigrations --noinput
python3 manage.py migrate --noinput
python3 manage.py collectstatic --noinput --clear
python3 manage.py shell < "deletedb.py" 