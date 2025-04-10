import { useNavigate } from "react-router-dom";
import LandingPageLoaderComponent from "../../component/customComponents/Loader/LandingPageLoaderComponent";
import logo from "../../assets/logo.png"
import "./LandingPageStyle.scss"

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landingPage">
            <LandingPageLoaderComponent />
        <div className="contentContainer">
            <img src={logo} alt="Company Logo" />
            <h1>Welcome to Asset Management</h1>
            <p>Track and manage your assets efficiently!</p>
            <button className="loginButton" onClick={() => navigate('/login')}>Login</button>
        </div>
    </div>
    );
};

export default LandingPage;

