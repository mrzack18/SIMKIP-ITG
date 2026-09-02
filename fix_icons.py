import os

filepath = r'c:\laragon\www\SIMKIP-ITG\resources\js\pages\student\UploadDokumen.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_import = 'import { Upload, CheckCircle, Clock, AlertTriangle, FileText, ChevronRight, X, Loader2 } from "lucide-react";'
new_import = 'import { Upload, CheckCircle, Clock, AlertTriangle, FileText, ChevronRight, X, Loader2, Eye, Download } from "lucide-react";'

content = content.replace(old_import, new_import)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Added Eye and Download imports")
