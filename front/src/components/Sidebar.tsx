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
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
      isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
    }`;

  return (
    <aside className="w-64 bg-white h-screen border-r shadow-sm flex flex-col justify-between">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
          {role === 'admin' ? 'Dashboard Admin' : 'Dashboard Comptable'}
        </h2>
        <nav className="space-y-1">
          {role === 'admin' && (
            <>
              <NavLink to="/admin" className={linkClass}>
                <Home size={18} /> Tableau de Bord
              </NavLink>
              <NavLink to="/admin/users" className={linkClass}>
                <Users size={18} /> Utilisateurs
              </NavLink>
              <NavLink to="/eleves" className={linkClass}>
                <Users size={18} /> Élèves
              </NavLink>
              <NavLink to="/classes" className={linkClass}>
                <CheckCircle size={18} /> Classes
              </NavLink>
              <NavLink to="/matieres" className={linkClass}>
                <Book size={18} /> Matières
              </NavLink>
              <NavLink to="/admin-exports" className={linkClass}>
                <Bell size={18} /> Exports
              </NavLink>
              <NavLink to="/admin-settings" className={linkClass}>
                <Settings size={18} /> Paramètres
              </NavLink>
            </>
          )}
          {role === 'comptable' && (
            <>
              <NavLink to="/comptable" className={linkClass}>
                <Home size={18} /> Tableau de Bord
              </NavLink>
              <NavLink to="/paiements" className={linkClass}>
                <CheckCircle size={18} /> Paiements
              </NavLink>
              <NavLink to="/comptable-exports" className={linkClass}>
                <Bell size={18} /> Exports
              </NavLink>
              <NavLink to="/comptable-settings" className={linkClass}>
                <Settings size={18} /> Paramètres
              </NavLink>
            </>
          )}
        </nav>
      </div>

      <div className="p-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-md text-sm font-medium transition"
        >
          <LogOut size={18} /> Se déconnecter
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
