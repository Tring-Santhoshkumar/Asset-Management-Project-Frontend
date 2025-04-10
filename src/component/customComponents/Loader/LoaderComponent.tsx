import Lottie from 'lottie-react';
import LoginLoader from '../../../assets/Loader/LoginLoader.json'

const LoaderComponent = () => {
    return(
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
         display: "flex", justifyContent: "center", alignItems: "center", backgroundColor:'white', zIndex:5}}>
            <Lottie animationData={LoginLoader} style={{ width: 200, height: 200 }} />
        </div>
    )
}

export default LoaderComponent;
