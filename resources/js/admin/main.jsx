import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './components/ui';
import '../../css/admin.css';

ReactDOM.createRoot(document.getElementById('admin')).render(
    <React.StrictMode>
        <BrowserRouter basename="/admin">
            <AuthProvider>
                <UIProvider>
                    <App />
                </UIProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
