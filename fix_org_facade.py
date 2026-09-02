import os

filepath = r'c:\laragon\www\SIMKIP-ITG\app\Http\Controllers\Api\OrganisasiController.php'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

resubmit_code = """
    public function resubmit(Request $req, $id) {
        if ($req->user()->role === "mahasiswa") return app(MhsOrganisasi::class)->resubmit($req, $id);
        abort(403);
    }
"""

content = content.replace("}\n", resubmit_code + "}\n")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated OrganisasiController facade")
