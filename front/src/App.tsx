import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import DashboardAdmin from './pages/DashboardAdmin';
import Sidebar from './components/Sidebar';
import UserPage from './pages/UserPage';
import ClassePage from './pages/ClassePage';
import ElevePage from './pages/ElevePage';
import MatieresPage from './pages/MatieresPage';



const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin" element={<DashboardAdmin/>} />
            <Route path="/sidebar" element={<Sidebar/>} />
            <Route path="/admin/users" element={<UserPage />} />
            <Route path='/classes' element={<ClassePage/>} />
            <Route path='/eleves' element={<ElevePage/>} />
            <Route path='/matieres' element={<MatieresPage/>} />
            </Routes>
        </BrowserRouter>
    )
};

export default AppRouter;
