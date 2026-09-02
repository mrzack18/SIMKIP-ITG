import os

filepath = r'c:\laragon\www\SIMKIP-ITG\routes\api.php'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

if 'Route::put("/pelatihan/{id}/resubmit"' not in content:
    content = content.replace('Route::put("/pelatihan/{id}",           [PelatihanController::class, "update"]);', 'Route::put("/pelatihan/{id}",           [PelatihanController::class, "update"]);\n    Route::put("/pelatihan/{id}/resubmit",  [PelatihanController::class, "resubmit"]);')
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
print("Updated api.php for Pelatihan resubmit")
