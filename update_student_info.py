import os
import re

filepath = r'c:\laragon\www\SIMKIP-ITG\resources\js\pages\student\UploadDokumen.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
old_import = 'import { api } from "@/services/api";'
new_import = 'import { api } from "@/services/api";\nimport { useAuth } from "@/context/AuthContext";'
content = content.replace(old_import, new_import)

# Get user from useAuth()
content = content.replace('export default function UploadDokumen() {', 'export default function UploadDokumen() {\n  const { user } = useAuth();')

# Replace the static block
old_card = """      {/* Student info */}
      <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100 flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ background: "#263F93" }}
        >
          AR
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-sm">Ahmad Rifaldi</p>
          <p className="text-xs text-gray-400">NIM 2206001</p>
        </div>
      </div>"""

new_card = """      {/* Student info */}
      <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100 flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ background: "#263F93" }}
        >
          {user?.nama?.substring(0, 2).toUpperCase() || "MH"}
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-sm">{user?.nama || "Mahasiswa"}</p>
          <p className="text-xs text-gray-400">NIM {user?.nim || "-"}</p>
        </div>
      </div>"""

content = content.replace(old_card, new_card)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated student info card to use dynamic user data")
