import os
import re

dir_path = r'c:\laragon\www\SIMKIP-ITG\resources\js'
for root, dirs, files in os.walk(dir_path):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            # We don't want to replace non-tahun ajaran filters like prodi, angkatan.
            # But let's see which files have 'Semua'.
            if re.search(r'useState(?:<string>)?\([\'\"]Semua[\'\"]\)', content):
                print(filepath)
