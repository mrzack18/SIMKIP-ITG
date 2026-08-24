import { Link } from "react-router-dom";
import { useState } from "react";
import { CheckCircle, AlertTriangle, Award, XCircle } from "lucide-react";

type Tab = "Menunggu" | "Diterbitkan" | "Ditolak";

const requests = [
  {
    id: 1,
    nim: "2206001",
    nama: "Ahmad Rifaldi",
    prodi: "Teknik Informatika",
    angkatan: 2022,
    semester: 8,
    tanggalAjukan: "10 Agu 2026",
    docsOk: 5,
    docsTotal: 5,
    spBersih: true,
    status: "Menunggu",
    sksDitempuh: 144,
    sksTotal: 144,
  },
  {
    id: 2,
    nim: "2307001",
    nama: "Fitriyani Hasanah",
    prodi: "Sistem Informasi",
    angkatan: 2023,
    semester: 8,
    tanggalAjukan: "9 Agu 2026",
    docsOk: 4,
    docsTotal: 5,
    spBersih: true,
    status: "Menunggu",
    sksDitempuh: 130,
    sksTotal: 144,
  },
  {
    id: 3,
    nim: "2207001",
    nama: "Juwita Ramadhani",
    prodi: "Sistem Informasi",
    angkatan: 2022,
    semester: 8,
    tanggalAjukan: "8 Agu 2026",
    docsOk: 5,
    docsTotal: 5,
    spBersih: true,
    status: "Menunggu",
    sksDitempuh: 144,
    sksTotal: 144,
  },
  {
    id: 4,
    nim: "2211001",
    nama: "Rina Marlina",
    prodi: "Teknik Sipil",
    angkatan: 2022,
    semester: 8,
    tanggalAjukan: "7 Agu 2026",
    docsOk: 3,
    docsTotal: 5,
    spBersih: false,
    status: "Menunggu",
    sksDitempuh: 138,
    sksTotal: 144,
  },
  {
    id: 5,
    nim: "2220001",
    nama: "Lena Pertiwi",
    prodi: "Arsitektur",
    angkatan: 2022,
    semester: 8,
    tanggalAjukan: "6 Agu 2026",
    docsOk: 5,
    docsTotal: 5,
    spBersih: true,
    status: "Menunggu",
    sksDitempuh: 144,
    sksTotal: 144,
  },
  {
    id: 6,
    nim: "2306001",
    nama: "Krisna Bayu",
    prodi: "Teknik Informatika",
    angkatan: 2023,
    semester: 8,
    tanggalAjukan: "1 Agu 2026",
    docsOk: 5,
    docsTotal: 5,
    spBersih: true,
    status: "Diterbitkan",
    sksDitempuh: 144,
    sksTotal: 144,
  },
  {
    id: 7,
    nim: "2303002",
    nama: "Hesti Rahayu",
    prodi: "Teknik Industri",
    angkatan: 2023,
    semester: 8,
    tanggalAjukan: "28 Jul 2026",
    docsOk: 3,
    docsTotal: 5,
    spBersih: false,
    status: "Ditolak",
    sksDitempuh: 130,
    sksTotal: 144,
  },
];

const counts = {
  Menunggu: requests.filter((r) => r.status === "Menunggu").length,
  Diterbitkan: requests.filter((r) => r.status === "Diterbitkan").length,
  Ditolak: requests.filter((r) => r.status === "Ditolak").length,
};

export default function BebasTanggunganList() {
  const [tab, setTab] = useState<Tab>("Menunggu");
  const filtered = requests.filter((r) => r.status === tab);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-700 text-2xl text-gray-900">
            Permohonan Surat Keterangan Penyelesaian Studi
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Review permohonan penerbitan Surat Keterangan Penyelesaian Studi KIP-K
          </p>
        </div>
        <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-xl px-4 py-2.5">
          <Award size={16} className="text-purple-600" />
          <span className="text-sm font-600 text-purple-700">
            {counts.Menunggu} menunggu review
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(["Menunggu", "Diterbitkan", "Ditolak"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-500 transition-all flex items-center gap-2 ${
              tab === t ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-600 ${
                t === "Menunggu"
                  ? "bg-yellow-100 text-yellow-700"
                  : t === "Diterbitkan"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {counts[t]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-[#E2E8F0]">
                {[
                  "No",
                  "NIM",
                  "Nama",
                  "Prodi",
                  "Angkatan",
                  "Semester",
                  "Tgl. Ajukan",
                  "Kelengkapan SKS",
                  "Kelengkapan Dok.",
                  "Status SP",
                  "Aksi",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-600 text-gray-500 uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((r, i) => {
                const sksOk = r.sksDitempuh === r.sksTotal;
                return (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5 text-gray-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-3.5 font-mono text-xs text-gray-600">
                      {r.nim.slice(-8)}
                    </td>
                    <td className="px-4 py-3.5 font-500 text-gray-800">{r.nama}</td>
                    <td className="px-4 py-3.5 text-xs text-gray-500">
                      {r.prodi.replace("Teknik ", "T.")}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600">{r.angkatan}</td>
                    <td className="px-4 py-3.5 text-gray-600">Sem {r.semester}</td>
                    <td className="px-4 py-3.5 text-xs text-gray-500">{r.tanggalAjukan}</td>

                    {/* Kelengkapan SKS */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-xs font-600 flex items-center gap-1 ${
                          sksOk ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {r.sksDitempuh}/{r.sksTotal} SKS {sksOk ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      </span>
                    </td>

                    {/* Kelengkapan Dokumen */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(r.docsOk / r.docsTotal) * 100}%`,
                              background:
                                r.docsOk === r.docsTotal ? "#059669" : "#F59E0B",
                            }}
                          />
                        </div>
                        <span
                          className={`text-xs font-600 flex items-center gap-1 ${
                            r.docsOk === r.docsTotal ? "text-green-600" : "text-yellow-600"
                          }`}
                        >
                          {r.docsOk}/{r.docsTotal}{" "}
                          {r.docsOk === r.docsTotal ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                        </span>
                      </div>
                    </td>

                    {/* Status SP */}
                    <td className="px-4 py-3.5">
                      {r.spBersih ? (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle size={12} /> Bersih
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-red-600">
                          <AlertTriangle size={12} /> Ada Riwayat
                        </span>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="px-4 py-3.5">
                      {tab === "Menunggu" ? (
                        <Link
                          to={`/admin/bebas-tanggungan/${r.id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-500 border border-green-500 text-green-600 hover:bg-green-50 transition-colors whitespace-nowrap"
                        >
                          <CheckCircle size={12} /> Review & Terbitkan
                        </Link>
                      ) : (
                        <Link
                          to={`/admin/bebas-tanggungan/${r.id}`}
                          className="px-3 py-1.5 text-xs border border-[#E2E8F0] rounded-lg text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
                        >
                          Lihat Detail
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Award size={28} className="mx-auto text-gray-200 mb-2" />
            <p className="text-gray-400 text-sm">Tidak ada permohonan dengan status ini</p>
          </div>
        )}
      </div>
    </div>
  );
}
