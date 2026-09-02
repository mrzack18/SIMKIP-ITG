import os

filepath = r'c:\laragon\www\SIMKIP-ITG\resources\js\pages\student\SPMahasiswa.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_import = 'import { FileText, Download, CheckCircle, AlertTriangle, X } from "lucide-react";'
new_import = 'import { FileText, Download, CheckCircle, AlertTriangle, X, Phone, Mail } from "lucide-react";'

content = content.replace(old_import, new_import)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Added Phone and Mail to lucide-react imports")
