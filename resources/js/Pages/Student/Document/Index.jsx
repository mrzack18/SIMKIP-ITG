import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Upload, FileText, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DocumentIndex({ documents }) {
    const mandatoryDocs = ['Sertifikat MABIM', 'Sertifikat KKN', 'Sertifikat KP', 'Sertifikat Bela Negara', 'SK Skripsi'];
    
    return (
        <AuthenticatedLayout header="Drive Pribadi & Dokumen Wajib">
            <Head title="Drive Pribadi" />

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Dokumen Persyaratan Kelulusan KIP</CardTitle>
                        <CardDescription>
                            Anda wajib melengkapi seluruh dokumen di bawah ini agar dapat mengajukan Surat Bebas Tanggungan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {mandatoryDocs.map((docType, index) => {
                                const uploadedDoc = documents.find(d => d.type === docType);
                                
                                return (
                                    <motion.div 
                                        key={docType}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card className="border-2 border-gray-100 hover:border-blue-200 transition-colors h-full flex flex-col">
                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between items-start">
                                                    <FileText className="h-6 w-6 text-blue-500" />
                                                    {uploadedDoc ? (
                                                        uploadedDoc.status === 'approved' 
                                                            ? <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1"/> Valid</Badge>
                                                            : <Badge variant="warning"><Clock className="w-3 h-3 mr-1"/> Review</Badge>
                                                    ) : (
                                                        <Badge variant="outline">Belum Ada</Badge>
                                                    )}
                                                </div>
                                                <CardTitle className="text-base mt-2">{docType}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="mt-auto pt-4 border-t flex flex-col justify-end flex-grow">
                                                {uploadedDoc ? (
                                                    <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50">
                                                        Lihat Dokumen
                                                    </Button>
                                                ) : (
                                                    <div className="relative">
                                                        <Button variant="secondary" className="w-full cursor-pointer overflow-hidden">
                                                            <Upload className="mr-2 h-4 w-4" /> Unggah File
                                                            <input 
                                                                type="file" 
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                                onChange={() => alert('Simulasi Upload File untuk ' + docType)}
                                                            />
                                                        </Button>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
