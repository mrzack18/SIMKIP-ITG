#!/bin/bash
# Script to copy all controller files from host to container
CONTAINER="simokip-app"
BASE="/var/www"

# Create dirs
docker exec $CONTAINER mkdir -p $BASE/app/Http/Controllers/Api/Admin
docker exec $CONTAINER mkdir -p $BASE/app/Http/Controllers/Api/Mahasiswa
docker exec $CONTAINER mkdir -p $BASE/app/Http/Controllers/Api/Prodi
docker exec $CONTAINER mkdir -p $BASE/app/Http/Controllers/Api/Warek
docker exec $CONTAINER mkdir -p $BASE/app/Services

echo "Copying files to container..."
FILES=(
  "app/Http/Controllers/Api/AuthController.php"
  "app/Http/Controllers/Api/Admin/DashboardController.php"
  "app/Http/Controllers/Api/Admin/MahasiswaController.php"
  "app/Http/Controllers/Api/Admin/DokumenController.php"
  "app/Http/Controllers/Api/Admin/SPController.php"
  "app/Http/Controllers/Api/Admin/BebasTanggunganController.php"
  "app/Http/Controllers/Api/Admin/LaporanController.php"
  "app/Http/Controllers/Api/Admin/DataAkademikController.php"
  "app/Http/Controllers/Api/Admin/KonfigurasiController.php"
  "app/Http/Controllers/Api/Admin/AuditController.php"
  "app/Http/Controllers/Api/Mahasiswa/DashboardController.php"
  "app/Http/Controllers/Api/Mahasiswa/IPKController.php"
  "app/Http/Controllers/Api/Mahasiswa/DokumenController.php"
  "app/Http/Controllers/Api/Mahasiswa/PrestasiController.php"
  "app/Http/Controllers/Api/Mahasiswa/OrganisasiController.php"
  "app/Http/Controllers/Api/Mahasiswa/PelatihanController.php"
  "app/Http/Controllers/Api/Mahasiswa/BebasTanggunganController.php"
  "app/Http/Controllers/Api/Prodi/DashboardController.php"
  "app/Http/Controllers/Api/Prodi/MahasiswaController.php"
  "app/Http/Controllers/Api/Warek/DashboardController.php"
  "app/Http/Controllers/Api/Warek/LaporanController.php"
  "app/Http/Controllers/Api/NotificationController.php"
  "app/Http/Controllers/Api/ProfileController.php"
  "app/Http/Middleware/CheckRole.php"
  "app/Services/IPKCalculatorService.php"
  "app/Services/SPValidationService.php"
  "app/Services/BebasTanggunganService.php"
  "routes/api.php"
)

for f in "${FILES[@]}"; do
  if [ -f "/home/zky/KULIAH/KP/$f" ]; then
    docker cp "/home/zky/KULIAH/KP/$f" "$CONTAINER:$BASE/$f"
    echo "  ✓ $f"
  else
    echo "  ✗ MISSING: $f"
  fi
done

echo "Done!"
