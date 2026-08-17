import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Eye } from 'lucide-react';

export default function ProdiStudentIndex({ students }) {
    return (
        <AuthenticatedLayout header="Mahasiswa KIP Program Studi">
            <Head title="Mahasiswa Prodi" />
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Mahasiswa (Read-Only)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>NIM</TableHead>
                                    <TableHead>Nama Mahasiswa</TableHead>
                                    <TableHead>IPK Terakhir</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-4">Tidak ada mahasiswa.</TableCell>
                                    </TableRow>
                                ) : (
                                    students.map(s => (
                                        <TableRow key={s.nim}>
                                            <TableCell>{s.nim}</TableCell>
                                            <TableCell>{s.name}</TableCell>
                                            <TableCell className="font-semibold">{s.ipk_terakhir}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4 mr-1" /> Rekam Jejak
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
