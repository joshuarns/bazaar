import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Articles from './pages/Articles';
import ArticleForm from './pages/ArticleForm';
import Banners from './pages/Banners';
import Categories from './pages/Categories';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex h-screen items-center justify-center">Cargando...</div>;
    return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
    return (
        <Routes>
            <Route path="login" element={<Login />} />
            <Route
                element={
                    <ProtectedRoute>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Dashboard />} />
                <Route path="articles" element={<Articles />} />
                <Route path="articles/new" element={<ArticleForm />} />
                <Route path="articles/:id/edit" element={<ArticleForm />} />
                <Route path="banners" element={<Banners />} />
                <Route path="categories" element={<Categories />} />
            </Route>
        </Routes>
    );
}
