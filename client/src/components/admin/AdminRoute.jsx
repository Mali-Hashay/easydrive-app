import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AdminRoute({children})
{
    const {user, loading} = useSelector(state=> state.auth);

    if (loading) 
        return <div>טוען...</div>;
    
    if (!user || user.role!=='admin')
        return <Navigate to="/" replace/>;

    return children;
       
}