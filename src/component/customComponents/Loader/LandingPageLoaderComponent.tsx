import Lottie from 'lottie-react';
import LandingPageLoader from "../../../assets/Loader/LandingPageLoader.json";

const LandingPageLoaderComponent = () => {
    return(
        <div className="loaderContainer">
            <Lottie animationData={LandingPageLoader} style={{ width: "400px", height: "400px" }} />
        </div>
    )
}

export default LandingPageLoaderComponent;