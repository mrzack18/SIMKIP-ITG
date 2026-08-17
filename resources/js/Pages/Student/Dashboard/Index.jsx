import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/Components/ui/alert';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentDashboard({ status_akademik, ipk_terakhir, sp_aktif }) {
    return (
        <AuthenticatedLayout header="Dashboard Mahasiswa">
            <Head title="Dashboard" />

            <div className="space-y-6">
                {sp_aktif && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <Alert variant="destructive">
                            <AlertTriangle className="h-5 w-5" />
                            <AlertTitle className="text-lg">SURAT PERINGATAN (SP {sp_aktif.level})</AlertTitle>
                            <AlertDescription>
                                Anda sedang dalam masa peringatan dengan alasan: <strong>{sp_aktif.reason}</strong>. 
                                Harap segera memperbaiki status Anda dalam masa tenggang (grace period) 1 semester ke depan.
                            </AlertDescription>
                        </Alert>
                    </motion.div>
                )}

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Status Akademik</CardTitle>
                            {status_akademik === 'Aktif' ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                                <Info className="h-4 w-4 text-gray-400" />
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{status_akademik}</div>
                            <p className="text-xs text-gray-500 mt-1">Status KIP-K Semester Berjalan</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">IPK Terakhir</CardTitle>
                            <Info className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{ipk_terakhir}</div>
                            <p className="text-xs text-gray-500 mt-1">Batas minimum: 3.00</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Panduan Penggunaan Sistem</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-blue-800">
                            <h4 className="font-semibold mb-2">Jadwal Input Nilai</h4>
                            <p className="text-sm">Jadwal input nilai IPK dan prestasi untuk semester ini <strong>SEDANG DIBUKA</strong>. Silakan menuju ke menu "Akademik & Prestasi".</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md border text-gray-800">
                            <h4 className="font-semibold mb-2">Dokumen Wajib (Drive Pribadi)</h4>
                            <p className="text-sm">Anda diwajibkan mengunggah seluruh dokumen kegiatan kemahasiswaan (MABIM, KKN, Bela Negara, KP) sebagai syarat pencetakan bebas tanggungan kelak.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
