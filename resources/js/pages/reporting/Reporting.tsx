import { useState, useEffect, useCallback } from "react";
import { Award, Users, BookOpen, Download, Loader2, Eye } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { TahunAjaranFilter, getCurrentTahunAjaran } from "@/components/ui/TahunAjaranFilter";
import { getMahasiswaFilterOptions, type MahasiswaFilterOptions } from "@/services/mahasiswaService";
import {
  PrestasiDetailModal,
  OrganisasiDetailModal,
  PelatihanDetailModal,
} from "@/components/modules/admin/mahasiswa/DetailModals";
import {
  getReporting,
  downloadReportingPdf,
  type ReportingType,
  type ReportingRow,
} from "@/services/reportingService";

/** Modal detail yang sama dengan halaman Detail Mahasiswa. */
const DETAIL_MODALS: Record<
  ReportingType,
  (props: { item: any; onClose: () => void; mahasiswa?: any }) => any
> = {
  prestasi: PrestasiDetailModal,
  organisasi: OrganisasiDetailModal,
  pelatihan: PelatihanDetailModal,
};

// ── Tab & opsi filter ─────────────────────────────────────────────────────

const TABS: { key: ReportingType; label: string; icon: typeof Award }[] = [
  { key: "prestasi", label: "Prestasi", icon: Award },
  { key: "organisasi", label: "Keaktifan Organisasi", icon: Users },
  { key: "pelatihan", label: "Pelatihan", icon: BookOpen },
];

/** Opsi filter tambahan per tipe; harus selaras dengan TYPES di ReportingController. */
const EXTRA_OPTIONS: Record<ReportingType, { key: "tingkat" | "jenis"; label: string; values: string[] }> = {
  prestasi: { key: "tingkat", label: "Tingkat", values: ["Internasional", "Nasional", "Wilayah", "Institusi"] },
  organisasi: { key: "jenis", label: "Jenis", values: ["Organisasi", "Kepanitiaan", "Kegiatan"] },
  pelatihan: { key: "jenis", label: "Jenis", values: ["Akademik", "Non-Akademik"] },
};

/** Nilai status validasi berbeda antara prestasi dan organisasi/pelatihan. */
const STATUS_OPTIONS: Record<ReportingType, string[]> = {
  prestasi: ["Menunggu Validasi", "Disetujui", "Ditolak"],
  organisasi: ["Menunggu", "Disetujui", "Ditolak"],
  pelatihan: ["Menunggu", "Disetujui", "Ditolak"],
};

const SEMUA = "Semua";
const SEMUA_STATUS = "Semua Status";

/** Kolom tabel per tipe. */
const COLUMNS: Record<ReportingType, { key: keyof ReportingRow; label: string }[]> = {
  prestasi: [
    { key: "nim", label: "NIM" },
    { key: "nama", label: "Nama" },
    { key: "prodi", label: "Prodi" },
    { key: "angkatan", label: "Angkatan" },
    { key: "namaPrestasi", label: "Nama Prestasi" },
    { key: "tingkat", label: "Tingkat" },
    { key: "pencapaian", label: "Pencapaian" },
    { key: "penyelenggara", label: "Penyelenggara" },
    { key: "tanggalMulai", label: "Tanggal" },
    { key: "status", label: "Status" },
  ],
  organisasi: [
    { key: "nim", label: "NIM" },
    { key: "nama", label: "Nama" },
    { key: "prodi", label: "Prodi" },
    { key: "angkatan", label: "Angkatan" },
    { key: "organisasi", label: "Organisasi" },
    { key: "jenis", label: "Jenis" },
    { key: "jabatan", label: "Jabatan" },
    { key: "periodeMulai", label: "Periode Mulai" },
    { key: "periodeSelesai", label: "Periode Selesai" },
    { key: "status", label: "Status" },
  ],
  pelatihan: [
    { key: "nim", label: "NIM" },
    { key: "nama", label: "Nama" },
    { key: "prodi", label: "Prodi" },
    { key: "angkatan", label: "Angkatan" },
    { key: "namaPelatihan", label: "Nama Pelatihan" },
    { key: "jenis", label: "Jenis" },
    { key: "penyelenggara", label: "Penyelenggara" },
    { key: "tanggalMulai", label: "Tanggal Mulai" },
    { key: "tanggalSelesai", label: "Tanggal Selesai" },
    { key: "status", label: "Status" },
  ],
};

// ── Helpers UI ────────────────────────────────────────────────────────────

const SELECT_CLASS =
  "px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#263F93]/20 text-gray-600 w-full sm:w-auto max-w-full min-w-0 truncate";

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={SELECT_CLASS}>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

/** Dropdown prodi — value adalah id (dikirim ke backend), label adalah nama. */
function ProdiSelect({
  value,
  onChange,
  prodis,
}: {
  value: string;
  onChange: (v: string) => void;
  prodis: { id: number; nama: string }[];
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={SELECT_CLASS}>
      <option value={SEMUA}>Semua Prodi</option>
      {prodis.map((p) => (
        <option key={p.id} value={String(p.id)}>
          {p.nama}
        </option>
      ))}
    </select>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Disetujui: "bg-green-50 text-green-700 border-green-200",
    Ditolak: "bg-red-50 text-red-700 border-red-200",
  };
  const cls = styles[status] ?? "bg-amber-50 text-amber-700 border-amber-200";
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${cls}`}>
      {status}
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function Reporting() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [tab, setTab] = useState<ReportingType>("prestasi");
  const [tahunAjaran, setTahunAjaran] = useState<string>(getCurrentTahunAjaran());
  const [prodiId, setProdiId] = useState<string>(SEMUA);
  const [status, setStatus] = useState<string>(SEMUA_STATUS);
  const [extra, setExtra] = useState<string>(SEMUA);

  const [rows, setRows] = useState<ReportingRow[]>([]);
  const [detailItem, setDetailItem] = useState<ReportingRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<MahasiswaFilterOptions | null>(null);

  // Opsi prodi hanya relevan untuk admin; prodi sudah di-scope di backend.
  useEffect(() => {
    if (!isAdmin) return;
    let active = true;
    getMahasiswaFilterOptions()
      .then((res) => { if (active) setFilterOptions(res); })
      .catch(() => { /* dropdown prodi opsional — abaikan kegagalan */ });
    return () => { active = false; };
  }, [isAdmin]);

  // Filter tambahan & status ikut berubah saat tab berganti.
  const extraConfig = EXTRA_OPTIONS[tab];

  const buildFilter = useCallback(() => ({
    tahun_ajaran: tahunAjaran,
    ...(isAdmin ? { prodi_id: prodiId } : {}),
    status,
    [extraConfig.key]: extra,
  }), [tahunAjaran, prodiId, status, extra, isAdmin, extraConfig.key]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    getReporting(tab, buildFilter())
      .then((res) => {
        if (!active) return;
        setRows(res.data ?? []);
      })
      .catch(() => {
        if (!active) return;
        setRows([]);
        setError("Gagal memuat data laporan.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [tab, buildFilter]);

  const handleExport = async () => {
    setExporting(true);
    try {
      await downloadReportingPdf(tab, buildFilter());
    } catch {
      alert("Gagal mengunduh PDF laporan.");
    } finally {
      setExporting(false);
    }
  };

  const columns = COLUMNS[tab];
  const DetailModal = DETAIL_MODALS[tab];

  return (
    <div className="space-y-3 sm:space-y-4 pb-24 w-full max-w-7xl mx-auto min-w-0">
      {/* Header */}
      <div className="flex flex-col min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between gap-2 min-w-0">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-display font-700 text-gray-900">Reporting</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Laporan prestasi, keaktifan organisasi, dan pelatihan mahasiswa
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#263F93] hover:bg-[#1B2F73] disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors shrink-0"
        >
          {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          Unduh PDF
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-[#E2E8F0]">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => {
              setTab(key);
              setExtra(SEMUA);
              setStatus(SEMUA_STATUS);
              setDetailItem(null); // modal terikat ke tipe tab
            }}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
              tab === key
                ? "border-[#263F93] text-[#263F93]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:items-center">
        <TahunAjaranFilter value={tahunAjaran} onChange={setTahunAjaran} />

        {isAdmin && (
          <ProdiSelect
            value={prodiId}
            onChange={setProdiId}
            prodis={filterOptions?.prodis ?? []}
          />
        )}

        <FilterSelect
          value={status}
          onChange={setStatus}
          options={[SEMUA_STATUS, ...STATUS_OPTIONS[tab]]}
        />

        <FilterSelect
          value={extra}
          onChange={setExtra}
          options={[SEMUA, ...extraConfig.values]}
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-400 text-sm">
            <Loader2 size={18} className="animate-spin" />
            Memuat data...
          </div>
        ) : error ? (
          <div className="py-16 text-center text-sm text-red-600">{error}</div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">
            Tidak ada data yang sesuai dengan filter yang dipilih.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-[#E2E8F0]">
                  <tr>
                    <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">No</th>
                    {columns.map((c) => (
                      <th key={c.key} className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                        {c.label}
                      </th>
                    ))}
                    <th className="px-3 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2.5 text-gray-500">{i + 1}</td>
                      {columns.map((c) => (
                        <td key={c.key} className="px-3 py-2.5 text-gray-700">
                          {c.key === "status" ? (
                            <StatusBadge status={String(row.status)} />
                          ) : (
                            <span className="whitespace-nowrap">{row[c.key] ?? "-"}</span>
                          )}
                        </td>
                      ))}
                      <td className="px-3 py-2.5 text-center">
                        <button
                          onClick={() => setDetailItem(row)}
                          title="Lihat detail"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#263F93] text-xs font-medium text-[#263F93] hover:bg-[#EDF0F8] transition-colors whitespace-nowrap"
                        >
                          <Eye size={13} /> Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-[#E2E8F0] text-xs text-gray-500">
              Menampilkan {rows.length} data
            </div>
          </>
        )}
      </div>

      {/* Modal detail — komponen yang sama dipakai halaman Detail Mahasiswa */}
      {detailItem && (
        <DetailModal
          item={detailItem.detail ?? detailItem}
          mahasiswa={{ nama: detailItem.nama, nim: detailItem.nim, prodi: detailItem.prodi }}
          onClose={() => setDetailItem(null)}
        />
      )}
    </div>
  );
}
