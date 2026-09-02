import os

filepath = r'c:\laragon\www\SIMKIP-ITG\app\Http\Controllers\Api\PelatihanController.php'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace double resubmit with single
double_resubmit = """    public function resubmit(Request $req, $id) {
        if ($req->user()->role === "mahasiswa") return app(MhsPelatihan::class)->resubmit($req, $id);
        abort(403);
    }

    public function resubmit(Request $req, $id) {
        if ($req->user()->role === "mahasiswa") return app(MhsPelatihan::class)->resubmit($req, $id);
        abort(403);
    }"""

single_resubmit = """    public function resubmit(Request $req, $id) {
        if ($req->user()->role === "mahasiswa") return app(MhsPelatihan::class)->resubmit($req, $id);
        abort(403);
    }"""

content = content.replace(double_resubmit, single_resubmit)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed Api/PelatihanController")
