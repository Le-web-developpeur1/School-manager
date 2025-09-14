import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import DashboardAdmin from './pages/DashboardAdmin';
import Sidebar from './components/Sidebar';
import UserPage from './pages/UserPage';
import ClassePage from './pages/ClassePage';
import ElevePage from './pages/ElevePage';
import MatieresPage from './pages/MatieresPage';
import DashboardComptable from './pages/DashboardComptable';
import PaiementsPage from './pages/PaiementsPage';
import AdminExportPage from './pages/AdminExportPage';
import SettingsPage from './pages/SettingsAdminPage';
import ComptableExportPage from './pages/ComptableExportPage';
import SettingsComptablePage from './pages/SettingsComptablePage';
import AdminProfil from './pages/AdminProfil';



const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin" element={<DashboardAdmin/>} />
            <Route path="/comptable" element={<DashboardComptable/>} />
            <Route path="/paiements" element={<PaiementsPage/>} />
            <Route path="/sidebar" element={<Sidebar/>} />
            <Route path="/admin/users" element={<UserPage />} />
            <Route path='/classes' element={<ClassePage/>} />
            <Route path='/eleves' element={<ElevePage/>} />
            <Route path='/matieres' element={<MatieresPage/>} />
            <Route path='/admin-exports' element={<AdminExportPage/>} />
            <Route path='/comptable-exports' element={<ComptableExportPage/>} />
            <Route path='/admin-settings' element={<SettingsPage/>} />
            <Route path='/comptable-settings' element={<SettingsComptablePage/>} />
            <Route path='/profil-utilisateur' element={<AdminProfil/>} />
            </Routes>
        </BrowserRouter>
    )
};

export default AppRouter;
