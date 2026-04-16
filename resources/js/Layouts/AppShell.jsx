import { Head, Link, usePage, router } from '@inertiajs/react';
import FlashBanner from '../Components/FlashBanner';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/cart', label: 'Cart' },
    { href: '/checkout', label: 'Checkout' },
];

export default function AppShell({ title, children, darkHero = false }) {
    const { auth, cart } = usePage().props;

    return (
        <>
            <Head title={title} />
            <div className={darkHero ? 'min-h-screen bg-[#121212] text-white' : 'min-h-screen bg-stone-50'}>
                <header className="border-b border-[var(--color-brand)] bg-[#121212] text-white">
                    <div className="container-shell flex items-center justify-between gap-6 py-4">
                        <Link className="flex items-center gap-2 text-xl font-black text-[var(--color-brand)]" href="/">
                            <span>✏️</span>
                            <span>SchoolStore</span>
                        </Link>
                        <nav className="hidden items-center gap-6 text-sm text-stone-300 md:flex">
{navLinks.map((item) => (
                                <Link key={item.href} className="transition hover:text-white" href={item.href}>
                                    {item.label}
                                </Link>
                            ))}
                            {!auth.user ? (
                                <Link
                                    className="rounded-full bg-[var(--color-brand)] px-4 py-2 text-sm font-semibold text-stone-950 transition hover:brightness-105"
                                    href="/login"
                                >
                                    Login
                                </Link>
                            ) : (
                                <>
                                    <button
                                        className="rounded-full bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-semibold text-white transition"
                                        onClick={() => router.post('/logout')}
                                    >
                                        Logout
                                    </button>
                                    {auth.user?.is_admin ? (
                                        <Link className="transition hover:text-white" href="/admin">
                                            Admin
                                        </Link>
                                    ) : null}
                                </>
                            )}
                        </nav>
                        <div className="flex items-center gap-3">
                            <Link className="rounded-full bg-[var(--color-brand)] px-4 py-2 text-sm font-semibold text-stone-950" href="/cart">
                                Cart <span className="ml-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] text-white">{cart.count}</span>
                            </Link>
                        </div>
                    </div>
                </header>
                <main className="container-shell py-8">
                    <FlashBanner />
                    {children}
                </main>
            </div>
        </>
    );
}
