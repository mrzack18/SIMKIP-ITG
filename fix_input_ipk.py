import os

filepath = r'c:\laragon\www\SIMKIP-ITG\resources\js\pages\student\InputIPK.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix displayedSemester
content = content.replace('''  const displayedSemester = mahasiswaProfile && taFilter !== getCurrentTahunAjaran()
    ? calculateSemester(mahasiswaProfile.angkatan, taFilter)
    : (maxSemesterFromHistory || targetSemester)''', 
    '''  const displayedSemester = mahasiswaProfile
    ? calculateSemester(mahasiswaProfile.angkatan, taFilter)
    : targetSemester''')

# Fix isPeriodActive
content = content.replace('''    if (taFilter !== getCurrentTahunAjaran() && periode.tahun_ajaran) {''', 
    '''    if (periode.tahun_ajaran) {''')

# Fix isTANotMatched
content = content.replace('''  const isTANotMatched = () => {
    if (taFilter === getCurrentTahunAjaran() || !periode?.tahun_ajaran) return false''', 
    '''  const isTANotMatched = () => {
    if (!periode?.tahun_ajaran) return false''')

# Fix computedDisplayedSem
content = content.replace('''      const computedDisplayedSem = taFilter === getCurrentTahunAjaran()
        ? (history.length > 0 ? Math.max(...history.map((r) => r.semester)) : 0)
        : calculateSemester(angkatan, taFilter)''', 
    '''      const computedDisplayedSem = calculateSemester(angkatan, taFilter)''')

# Fix FormData append
content = content.replace('''    if (taFilter !== getCurrentTahunAjaran()) {
      fd.append('tahun_ajaran', taFilter)
    } else if (periode?.tahun_ajaran) {
      fd.append('tahun_ajaran', periode.tahun_ajaran)
    }''', 
    '''    fd.append('tahun_ajaran', taFilter)''')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed InputIPK")
