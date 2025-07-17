import { Navigate, Outlet } from "react-router-dom";


function PrivateRoute() {
    const token = localStorage.getItem("token"); // Celà vérifie si le token existe
    return token ? <Outlet/> : <Navigate to="/login" />;
  };
  
  export default PrivateRoute;