import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import DashboardAdmin from './pages/DashboardAdmin';



const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin" element={<DashboardAdmin/>} />
            </Routes>
        </BrowserRouter>
    )
};

export default AppRouter;
