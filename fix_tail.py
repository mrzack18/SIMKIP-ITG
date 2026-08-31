with open('resources/js/components/modules/admin/mahasiswa/TabInfoPribadi.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('resources/js/components/modules/admin/mahasiswa/TabInfoPribadi.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines[:-6])
