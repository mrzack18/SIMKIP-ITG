import os

filepath = r'c:\laragon\www\SIMKIP-ITG\resources\js\pages\student\UploadDokumen.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove EXTRA_FIELDS declaration
import re
content = re.sub(r'interface ExtraFieldDef \{[\s\S]*?\n\}\n\nconst EXTRA_FIELDS: Record<string, ExtraFieldDef\[\]> = \{[\s\S]*?\n\};\n\n', '', content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Cleaned up unused EXTRA_FIELDS")
