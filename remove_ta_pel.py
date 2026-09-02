import os

filepath = r'c:\laragon\www\SIMKIP-ITG\resources\js\pages\student\Pelatihan.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Block to remove
block_to_remove = """              <div>
                <label className="block text-sm font-500 text-gray-700 mb-1.5">
                  <BookOpen size={14} className="inline mr-1.5" />Tahun Ajaran <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  value={form.tahunAjaran}
                  onChange={e => handleFormChange("tahunAjaran", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                >
                  <option value="2025/2026 Ganjil">2025/2026 Ganjil</option>
                  <option value="2024/2025 Genap">2024/2025 Genap</option>
                  <option value="2024/2025 Ganjil">2024/2025 Ganjil</option>
                </select>
              </div>"""

content = content.replace(block_to_remove, "")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed Tahun Ajaran select block from Pelatihan.tsx")
