import { api } from "./api"

export const getMyTasks = async()=>{
    try{
        const response = await api.get(`/tasks/tasks/user/${localStorage.getItem("email")}`)
        console.log(response)
        if(response.status == 200){
            return response.data;
        }else{
            return false;
        }
    }catch(e){
        console.log("Eroor del intercepppp" ,e)
        return false;
    }
}

export const createTaskAssignedGroup = async(taskData)=>{
    try{
        const response = await api.post("/tasks/tasks",{
            emailOwner: taskData.emailOwner,
            groupId: taskData.groupId,
            titulo: taskData.titulo,
            descripcion: taskData.descripcion,
            deadline: new Date(taskData.deadline),
            status: taskData.status,
            categoria: taskData.categoria,
        })
        if(response.status==201){
            return true;
        }else{
            return false
        }
    }catch(e){
        console.log(e)
        return false;
    }
}

export const createTask = async(taskData)=>{
    try{
        const response = await api.post("/tasks/tasks",{
            emailOwner: localStorage.getItem("email"),
            titulo: taskData.titulo,
            descripcion: taskData.descripcion,
            deadline: new Date(taskData.deadline),
            status: taskData.status,
            categoria: taskData.categoria,
        })
        if(response.status==201){
            return true;
        }else{
            return false
        }
    }catch(e){
        console.log(e)
        return false;
    }
}

export const createTaskIntegrant = async(taskData)=>{
    try{
        const response = await api.post("/tasks/tasks",{
            emailOwner: taskData.emailOwner,
            titulo: taskData.titulo,
            descripcion: taskData.descripcion,
            deadline: new Date(taskData.deadline),
            status: taskData.status,
            categoria: taskData.categoria,
        })
        if(response.status==201){
            return true;
        }else{
            return false
        }
    }catch(e){
        console.log(e)
        return false;
    }
}

export const updateTask = async(taskId, taskObj ) =>{
    try{
        const response = await api.put(`/tasks/tasks/${encodeURI(taskId)}`,taskObj)
        console.log(response);
        if(response.status==200){
            return true
        }
        return false;
    }catch(e){
        console.log(e)
        return false;
    }
}