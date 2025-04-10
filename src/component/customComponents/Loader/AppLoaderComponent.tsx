import Lottie from 'lottie-react';
import AppLoader from '../../../assets/Loader/AppLoader.json'

const AppLoaderComponent = () => {
    return(
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
         display: "flex", justifyContent: "center", alignItems: "center", zIndex:5, backdropFilter: "blur(8px)"}}>
            <Lottie animationData={AppLoader} style={{ width: 200, height: 200 }} />
        </div>
    )
}

export default AppLoaderComponent;
