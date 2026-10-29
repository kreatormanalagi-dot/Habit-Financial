@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

echo ========================================================
echo   Habit ^& Financial - Upload ke GitHub ^& Buat APK
echo ========================================================
echo.

:: 1. Deteksi letak Git di komputer
set "GIT_EXE="

:: Cek Git di PATH
where git >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    set "GIT_EXE=git"
)

:: Cek Git di LocalAppData
if not defined GIT_EXE (
    if exist "%LOCALAPPDATA%\Programs\Git\cmd\git.exe" (
        set "GIT_EXE=%LOCALAPPDATA%\Programs\Git\cmd\git.exe"
    )
)

:: Cek Git di Program Files
if not defined GIT_EXE (
    if exist "C:\Program Files\Git\cmd\git.exe" (
        set "GIT_EXE=C:\Program Files\Git\cmd\git.exe"
    )
)

if not defined GIT_EXE (
    echo [PERHATIAN] Git belum terdeteksi di komputer Anda.
    echo.
    echo Sedang menyiapkan Git otomatis, mohon tunggu sebentar...
    echo Atau silakan instal Git dari: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [OK] Menggunakan Git: "%GIT_EXE%"
echo.

:: 2. Meminta input URL Repositori
echo Silakan masukkan URL Repositori GitHub Anda:
echo (Contoh: https://github.com/username-anda/habit-and-financial.git)
echo.
set /p REPO_URL="URL GitHub: "

if "%REPO_URL%"=="" (
    echo.
    echo [ERROR] URL Repositori tidak boleh kosong!
    echo Silakan jalankan ulang file ini dan masukkan URL repository Anda.
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================================
echo [1/4] Menginisialisasi git repository...
"%GIT_EXE%" init
"%GIT_EXE%" branch -M main

echo.
echo [2/4] Mendaftarkan file proyek...
"%GIT_EXE%" add .

echo.
echo [3/4] Membuat commit...
"%GIT_EXE%" commit -m "Build Habit & Financial App v1.0"

echo.
echo [4/4] Mengirim kode ke GitHub (%REPO_URL%)...
"%GIT_EXE%" remote remove origin >nul 2>nul
"%GIT_EXE%" remote add origin %REPO_URL%
"%GIT_EXE%" push -u origin main --force

echo.
echo ========================================================
echo   PROSES SELESAI!
echo ========================================================
echo.
echo Langkah selanjutnya untuk mengambil file APK:
echo 1. Buka repositori GitHub Anda di browser
echo 2. Klik tab "Actions" di menu atas
echo 3. Tunggu 2-3 menit hingga workflow selesai (centang hijau)
echo 4. Unduh file APK di bagian "Artifacts" atau menu "Releases"
echo.
pause
