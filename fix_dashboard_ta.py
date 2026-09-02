import os
import re

filepath = r'c:\laragon\www\SIMKIP-ITG\resources\js\pages\admin\Dashboard.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('<option value="Semua">Semua TA</option>', '')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed Dashboard.tsx')
