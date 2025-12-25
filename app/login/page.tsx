"use client";

import { useState } from 'react';
import { useAuthContext } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { LogIn, UserPlus, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { signIn, signUp } = useAuthContext() as any; // Cast because context type is defined in hook
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await signIn(email, password);
                if (error) throw error;
                router.push('/');
            } else {
                const { error } = await signUp(email, password);
                if (error) throw error;
                setSuccess('¡Registro exitoso! Por favor revisa tu correo para confirmar tu cuenta.');
                setIsLogin(true);
            }
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error inesperado');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Background Decorations */}
            <div className="auth-bg-decor auth-bg-decor-1"></div>
            <div className="auth-bg-decor auth-bg-decor-2"></div>

            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-icon-wrapper">
                        {isLogin ? <LogIn size={32} /> : <UserPlus size={32} />}
                    </div>
                    <h1 className="auth-title">
                        {isLogin ? 'Bienvenido de nuevo' : 'Crear cuenta'}
                    </h1>
                    <p className="auth-subtitle">
                        {isLogin
                            ? 'Ingresa tus credenciales para acceder'
                            : 'Regístrate para comenzar a controlar tus gastos'}
                    </p>
                </div>

                {error && (
                    <div className="auth-alert auth-alert-error">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <p>{error}</p>
                    </div>
                )}

                {success && (
                    <div className="auth-alert auth-alert-success">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <p>{success}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-input-group">
                        <label className="auth-input-label">Correo Electrónico</label>
                        <div className="auth-input-wrapper">
                            <span className="auth-input-icon">
                                <Mail size={18} />
                            </span>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="auth-input"
                                placeholder="correo@ejemplo.com"
                            />
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label className="auth-input-label">Contraseña</label>
                        <div className="auth-input-wrapper">
                            <span className="auth-input-icon">
                                <Lock size={18} />
                            </span>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="auth-input"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-auth"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError(null);
                            setSuccess(null);
                        }}
                        className="auth-toggle-btn"
                    >
                        {isLogin
                            ? '¿No tienes una cuenta? Regístrate aquí'
                            : '¿Ya tienes cuenta? Inicia sesión'}
                    </button>
                </div>
            </div>
        </div>
    );
}
