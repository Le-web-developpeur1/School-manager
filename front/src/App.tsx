import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import DashboardAdmin from './pages/DashboardAdmin';
import Sidebar from './components/Sidebar';



const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin" element={<DashboardAdmin/>} />
            <Route path="/sidebar" element={<Sidebar/>} />
            </Routes>
        </BrowserRouter>
    )
};

export default AppRouter;
