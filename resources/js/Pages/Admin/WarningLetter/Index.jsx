import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { AlertTriangle, Plus } from 'lucide-react';
import Modal from '@/Components/Modal';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select } from '@/Components/ui/select';

export default function WarningLetterIndex({ students, warnings }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const openIssueModal = (student = null) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    return (
        <AuthenticatedLayout header="Sistem Peringatan (SP)">
            <Head title="Sistem Peringatan" />

            <div className="space-y-6">
                <Card className="border-red-200">
                    <CardHeader className="bg-red-50 rounded-t-lg border-b border-red-100">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-red-800 flex items-center">
                                    <AlertTriangle className="mr-2 h-5 w-5" /> 
                                    Rekomendasi SP (IPK &lt; Threshold)
                                </CardTitle>
                                <CardDescription className="text-red-600 mt-1">
                                    Mahasiswa berikut terdeteksi otomatis oleh sistem memiliki IPK di bawah ambang batas yang ditetapkan.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
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
                                        <TableCell colSpan={4} className="text-center py-4">Tidak ada mahasiswa di bawah threshold.</TableCell>
                                    </TableRow>
                                ) : (
                                    students.map(s => (
                                        <TableRow key={s.id}>
                                            <TableCell>{s.nim}</TableCell>
                                            <TableCell>{s.name}</TableCell>
                                            <TableCell>
                                                <span className="font-bold text-red-600">{s.ipk}</span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="destructive" size="sm" onClick={() => openIssueModal(s)}>
                                                    Terbitkan SP 1
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
                            <CardTitle>Riwayat SP Aktif</CardTitle>
                            <CardDescription>Daftar mahasiswa yang sedang dalam masa SP atau Grace Period.</CardDescription>
                        </div>
                        <Button onClick={() => openIssueModal(null)} variant="outline">
                            <Plus className="mr-2 h-4 w-4" /> SP Manual (Non-Akademik)
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>NIM</TableHead>
                                    <TableHead>Nama Mahasiswa</TableHead>
                                    <TableHead>Tingkat SP</TableHead>
                                    <TableHead>Alasan</TableHead>
                                    <TableHead>Tanggal Terbit</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {warnings.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-4">Tidak ada riwayat SP.</TableCell>
                                    </TableRow>
                                ) : (
                                    warnings.map(w => (
                                        <TableRow key={w.id}>
                                            <TableCell>{w.nim}</TableCell>
                                            <TableCell>{w.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="destructive">SP {w.level}</Badge>
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate" title={w.reason}>{w.reason}</TableCell>
                                            <TableCell>{w.date}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Terbitkan Surat Peringatan (SP)
                        </h2>
                        
                        <div className="space-y-4">
                            {!selectedStudent && (
                                <div>
                                    <Label>Cari Mahasiswa</Label>
                                    <Input placeholder="Ketik NIM atau Nama..." className="mt-1" />
                                </div>
                            )}
                            
                            {selectedStudent && (
                                <div className="p-3 bg-gray-50 border rounded-md">
                                    <p className="text-sm text-gray-500">Penerima SP:</p>
                                    <p className="font-semibold">{selectedStudent.nim} - {selectedStudent.name}</p>
                                </div>
                            )}

                            <div>
                                <Label>Tingkat SP</Label>
                                <Select className="mt-1">
                                    <option value="1">SP 1 (Peringatan Awal)</option>
                                    <option value="2">SP 2 (Peringatan Keras)</option>
                                    <option value="3">SP 3 (Pencabutan KIP-K)</option>
                                </Select>
                            </div>
                            
                            <div>
                                <Label>Alasan Penerbitan SP</Label>
                                <textarea 
                                    className="w-full mt-1 rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500" 
                                    rows="3"
                                    placeholder="Jelaskan alasan pelanggaran (akademik/kode etik)..."
                                    defaultValue={selectedStudent ? `IPK Semester terakhir (${selectedStudent.ipk}) berada di bawah standar.` : ''}
                                ></textarea>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                                Batal
                            </Button>
                            <Button variant="destructive" onClick={() => {
                                alert('Surat Peringatan Berhasil Diterbitkan dan Notifikasi telah dikirim ke Mahasiswa.');
                                setIsModalOpen(false);
                            }}>
                                Terbitkan SP
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
