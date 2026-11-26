import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import PasswordField from '../components/PasswordField';
import { ROLES } from '../roles';
import { Button, Card, Field, PageHeader, inputClass as kitInput, useUI } from '../components/ui';

const inputClass = kitInput;

export default function UserForm() {
    const { id } = useParams();
    const isEditing = Boolean(id);
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: '', email: '', role: 'editor', password: '' });
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const { toast } = useUI();

    useEffect(() => {
        if (!isEditing) return;
        api.get(`/admin/users/${id}`)
            .then(({ data }) => setForm({ name: data.name, email: data.email, role: data.role, password: '' }))
            .catch(() => setError('No se pudo cargar el usuario.'))
            .finally(() => setLoading(false));
    }, [id]);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const submit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        setError('');
        try {
            const payload = { ...form };
            if (isEditing && !payload.password) delete payload.password;
            if (isEditing) await api.put(`/admin/users/${id}`, payload);
            else await api.post('/admin/users', payload);
            toast(isEditing ? 'Cambios guardados' : `${form.name} ya puede entrar al panel`);
            navigate('/users', { replace: true });
        } catch (err) {
            setErrors(Object.fromEntries(Object.entries(err.response?.data?.errors || {}).map(([k, v]) => [k, v[0]])));
            setError(err.response?.data?.errors ? 'Revisa los campos marcados.' : (err.response?.data?.message || 'No se pudo guardar.'));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-400 text-sm">Cargando…</div>;

    return (
        <form onSubmit={submit} className="max-w-2xl mx-auto" noValidate>
            <PageHeader
                back={{ to: '/users', label: 'Usuarios' }}
                title={isEditing ? `Editar a ${form.name || 'usuario'}` : 'Añadir usuario'}
                description={isEditing ? 'Cambia sus datos, su rol o ponle una contraseña nueva.' : 'Crea una cuenta para alguien del equipo.'}
            />

            {error && <div role="alert" className="mb-4 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}

            <Card>
            <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                        <label htmlFor="name" className="block text-xs font-medium text-gray-600 mb-1.5">Nombre</label>
                        <input id="name" value={form.name} onChange={e => set('name', e.target.value)} autoFocus={!isEditing} className={inputClass} />
                        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
                        <input id="email" type="email" value={form.email} onChange={e => set('email', e.target.value)} autoComplete="off" className={inputClass} />
                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                    </div>
                </div>

                <fieldset>
                    <legend className="block text-xs font-medium text-gray-600 mb-2">Rol</legend>
                    <div className="grid sm:grid-cols-2 gap-3">
                        {Object.entries(ROLES).map(([key, r]) => (
                            <label
                                key={key}
                                className={`block cursor-pointer rounded-lg border p-4 transition-colors ${form.role === key ? 'border-gray-900 ring-1 ring-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <span className="flex items-center gap-2">
                                    <input type="radio" name="role" value={key} checked={form.role === key} onChange={() => set('role', key)} />
                                    <span className="text-sm font-medium text-gray-800">{r.label}</span>
                                </span>
                                <span className="block mt-1 pl-5 text-xs text-gray-500">{r.description}</span>
                            </label>
                        ))}
                    </div>
                    {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role}</p>}
                </fieldset>

                <div>
                    <label htmlFor="password" className="block text-xs font-medium text-gray-600 mb-1.5">
                        {isEditing ? 'Nueva contraseña' : 'Contraseña'}
                    </label>
                    <PasswordField
                        id="password"
                        value={form.password}
                        onChange={v => set('password', v)}
                        placeholder={isEditing ? 'Déjala vacía para no cambiarla' : 'Mínimo 8 caracteres'}
                    />
                    {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                    {!isEditing && <p className="mt-1 text-xs text-gray-500">Compártela con la persona por un canal seguro; podrá cambiarla en «Mi perfil».</p>}
                </div>
            </div>
            </Card>

            <div className="flex gap-2 mt-6">
                <Button type="submit" loading={saving}>{isEditing ? 'Guardar cambios' : 'Crear usuario'}</Button>
                <Button variant="secondary" onClick={() => navigate('/users')}>Cancelar</Button>
            </div>
        </form>
    );
}
