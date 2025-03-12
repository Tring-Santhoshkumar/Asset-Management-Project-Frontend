import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const toastAlert = (name: string,value: string) => {
    if(name == 'success'){
        toast.success(value);
    }
    else if(name == 'error'){
        toast.error(value);
    }
    else if(name == 'warning'){
        toast.warning(value);
    }
    else if(name == 'info'){
        toast.info(value);
    }
};