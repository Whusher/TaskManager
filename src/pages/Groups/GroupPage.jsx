import { useEffect, useState } from "react";
import DasboardLayout from "../../layouts/DashboardLayout";
import { toast } from "react-toastify";
import { addNewMember, createGroup, getGroupsByOwner, deleteGroup } from "../../services/groupService";

export default function GroupPageM() {
  return <DasboardLayout child={<OwnerGroups />} />;
}


const OwnerGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [creating, setCreating] = useState(false);
  const [updater, setUpdater] = useState(false);
  const Username = localStorage.getItem("username");

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      toast.warn("El nombre del grupo no puede estar vacío.");
      return;
    }

    setCreating(true);

    try {
      const res = await createGroup({
        owner: Username,
        nombre: newGroupName
      })
      if (res){
        toast.success("Grupo creado")
      }else{
        toast.error("Error al crear el grupo")
      }

      // Actualizar lista de grupos
      setUpdater(prev => !prev)
      setNewGroupName("");
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Hubo un error al crear el grupo.");
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    const fetchGroups = async() =>{
      const res = await getGroupsByOwner(Username);
      if(res){
        setGroups(res);
        setLoading(false);
      }else{
        setError("Sin grupos disponibles");
        setLoading(false);
      }
    }
    fetchGroups();
  }, [updater]);

  const toggleGroupDetails = (group) => {
    setSelectedGroup( group );
  };

  const handleAddMember = async (groupId) => {
    if (!newMemberEmail.trim()) {
      toast.error("Ingrese un username válido.");
      return;
    }

    try {
      const response = await addNewMember(groupId, newMemberEmail);
      if (!response) throw new Error("Error al agregar integrante.");

      toast.success("Integrante agregado correctamente.");
      setNewMemberEmail("");

      // Refrescar la lista de grupos
      setUpdater(prev => !prev)
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteGroup = async( id) => {
    console.log("hello", id)
    try{
      const res = await deleteGroup(id);
      if(res){
        setUpdater(prev => !prev)
        toast.success(`${res.message}`)
      }else{
      toast.error('Error al tratar de eliminar el grupo');
      }

    }catch(e){
      console.log(e)
      toast.error('Error al tratar de eliminar el grupo');
    }
  }

  if (loading) return <p className="text-center text-gray-500">Cargando...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold text-center mb-4">Mis Grupos</h2>
      {/* Botón para abrir el modal */}
      <div className="text-center mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700"
        >
          + Crear Grupo
        </button>
      </div>

      {groups.length === 0 && <p className="text-center text-gray-500">No eres dueño de ningún grupo.</p>}

      {error && <p className="text-center text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((group) => (
          <div
            key={group._id}
            onClick={() => toggleGroupDetails(group)} // Usar onClick en lugar de onMouseEnter/Leave
            className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition-all"
          >
            <h3 className="text-lg font-semibold">{group.nombre}</h3>
            <p className="text-gray-600">Owner: {group.owner}</p>
            <p
              className={`mt-2 px-2 py-1 inline-block text-sm rounded ${group.isActive ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
                }`}
            >
              {group.isActive ? "Activo" : "Inactivo"}
            </p>

            {/* Mostrar detalles del grupo si está seleccionado */}
            {selectedGroup?._id === group._id && (
              <div className="mt-4 p-2 border-t">
                <h4 className="font-semibold mb-2">Integrantes:</h4>
                {group.integrantes && group.integrantes.length > 0 ? (
                  <ul className="text-sm text-gray-700">
                    {group.integrantes.map((member, index) => (
                      <li key={index} className="py-1">
                        {member}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No hay integrantes.</p>
                )}

                {/* Agregar nuevo integrante */}
                <div className="mt-4 flex">
                  <input
                    type="email"
                    placeholder="Username del nuevo usuario"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="flex-grow p-2 border rounded-md"
                  />
                  <button
                    onClick={() => handleAddMember(group._id)}
                    className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Agregar
                  </button>
                </div>

                {/* Botón para eliminar grupo */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteGroup(group._id);
                  }}
                  className="mt-4 bg-red-600 text-white w-full px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Eliminar Grupo
                </button>
              </div>
            )}
          </div>
        ))}
        {/* Modal para ingresar el nombre del grupo */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Crear Nuevo Grupo</h3>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Nombre del grupo"
                className="w-full p-2 border rounded mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateGroup}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700"
                  disabled={creating}
                >
                  {creating ? "Creando..." : "Crear"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

