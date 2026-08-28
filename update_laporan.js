const fs = require('fs');
const file = '/home/zky/KULIAH/KP/resources/js/pages/admin/SusunLaporan.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'import { createLaporan, submitLaporan, getPreviewStatistics, type LaporanPreviewStatistics } from "@/services/laporanService";',
  'import { createLaporan, submitLaporan, getPreviewStatistics, type LaporanPreviewStatistics } from "@/services/laporanService";\nimport { getMahasiswaFilterOptions } from "@/services/mahasiswaService";'
);

content = content.replace(/const ANGKATAN_LIST = \[.*?\];/s, '');
content = content.replace(/const PRODI_LIST = \[\s*".*?",\s*".*?",\s*".*?",\s*".*?",\s*".*?",\s*\];/s, '');

content = content.replace(
  '  // Real data from backend',
  `  // Filter options
  const [angkatanList, setAngkatanList] = useState<number[]>([]);
  const [prodiList, setProdiList] = useState<string[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(true);

  useEffect(() => {
    getMahasiswaFilterOptions()
      .then(res => {
        setAngkatanList(res.angkatans);
        setProdiList(res.prodis.map(p => p.nama));
        if (res.angkatans.length > 0) setForm(f => ({ ...f, angkatan: String(res.angkatans[0]) }));
        if (res.prodis.length > 0) setForm(f => ({ ...f, prodi: res.prodis[0].nama }));
      })
      .catch(() => {})
      .finally(() => setOptionsLoading(false));
  }, []);

  // Real data from backend`
);

content = content.replace(/ANGKATAN_LIST/g, 'angkatanList');
content = content.replace(/PRODI_LIST/g, 'prodiList');

fs.writeFileSync(file, content);
