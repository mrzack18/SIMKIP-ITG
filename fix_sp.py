with open('resources/js/pages/admin/DataAkademik.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('{r.sp ? (')
end = text.find(')}', text.find('???</span>', start)) + 2

replacement = """{r.spList ? (
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
                                    title={isActive ? 'Aktif' : 'Tidak Aktif (Kadaluarsa)'}
                                  >
                                    {sp.level}
                                  </span>
                                );
                              })
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}"""

if start != -1 and end != -1:
    text = text[:start] + replacement + text[end:]
    with open('resources/js/pages/admin/DataAkademik.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Replaced successfully')
else:
    print('Pattern not found', start, end)
