oke kita mulai melakukan revisi yg mahasiswa



perbaiki ini Design an "IPK Input Form" page for SIMKIP-ITG student panel.



PURPOSE: Allow students to input their semester GPA (IPK) during the active input period defined by the academic calendar. Input is locked outside the designated period.



ROLE: Mahasiswa



LAYOUT:



Standard student dashboard layout with sidebar

Centered form card

UI COMPONENTS: Period Status Banner (top):



If ACTIVE period: green banner "✅ Periode input IPK aktif: 1 Sep – 15 Sep 2026. Tersisa 10 hari."

If CLOSED: gray locked banner "🔒 Periode input IPK belum dibuka. Periode berikutnya akan diumumkan sesuai kalender akademik."

Form Card (only shown if period is active):



Heading: "Input Nilai IPK Semester [n]"

Sub-heading: "Tahun Akademik 2025/2026 — Semester Genap"

Number input: "Nilai IPK" (range 0.00–4.00, step 0.01, large font size) — with slider alternative

File upload (optional): "Upload KHS (Kartu Hasil Studi)" — supporting document

Info text: "IPK yang Anda input akan diverifikasi oleh Admin."

Submit button: "Simpan IPK" (blue)

Previous IPK History (below form):



Simple table: Semester | Tahun Akademik | IPK | Status Verifikasi

Shows all previously inputted IPK values

INTERACTIONS:



IPK input validates range (0.00–4.00)

If inputting below threshold: soft warning "IPK di bawah standar minimum (3.0). Pastikan nilai yang Anda input sudah benar."

Success toast on submit

Cannot edit after submission (must contact Admin)

If period closed: entire form is disabled/hidden

RESPONSIVE:



Mobile: form centered, full-width inputs lalu ini Design an "Academic History / IPK Chart" page for SIMKIP-ITG student panel.

PURPOSE: Display the student's complete IPK history across all semesters as a visual line chart, along with a detailed table. This helps students track their academic progress over time.



ROLE: Mahasiswa



LAYOUT:



Standard student dashboard layout with sidebar

Chart on top, table below

UI COMPONENTS: Chart Section:



Line chart: x-axis = Semester (1–8), y-axis = IPK (0.0–4.0)

Data points connected with smooth curve

Each data point labeled with exact IPK value

Red dashed horizontal line at IPK threshold (3.0) labeled "Batas Minimum"

Green zone above threshold, light red zone below

Current semester highlighted with larger dot

Table Section:



Columns: Semester | Tahun Akademik | IPK | Perubahan (↑+0.3 green or ↓-0.2 red) | Status Verifikasi (badge)

Summary row at bottom: "IPK Kumulatif: 3.24"

Stat Cards (above chart):



"IPK Tertinggi: 3.65 (Semester 3)"

"IPK Terendah: 2.80 (Semester 4)"

"IPK Rata-rata: 3.24"

INTERACTIONS:



Chart hover shows tooltip with semester details

Chart is animated on load

Table rows clickable to highlight corresponding point on chart

RESPONSIVE:



Mobile: chart scrollable horizontally, table adapted for narrow screens

lalu ini Design combined "Achievement Input & List" pages for SIMKIP-ITG student panel.



PURPOSE: Allow students to record their achievements (competitions, awards, etc.) with supporting documents, and view their complete list of recorded achievements.



ROLE: Mahasiswa



LAYOUT:



Standard student dashboard layout with sidebar

Split into input section (modal/slide-over) and list section (main page)

UI COMPONENTS — Daftar Prestasi (Main Page): Page Header:



Title: "Prestasi Saya"

"+ Tambah Prestasi" button (blue)

Count: "4 prestasi tercatat"

Achievement Cards (grid layout): Each card shows:



Achievement icon/category indicator

Name: "Juara 2 Lomba Coding Nasional"

Level: "Nasional" (badge)

Date: "Mei 2026"

Validation status badge: ✅ Disetujui / ⏳ Menunggu / ❌ Ditolak

Thumbnail of uploaded proof document

Hover: shows full card with "Lihat Detail" button

If rejected: shows rejection note from Admin

UI COMPONENTS — Input Prestasi (Modal/Slide-over): Form Fields:



Input: "Nama Prestasi / Penghargaan" (required)

Dropdown: "Tingkat" (Prodi / Universitas / Regional / Nasional / Internasional)

Input: "Penyelenggara"

Date picker: "Tanggal"

Textarea: "Deskripsi" (optional)

File upload: "Upload Bukti (Sertifikat/Piagam)" — image or PDF, drag & drop area with preview

Submit: "Simpan Prestasi"

INTERACTIONS:



"+ Tambah" opens slide-over panel from right (desktop) or full-page modal (mobile)

Upload shows preview before submit

After submit: card appears in list with "Menunggu Validasi" status

Can view but not delete submitted achievements (BR-11)

RESPONSIVE:



Mobile: cards become single column, modal becomes full-screen

Design combined "Organization Activity Input & List" pages for SIMKIP-ITG student panel.



PURPOSE: Allow students to record their organizational memberships and roles (BEM, HIMA, UKM, etc.) with supporting documents.



ROLE: Mahasiswa



LAYOUT:



Standard student dashboard layout with sidebar

Timeline-based list layout with slide-over input form

UI COMPONENTS — Daftar Organisasi (Main Page): Page Header:



Title: "Keaktifan Organisasi Saya"

"+ Tambah Organisasi" button (blue)

Timeline Layout: Each entry shows as a timeline card:



Organization name: "BEM ITG"

Role/Position: "Ketua Divisi Pendidikan"

Period: "Sep 2025 – Agu 2026" (with duration calculated: "1 tahun")

Proof document: thumbnail preview

Validation status badge

If rejected: rejection note visible

UI COMPONENTS — Input Form (Slide-over): Form Fields:



Input: "Nama Organisasi" (required)

Input: "Jabatan / Peran" (required)

Date pickers: "Periode Mulai" and "Periode Selesai"

Textarea: "Deskripsi Kegiatan" (optional)

File upload: "Upload Bukti (SK Kepengurusan/Sertifikat)" — drag & drop

Submit: "Simpan"

INTERACTIONS:



Similar interaction patterns to Prestasi page

Timeline chronologically sorted (newest first)

Slide-over for input on desktop, full page on mobile

RESPONSIVE:



Mobile: timeline becomes simple card list, slide-over becomes full-screen modal

kemudian ini



Design a "Mandatory Document Upload" page for SIMKIP-ITG student panel.



PURPOSE: Central page for students to upload all required/mandatory documents (MABIM, KKN, Kerja Praktik, Skripsi, Bela Negara). Each document type has its own upload slot. This is a critical feature that serves as both an evaluation requirement and a personal digital archive.



ROLE: Mahasiswa



LAYOUT:



Standard student dashboard layout with sidebar

Card-based checklist layout

UI COMPONENTS: Page Header:



Title: "Upload Dokumen Kewajiban"

Progress indicator: "2 dari 5 dokumen telah disetujui" with progress bar

Info text: "Seluruh dokumen berikut WAJIB diunggah dan divalidasi sebagai syarat evaluasi KIP dan kelulusan."

Document Upload Cards (5 cards, one per document type): Each card structured as:



Left: Large icon representing document type

Center:

Document type name: "Sertifikat MABIM"

Description: "Sertifikat keikutsertaan Masa Bimbingan Mahasiswa Baru"

Status indicators:

"Belum Diunggah" (gray, with upload button)

"Diunggah — Menunggu Validasi" (yellow, shows file name, upload date)

"Disetujui ✅" (green, shows approval date)

"Ditolak — Perlu Upload Ulang" (red, shows admin rejection note)

Right:

If not uploaded: "📤 Upload" button

If uploaded: "👁️ Lihat" and "📤 Upload Ulang" buttons (only if rejected)

If approved: "📥 Download" button

Card Status Visual:



Cards are visually different per status: green left border = approved, yellow = pending, red = rejected, gray = not uploaded

Cards ordered by urgency: rejected first, then not uploaded, then pending, then approved

Upload Modal (triggered by Upload button):



Drag-and-drop zone: "Seret file ke sini atau klik untuk memilih"

Accepted formats: PDF, JPG, PNG (max 10MB)

Preview area after file selection

Submit: "Upload Dokumen"

INTERACTIONS:



Upload opens modal with drag-and-drop

File preview before submission

After upload: card status changes to "Menunggu Validasi" with animation

"Lihat" opens document in preview modal

Rejected documents show admin's note prominently

Cannot delete uploaded documents (only re-upload if rejected)

STATES:



New student: all cards gray/empty with encouraging text

Mixed status: cards ordered by urgency

All approved: celebratory state "🎉 Semua dokumen kewajiban telah disetujui!"

RESPONSIVE:



Mobile: cards stack vertically, full-width

Upload modal becomes full-screen

kemudian ini Design a "Digital Archive / Personal Drive" page for SIMKIP-ITG student panel.



PURPOSE: A personal document archive where students can view and download all their uploaded and validated documents. Acts as a "drive" for their KIP-K journey — useful for thesis defense (sidang) and SKPI preparation.



ROLE: Mahasiswa



LAYOUT:



Standard student dashboard layout with sidebar

File explorer-like layout

UI COMPONENTS: Page Header:



Title: "Arsip Digital Saya"

Subtitle: "Semua dokumen Anda tersimpan aman di sini. Gunakan arsip ini untuk persiapan sidang dan SKPI."

"📥 Download Semua" button (zip download)

Category Sections (collapsible):



**SK Penetapan KIP** — file card with download button

**Kartu Hasil Studi (KHS)** — file cards per semester

**Sertifikat Prestasi** — grid of certificate thumbnails

**Bukti Keaktifan Organisasi** — grid of document thumbnails

**Dokumen Kewajiban** — MABIM, KKN, KP, Skripsi, Bela Negara

**Surat Bebas Tanggungan** (if approved) — PDF download

Each File Card:



Thumbnail preview (image) or PDF icon

File name, document type, upload date

Status badge (Disetujui ✅)

"Download" button

"Lihat" button (preview in modal)

Search/Filter:



Search by document name

Filter by category

Sort by date

INTERACTIONS:



Click thumbnail → full preview in lightbox modal

Download individual files or all at once

Collapsible sections for organization

Only showing approved/validated documents

RESPONSIVE:



Mobile: grid becomes 2-column or single column

Category sections are collapsible accordions

Design a "Document Status Tracking" page for SIMKIP-ITG student panel.



PURPOSE: Show students the real-time status of all their uploaded documents — whether pending validation, approved, or rejected with feedback.



ROLE: Mahasiswa



LAYOUT:



Standard student dashboard layout with sidebar

Status-filtered list

UI COMPONENTS: Tab Pills: "Semua (12)" | "Menunggu Validasi (3)" | "Disetujui (7)" | "Ditolak (2)"



Document Status Cards: Each card shows:



Document type tag (e.g., "Prestasi", "MABIM", "Organisasi")

Document name/title

Upload date: "Diunggah 2 hari yang lalu"

Status with icon:

⏳ "Menunggu Validasi" (yellow background)

✅ "Disetujui" (green background) + "Disetujui pada: 14 Agu 2026"

❌ "Ditolak" (red background) + "Catatan Admin: Gambar buram, silakan upload ulang dengan kualitas yang lebih baik" (displayed prominently)

Action: "Lihat Dokumen" button

If rejected: "Upload Ulang" button (prominent, orange)

Summary Bar (top):



Visual breakdown bar: green segment (approved) | yellow (pending) | red (rejected) with percentages

INTERACTIONS:



Tab filtering without page reload

"Upload Ulang" navigates to upload page for that document type

"Lihat Dokumen" opens preview modal

RESPONSIVE:



Mobile: cards full-width, tab pills scrollable horizontally

lalu ini juga Design a "Warning Letter Notification" page for SIMKIP-ITG student panel.



PURPOSE: Display all Surat Peringatan (SP) received by the student. This is a serious notification page with strong visual emphasis — per the stakeholder requirement, a prominent RED alert must appear on the student's dashboard when an SP is issued.



ROLE: Mahasiswa (read-only, receiving end)



LAYOUT:



Standard student dashboard layout with sidebar

Alert-focused layout

UI COMPONENTS: If NO SP:



Large green card with checkmark icon: "✅ Anda tidak memiliki Surat Peringatan. Pertahankan prestasi Anda!"

If SP EXISTS: Active SP Alert Card (prominent, full-width):



RED background gradient, white text, warning icon (⚠️)

Large heading: "SURAT PERINGATAN [SP1]"

"Diterbitkan: 15 Maret 2026"

"Alasan: IPK semester 4 berada di bawah standar minimum (2.8 < 3.0)"

"Konsekuensi: Anda diberikan masa perbaikan selama 1 semester (hingga Semester Genap 2025/2026)"

Progress bar showing grace period: "Sisa masa perbaikan: 82 hari"

If SP2: even more prominent, darker red

If SP3: full red with "STATUS KIP-K ANDA DICABUT" in large bold text

SP History Timeline (below active alert):



Vertical timeline showing all SPs in chronological order

Each entry: date, level, reason, outcome (if resolved)

Important Info Box:



"ℹ️ Apa yang harus saya lakukan?"

"Tingkatkan IPK Anda pada semester berikutnya hingga di atas standar minimum (3.0)"

"Hubungi Biro Kemahasiswaan jika Anda memiliki pertanyaan"

INTERACTIONS:



SP alert cannot be dismissed

Timeline entries expandable for full detail

Links to contact info or related pages

RESPONSIVE:



Mobile: alert card simplified but still prominent, timeline becomes vertical cards

kemudian ini



Design a "Request Clearance Certificate" page for SIMKIP-ITG student panel.



PURPOSE: Allow students nearing graduation (semester 8) to request "Bebas Tanggungan" (KIP clearance certificate) required before their thesis defense (sidang). The page shows all prerequisites and enables submission only when all requirements are met.



ROLE: Mahasiswa



LAYOUT:



Standard student dashboard layout with sidebar

Prerequisite checklist + action card

UI COMPONENTS: Page Header:



Title: "Ajukan Bebas Tanggungan"

Subtitle: "Bebas Tanggungan wajib di-approve oleh Kemahasiswaan sebelum Anda mengikuti sidang akhir."

Eligibility Check Section: Visual checklist of prerequisites:



✅ "Semester 8 atau lebih" — met (green)

✅ "IPK di atas standar minimum" — met (green), shows current IPK

✅ "Tidak ada SP aktif" — met (green) / ❌ "SP1 Aktif" (red, blocks submission)

✅ "Semua dokumen kewajiban tervalidasi (5/5)" — met (green) / ❌ "3/5 — Belum lengkap" (red)

✅ "Semua data semester terisi" — met (green) / ❌ "Semester 6 belum diinput" (red)

Overall Readiness:



If ALL prerequisites met:

Green card: "✅ Anda memenuhi semua persyaratan untuk mengajukan Bebas Tanggungan!"

Large "Ajukan Bebas Tanggungan" button (green)

If NOT all met:

Red/yellow card: "⚠️ Anda belum memenuhi persyaratan berikut:" (list of unmet items with action links)

Button disabled with tooltip "Lengkapi semua persyaratan terlebih dahulu"

INTERACTIONS:



Prerequisites checked in real-time against student data

Each unmet prerequisite links to the relevant page (e.g., "Upload Dokumen")

On submit: confirmation modal "Apakah Anda yakin ingin mengajukan Bebas Tanggungan? Permohonan Anda akan di-review oleh Biro Kemahasiswaan."

After submit: status changes to "Menunggu Approval", redirect to status page

RESPONSIVE:



Mobile: checklist becomes accordion-style, submit button sticky at bottom

Design a "Clearance Status & PDF Download" page for SIMKIP-ITG student panel.



PURPOSE: Show the current status of the student's Bebas Tanggungan request, and if approved, provide a downloadable PDF certificate with QR code for thesis defense requirements.



ROLE: Mahasiswa



LAYOUT:



Standard student dashboard layout with sidebar

Status-centric card layout

UI COMPONENTS: Status States:



State 1 — "Belum Diajukan":



Gray card: "Anda belum mengajukan Bebas Tanggungan."

Button: "Ajukan Sekarang →" linking to Halaman 35

State 2 — "Menunggu Approval":



Yellow card with hourglass icon

"Permohonan Anda sedang di-review oleh Biro Kemahasiswaan."

Application date: "Diajukan: 10 Agustus 2026"

Estimated processing time: "Proses review biasanya memakan waktu 3–7 hari kerja."

Subtle pulsing animation on status badge

State 3 — "Disetujui ✅":



Large green celebration card with confetti animation/effect

"🎉 Selamat! Bebas Tanggungan Anda telah disetujui!"

Approval date: "Disetujui: 15 Agustus 2026 oleh Biro Kemahasiswaan"

PDF Preview: embedded preview of the generated Surat Keterangan Bebas Tanggungan

Download buttons: "📥 Download PDF" (primary, large), "🖨️ Cetak" (secondary)

PDF features: official document format with ITG letterhead, QR code for verification, student details, approval signatures

State 4 — "Ditolak":



Red card: "❌ Permohonan Bebas Tanggungan Anda ditolak."

Reason: "Alasan: Masih terdapat dokumen kewajiban yang belum tervalidasi."

Action: "Perbaiki Persyaratan & Ajukan Kembali →"

INTERACTIONS:



Download PDF opens generated document

Print button opens browser print dialog

QR code on PDF is scannable for verification

Re-apply link navigates to prerequisite page

RESPONSIVE:



Mobile: status cards full-width, PDF preview becomes scrollable, download button sticky at bottom

dan ini untuk semua user Design a "Profile & Account Settings" page for SIMKIP-ITG system.



PURPOSE: Allow all users to view their profile information and change their password.



ROLE: All roles (Super Admin, Mahasiswa, Prodi, Warek 3) — content adapts per role.



LAYOUT:



Standard dashboard layout with left sidebar navigation

Main content area with two sections stacked vertically

UI COMPONENTS: Section 1 — "Informasi Profil" (read-only card):



Avatar/initials circle (large, with role badge)

For Mahasiswa: NIM, Nama, Program Studi, Angkatan, Kategori (Reguler/Aspirasi badge), Status Akun (Aktif — green badge)

For Admin: Nama, Username, Role badge

For Prodi: Nama Prodi, Username

Non-editable fields shown in a clean two-column grid

Section 2 — "Ubah Password" (form card):



Input: "Password Saat Ini"

Input: "Password Baru" with strength indicator

Input: "Konfirmasi Password Baru"

Button: "Simpan Password" (blue)

Cancel link

INTERACTIONS:



Success toast notification on password change

Validation errors shown inline

RESPONSIVE:



Mobile: sections stack vertically, fields become single column

Sidebar collapses to hamburger menu