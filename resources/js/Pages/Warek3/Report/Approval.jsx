import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { PenTool } from 'lucide-react';

export default function ReportApproval({ reports }) {
    return (
        <AuthenticatedLayout header="Otorisasi Laporan">
            <Head title="Otorisasi Laporan" />
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Pengajuan Laporan Semester</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Semester / TA</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi Otorisasi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reports.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-4">Belum ada laporan yang diajukan.</TableCell>
                                    </TableRow>
                                ) : (
                                    reports.map(r => (
                                        <TableRow key={r.id}>
                                            <TableCell className="font-medium">{r.semester}</TableCell>
                                            <TableCell>
                                                {r.status === 'pending_approval' ? (
                                                    <Badge variant="warning">Menunggu TTD Anda</Badge>
                                                ) : (
                                                    <Badge variant="success">Sudah Disahkan</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button 
                                                    className="bg-blue-600 hover:bg-blue-700" 
                                                    disabled={r.status !== 'pending_approval'}
                                                    onClick={() => alert('Dokumen berhasil disahkan dengan e-Signature (Barcode/QR)!')}
                                                >
                                                    <PenTool className="mr-2 h-4 w-4" /> Beri e-Signature
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
