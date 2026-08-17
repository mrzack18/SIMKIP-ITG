import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Eye, Check, X } from 'lucide-react';
import Modal from '@/Components/Modal';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';

export default function DocumentValidation({ documents }) {
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const handlePreview = (doc) => {
        setSelectedDoc(doc);
        setIsModalOpen(true);
        setRejectReason('');
    };

    return (
        <AuthenticatedLayout header="Validasi Dokumen Mahasiswa">
            <Head title="Validasi Dokumen" />

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Antrean Dokumen Menunggu Validasi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>NIM</TableHead>
                                    <TableHead>Nama Mahasiswa</TableHead>
                                    <TableHead>Jenis Dokumen</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {documents.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                            Tidak ada dokumen dalam antrean.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    documents.map((doc) => (
                                        <TableRow key={doc.id}>
                                            <TableCell className="font-medium">{doc.nim}</TableCell>
                                            <TableCell>{doc.name}</TableCell>
                                            <TableCell>{doc.type}</TableCell>
                                            <TableCell>
                                                <Badge variant="warning">Perlu Direview</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm" onClick={() => handlePreview(doc)}>
                                                    <Eye className="mr-2 h-4 w-4" /> Review
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Modal Review Dokumen */}
                <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="3xl">
                    {selectedDoc && (
                        <div className="flex flex-col h-[80vh]">
                            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{selectedDoc.type}</h3>
                                    <p className="text-sm text-gray-500">{selectedDoc.nim} - {selectedDoc.name}</p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                                    Tutup
                                </Button>
                            </div>
                            
                            <div className="flex-1 p-6 overflow-y-auto flex">
                                {/* Simulasi Preview PDF/Gambar */}
                                <div className="w-2/3 bg-gray-200 border rounded-md flex items-center justify-center text-gray-400">
                                    [Area Pratinjau Dokumen PDF / Gambar]
                                </div>
                                
                                {/* Panel Aksi */}
                                <div className="w-1/3 pl-6 flex flex-col justify-center space-y-6">
                                    <div className="space-y-4">
                                        <Button 
                                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => {
                                                alert('Dokumen disetujui!');
                                                setIsModalOpen(false);
                                            }}
                                        >
                                            <Check className="mr-2 h-4 w-4" /> Setujui Dokumen
                                        </Button>
                                        
                                        <div className="pt-6 border-t border-gray-200 space-y-3">
                                            <Label>Atau Tolak Dokumen</Label>
                                            <Input 
                                                placeholder="Alasan penolakan (Wajib jika menolak)" 
                                                value={rejectReason}
                                                onChange={(e) => setRejectReason(e.target.value)}
                                            />
                                            <Button 
                                                variant="destructive" 
                                                className="w-full"
                                                onClick={() => {
                                                    if(!rejectReason) {
                                                        alert('Harap isi alasan penolakan!');
                                                        return;
                                                    }
                                                    alert('Dokumen ditolak dengan alasan: ' + rejectReason);
                                                    setIsModalOpen(false);
                                                }}
                                            >
                                                <X className="mr-2 h-4 w-4" /> Tolak & Minta Revisi
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
