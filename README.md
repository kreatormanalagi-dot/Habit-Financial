# 🌟 Habit & Financial

Aplikasi pelacak rutinitas harian (*habit tracker*) dan pembukuan keuangan pribadi (*financial manager*) yang modern, bersih, dan **100% offline-ready** untuk Android & iOS.

Didesain dengan estetika modern bergaya **Instagram** yang dipadukan dengan format data rapi ala **Google Spreadsheet** tanpa garis tabel yang kaku.

---

## 📱 Fitur Utama Aplikasi

### 📅 Tab 1: Beranda (Habits & Rutinitas)
- **Kalender Bulanan Interaktif**: Menyorot hari ini dan menampilkan status penyelesaian habit tiap tanggal.
- **Rutinitas Harian Otomatis**: Sekali ditambahkan, habit langsung muncul setiap hari dan tinggal dicentang saat selesai.
- **Pengingat Alarm & Notifikasi HP**: Atur jam target untuk setiap habit. Terhubung dengan sistem alarm dan notifikasi lokal perangkat.
- **Streak Tracker & Confetti**: Menghitung konsistensi harian (*streak*) dengan animasi selebrasi saat semua rutinitas terselesaikan.

### 💰 Tab 2: Financial (Keuangan & Kalender)
- **Kalender Transaksi Bulanan**: Indikator titik hijau (pemasukan) dan merah (pengeluaran) di setiap tanggal.
- **Catat Transaksi Fleksibel**: Cukup klik tanggal apapun di kalender untuk mencatat pengeluaran atau pemasukan.
- **Tampilan Ala Google Sheets Tanpa Garis**: Rincian transaksi tersusun rapi dengan kolom waktu, kategori, keterangan, dan nominal tanpa sekat tabel yang mengganggu.
- **Rangkuman Instan**: Lihat total pemasukan, pengeluaran, dan saldo bersih per bulan maupun per tahun.

### 📊 Tab 3: Rangkuman (Laporan & Target Tercapai)
- **Filter Fleksibel**: Beralih antara analisis per bulan atau per tahun secara instan.
- **Statistik Kebiasaan**: Tingkat konsistensi habit, total checklist, dan penghargaan untuk habit paling konsisten.
- **Analisis Finansial & Rasio Tabungan**: Menghitung rasio tabungan (*Saving Rate %*) dan persentase pengeluaran per kategori.
- **Target yang Sudah Tercapai**: Menampilkan daftar *goals* dan impian yang berhasil diselesaikan 100%.

### 🎯 Tab 4: Goals & Jurnal Harian
- **Target & Impian**: Tetapkan target tabungan atau resolusi hidup, batas waktu (*deadline*), dan tambah progres tabungan secara berkala.
- **Jurnal Catatan Harian**:
  - Pelacak suasana hati (*Mood Tracker* 5 ekspresi).
  - 3 hal yang disyukuri hari ini (*Gratitude Journal*).
  - Kemenangan kecil / momen terbaik hari ini (*Highlight*).
  - Catatan refleksi dan evaluasi diri harian.
  - Riwayat jurnal lengkap yang tersimpan aman di perangkat.

### 🔒 100% Offline & Cadangan Data
- Seluruh data disimpan langsung di penyimpanan lokal HP (tanpa server eksternal, menjaga privasi).
- Fitur **Ekspor / Impor Backup JSON**: Cadangkan seluruh data kapan saja dan pindahkan ke HP baru dengan mudah.

---

## 🚀 Panduan Membuat APK di GitHub (Otomatis & Gratis)

Anda tidak perlu menginstal Android Studio di laptop/PC. GitHub Actions akan secara otomatis mengompilasi file `.apk` untuk Anda di cloud!

### Langkah 1: Buat Repositori Baru di GitHub
1. Buka [github.com](https://github.com) dan login ke akun Anda.
2. Klik tombol hijau **New** (Buat repositori baru).
3. Beri nama repositori, misalnya: `habit-and-financial`.
4. Pilih **Public** atau **Private** (bebas).
5. Jangan centang "Add a README file" (karena kita sudah punya kodenya).
6. Klik **Create repository**.

### Langkah 2: Upload Kode ke GitHub

#### Opsi A: Menggunakan Git Terminal / PowerShell
Jalankan perintah berikut di folder proyek ini:
```bash
git init
git add .
git commit -m "Inisialisasi Habit & Financial App"
git branch -M main
git remote add origin https://github.com/USERNAME_ANDA/habit-and-financial.git
git push -u origin main
```
*(Ganti `USERNAME_ANDA` dengan username GitHub Anda).*

#### Opsi B: Menggunakan GitHub Desktop
1. Buka aplikasi **GitHub Desktop**.
2. Klik **File** > **Add Local Repository** > pilih folder `d:\project appk habit`.
3. Klik **Publish repository** ke akun GitHub Anda.

---

### Langkah 3: Menjalankan Build APK Otomatis
Setelah kode terupload ke GitHub:
1. Buka halaman repositori Anda di browser GitHub.
2. Klik tab **Actions** di bagian atas menu.
3. Anda akan melihat workflow bernama **"Build Android APK (Habit & Financial)"** berjalan otomatis.
4. Anda juga bisa menjalankannya kapan saja secara manual:
   - Klik **Build Android APK (Habit & Financial)** di sisi kiri.
   - Klik tombol **Run workflow** > pilih branch `main` > klik **Run workflow**.

---

### Langkah 4: Mengunduh File APK ke HP
Proses kompilasi di GitHub memakan waktu sekitar **2–4 menit**.

1. Setelah proses selesai (muncul centang hijau ✅), klik pada nama proses build tersebut.
2. Gulir ke bagian paling bawah ke bagian **Artifacts**.
3. Klik pada file **`Habit-and-Financial-APK`** untuk langsung mengunduh file `.zip` yang berisi `Habit-and-Financial.apk`.
4. Jika build ditrigger melalui *workflow dispatch* atau *tag*, file APK juga otomatis tersedia di menu **Releases** (dapat diunduh langsung lewat HP tanpa unzip).
5. Kirim file `.apk` tersebut via WhatsApp / Telegram / Google Drive ke HP Android Anda.
6. Di HP Android, buka file `.apk` dan klik **Install** (jika muncul konfirmasi "Izinkan instalasi dari sumber tidak dikenal", pilih Izinkan).

---

## 🍏 Cara Pasang di iPhone / iOS (Offline PWA)
Aplikasi ini sudah mendukung *Progressive Web App* (PWA) offline:
1. Buka aplikasi di browser Safari iPhone.
2. Ketuk ikon **Bagikan (Share)** (kotak dengan panah ke atas di bagian bawah layar Safari).
3. Gulir ke bawah dan pilih **Tambah ke Layar Utama (Add to Home Screen)**.
4. Ketuk **Tambah**.
5. Ikon **Habit & Financial** akan langsung muncul di layar utama iPhone Anda dan dapat dibuka 100% offline layaknya aplikasi native!

---

## 💻 Menjalankan di Komputer / Laptop Lokal
Jika ingin mencoba aplikasi langsung di laptop Anda:
```bash
npm run dev
```
Buka browser di alamat `http://localhost:3000`.
