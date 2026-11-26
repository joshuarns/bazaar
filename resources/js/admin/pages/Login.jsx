import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Field, inputClass } from '../components/ui';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, login } = useAuth();
    const navigate = useNavigate();

    if (user) return <Navigate to="/" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            const status = err.response?.status;
            setError(
                status === 429 ? 'Demasiados intentos. Espera un minuto y vuelve a probar.'
                : status === 422 ? 'Email o contraseña incorrectos.'
                : 'No se pudo conectar. Inténtalo de nuevo.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white">
            <div className="hidden lg:flex flex-col justify-between bg-[#16161a] p-12 text-white">
                <span className="font-serif text-2xl tracking-[0.25em]">BAZAAR</span>
                <div>
                    <p className="font-serif text-4xl leading-tight max-w-md">Moda, belleza y cultura, escritas por tu equipo.</p>
                    <p className="mt-4 text-sm text-white/50">Panel de redacción</p>
                </div>
                <a href="/" className="text-sm text-white/50 hover:text-white">← Volver al sitio</a>
            </div>

            <div className="flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-sm">
                    <div className="lg:hidden text-center mb-10">
                        <span className="font-serif text-3xl tracking-[0.25em] text-gray-900">BAZAAR</span>
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Inicia sesión</h1>
                    <p className="mt-1 text-sm text-gray-500">Entra con el email y la contraseña de tu cuenta.</p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
                        {error && <div role="alert" className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}
                        <Field label="Email" htmlFor="email">
                            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" autoFocus required className={`${inputClass} h-11`} />
                        </Field>
                        <Field label="Contraseña" htmlFor="password">
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    required
                                    className={`${inputClass} h-11 pr-11`}
                                />
                                <button type="button" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700">
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                        </Field>
                        <Button type="submit" size="lg" loading={loading} disabled={!email || !password} className="w-full">
                            {loading ? 'Entrando…' : 'Entrar'}
                        </Button>
                    </form>
                    <p className="mt-8 text-xs text-gray-500">¿Olvidaste la contraseña? Pide a un administrador que te ponga una nueva desde «Usuarios».</p>
                </div>
            </div>
        </div>
    );
}
