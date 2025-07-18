import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password });
            console.log('Tentative de login avec :', email, password);
            console.log('Réponse backend:', res.data);

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.utilisateur.role);

            toast.success('Connexion réussie !');
            console.log('Réponse du serveur :', res.data);
            if (res.data.utilisateur.role === 'admin') navigate('/admin');
            else if (res.data.utilisateur.role === 'comptable') navigate('/admin');
            else navigate('/');
        } catch (error) {
            toast.error('Email ou mot de passe incorrect');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow w-96">
                <h2 className='text-2xl font-bold mb-4 text-center'>Connexion</h2>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full mb-3 p-2 border"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    className="w-full mb-3 p-2 border"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700">
                    Se connecter
                </button>
            </form>
        </div>
    )
};

export default Login;