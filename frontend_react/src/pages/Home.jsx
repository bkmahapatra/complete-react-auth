import { useAuth } from "../hooks/useAuth"

const Home = () => {
    const { token } = useAuth();

    return (
        <div>Home</div>
    )
}

export default Home