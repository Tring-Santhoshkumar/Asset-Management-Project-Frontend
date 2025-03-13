import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import InputField from "../../component/customComponents/InputField";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGINUSER } from "./LoginApi";
import { jwtDecode } from "jwt-decode";
import { toastAlert } from "../../component/customComponents/toastify";
interface FormType {
    email: string;
    password: string;
}

const Login = () => {
    const navigate = useNavigate();
    const methods = useForm<FormType>({ mode : "onChange"});
    const { handleSubmit } = methods;
    const [login] = useMutation(LOGINUSER);

    const onSubmit: SubmitHandler<FormType> = async (data) => {
        try{
            const response = await login({ variables: data });
            const token : string = response.data.login;
            if(token == 'No User'){
                toastAlert('error','No user found with such email,Please First Register.');
            }
            else if(token == 'Invalid Password'){
                toastAlert('error','Invalid Password,Enter valid password!');
            }
            else if(token){
              localStorage.setItem("token", token);
              const decodedData : any = jwtDecode(token);
              localStorage.setItem("role", decodedData.role);
              if(decodedData.role == 'user') localStorage.setItem("userId",decodedData.id);
              navigate(decodedData.role == "admin" ? "/admin/dashboard" : "/users/dashboard");
              toastAlert('success','Login Successfull!!!');
            }
          }
          catch(error){
            console.error("Login Failed!", error);
          }
    };
    
    return (
        <FormProvider {...methods}>
            <div className="registerContainer">
                <div className="registerForm">
                    <h1 className="registerHeading">Login Page</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <InputField type="email" name="email" placeholder="Enter email" classname="formEmail" />
                        <InputField type="password" name="password" placeholder="Enter password" classname="formPassword" />
                        <button type="submit">Submit</button>
                    </form>
                    <p className="registerFormPara">New User? <span onClick={() => navigate('/')}>Register</span></p>
                </div>
            </div>
        </FormProvider>
    );
};

export default Login;
