@echo off
echo =======================================
echo Iniciando Churrasco B10 Server...
echo =======================================
echo.

SET PYTHON_PATH="C:\Users\Administrator\AppData\Local\Programs\Python\Python314\python.exe"

echo 1. Instalando dependencias necessarias...
%PYTHON_PATH% -m pip install -r requirements.txt

echo.
echo 2. Iniciando Backend...
start "Backend API (FastAPI)" cmd /c "cd backend && %PYTHON_PATH% -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"
echo Backend rodando em http://127.0.0.1:8000

timeout /t 6 >nul

echo.
echo 3. Iniciando Frontend...
start "Frontend (Streamlit)" cmd /c "%PYTHON_PATH% -m streamlit run frontend/app.py"
echo Frontend abrindo no seu navegador...

echo.
echo Tudo pronto! Nao feche essas janelas para manter o sistema no ar.
pause
