import os

filepath = r'c:\laragon\www\SIMKIP-ITG\resources\js\pages\student\Pelatihan.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# The button in Pelatihan.tsx is:
old_btn = """                    <button
                      onClick={() => setDetail(item)}
                      className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Lihat Detail
                    </button>
                  </div>"""

new_btn = """                  </div>
                  <div className="flex gap-2 w-full sm:w-auto flex-col sm:flex-row mt-3 sm:mt-0">
                    <button
                      onClick={() => setDetail(item)}
                      className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-xs text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye size={12} /> Detail
                    </button>
                    {item.status === "Ditolak" && (
                      <>
                        <button
                          onClick={() => openEditForm(item)}
                          className="px-3 py-1.5 rounded-lg border border-amber-300 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Pencil size={12} /> Edit
                        </button>
                        <button
                          onClick={() => handleResubmit(item.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-[#263F93] hover:bg-[#1a2e6e] transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Send size={12} /> Ajukan Ulang
                        </button>
                      </>
                    )}
                  </div>"""

content = content.replace(old_btn, new_btn)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Added Edit and Ajukan Ulang buttons correctly")
