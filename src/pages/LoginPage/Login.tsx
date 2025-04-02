import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import InputField from "../../component/customComponents/InputField";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGINUSER } from "./LoginApi";
import { jwtDecode } from "jwt-decode";
import { toastAlert } from "../../component/customComponents/toastify";
import { useState } from "react";
import LoaderComponent from "../../component/customComponents/Loader/LoaderComponent";
interface FormType {
    email: string;
    password: string;
}

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const methods = useForm<FormType>({ mode : "onChange"});
    const { handleSubmit } = methods;
    const [login] = useMutation(LOGINUSER);

    const onSubmit: SubmitHandler<FormType> = async (data) => {
        try{
            setLoading(true); 
            const response = await login({ variables: { email: data.email, password: data.password } });
            const token : string = response.data.login;
            if(token == 'No User'){
                toastAlert('error','No user found with such email,Please First Register.');
                setLoading(false);
                return;
            }
            else if(token == 'Invalid Password'){
                toastAlert('error','Invalid Password,Enter valid password!');
                setLoading(false);
                return;
            }
            else if(token == 'Inactive User'){
                toastAlert('error','You"re no longer a user who have access!');
                setLoading(false);
                return;
            }
            else if(token){
              localStorage.setItem("token", token);
              const decodedData : any = jwtDecode(token);
              localStorage.setItem("role", decodedData.role);
              if(decodedData.role == 'user') localStorage.setItem("userId",decodedData.id);
            setTimeout(() => {
                setLoading(false);
                if(decodedData.reset_password && decodedData.role == "user"){
                    navigate("/ChangePassword");
                    toastAlert("info", "Change Password");
                }
                else{
                    navigate(decodedData.role == "admin" ? "/admin/dashboard" : "/users/dashboard");
                    toastAlert("success", "Login Successful!!!");
                }
            }, 4000);
            }
          }
          catch(error){
            console.error("Login Failed!", error);
            setLoading(false);
            return;
          }
    };
    
    return (
        <>
        {loading && <LoaderComponent />}
        <FormProvider {...methods}>
            <div className="registerContainer">
                <div className="registerForm">
                    <h1 className="registerHeading">Login Page</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <InputField type="email" name="email" placeholder="Enter email" classname="formEmail" />
                        <InputField type="password" name="password" placeholder="Enter password" classname="formPassword" />
                        <button type="submit" className="loginSubmit">Submit</button>
                    </form>
                </div>
            </div>
        </FormProvider>
        </>
    );
};

export default Login;
