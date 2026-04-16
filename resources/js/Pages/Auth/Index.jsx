import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import FormField from '../../Components/FormField';
import AppShell from '../../Layouts/AppShell';

export default function AuthIndex() {
    const [tab, setTab] = useState('login');
    const loginForm = useForm({ email: 'juan@email.com', password: 'password123' });
    const registerForm = useForm({ name: '', email: '', password: '', password_confirmation: '' });

    return (
        <AppShell darkHero title="Login">
            <div className="flex min-h-[76vh] items-center justify-center">
                <div className="w-full max-w-md rounded-[30px] bg-white p-6 text-stone-900 shadow-[0_30px_120px_-40px_rgba(0,0,0,0.7)]">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black">✏️ SchoolStore</h1>
                        <p className="text-sm text-stone-500">Sign in to your account or create a new one.</p>
                    </div>

                    <div className="mt-6 grid grid-cols-2 rounded-full bg-stone-100 p-1">
                        <button className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === 'login' ? 'bg-white shadow' : ''}`} onClick={() => setTab('login')} type="button">
                            Login
                        </button>
                        <button className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === 'register' ? 'bg-white shadow' : ''}`} onClick={() => setTab('register')} type="button">
                            Register
                        </button>
                    </div>

                    {tab === 'login' ? (
                        <form className="mt-6 space-y-4" onSubmit={(event) => {
                            event.preventDefault();
                            loginForm.post('/login');
                        }}>
                            <FormField error={loginForm.errors.email} label="Email Address" onChange={(e) => loginForm.setData('email', e.target.value)} value={loginForm.data.email} />
                            <FormField error={loginForm.errors.password} label="Password" onChange={(e) => loginForm.setData('password', e.target.value)} type="password" value={loginForm.data.password} />
                            <button className="btn-dark w-full" disabled={loginForm.processing} type="submit">
                                Login
                            </button>
                        </form>
                    ) : (
                        <form className="mt-6 space-y-4" onSubmit={(event) => {
                            event.preventDefault();
                            registerForm.post('/register');
                        }}>
                            <FormField error={registerForm.errors.name} label="Full Name" onChange={(e) => registerForm.setData('name', e.target.value)} value={registerForm.data.name} />
                            <FormField error={registerForm.errors.email} label="Email Address" onChange={(e) => registerForm.setData('email', e.target.value)} value={registerForm.data.email} />
                            <FormField error={registerForm.errors.password} label="Password" onChange={(e) => registerForm.setData('password', e.target.value)} type="password" value={registerForm.data.password} />
                            <FormField
                                error={registerForm.errors.password_confirmation}
                                label="Confirm Password"
                                onChange={(e) => registerForm.setData('password_confirmation', e.target.value)}
                                type="password"
                                value={registerForm.data.password_confirmation}
                            />
                            <button className="btn-dark w-full" disabled={registerForm.processing} type="submit">
                                Create Account
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </AppShell>
    );
}
