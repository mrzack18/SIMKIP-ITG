import os

filepath = r'c:\laragon\www\SIMKIP-ITG\resources\js\pages\student\UploadDokumen.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update interface
old_interface = """interface Doc {
  id: string;
  dokumenJenisId: number;
  kode: string;
  nama: string;
  desc: string;
  status: DocStatus;
  catatan?: string;
  fileName?: string;
  fileUrl?: string;
  metadata?: any;
}"""
new_interface = """interface Doc {
  id: string;
  dokumenJenisId: number;
  kode: string;
  nama: string;
  desc: string;
  status: DocStatus;
  catatan?: string;
  fileName?: string;
  fileUrl?: string;
  metadata?: any;
  isWajib?: boolean;
  fields?: any[];
}"""
content = content.replace(old_interface, new_interface)

# 2. Add Wajib badge
old_badge = """                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800 text-sm">{doc.nama}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${badgeStyle[doc.status]}`}>
                    {doc.status}
                  </span>
                </div>"""
new_badge = """                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800 text-sm">{doc.nama}</h3>
                  {doc.isWajib ? (
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-blue-50 text-[#263F93] border border-blue-100">Wajib</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-gray-50 text-gray-400 border border-gray-200">Opsional</span>
                  )}
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${badgeStyle[doc.status]}`}>
                    {doc.status}
                  </span>
                </div>"""
content = content.replace(old_badge, new_badge)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated UploadDokumen.tsx to show isWajib badge")
