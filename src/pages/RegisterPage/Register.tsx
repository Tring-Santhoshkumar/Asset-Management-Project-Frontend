import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import InputField from "../../component/customComponents/InputField";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { REGISTERUSER } from "./RegisterApi";
import { toastAlert } from "../../component/customComponents/toastify";

interface FormType {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    adminKey: string;
}

const Register = () => {

    const navigate = useNavigate();
    const methods = useForm<FormType>({ mode : "onChange" });
    const { handleSubmit, watch } = methods;
    const userRole = watch("role","");
    const [register] = useMutation(REGISTERUSER);

    const onSubmit : SubmitHandler<FormType> = async (data) => {
        try {
            const { name, email, password, role } = data;
            // console.log("Data:",name,email,password,role);
            const response = await register({ variables: {name, email, password, role} });
            console.log("Registered User:", response.data);
            setTimeout(()=> {
                navigate('/login');
                toastAlert('success','Registration Successfull,please login using the same credentials');
            },200);
        }
        catch(err : any) {
            console.log(err);
        }
    }

    return (
        <FormProvider {...methods}>
            <div className="registerContainer">
                <div className="registerForm">
                    <h1 className="registerHeading">Register Page</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <InputField type="radio" name="role" options={[{ label: "User", value: "user" }, { label: "Admin", value: "admin" }]} placeholder=''/>
                        <InputField type="text" name="name" placeholder="Enter name" />
                        <InputField type="email" name="email" placeholder="Enter email" />
                        <InputField type="password" name="password" placeholder="Enter password" />
                        <InputField type="password" name="confirmPassword" placeholder="Confirm password" />
                        {userRole === "admin" && (
                            <InputField type="password" name="adminKey" placeholder="Enter Admin Key" />
                        )}
                        <button type="submit">Register {userRole}</button>
                    </form>
                    <p className="registerFormPara">Have an account? <span onClick={() => navigate('/login')}>Login</span></p>
                </div>
            </div>
        </FormProvider>
    );
};

export default Register;
