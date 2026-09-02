import os

filepath = r'c:\laragon\www\SIMKIP-ITG\resources\js\pages\student\ArsipDigital.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_card = """      <div className="flex gap-1.5 mt-2.5">
        <button onClick={() => onPreview(file)} className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
          <Eye size={11} /> Lihat
        </button>
        <button className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
          <Download size={11} /> Unduh
        </button>
      </div>"""

new_card = """      <div className="flex gap-1.5 mt-2.5">
        <button onClick={() => onPreview(file)} className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
          <Eye size={11} /> Lihat
        </button>
        {file.file_url ? (
          <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
            <Download size={11} /> Unduh
          </a>
        ) : (
          <button disabled className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-400 cursor-not-allowed bg-gray-50">
            <Download size={11} /> Unduh
          </button>
        )}
      </div>"""

content = content.replace(old_card, new_card)

old_download_semua = """        <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-500 text-white"
          style={{ background: "#263F93" }}>
          <Download size={15} /> Download Semua
        </button>"""

new_download_semua = """        <button 
          onClick={() => alert("Fitur Download Semua arsip dalam pengembangan. Silakan unduh arsip secara individu.")}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-500 text-white hover:opacity-90 transition-opacity"
          style={{ background: "#263F93" }}>
          <Download size={15} /> Download Semua
        </button>"""

content = content.replace(old_download_semua, new_download_semua)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Wired up FileCard download and handled Download Semua placeholder")
