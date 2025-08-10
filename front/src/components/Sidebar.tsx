import {
    Home,
    Users,
    CheckCircle,
    Bell,
    Settings,
    LogOut,
    Book
  } from 'lucide-react';
  import { NavLink, useNavigate } from 'react-router-dom';
  import { logout } from '../services/authService';
  
  const Sidebar = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');
  
    const handleLogout = () => {
      logout();
      navigate('/');

    };
  
    const linkClass =
      'flex items-center gap-2 text-gray-600 hover:text-blue-600 p-2 rounded';
  
    return (
      <aside className="w-63 bg-white p-5 shadow-md h-screen flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-700 mb-5 border-b border-gray-700">
            {role === 'admin' ? 'Dashboard Admin' : 'Dashboard Comptable'}
          </h2>
          <nav className="space-y-2">
            {role === 'admin' && (
              <>
                <NavLink to="/admin" className={linkClass}>
                  <Home size={20} /> Tableau de Bord
                </NavLink>
                <NavLink to="/admin/users" className={linkClass}>
                  <Users size={20} /> Utilisateurs
                </NavLink>
                <NavLink to="/classes" className={linkClass}>
                  <CheckCircle size={20} /> Classes
                </NavLink>
                <NavLink to="/eleves" className={linkClass}>
                  <Users size={20} /> Élèves
                </NavLink>
                <NavLink to="/matieres" className={linkClass}>
                  <Book size={20} /> Matières
                </NavLink>
                <NavLink to="/settings" className={linkClass}>
                  <Settings size={20} /> Paramètres
                </NavLink>
              </>
            )}
  
            {role === 'comptable' && (
              <>
                <NavLink to="/comptable" className={linkClass}>
                  <Home size={20} /> Tableau de Bord
                </NavLink>
                <NavLink to="/paiements" className={linkClass}>
                  <CheckCircle size={20} /> Paiements
                </NavLink>
                <NavLink to="/exports" className={linkClass}>
                  <Bell size={20} /> Exports
                </NavLink>
                <NavLink to="/settings" className={linkClass}>
                  <Settings size={20} /> Paramètres
                </NavLink>
              </>
            )}
          </nav>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 hover:text-red-600 p-2 mt-4">
          <LogOut size={20} /> Se déconnecter
        </button>
      </aside>
    );
  };
  
  export default Sidebar;
  