import { useFormContext } from "react-hook-form";

interface InputType {
    type : string;
    name : "name" | "email" | "password" | "confirmPassword" | "adminKey" | "role";
    placeholder : string;
    classname? : string;
    options? : { label : string; value : string }[];
}

const InputField: React.FC<InputType> = ({ type, name, placeholder, options }) => {
    const { register, formState : { errors }, getValues } = useFormContext();

    const validation = {
        name : {
            required : "Name is required",
            pattern : { value : /^[A-Za-z\s]+$/, message: "Name must be only alphabets" },
            minLength : { value : 3, message : "Name must be at least 3 characters." }
        },
        email: {
            required : "Email is required",
            pattern : { value: /^[a-zA-Z0-9]+@+[A-Za-z]+\.+com$/, message: 'Email must be valid' }
        },
        password : {
            required: "Password is required",
            minLength: { value : 8, message : "Password must be at least 8 characters" },
            pattern: { value : /^(?=.*[!@#$%^&*(),.<>?])(?=.*[0-9])(?=.*[A-Z]).+$/, message: 'Password must be atleast 5 characters and atleast include a uppercase letter, a number, and a special character.' },
        },
        confirmPassword : {
            required: "Confirm Password is required",
            validate: (value: string) => value == getValues("password") || "Passwords do not match."
        },
        role : {
            required: "Role is required",
        },
        adminKey : {
            required: "Admin Key is required",
            validate: (value: string) => value == "admin123" || "Invalid Admin Key,Enter correct credentials."
        }
    };

    return(
        <div>
            {type === "radio" && options ? (
                <div className="radioGroup">
                    {options.map((option) => (
                        <label key={option.value} className="formRadio">
                            <input type="radio" {...register(name, validation[name])} value={option.value} />
                            {option.label}
                        </label>
                    ))}
                </div>
            ) : ( <input type={type} placeholder={placeholder}  className='formInput' {...register(name, validation[name])} />)}
            {errors?.[name] && <span className="formError">{errors[name]?.message as string}</span>}
        </div>
    );
};

export default InputField;
