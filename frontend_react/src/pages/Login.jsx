import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../api/api";

const Login = () => {
    const { setUserToken } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const { from } = location.state || { from: { pathname: "/" } };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = e.target[0].value;
        const password = e.target[1].value;

        const response = await api.post("/user/login", {
            email,
            password,
        });

        const data = response.data;


        if (response.status !== 200) {
            alert("Invalid credentials");
            return;
        }

        setUserToken(data.data.accessToken
            , data.data.refreshToken);
        navigate(from.pathname, { replace: true });
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <input type="submit" value="Login" />
        </form>
    )
}

export default Login