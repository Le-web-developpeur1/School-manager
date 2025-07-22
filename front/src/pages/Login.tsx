import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await login({ email, password });
            console.log('Tentative de login avec :', email, password);
            console.log('Réponse backend:', res.data);

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.utilisateur.role);

            console.log('Réponse du serveur :', res.data);

            toast.success(res.data.message || 'Connexion réussie !');
            if (res.data.utilisateur.role === 'admin') {
                setTimeout(() => {
                    setLoading(false);
                    navigate('/admin');
                }, 2000);
            }
            else if (res.data.utilisateur.role === 'comptable') {
                setTimeout(() => {
                    navigate('/admin');
                    setLoading(false);
                },2000);
            }
            else navigate('/');
        } catch (error) {
            setTimeout(() => {
                toast.error('Email ou mot de passe incorrect');
                console.error(error);
                setLoading(false);
            },1000)
            
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
                 <button 
                            type="submit"
                            className="w-full py-3 mt-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 flex justify-center items-center"
                            disabled={loading}
                    >
                       {loading ? (
                            <span className="border-t-2 border-white border-solid w-5 h-5 rounded-full animate-spin"></span>
                        ) : (
                            "Se connecter"
                        )}
                    </button>
            </form>
        </div>
    )
};

export default Login;