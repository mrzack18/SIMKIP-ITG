import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { Plus, Search, Eye } from 'lucide-react';
import Modal from '@/Components/Modal';
import { Label } from '@/Components/ui/label';
import { Select } from '@/Components/ui/select';
import { motion } from 'framer-motion';

export default function StudentIndex({ students }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.nim.includes(searchTerm)
    );

    return (
        <AuthenticatedLayout header="Manajemen Data Mahasiswa">
            <Head title="Data Mahasiswa" />

            <div className="space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Daftar Mahasiswa KIP-K</CardTitle>
                        <Button onClick={() => setIsModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Tambah Mahasiswa
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center mb-4 max-w-sm">
                            <Search className="h-4 w-4 text-gray-500 mr-2" />
                            <Input 
                                placeholder="Cari NIM atau Nama..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>NIM</TableHead>
                                    <TableHead>Nama Mahasiswa</TableHead>
                                    <TableHead>Angkatan</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStudents.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                            Tidak ada data ditemukan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredStudents.map((student, i) => (
                                        <motion.tr 
                                            key={student.id} 
                                            initial={{ opacity: 0, y: 10 }} 
                                            animate={{ opacity: 1, y: 0 }} 
                                            transition={{ delay: i * 0.05 }}
                                            className="border-b"
                                        >
                                            <TableCell className="font-medium">{student.nim}</TableCell>
                                            <TableCell>{student.name}</TableCell>
                                            <TableCell>{student.angkatan}</TableCell>
                                            <TableCell>
                                                <Badge variant={student.category === 'Reguler' ? 'default' : 'secondary'}>
                                                    {student.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4 mr-1" /> Detail
                                                </Button>
                                            </TableCell>
                                        </motion.tr>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Modal Tambah Mahasiswa */}
                <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Tambah Mahasiswa KIP Baru
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="nim">NIM</Label>
                                <Input id="nim" placeholder="Masukkan NIM" className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="sk">Nomor SK Penetapan</Label>
                                <Input id="sk" placeholder="Masukkan Nomor SK" className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="kategori">Kategori KIP</Label>
                                <Select id="kategori" className="mt-1">
                                    <option value="Reguler">Reguler</option>
                                    <option value="Aspirasi">Aspirasi</option>
                                </Select>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                                Batal
                            </Button>
                            <Button onClick={() => {
                                // Simulate submit
                                alert('Berhasil mendaftarkan mahasiswa mock!');
                                setIsModalOpen(false);
                            }}>
                                Simpan Akun
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
