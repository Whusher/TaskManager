import { api } from "./api"

export const loginUser = async(email, password) => {
    try{
        const response = await api.post("/auth/login", {email, password})
        console.log(response)
        if(response.status == 200){
            localStorage.setItem("email", email);
            localStorage.setItem("username",response.data.user.username)
            localStorage.setItem("role",response.data.user.role)
            localStorage.setItem("token", response.data.token)
            if(response.data.user.role == "admin"){
                localStorage.setItem("admin", "sjpoja66a6d4a5dwiy393h3uub")
            }
            return response.data;
        }else{
            return false;
        }
    }catch(e){
        console.log("Eroor del intercepppp" ,e)
        return false;
    }
}

export const registerUser = async(email,username,password)=>{
    try{
        const response = await api.post("/auth/register", {email,username,password})
        console.log(response)
        if(response.status == 201){
            return response.data;
        }else{
            return false;
        }
    }catch(e){
        console.log("Eroor del intercepppp" ,e)
        return false;
    }
}