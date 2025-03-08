import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ Component , isAdmin = false}) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando...</p>; // Para evitar parpadeos
  if(isAdmin){
    const validAdmin = localStorage.getItem("admin");
    if(validAdmin != null || validAdmin != undefined){
      return <Component /> ;
    }else{
      return <Navigate to="/login" replace />
    }
  }else{
    return user ? <Component /> : <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
