@echo off
echo Mengaktifkan Jaringan Server Lokal untuk Login Firebase...
start http://localhost:8000/public/index.html
python -m http.server 8000
