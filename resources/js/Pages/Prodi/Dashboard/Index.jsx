import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';

export default function ProdiDashboard() {
    return (
        <AuthenticatedLayout header="Dashboard Program Studi">
            <Head title="Dashboard Prodi" />
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Selamat Datang, Admin Program Studi</CardTitle>
                        <CardDescription>
                            Anda memiliki akses (Read-Only) untuk melihat rekam jejak akademik mahasiswa KIP-K di lingkungan program studi Anda.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-500">Silakan gunakan menu navigasi untuk melihat daftar mahasiswa.</p>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
