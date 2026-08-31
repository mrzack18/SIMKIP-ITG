import re

with open('resources/js/pages/admin/DataAkademik.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# I will replace the SP rendering block inside `r.sp ?`
old_sp_block = r'\{r\.sp \? \(\s*<>\s*\{\(r\.sp === "SP2" \|\| r\.sp === "SP3"\) && \(\s*<span[^>]+>\s*SP1\s*</span>\s*\)\}\s*\{r\.sp === "SP3" && \(\s*<span[^>]+>\s*SP2\s*</span>\s*\)\}\s*<span\s+className=\{[^}]+\}\s*>\s*\{r\.sp\}\s*</span>\s*</>\s*\) : \(\s*<span[^>]+>.+?</span>\s*\)\}'

new_sp_block = r'''{r.spList ? (
                              r.spList.map((sp: any, idx: number) => {
                                const isActive = sp.status === 'Aktif';
                                let colorClass = 'bg-gray-100 text-gray-500'; // inactive
                                if (isActive) {
                                  if (sp.level === 'SP1') colorClass = 'bg-orange-100 text-orange-700';
                                  else if (sp.level === 'SP2') colorClass = 'bg-red-100 text-red-700';
                                  else if (sp.level === 'SP3') colorClass = 'bg-red-900 text-red-100';
                                }
                                return (
                                  <span
                                    key={idx}
                                    className={`px-1.5 py-0.5 rounded text-xs font-600 ${colorClass}`}
                                    title={isActive ? "Aktif" : "Tidak Aktif (Kadaluarsa)"}
                                  >
                                    {sp.level}
                                  </span>
                                );
                              })
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}'''

text = re.sub(old_sp_block, new_sp_block, text, flags=re.DOTALL)

with open('resources/js/pages/admin/DataAkademik.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("SP rendering fixed.")
