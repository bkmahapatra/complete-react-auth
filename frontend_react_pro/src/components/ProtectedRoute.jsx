import { useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    console.log(location)

    return children;
}

export default ProtectedRoute