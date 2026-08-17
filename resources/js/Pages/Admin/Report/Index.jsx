import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Download, FileSignature, CheckCircle } from 'lucide-react';

export default function ReportIndex({ reports, clearances }) {
    return (
        <AuthenticatedLayout header="Laporan & Persetujuan">
            <Head title="Laporan & Persetujuan" />

            <div className="space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Pengajuan Bebas Tanggungan</CardTitle>
                            <CardDescription>Mahasiswa semester akhir (8+) yang mengajukan surat bebas tanggungan sebagai syarat sidang akhir.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>NIM</TableHead>
                                    <TableHead>Nama Mahasiswa</TableHead>
                                    <TableHead>Status Dokumen Wajib</TableHead>
                                    <TableHead>Status Persetujuan</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clearances.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-4">Belum ada pengajuan.</TableCell>
                                    </TableRow>
                                ) : (
                                    clearances.map(c => (
                                        <TableRow key={c.id}>
                                            <TableCell>{c.nim}</TableCell>
                                            <TableCell>{c.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="success">Lengkap (5/5)</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="warning">Menunggu Admin</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" onClick={() => alert('Persetujuan Bebas Tanggungan diberikan!')}>
                                                    <CheckCircle className="mr-2 h-4 w-4" /> Approve
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Riwayat Laporan Semester (Ke Warek 3)</CardTitle>
                            <CardDescription>Laporan evaluasi komprehensif mahasiswa KIP-K setiap akhir semester.</CardDescription>
                        </div>
                        <Button>
                            <FileSignature className="mr-2 h-4 w-4" /> Buat Laporan Baru
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Semester / TA</TableHead>
                                    <TableHead>Total Evaluasi</TableHead>
                                    <TableHead>Status TTD Warek 3</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reports.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-4">Belum ada laporan.</TableCell>
                                    </TableRow>
                                ) : (
                                    reports.map(r => (
                                        <TableRow key={r.id}>
                                            <TableCell className="font-medium">{r.semester}</TableCell>
                                            <TableCell>450 Mahasiswa</TableCell>
                                            <TableCell>
                                                {r.status === 'approved_by_warek3' ? (
                                                    <Badge variant="success">Disetujui (Signed)</Badge>
                                                ) : (
                                                    <Badge variant="warning">Menunggu TTD</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="outline" size="sm" disabled={r.status !== 'approved_by_warek3'}>
                                                    <Download className="mr-2 h-4 w-4" /> PDF
                                                </Button>
                                                <Button variant="outline" size="sm" disabled={r.status !== 'approved_by_warek3'}>
                                                    <Download className="mr-2 h-4 w-4" /> Excel
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
