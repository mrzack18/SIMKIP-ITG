import os

filepath = r'c:\laragon\www\SIMKIP-ITG\resources\js\pages\student\SPMahasiswa.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update useEffect
old_effect = """  useEffect(() => {
    api.get<{success: boolean, data: SP[]}>("/sp").then((res) => {
      setList(res.data || []);
      setLoading(false);
    });
  }, []);"""

new_effect = """  const fetchSP = () => {
    setLoading(true);
    api.get<{success: boolean, data: SP[]}>(
      "/sp", 
      taFilter ? { tahun_ajaran: taFilter } : undefined
    ).then((res) => {
      setList(res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchSP();
  }, [taFilter]);"""

content = content.replace(old_effect, new_effect)

# 2. Prevent active SP from being evaluated on old data or maybe wait...
# "konsep ny tahun ajaran dengan aturan mesin waktu"
# Wait, if they select an old semester, should the ACTIVE_SP be shown? Yes, if it was active back then, but we don't have historical active state, we just have SPs issued on or before that semester. So ACTIVE_SP should be calculated from `list` which is already filtered!
# Wait, let's see where ACTIVE_SP is used. 
# `const ACTIVE_SP = list.find((s) => s.status === 'Aktif' || s.status === 'Masa Tenggang');`
# This is fine, because `list` is filtered.

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated SPMahasiswa frontend to use API query with Time Machine concept")
