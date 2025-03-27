import { api } from "./api";

export const createGroup = async(groupOBJ)=>{
    try{
        console.log({...groupOBJ})
        const res = await api.post("/groups/groups",{...groupOBJ});
        if(res.status == 201 || res.status == 200){
            return true;
        }else{
            return false;
        }
    }catch(e){
        console.log(e)
        return false;
    }
}

export const getGroupsByOwner = async(owner) =>{
    owner = owner.trim()
    try{
        const res = await api.get(`/groups/groups/owner/${encodeURI(owner)}`)
        if(res.status==200){
            return res.data
        }else{
            return false;
        }
    }catch(e){
        console.log(e)
        return false;
    }
}
export const getGroupById = async(groupId) =>{
    groupId = groupId.trim();
    try{
        const res = await api.get(`/groups/groups/${encodeURIComponent(groupId)}`)
        if(res.status == 200){
            return res.data
        }else{
            return false;
        }
    }catch(e){
        console.log(e)
        return false;
    }
}

export const addNewMember =async (groupId, usernameMember) =>{
    try{
        const res = await api.put(`/groups/groups/${groupId}/add-member`,{
                newMember: usernameMember
        })
        if(res.status==200){
            return res.data
        }else{
            return false;
        }
    }catch(e){
        console.log(e)
        return false;
    }
}


export const getGroupsByUser = async(integrant) =>{
    try{
        const res = await api.get(`/groups/groups/member/${integrant}`)
        if(res.status == 200){
            return res.data;
        }else{
            return false;
        }
    }catch(e){
        console.log(e)
        return false;
    }
}
export const deleteGroup = async (groupId) => {
    try {
      const res = await api.delete(`/groups/groups/${groupId}`);
      if (res.status === 200) {
        return res.data;  // Si la eliminación fue exitosa, devolver el mensaje de éxito
      } else {
        return false;  // Si no fue exitosa, devolver false
      }
    } catch (e) {
      console.error(e);
      return false;  // Si ocurre un error, devolver false
    }
  };
  

export const getTasksByGroup = async(groupId) =>{
    try{
        const res = await api.get(`/tasks/tasks/group/${encodeURI(groupId)}`)
        if(res.status == 200){
            return res.data;
        }else{
            return false;
        }
    }catch(e){
        console.log(e)
        return false;
    }
}