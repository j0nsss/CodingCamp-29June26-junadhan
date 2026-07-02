# Requirements Document

## Introduction

Dashboard Produktivitas (ProductivityHub) adalah aplikasi web satu halaman yang membantu pengguna mengelola waktu dan tugas harian mereka secara efisien langsung dari browser. Aplikasi ini menyediakan empat fitur utama — Greeting Card, Focus Timer (gaya Pomodoro), To-Do List, dan Quick Links — yang semuanya berjalan sepenuhnya di sisi klien tanpa backend, menggunakan HTML, CSS, dan Vanilla JavaScript. Data disimpan di `localStorage` sehingga tetap tersedia di antara sesi browser. Tampilan menggunakan gaya Neo-Brutalism yang responsif di berbagai ukuran layar.

---

## Glossary

- **Dashboard**: Antarmuka utama aplikasi web satu halaman (single-page) yang memuat semua widget produktivitas.
- **Greeting_Card**: Widget di bagian atas Dashboard yang menampilkan jam digital, tanggal, ucapan berbasis waktu hari, dan nama pengguna yang dapat dikustomisasi.
- **Focus_Timer**: Widget penghitung-mundur bergaya Pomodoro dengan animasi ring SVG dan notifikasi browser.
- **To-Do_List**: Widget pengelola daftar tugas yang mendukung tambah, edit, hapus, centang selesai, pencegahan duplikat, dan pengurutan.
- **Quick_Links**: Widget bookmark yang menyimpan tautan situs favorit pengguna beserta favicon.
- **LocalStorage**: API penyimpanan browser bawaan yang digunakan untuk menyimpan semua data pengguna di sisi klien.
- **Theme_Toggle**: Tombol di navbar untuk berpindah antara mode terang (light) dan mode gelap (dark).
- **Neo-Brutalism**: Gaya desain visual yang ditandai dengan warna aksen mencolok, border tebal hitam, bayangan offset, dan tipografi tebal.
- **Validator**: Logika JavaScript yang memvalidasi masukan pengguna (teks tugas, URL, nama) sebelum diproses.
- **Renderer**: Fungsi JavaScript yang membaca state data dan memperbarui tampilan DOM.
- **SVG_Ring**: Animasi lingkaran SVG pada Focus_Timer yang menampilkan sisa waktu secara visual.

---

## Requirements

### Requirement 1: Greeting Card — Jam dan Tanggal Langsung

**User Story:** Sebagai pengguna, saya ingin melihat jam dan tanggal terkini secara langsung, agar saya selalu mengetahui waktu saat ini tanpa berpindah aplikasi.

#### Acceptance Criteria

1. THE Greeting_Card SHALL menampilkan jam digital dalam format `HH:MM` menggunakan jam lokal browser dengan font monospace.
2. WHILE aplikasi berjalan di browser, THE Greeting_Card SHALL memulai dan mempertahankan pembaruan jam setiap satu detik menggunakan jam lokal browser, tanpa memuat ulang halaman.
3. THE Greeting_Card SHALL menampilkan tanggal lengkap dalam format `[Hari], [Tanggal] [Bulan] [Tahun]` dalam bahasa Indonesia (contoh: "Senin, 30 Juni 2025").

---

### Requirement 2: Greeting Card — Ucapan Berbasis Waktu

**User Story:** Sebagai pengguna, saya ingin menerima ucapan yang sesuai dengan waktu hari, agar Dashboard terasa personal dan kontekstual.

#### Acceptance Criteria

1. WHEN jam menunjukkan pukul 05:00–11:59, THE Greeting_Card SHALL menampilkan ucapan "Selamat Pagi".
2. WHEN jam menunjukkan pukul 12:00–14:59, THE Greeting_Card SHALL menampilkan ucapan "Selamat Siang".
3. WHEN jam menunjukkan pukul 15:00–18:59, THE Greeting_Card SHALL menampilkan ucapan "Selamat Sore".
4. WHEN jam menunjukkan pukul 19:00–04:59, THE Greeting_Card SHALL menampilkan ucapan "Selamat Malam".
5. IF nama pengguna tersimpan di LocalStorage dengan panjang 1–30 karakter, THEN THE Greeting_Card SHALL menampilkan ucapan dalam format "[Ucapan], [Nama]!" (contoh: "Selamat Pagi, Budi!").
6. IF tidak ada nama tersimpan ATAU nama yang tersimpan adalah string kosong, THEN THE Greeting_Card SHALL menampilkan ucapan tanpa nama (contoh: "Selamat Pagi!").

---

### Requirement 3: Greeting Card — Nama Pengguna

**User Story:** Sebagai pengguna, saya ingin menyimpan nama saya agar ucapan pada Dashboard terasa personal.

#### Acceptance Criteria

1. THE Greeting_Card SHALL menyediakan kolom input teks untuk memasukkan nama pengguna dengan panjang maksimal 30 karakter.
2. WHEN pengguna mengklik tombol "Simpan", THE Dashboard SHALL menyimpan nama yang sudah di-trim ke LocalStorage.
3. WHEN pengguna menekan tombol Enter pada kolom nama, THE Dashboard SHALL menyimpan nama (setelah di-trim) ke LocalStorage dan memperbarui ucapan.
4. WHEN halaman dimuat ulang, THE Greeting_Card SHALL memuat nama pengguna dari LocalStorage dan menampilkannya di kolom input.
5. WHEN pengguna menyimpan input kosong atau spasi saja, THE Dashboard SHALL menghapus nama dari LocalStorage dan menampilkan ucapan tanpa nama.
6. WHEN nama berhasil disimpan, THE Greeting_Card SHALL segera memperbarui ucapan yang ditampilkan sesuai nama terbaru.

---

### Requirement 4: Focus Timer — Penghitungan Mundur

**User Story:** Sebagai pengguna, saya ingin menggunakan timer Pomodoro agar saya dapat fokus bekerja dalam sesi waktu yang terstruktur.

#### Acceptance Criteria

1. THE Focus_Timer SHALL menampilkan sisa waktu dalam format `MM:SS` menggunakan font monospace.
2. WHEN pengguna mengklik tombol "Start", THE Focus_Timer SHALL memulai penghitungan mundur satu detik per detik.
3. WHILE Focus_Timer berjalan, THE Focus_Timer SHALL memperbarui tampilan waktu setiap satu detik.
4. WHEN sisa waktu mencapai nol detik, THE Focus_Timer SHALL berhenti secara otomatis, menampilkan '00:00' pada layar, dan memicu notifikasi sesi selesai.
5. WHILE Focus_Timer berjalan, THE Focus_Timer SHALL menonaktifkan tombol "Start" dan kolom input durasi.
6. WHEN Focus_Timer selesai, THE Focus_Timer SHALL mengaktifkan kembali tombol "Start" dan kolom input durasi dan menampilkan kembali label 'Fokus' pada timer.

---

### Requirement 5: Focus Timer — Kontrol (Pause, Resume, Reset)

**User Story:** Sebagai pengguna, saya ingin dapat menjeda, melanjutkan, dan mengatur ulang timer agar saya dapat mengontrol sesi fokus saya secara fleksibel.

#### Acceptance Criteria

1. WHEN pengguna mengklik tombol "Stop" (Pause), THE Focus_Timer SHALL menjeda penghitungan mundur tanpa mengatur ulang sisa waktu.
2. WHILE Focus_Timer dijeda, THE Focus_Timer SHALL menampilkan label "Dijeda" dan mengaktifkan kembali tombol "Start"; tombol Stop dinonaktifkan saat dalam kondisi dijeda.
3. WHILE Focus_Timer dijeda DAN pengguna mengklik tombol 'Start', THE Focus_Timer SHALL melanjutkan penghitungan mundur dari sisa waktu terakhir.
4. WHEN pengguna mengklik tombol "Reset", THE Focus_Timer SHALL menghentikan penghitungan mundur dan mengatur ulang sisa waktu ke nilai yang tertera di kolom input durasi saat ini.
5. WHEN Focus_Timer berjalan, THE Focus_Timer SHALL mengaktifkan tombol Stop agar pengguna dapat menjeda.

---

### Requirement 6: Focus Timer — Durasi Kustom

**User Story:** Sebagai pengguna, saya ingin mengatur durasi timer sesuai kebutuhan, agar saya dapat menyesuaikan sesi fokus dengan preferensi saya.

#### Acceptance Criteria

1. THE Focus_Timer SHALL menyediakan kolom input angka untuk mengatur durasi sesi dalam menit, dengan nilai default 25 menit.
2. THE Focus_Timer SHALL menerima durasi antara 1 menit hingga 120 menit.
3. IF pengguna memasukkan nilai di luar rentang 1–120, THEN THE Validator SHALL mengatur ulang nilai ke batas yang paling dekat (1 atau 120).
4. WHEN pengguna mengubah durasi saat timer tidak berjalan, THE Focus_Timer SHALL memperbarui tampilan waktu segera sesuai durasi baru.
5. WHEN halaman dimuat ulang, THE Focus_Timer SHALL memuat durasi terakhir yang tersimpan dari LocalStorage sebagai nilai default.
6. WHEN pengguna mengklik "Start" untuk memulai sesi baru (bukan resume), THE Focus_Timer SHALL menyimpan durasi yang dipilih ke LocalStorage.

---

### Requirement 7: Focus Timer — SVG Ring Progress

**User Story:** Sebagai pengguna, saya ingin melihat indikator visual berupa ring melingkar pada timer agar saya dapat memantau kemajuan sesi secara sekilas.

#### Acceptance Criteria

1. THE SVG_Ring SHALL menampilkan lingkaran progress yang mengikuti persentase sisa waktu terhadap total durasi.
2. IF sisa waktu lebih dari 25% durasi total, THE SVG_Ring SHALL menampilkan progress dengan warna aksen biru.
3. IF sisa waktu berada di antara lebih dari 10% hingga 25% dari durasi total, THE SVG_Ring SHALL mengubah warna progress menjadi warna aksen oranye.
4. IF sisa waktu sama dengan atau kurang dari 10% dari durasi total, THE SVG_Ring SHALL mengubah warna progress menjadi warna merah (critical).
5. WHEN pengguna mengklik "Reset", THE SVG_Ring SHALL kembali menampilkan lingkaran penuh dengan warna aksen biru.
6. WHEN Focus_Timer belum dimulai atau baru direset, THE SVG_Ring SHALL menampilkan lingkaran penuh dengan warna aksen biru.

---

### Requirement 8: Focus Timer — Notifikasi Browser

**User Story:** Sebagai pengguna, saya ingin menerima notifikasi browser saat sesi fokus selesai, agar saya dapat mengetahui sesi berakhir meskipun sedang menggunakan tab lain.

#### Acceptance Criteria

1. WHEN halaman pertama kali dimuat, THE Focus_Timer SHALL meminta izin notifikasi browser kepada pengguna jika status izin masih "default".
2. WHEN sesi timer selesai DAN izin notifikasi telah diberikan, THE Focus_Timer SHALL mengirimkan notifikasi browser dengan judul "Focus Timer" dan pesan "Sesi Pomodoro selesai! Saatnya istirahat."
3. WHEN sesi timer selesai, THE Focus_Timer SHALL selalu menampilkan pesan 'Sesi fokus selesai! Saatnya istirahat.' di dalam antarmuka Dashboard selama minimal 5 detik, terlepas dari status izin notifikasi browser.

---

### Requirement 9: To-Do List — Tambah Tugas

**User Story:** Sebagai pengguna, saya ingin menambahkan tugas baru ke daftar, agar saya dapat mencatat semua hal yang perlu dikerjakan.

#### Acceptance Criteria

1. THE To-Do_List SHALL menyediakan kolom input teks untuk memasukkan tugas baru dengan panjang maksimal 100 karakter; input tidak boleh menerima karakter melebihi batas tersebut.
2. WHEN pengguna mengklik tombol "Tambah" dengan input yang setelah di-trim tidak kosong, THE To-Do_List SHALL menambahkan tugas baru (dengan teks yang sudah di-trim) ke bagian bawah daftar.
3. WHEN pengguna menekan tombol Enter pada kolom input tugas, THE To-Do_List SHALL menambahkan tugas dengan perilaku identik: teks di-trim, tugas ditambahkan ke bawah daftar, input dikosongkan, dan fokus dipindahkan kembali ke kolom input.
4. WHEN tugas berhasil ditambahkan, THE Renderer SHALL mengosongkan kolom input dan memindahkan fokus kembali ke kolom input.
5. IF input kosong atau hanya berisi spasi, THEN THE Validator SHALL menampilkan pesan kesalahan "Tugas tidak boleh kosong!" dan tidak menambahkan tugas.
6. WHEN tugas berhasil ditambahkan, THE To-Do_List SHALL menyimpan daftar terbaru ke LocalStorage.

---

### Requirement 10: To-Do List — Pencegahan Duplikat

**User Story:** Sebagai pengguna, saya ingin dicegah dari penambahan tugas yang sama, agar daftar tugas saya tetap bersih dan tidak redundan.

#### Acceptance Criteria

1. IF pengguna mencoba menambahkan tugas yang teksnya identik (tidak peka huruf besar/kecil) dengan tugas yang sudah ada, THEN THE Validator SHALL menampilkan pesan kesalahan yang menyebutkan nama tugas yang duplikat dan tidak menambahkan tugas tersebut; kolom input TIDAK dikosongkan setelah error tampil.
2. IF pengguna mencoba menyimpan hasil edit tugas dengan teks yang identik (tidak peka huruf besar/kecil) dengan tugas lain yang sudah ada di daftar, THEN THE Validator SHALL menampilkan pesan kesalahan dan tidak menyimpan perubahan tersebut; kolom edit modal TIDAK dikosongkan setelah error tampil.
3. IF teks baru yang akan disimpan (setelah trim dan lowercase) identik dengan teks tugas yang sedang diedit sendiri (bukan tugas lain), THEN THE Validator SHALL mengizinkan penyimpanan.

---

### Requirement 11: To-Do List — Tandai Selesai

**User Story:** Sebagai pengguna, saya ingin menandai tugas sebagai selesai, agar saya dapat melacak kemajuan pekerjaan saya.

#### Acceptance Criteria

1. THE To-Do_List SHALL menampilkan sebuah checkbox pada setiap item tugas.
2. WHEN pengguna mencentang checkbox sebuah tugas, THE To-Do_List SHALL menandai tugas tersebut sebagai selesai dan menampilkan teks tugas dengan garis coret (strikethrough).
3. WHEN pengguna menghapus centang checkbox, THE To-Do_List SHALL mengembalikan status tugas ke belum selesai dan menghapus tampilan garis coret pada teks tugas.
4. THE Renderer SHALL menampilkan penghitung kemajuan dalam format "[Selesai]/[Total] selesai" di bagian bawah daftar; IF tidak ada tugas dalam daftar, THE Renderer SHALL menyembunyikan penghitung kemajuan.
5. WHEN status tugas diubah, THE To-Do_List SHALL menyimpan perubahan ke LocalStorage.

---

### Requirement 12: To-Do List — Edit Tugas via Modal

**User Story:** Sebagai pengguna, saya ingin mengedit teks tugas yang sudah ada, agar saya dapat memperbaiki atau memperbarui deskripsi tugas.

#### Acceptance Criteria

1. WHEN pengguna mengklik tombol edit pada sebuah tugas, THE Dashboard SHALL menampilkan modal edit dengan kolom input yang sudah terisi teks tugas saat ini; kolom input modal memiliki batas maksimal 100 karakter.
2. WHEN modal edit terbuka, THE Dashboard SHALL memindahkan fokus ke kolom input modal dan menyeleksi seluruh teks.
3. WHEN pengguna mengklik tombol "Simpan" di modal, THE To-Do_List SHALL menyimpan teks yang diperbarui, menyimpan perubahan ke LocalStorage, dan menutup modal.
4. WHEN pengguna mengklik tombol "Batal" di modal, THE Dashboard SHALL menutup modal tanpa menyimpan perubahan.
5. WHEN pengguna menekan tombol Enter di modal, THE To-Do_List SHALL menyimpan teks yang diperbarui ke LocalStorage, menutup modal, dan memperbarui tampilan daftar.
6. WHEN pengguna menekan tombol Escape di modal, THE Dashboard SHALL menutup modal tanpa menyimpan perubahan.
7. WHEN pengguna mengklik area di luar kotak modal, THE Dashboard SHALL menutup modal tanpa menyimpan perubahan.
8. IF pengguna mencoba menyimpan edit dengan input kosong, THEN THE Validator SHALL mempertahankan modal tetap terbuka, memindahkan fokus ke kolom input, dan menampilkan indikasi visual bahwa input tidak boleh kosong.

---

### Requirement 13: To-Do List — Hapus Tugas

**User Story:** Sebagai pengguna, saya ingin menghapus tugas dari daftar, agar saya dapat membersihkan tugas yang tidak lagi relevan.

#### Acceptance Criteria

1. THE To-Do_List SHALL menampilkan tombol hapus pada setiap item tugas.
2. WHEN pengguna mengklik tombol hapus, THE To-Do_List SHALL menghapus tugas tersebut dari daftar secara permanen.
3. WHEN tugas dihapus, THE To-Do_List SHALL menyimpan daftar terbaru ke LocalStorage.
4. WHEN daftar tugas menjadi kosong, THE Renderer SHALL menampilkan pesan status kosong "Belum ada tugas. Tambahkan sekarang!".

---

### Requirement 14: To-Do List — Pengurutan

**User Story:** Sebagai pengguna, saya ingin mengurutkan daftar tugas saya, agar saya dapat melihat tugas dalam urutan yang sesuai dengan kebutuhan.

#### Acceptance Criteria

1. THE To-Do_List SHALL menyediakan tombol pengurutan "A-Z" untuk mengurutkan tugas berdasarkan abjad secara ascending; WHEN pengguna mengklik tombol 'A-Z', THE To-Do_List SHALL mengurutkan seluruh daftar tugas berdasarkan abjad ascending menggunakan locale Indonesia.
2. THE To-Do_List SHALL menyediakan tombol pengurutan "Aktif" untuk menampilkan tugas yang belum selesai di atas tugas yang sudah selesai; WHEN pengguna mengklik tombol 'Aktif', THE To-Do_List SHALL memindahkan semua tugas yang belum selesai ke atas dan tugas selesai ke bawah, mempertahankan urutan relatif dalam masing-masing kelompok.
3. WHEN pengguna mengklik tombol pengurutan yang sedang aktif, THE To-Do_List SHALL menonaktifkan pengurutan tersebut dan kembali ke urutan asli (urutan penambahan).
4. WHEN mode pengurutan aktif, THE Renderer SHALL menampilkan tombol pengurutan yang sedang aktif dengan latar warna aksen-lime dan teks hitam, dibandingkan tombol yang tidak aktif.
5. WHEN pengguna mengklik tombol pengurutan lain saat satu mode sudah aktif, THE To-Do_List SHALL menonaktifkan mode sebelumnya dan mengaktifkan mode yang baru dipilih; THE To-Do_List SHALL hanya mengizinkan satu mode pengurutan aktif pada satu waktu.
6. THE To-Do_List SHALL mengurutkan teks tugas secara case-insensitive untuk pengurutan A-Z.

---

### Requirement 15: Quick Links — Tambah Bookmark

**User Story:** Sebagai pengguna, saya ingin menambahkan tautan situs favorit, agar saya dapat mengaksesnya dengan cepat dari Dashboard.

#### Acceptance Criteria

1. THE Quick_Links SHALL menyediakan kolom input untuk nama tautan dengan panjang maksimal 30 karakter dan kolom input untuk URL.
2. WHEN pengguna mengisi kedua kolom dan mengklik "Tambah Link", THE Quick_Links SHALL menambahkan tautan baru ke daftar.
3. IF pengguna mencoba menambahkan tautan dengan salah satu kolom kosong, THEN THE Validator SHALL menampilkan pesan kesalahan "Nama dan URL wajib diisi!" dan tidak menambahkan tautan.
4. IF URL yang dimasukkan tidak memiliki skema `http://` atau `https://`, THEN THE Validator SHALL menambahkan awalan `https://` secara otomatis sebelum divalidasi.
5. IF URL yang dimasukkan tidak membentuk URL yang valid setelah normalisasi, THEN THE Validator SHALL menampilkan pesan kesalahan dan tidak menambahkan tautan.
6. WHEN tautan berhasil ditambahkan, THE Quick_Links SHALL menyimpan daftar terbaru ke LocalStorage dan mengosongkan kedua kolom input.

---

### Requirement 16: Quick Links — Tampilan Favicon

**User Story:** Sebagai pengguna, saya ingin melihat favicon situs pada setiap tautan, agar saya dapat mengenali tautan dengan lebih cepat secara visual.

#### Acceptance Criteria

1. WHEN sebuah tautan ditampilkan, THE Quick_Links SHALL memuat dan menampilkan favicon situs menggunakan layanan Google Favicons berdasarkan domain URL.
2. IF favicon gagal dimuat, THEN THE Quick_Links SHALL menyembunyikan elemen gambar favicon tanpa mengganggu tampilan chip tautan.

---

### Requirement 17: Quick Links — Buka dan Hapus Tautan

**User Story:** Sebagai pengguna, saya ingin membuka tautan di tab baru dan menghapus tautan yang tidak lagi diperlukan.

#### Acceptance Criteria

1. WHEN pengguna mengklik nama tautan pada sebuah chip, THE Dashboard SHALL membuka URL yang sesuai di tab browser baru menggunakan atribut `rel="noopener noreferrer"`.
2. THE Quick_Links SHALL menampilkan tombol hapus pada setiap chip tautan.
3. WHEN pengguna mengklik tombol hapus sebuah chip, THE Quick_Links SHALL menghapus tautan tersebut dari daftar dan THE Renderer SHALL segera menghapus chip yang bersangkutan dari tampilan.
4. WHEN tautan dihapus, THE Quick_Links SHALL menyimpan daftar terbaru ke LocalStorage.
5. WHILE daftar tautan kosong, THE Renderer SHALL menampilkan pesan status kosong "Belum ada link. Tambahkan situs favoritmu!".

---

### Requirement 18: Theme Toggle — Mode Terang dan Gelap

**User Story:** Sebagai pengguna, saya ingin beralih antara mode terang dan gelap, agar tampilan Dashboard sesuai dengan preferensi pencahayaan saya.

#### Acceptance Criteria

1. THE Dashboard SHALL menampilkan tombol Theme_Toggle di navbar.
2. WHEN pengguna mengklik Theme_Toggle, THE Dashboard SHALL berpindah dari mode terang ke mode gelap (atau sebaliknya), mengubah palet warna seluruh elemen UI secara serentak.
3. WHEN mode berubah, THE Theme_Toggle SHALL memperbarui ikon tombol: menampilkan ikon matahari saat mode gelap aktif, dan ikon bulan saat mode terang aktif.
4. WHEN halaman pertama kali dimuat, THE Dashboard SHALL selalu menginisialisasi dalam mode terang terlepas dari sesi sebelumnya.
5. WHEN halaman pertama kali dimuat, THE Theme_Toggle SHALL menampilkan ikon bulan (indikator untuk beralih ke mode gelap).

---

### Requirement 19: Persistensi Data — LocalStorage

**User Story:** Sebagai pengguna, saya ingin data saya tetap tersimpan setelah menutup dan membuka kembali browser, agar saya tidak perlu memasukkan ulang informasi setiap saat.

#### Acceptance Criteria

1. WHEN halaman dimuat, THE Dashboard SHALL memuat nama pengguna (fallback: string kosong), daftar tugas (fallback: array kosong), daftar tautan (fallback: array kosong), dan durasi timer (fallback: 25 menit) dari LocalStorage.
2. WHEN pengguna menambah, mengubah, atau menghapus data apapun, THE Dashboard SHALL menyimpan perubahan ke LocalStorage sebelum memperbarui tampilan.
3. IF operasi tulis ke LocalStorage gagal (misalnya karena storage penuh), THEN THE Dashboard SHALL mencatat pesan peringatan di konsol browser tanpa menampilkan pesan error, dialog, atau notifikasi apapun yang terlihat oleh pengguna di halaman.
4. THE Dashboard SHALL menyimpan data dengan kunci (key) yang berbeda untuk setiap jenis data: nama, tugas, tautan, dan durasi timer; setiap kunci harus unik sehingga penulisan satu jenis data tidak menimpa data jenis lain.

---

### Requirement 20: Desain Visual — Neo-Brutalism

**User Story:** Sebagai pengguna, saya ingin antarmuka yang memiliki karakter visual yang kuat dan mudah dibaca, agar pengalaman menggunakan Dashboard terasa menyenangkan dan tidak membingungkan.

#### Acceptance Criteria

1. THE Dashboard SHALL menampilkan setiap widget dalam kartu (card) dengan border 3px solid hitam dan bayangan offset 4px kanan, 4px bawah, tanpa blur.
2. THE Dashboard SHALL menampilkan stripe warna di border atas setiap card: lime untuk Greeting_Card, biru untuk Focus_Timer, merah muda untuk To-Do_List, dan oranye untuk Quick_Links.
3. THE Dashboard SHALL menampilkan angka jam dan countdown timer menggunakan font monospace; judul widget dan label tombol menggunakan font display.
4. WHEN mode gelap aktif, THE Dashboard SHALL mengganti palet warna ke skema gelap: latar belakang hitam pekat (#0C0C0C), teks putih (#FFFFFF), permukaan card abu sangat gelap (#1A1A1A); border dan bayangan tetap hitam (#000000).
5. THE Dashboard SHALL menampilkan latar belakang dengan pola titik-titik (dot-grid): titik berdiameter 1px, jarak antar titik 22×22px, warna titik menggunakan warna teks utama tema aktif pada opasitas 10%.

---

### Requirement 21: Responsivitas — Tata Letak Multi-Breakpoint

**User Story:** Sebagai pengguna, saya ingin Dashboard dapat digunakan dengan nyaman di berbagai ukuran layar, agar saya dapat mengaksesnya dari ponsel, tablet, maupun laptop.

#### Acceptance Criteria

1. WHILE lebar viewport lebih besar dari 768px, THE Dashboard SHALL menampilkan Focus_Timer dan To-Do_List secara berdampingan dalam tata letak dua kolom.
2. WHILE lebar viewport sama dengan atau lebih kecil dari 768px, THE Dashboard SHALL mengubah tata letak menjadi satu kolom sehingga setiap widget ditampilkan penuh di baris tersendiri.
3. WHILE lebar viewport sama dengan atau lebih kecil dari 640px, THE Dashboard SHALL mengubah form Quick_Links dari tata letak baris menjadi tata letak kolom, dengan setiap input dan tombol menempati lebar penuh.
4. WHILE lebar viewport sama dengan atau lebih kecil dari 480px, THE Dashboard SHALL mengurangi ukuran padding dan elemen UI untuk memastikan konten tidak terpotong: ukuran font teks minimal 12px, padding card minimal 0.9rem.
5. WHILE lebar viewport sama dengan atau lebih kecil dari 480px, THE Dashboard SHALL menampilkan modal edit dari bagian bawah layar (slide-up) alih-alih dari tengah layar.

---

## Technical Constraints

### TC-1: Technology Stack

THE Dashboard SHALL dibangun menggunakan HTML untuk struktur, CSS untuk gaya, dan Vanilla JavaScript untuk logika tanpa menggunakan framework atau library JavaScript pihak ketiga (seperti React atau Vue).

### TC-2: Data Storage

THE Dashboard SHALL menyimpan seluruh data pengguna secara eksklusif menggunakan browser LocalStorage API dan tidak memerlukan server backend atau koneksi jaringan untuk fungsi inti aplikasi.

### TC-3: Browser Compatibility

THE Dashboard SHALL berfungsi dengan benar di versi terkini dari browser Chrome, Firefox, Edge, dan Safari. THE Dashboard SHALL dapat dijalankan sebagai halaman web mandiri (standalone) maupun sebagai browser extension.

---

## Non-Functional Requirements

### NFR-1: Simplicity

THE Dashboard SHALL menyediakan antarmuka yang bersih dan minimal yang dapat dipahami dan digunakan tanpa instruksi atau konfigurasi awal. THE Dashboard SHALL tidak memerlukan proses instalasi atau setup apapun selain membuka file di browser.

### NFR-2: Performance

THE Dashboard SHALL memuat seluruh aset (HTML, CSS, JavaScript) dan menampilkan antarmuka yang siap digunakan dalam waktu yang terasa instan di koneksi lokal. WHEN pengguna berinteraksi dengan widget apapun (mengetik, mengklik tombol, mencentang checkbox), THE Dashboard SHALL memperbarui tampilan dalam waktu kurang dari 100 milidetik tanpa jeda yang terasa oleh pengguna.

### NFR-3: Visual Design

THE Dashboard SHALL menampilkan hierarki visual yang jelas dengan perbedaan ukuran dan bobot tipografi yang konsisten antara judul, label, dan konten. THE Dashboard SHALL menggunakan ukuran font yang cukup besar dan kontras warna yang memadai agar teks dapat dibaca dengan nyaman pada semua widget.
