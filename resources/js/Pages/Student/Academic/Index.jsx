import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Upload } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AcademicIndex({ records }) {
    const [ipk, setIpk] = useState('');
    const [file, setFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Data berhasil disimpan! (Simulasi FE)');
        setIpk('');
        setFile(null);
    };

    return (
        <AuthenticatedLayout header="Akademik & Prestasi">
            <Head title="Akademik" />

            <div className="grid gap-6 md:grid-cols-2">
                {/* Riwayat IPK */}
                <Card>
                    <CardHeader>
                        <CardTitle>Riwayat IPK Semester</CardTitle>
                        <CardDescription>Catatan indeks prestasi per semester.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Semester</TableHead>
                                    <TableHead className="text-right">IPK</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {records.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center text-gray-500">Belum ada data.</TableCell>
                                    </TableRow>
                                ) : (
                                    records.map((r, i) => (
                                        <motion.tr 
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <TableCell>Semester {r.semester}</TableCell>
                                            <TableCell className="text-right font-semibold">{r.ipk}</TableCell>
                                        </motion.tr>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Form Input IPK & Prestasi */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Input Nilai & Prestasi Semester Ini</CardTitle>
                            <CardDescription>Pastikan Anda memasukkan data yang valid dan melampirkan bukti.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="ipk">IPK Semester Ini</Label>
                                    <Input 
                                        id="ipk" 
                                        type="number" 
                                        step="0.01" 
                                        placeholder="Contoh: 3.50" 
                                        value={ipk}
                                        onChange={(e) => setIpk(e.target.value)}
                                        required
                                        className="mt-1"
                                    />
                                </div>
                                
                                <div className="border-t pt-4">
                                    <Label className="mb-2 block">Upload Sertifikat Prestasi (Opsional)</Label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition-colors">
                                        <div className="space-y-1 text-center">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex text-sm text-gray-600 justify-center">
                                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                    <span>Upload a file</span>
                                                    <input 
                                                        id="file-upload" 
                                                        name="file-upload" 
                                                        type="file" 
                                                        className="sr-only" 
                                                        onChange={(e) => setFile(e.target.files[0])}
                                                    />
                                                </label>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, PDF up to 2MB</p>
                                        </div>
                                    </div>
                                    {file && <p className="text-sm mt-2 text-green-600 font-medium">Terpilih: {file.name}</p>}
                                </div>

                                <Button type="submit" className="w-full">
                                    Simpan Data
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
