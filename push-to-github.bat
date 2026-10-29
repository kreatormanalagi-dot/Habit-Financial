@echo off
chcp 65001 >nul
echo ========================================================
echo   Habit ^& Financial - Upload ke GitHub ^& Buat APK
echo ========================================================
echo.

:: Set path Git portable otomatis jika belum ada di path utama
set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;%PATH%"

where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git tidak ditemukan.
    pause
    exit /b 1
)

echo [OK] Git terdeteksi dengan baik.
echo.
echo Silakan masukkan URL Repositori GitHub Anda:
echo (Contoh: https://github.com/username-anda/habit-and-financial.git)
echo.
set /p REPO_URL="URL GitHub: "

if "%REPO_URL%"=="" (
    echo.
    echo [PERINGATAN] URL tidak boleh kosong! Silakan buka kembali file ini.
    echo.
    pause
    exit /b 1
)

echo.
echo [1/2] Menyiapkan remote origin...
git remote remove origin >nul 2>nul
git remote add origin %REPO_URL%

echo.
echo [2/2] Mengupload file ke GitHub...
git push -u origin main --force

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [PERHATIAN] Upload ke GitHub belum berhasil.
    echo Kemungkinan penyebab:
    echo 1. Anda belum login akun GitHub di browser / pop-up login.
    echo 2. URL repositori salah atau repositori belum dibuat di github.com.
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================================
echo   BERHASIL! KODE SUDAH TERUPLOAD KE GITHUB!
echo ========================================================
echo.
echo Sekarang buka browser Anda di halaman repositori GitHub:
echo 1. Klik tab "Actions" di menu atas repositori
echo 2. Tunggu 2-3 menit hingga workflow selesai (centang hijau)
echo 3. Unduh file APK di bagian "Artifacts" atau menu "Releases"
echo.
pause
