import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ChangePassword() {
    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        put(route('password.change.update'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <GuestLayout>
            <Head title="Wajib Ganti Password" />

            <div className="mb-4 text-sm text-gray-600">
                Demi keamanan akun Anda, silakan ubah password default Anda sebelum melanjutkan.
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="current_password" value="Password Saat Ini" />

                    <TextInput
                        id="current_password"
                        type="password"
                        name="current_password"
                        value={data.current_password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('current_password', e.target.value)}
                    />

                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password Baru" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password Baru" />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                    />

                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Simpan & Lanjutkan
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
