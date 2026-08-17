import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Save } from 'lucide-react';
import { useState } from 'react';

export default function SettingsIndex({ settings }) {
    const [formData, setFormData] = useState({
        ipk_threshold: settings?.ipk_threshold || 3.0,
        input_start: settings?.input_start || '',
        input_end: settings?.input_end || ''
    });

    const handleSave = (e) => {
        e.preventDefault();
        alert('Konfigurasi berhasil disimpan! (Simulasi FE)');
    };

    return (
        <AuthenticatedLayout header="Pengaturan Sistem">
            <Head title="Pengaturan" />

            <div className="max-w-4xl space-y-6">
                <Card>
                    <form onSubmit={handleSave}>
                        <CardHeader>
                            <CardTitle>Ambang Batas Evaluasi (Threshold)</CardTitle>
                            <CardDescription>
                                Nilai IPK minimum bagi mahasiswa KIP. Jika IPK semester berada di bawah nilai ini, mahasiswa akan ditandai untuk diterbitkan Surat Peringatan (SP 1).
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="max-w-xs space-y-2">
                                <Label htmlFor="ipk_threshold">Minimum IPK</Label>
                                <Input 
                                    id="ipk_threshold" 
                                    type="number" 
                                    step="0.01" 
                                    value={formData.ipk_threshold}
                                    onChange={(e) => setFormData({...formData, ipk_threshold: e.target.value})}
                                />
                            </div>
                        </CardContent>

                        <CardHeader className="border-t pt-6">
                            <CardTitle>Jendela Jadwal Input Nilai Akademik</CardTitle>
                            <CardDescription>
                                Atur rentang waktu mahasiswa diizinkan untuk mengunggah nilai IPK dan prestasi. Di luar waktu ini, form input akan dikunci.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
                                <div className="space-y-2">
                                    <Label htmlFor="input_start">Tanggal Buka</Label>
                                    <Input 
                                        id="input_start" 
                                        type="date" 
                                        value={formData.input_start}
                                        onChange={(e) => setFormData({...formData, input_start: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="input_end">Tanggal Tutup</Label>
                                    <Input 
                                        id="input_end" 
                                        type="date" 
                                        value={formData.input_end}
                                        onChange={(e) => setFormData({...formData, input_end: e.target.value})}
                                    />
                                </div>
                            </div>
                        </CardContent>

                        <div className="p-6 pt-0 flex justify-end">
                            <Button type="submit">
                                <Save className="mr-2 h-4 w-4" /> Simpan Pengaturan
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
