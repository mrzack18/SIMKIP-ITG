import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';

export default function Warek3Dashboard() {
    return (
        <AuthenticatedLayout header="Dashboard Wakil Rektor III">
            <Head title="Dashboard Warek 3" />
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Selamat Datang, Bapak/Ibu Wakil Rektor III</CardTitle>
                        <CardDescription>
                            Sistem Monitoring KIP-K ITG. Anda memiliki akses untuk meninjau dan mengesahkan (e-Signature) laporan evaluasi semester mahasiswa KIP-K.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-500">Buka menu "Otorisasi Laporan" untuk melihat antrean laporan yang membutuhkan pengesahan Anda.</p>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
