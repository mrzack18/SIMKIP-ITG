import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { FileCheck, Download } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/Components/ui/alert';

export default function ClearanceIndex({ can_apply, status }) {
    return (
        <AuthenticatedLayout header="Persetujuan Bebas Tanggungan">
            <Head title="Bebas Tanggungan" />

            <div className="max-w-3xl space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Syarat Bebas Tanggungan Akademik KIP-K</CardTitle>
                        <CardDescription>
                            Sebagai syarat mengikuti sidang akhir, Anda wajib mencetak Surat Keterangan Bebas Tanggungan.
                            Surat ini membuktikan Anda tidak memiliki masalah (SP) dan telah melengkapi semua dokumen wajib.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium">Status Prasyarat Anda:</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center">
                                    <FileCheck className="mr-2 h-4 w-4 text-green-500" /> Sedang menempuh Semester 8 atau lebih
                                </li>
                                <li className="flex items-center">
                                    <FileCheck className="mr-2 h-4 w-4 text-green-500" /> Semua Dokumen Wajib telah diunggah dan tervalidasi
                                </li>
                                <li className="flex items-center">
                                    <FileCheck className="mr-2 h-4 w-4 text-green-500" /> Tidak memiliki SP Aktif
                                </li>
                            </ul>
                        </div>

                        <div className="border-t pt-6">
                            {!status ? (
                                <div className="text-center">
                                    <p className="text-sm text-gray-500 mb-4">Anda telah memenuhi syarat untuk mengajukan surat.</p>
                                    <Button 
                                        size="lg" 
                                        className="w-full sm:w-auto"
                                        disabled={!can_apply}
                                        onClick={() => alert('Pengajuan berhasil dikirim ke Admin Kemahasiswaan.')}
                                    >
                                        <FileCheck className="mr-2 h-5 w-5" /> Ajukan Bebas Tanggungan
                                    </Button>
                                </div>
                            ) : status === 'pending' ? (
                                <Alert variant="warning">
                                    <AlertTitle>Menunggu Persetujuan</AlertTitle>
                                    <AlertDescription>
                                        Pengajuan Anda sedang diproses oleh Biro Kemahasiswaan. Harap periksa kembali secara berkala.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <Alert variant="success" className="bg-green-50 border-green-200">
                                    <div className="flex justify-between items-center w-full">
                                        <div>
                                            <AlertTitle className="text-green-800">Disetujui</AlertTitle>
                                            <AlertDescription className="text-green-700">
                                                Surat Bebas Tanggungan Anda telah disetujui.
                                            </AlertDescription>
                                        </div>
                                        <Button variant="outline" className="text-green-700 border-green-300 hover:bg-green-100">
                                            <Download className="mr-2 h-4 w-4" /> Unduh PDF
                                        </Button>
                                    </div>
                                </Alert>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
