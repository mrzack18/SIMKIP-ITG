import { useState, useRef } from "react";
import { Upload, CheckCircle, Clock, AlertTriangle, FileText, Eye, Download, X } from "lucide-react";

type DocStatus = "Disetujui" | "Menunggu Validasi" | "Ditolak" | "Belum Diunggah";

interface Doc {
  id: string;
  nama: string;
  desc: string;
  status: DocStatus;
  catatan?: string;
  fileName?: string;
}

interface ExtraFieldDef {
  key: string;
  label: string;
  type: "text" | "date";
}

const EXTRA_FIELDS: Record<string, ExtraFieldDef[]> = {
  pkkmb: [
    { key: "tanggal", label: "Tanggal Pelaksanaan", type: "date" },
    { key: "tempat", label: "Tempat / Lokasi", type: "text" },
  ],
  mabim: [
    { key: "tanggal", label: "Tanggal Pelaksanaan", type: "date" },
    { key: "tempat", label: "Tempat / Lokasi", type: "text" },
  ],
  belanegara: [
    { key: "tanggal", label: "Tanggal Pelaksanaan", type: "date" },
    { key: "tempat", label: "Tempat", type: "text" },
    { key: "penyelenggara", label: "Penyelenggara", type: "text" },
  ],
  sertifikasi: [
    { key: "namaSertifikasi", label: "Nama Sertifikasi", type: "text" },
    { key: "penyelenggara", label: "Penyelenggara", type: "text" },
    { key: "tanggalLulus", label: "Tanggal Lulus", type: "date" },
    { key: "noSertifikat", label: "No. Sertifikat", type: "text" },
  ],
  ba_kp: [
    { key: "judulKP", label: "Judul KP", type: "text" },
    { key: "perusahaan", label: "Perusahaan / Instansi", type: "text" },
    { key: "tanggalMulai", label: "Tanggal Mulai", type: "date" },
    { key: "tanggalSelesai", label: "Tanggal Selesai", type: "date" },
  ],
};

const INITIAL_DOCS: Doc[] = [
  {
    id: "pkkmb",
    nama: "PKKMB",
    desc: "Sertifikat Pengenalan Kehidupan Kampus Bagi Mahasiswa Baru",
    status: "Disetujui",
    fileName: "pkkmb_rifaldi.pdf",
  },
  {
    id: "belanegara",
    nama: "Bela Negara",
    desc: "Sertifikat keikutsertaan program Bela Negara",
    status: "Disetujui",
    fileName: "belanegara_rifaldi.pdf",
  },
  {
    id: "mabim",
    nama: "MABIM",
    desc: "Sertifikat keikutsertaan Masa Bimbingan Mahasiswa",
    status: "Menunggu Validasi",
    fileName: "mabim_rifaldi.pdf",
  },
  {
    id: "ba_kp",
    nama: "Berita Acara KP",
    desc: "Berita acara/bukti sidang Kerja Praktik",
    status: "Ditolak",
    catatan: "File buram, mohon upload ulang",
    fileName: "ba_kp_rifaldi.pdf",
  },
  {
    id: "sertifikasi",
    nama: "Sertifikasi",
    desc: "Sertifikat profesional/kompetensi (minimal 1 wajib)",
    status: "Belum Diunggah",
  },
  {
    id: "bukti_sidang",
    nama: "Bukti Sidang Skripsi",
    desc: "Bukti skripsi telah disidangkan dan dinyatakan lulus",
    status: "Belum Diunggah",
  },
];

const borderColor: Record<DocStatus, string> = {
  Disetujui: "border-l-green-500",
  "Menunggu Validasi": "border-l-amber-400",
  Ditolak: "border-l-red-400",
  "Belum Diunggah": "border-l-gray-300",
};

const badgeStyle: Record<DocStatus, string> = {
  Disetujui: "bg-green-100 text-green-700",
  "Menunggu Validasi": "bg-amber-100 text-amber-700",
  Ditolak: "bg-red-100 text-red-700",
  "Belum Diunggah": "bg-gray-100 text-gray-500",
};

function StatusIcon({ status }: { status: DocStatus }) {
  if (status === "Disetujui") return <CheckCircle size={20} className="text-green-500" />;
  if (status === "Menunggu Validasi") return <Clock size={20} className="text-amber-500" />;
  if (status === "Ditolak") return <AlertTriangle size={20} className="text-red-500" />;
  return <FileText size={20} className="text-gray-300" />;
}

export default function UploadDokumen() {
  const [docs, setDocs] = useState<Doc[]>(INITIAL_DOCS);
  const [uploadTarget, setUploadTarget] = useState<string | null>(null);
  const [viewTarget, setViewTarget] = useState<Doc | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [extraFields, setExtraFields] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const approved = docs.filter((d) => d.status === "Disetujui").length;
  const total = docs.length;
  const pct = Math.round((approved / total) * 100);

  const openUpload = (docId: string) => {
    setUploadTarget(docId);
    setSelectedFile(null);
    setExtraFields({});
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  const handleUploadSubmit = () => {
    if (!selectedFile || !uploadTarget) return;
    setUploading(true);
    setTimeout(() => {
      setDocs((prev) =>
        prev.map((d) =>
          d.id === uploadTarget
            ? { ...d, status: "Menunggu Validasi" as DocStatus, catatan: undefined, fileName: selectedFile.name }
            : d
        )
      );
      setUploading(false);
      setUploadTarget(null);
      setSelectedFile(null);
      setExtraFields({});
    }, 1200);
  };

  const uploadDoc = docs.find((d) => d.id === uploadTarget);
  const currentExtraFields = uploadTarget ? (EXTRA_FIELDS[uploadTarget] ?? []) : [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-bold text-2xl text-gray-900">Upload Dokumen Kewajiban</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Seluruh dokumen berikut wajib diunggah dan divalidasi sebagai syarat KIP-K dan kelulusan.
        </p>
      </div>

      {/* Student info */}
      <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100 flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ background: "#263F93" }}
        >
          AR
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-sm">Ahmad Rifaldi</p>
          <p className="text-xs text-gray-400">NIM 2206001</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-700">
            {approved} dari {total} dokumen telah disetujui
          </p>
          <p className="text-sm text-gray-400">{pct}%</p>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: "#263F93" }}
          />
        </div>
        {approved === total && (
          <div className="flex items-center gap-2 mt-3 text-green-600 text-sm font-medium">
            <CheckCircle size={16} /> Semua dokumen kewajiban telah disetujui!
          </div>
        )}
      </div>

      {/* Document cards — fixed order */}
      <div className="space-y-3">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className={`bg-white rounded-xl p-5 shadow-sm border border-gray-100 border-l-4 ${borderColor[doc.status]}`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <StatusIcon status={doc.status} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800 text-sm">{doc.nama}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${badgeStyle[doc.status]}`}>
                    {doc.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{doc.desc}</p>

                {doc.fileName && doc.status !== "Belum Diunggah" && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <FileText size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-500">{doc.fileName}</span>
                  </div>
                )}

                {doc.catatan && (
                  <div className="mt-2 flex items-start gap-2 bg-red-50 px-3 py-2 rounded-lg">
                    <AlertTriangle size={13} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700">
                      <span className="font-medium">Catatan Admin:</span> {doc.catatan}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {(doc.status === "Disetujui" || doc.status === "Menunggu Validasi") && (
                  <button
                    onClick={() => setViewTarget(doc)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#263F93] rounded-lg text-[#263F93] hover:bg-[#EDF0F8] transition-colors"
                  >
                    <Eye size={13} /> Lihat
                  </button>
                )}
                {doc.status === "Disetujui" && (
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                    <Download size={13} /> Unduh
                  </button>
                )}
                {(doc.status === "Belum Diunggah" || doc.status === "Ditolak") && (
                  <button
                    onClick={() => openUpload(doc.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg text-white font-medium transition-colors"
                    style={{ background: doc.status === "Ditolak" ? "#DC2626" : "#263F93" }}
                  >
                    <Upload size={13} /> {doc.status === "Ditolak" ? "Upload Ulang" : "Upload"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload modal */}
      {uploadTarget && uploadDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="font-bold text-gray-800">Upload Dokumen</h3>
                <p className="text-xs text-gray-400 mt-0.5">{uploadDoc.nama}</p>
              </div>
              <button
                onClick={() => setUploadTarget(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* File drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  dragOver
                    ? "border-[#263F93] bg-[#263F93]/5"
                    : "border-[#E2E8F0] hover:border-[#263F93]/40 hover:bg-gray-50/50"
                }`}
              >
                {selectedFile ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-[#263F93]/10 flex items-center justify-center mx-auto">
                      <FileText size={24} className="text-[#263F93]" />
                    </div>
                    <p className="font-medium text-[#263F93] text-sm">{selectedFile.name}</p>
                    <p className="text-xs text-gray-400">
                      {(selectedFile.size / 1024).toFixed(1)} KB — Klik untuk ganti
                    </p>
                  </div>
                ) : (
                  <>
                    <Upload size={28} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 font-medium">Seret file ke sini atau klik untuk memilih</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG — maks. 10MB</p>
                  </>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  if (f) setSelectedFile(f);
                }}
              />

              {/* Extra info fields */}
              {currentExtraFields.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Informasi Tambahan
                  </p>
                  <div className={`grid gap-3 ${currentExtraFields.length > 2 ? "grid-cols-2" : "grid-cols-1"}`}>
                    {currentExtraFields.map((field) => (
                      <div key={field.key}>
                        <label className="block text-xs text-gray-400 mb-1">{field.label}</label>
                        <input
                          type={field.type}
                          value={extraFields[field.key] ?? ""}
                          onChange={(e) =>
                            setExtraFields((prev) => ({ ...prev, [field.key]: e.target.value }))
                          }
                          placeholder={field.type === "text" ? field.label : undefined}
                          className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#263F93]/20 focus:border-[#263F93]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setUploadTarget(null)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleUploadSubmit}
                  disabled={!selectedFile || uploading}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40 flex items-center justify-center gap-2 transition-opacity"
                  style={{ background: "#263F93" }}
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Mengupload...
                    </>
                  ) : (
                    <>
                      <Upload size={14} /> Upload Dokumen
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview modal */}
      {viewTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800">{viewTarget.nama}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{viewTarget.fileName}</p>
              </div>
              <button
                onClick={() => setViewTarget(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex flex-col items-center justify-center gap-3">
                <FileText size={48} className="text-gray-300" />
                <p className="text-sm text-gray-500 font-medium">{viewTarget.fileName}</p>
                <p className="text-xs text-gray-400">Pratinjau dokumen</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${badgeStyle[viewTarget.status]}`}>
                    {viewTarget.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    <Download size={14} /> Unduh
                  </button>
                  <button
                    onClick={() => setViewTarget(null)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                    style={{ background: "#263F93" }}
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
