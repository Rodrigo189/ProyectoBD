#!/bin/bash

# Instalar dependencias del frontend
cd mi_web/frontend
npm install
npm run build

# Instalar dependencias del backend
cd ../backend
pip install -r requirements.txt

# Levantar Flask en 0.0.0.0:5000 para Railway
flask run --host=0.0.0.0 --port=5000
