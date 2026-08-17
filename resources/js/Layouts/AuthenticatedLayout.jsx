import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X, LayoutDashboard, Users, FileText, AlertTriangle, CheckSquare, LogOut, User } from 'lucide-react';
import Dropdown from '@/Components/Dropdown';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const role = user?.role || 'mahasiswa';
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Mock Navigation based on role
    const getNavigation = () => {
        if (role === 'admin') {
            return [
                { name: 'Dashboard', href: route('dashboard'), icon: LayoutDashboard },
                { name: 'Data Mahasiswa', href: '/admin/students', icon: Users },
                { name: 'Validasi Dokumen', href: '/admin/documents', icon: FileText },
                { name: 'Sistem Peringatan (SP)', href: '/admin/warnings', icon: AlertTriangle },
                { name: 'Laporan & Persetujuan', href: '/admin/reports', icon: CheckSquare },
            ];
        } else if (role === 'mahasiswa') {
            return [
                { name: 'Dashboard', href: route('dashboard'), icon: LayoutDashboard },
                { name: 'Akademik & Prestasi', href: '/student/academic', icon: FileText },
                { name: 'Drive Pribadi (Dokumen)', href: '/student/documents', icon: FileText },
                { name: 'Bebas Tanggungan', href: '/student/clearance', icon: CheckSquare },
            ];
        } else if (role === 'prodi') {
            return [
                { name: 'Dashboard', href: route('dashboard'), icon: LayoutDashboard },
                { name: 'Mahasiswa Prodi', href: '/prodi/students', icon: Users },
            ];
        } else if (role === 'warek3') {
            return [
                { name: 'Dashboard', href: route('dashboard'), icon: LayoutDashboard },
                { name: 'Otorisasi Laporan', href: '/warek3/reports', icon: CheckSquare },
            ];
        }
        return [];
    };

    const navigation = getNavigation();

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar Desktop */}
            <div className="hidden md:flex md:w-64 md:flex-col bg-white border-r border-gray-200">
                <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
                    <div className="flex items-center flex-shrink-0 px-4">
                        <ApplicationLogo className="h-8 w-auto text-blue-600" />
                        <span className="ml-2 text-xl font-bold text-gray-900">SIMKIP ITG</span>
                    </div>
                    <div className="mt-8 flex-1 flex flex-col">
                        <nav className="flex-1 px-2 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                        usePage().url.startsWith(item.href) && item.href !== '/'
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <item.icon
                                        className={`mr-3 flex-shrink-0 h-5 w-5 ${
                                            usePage().url.startsWith(item.href) && item.href !== '/'
                                                ? 'text-blue-700'
                                                : 'text-gray-400 group-hover:text-gray-500'
                                        }`}
                                    />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 flex md:hidden">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                    <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                type="button"
                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <X className="h-6 w-6 text-white" />
                            </button>
                        </div>
                        <div className="flex-shrink-0 flex items-center px-4">
                            <ApplicationLogo className="h-8 w-auto text-blue-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">SIMKIP ITG</span>
                        </div>
                        <div className="mt-5 flex-1 h-0 overflow-y-auto">
                            <nav className="px-2 space-y-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                                            usePage().url.startsWith(item.href)
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        <item.icon className="mr-4 flex-shrink-0 h-6 w-6 text-gray-400" />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex flex-col w-0 flex-1 overflow-hidden">
                <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-gray-200">
                    <button
                        type="button"
                        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="flex-1 px-4 flex justify-between">
                        <div className="flex-1 flex items-center">
                            {header && <h1 className="text-lg font-semibold text-gray-900">{header}</h1>}
                        </div>
                        <div className="ml-4 flex items-center md:ml-6">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="ml-2 hidden md:block font-medium text-gray-700">{user.name}</span>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
