import os

filepath = r'c:\laragon\www\SIMKIP-ITG\app\Http\Controllers\Api\OrganisasiController.php'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

last_brace_index = -1
for i in range(len(lines)-1, -1, -1):
    if lines[i].strip() == '}':
        last_brace_index = i
        break

resubmit_code = """
    public function resubmit(Request $req, $id) {
        if ($req->user()->role === "mahasiswa") return app(MhsOrganisasi::class)->resubmit($req, $id);
        abort(403);
    }
"""

if last_brace_index != -1:
    lines.insert(last_brace_index, resubmit_code)
    
with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(lines)
    
print("Fixed OrganisasiController facade")
