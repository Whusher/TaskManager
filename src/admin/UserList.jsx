import { useEffect, useState } from "react";
import Mountains from "../assets/Glorious-blue-mountain-range.jpg";
import { Link, useNavigate } from "react-router-dom";
import { getUsers, updateUser,deleteUser } from "../services/adminService";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [change, setChange] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(res);
      } catch (e) {
        console.log(e);
      }
    };
    fetchUsers();
  }, [change]);

  const handleRoleChange = async (id, newRole, user) => {
    const updatedUser = { ...user, role: newRole };
    delete updatedUser.password; // Eliminar la contraseña antes de enviar
  
    try {
      await updateUser(id, updatedUser);
      toast.success("Usuario actualizado");
      setUsers(
        users.map((user) =>
          user._id === id ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Error actualizando rol", error);
      toast.error("No se pudo actualizar el usuario");
    }
  };
  

  const handleDelete = async (id) => {
    try{
        const res = await deleteUser(id);
        if(res){
            toast.success("Usuario eliminado correctamente");
            setChange(prev => !prev)
        }else{
            toast.error("Error al eliminar al usuario")
        }
    }catch(e){
        console.log(e)
        toast.error("Error al eliminar al usuario")
    }
  }

  const Logout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div
      className="absolute top-0 bg-sky-200 left-0 w-full h-screen flex items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${Mountains})` }}
    >
      <div className="container mx-auto p-6 ">
        <h2 className="text-2xl font-bold mb-4">Usuarios</h2>
        <div className="flex w-full justify-around">
          <Link
            to="/create"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Crear Usuario
          </Link>
          <button
            onClick={Logout}
            className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded"
          >
            Salir del panel Admin
          </button>
        </div>
        <table className="w-full mt-4 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Username</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Rol</th>
              <th className="border border-gray-300 px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {users &&
              users.map((user) => (
                <tr
                  key={user._id}
                  className="text-center border border-gray-300"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {user.username}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <select
                      disabled={
                        localStorage.getItem("username") == user.username
                          ? true
                          : false
                      }
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value, user)
                      }
                      className="cursor-pointer border border-gray-300 px-2 py-1 rounded"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Link
                      to={`/edit/${user._id}`}
                      className="text-blue-500 hover:underline mr-2"
                    >
                      Editar
                    </Link>
                    <button
                      disabled={
                        localStorage.getItem("username") == user.username
                          ? true
                          : false
                      }
                      onClick={()=>handleDelete(user._id)}
                      className={`cursor-pointer ${localStorage.getItem("username") == user.username ? 'text-gray-700' : 'text-red-500'}  hover:underline`}
                    >
                      {localStorage.getItem("username") == user.username ? 'No puedes eliminarte' : 'Eliminar'}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
