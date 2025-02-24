import { useEffect, useState } from "react";
import DasboardLayout from "../../layouts/DashboardLayout";

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

  const emailUser = localStorage.getItem("email");
  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      alert("El nombre del grupo no puede estar vacío.");
      return;
    }

    setCreating(true);

    const newGroup = {
      ownerGroup: emailUser,
      nameGroup: newGroupName,
      groupStatus: true,
    };

    try {
      const response = await fetch("http://localhost:5260/api/Groups/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGroup),
      });

      if (!response.ok) {
        throw new Error("Error al crear el grupo.");
      }

      const createdGroup = await response.json();
      setGroups([...groups, createdGroup]); // Agrega el nuevo grupo a la lista
      setNewGroupName("");
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Hubo un error al crear el grupo.");
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    fetch(`http://localhost:5260/api/Groups/GetGroupsByOwner/${encodeURIComponent(emailUser)}`)
      .then((response) => {
        if (!response.ok) throw new Error("Error al obtener los grupos");
        return response.json();
      })
      .then((data) => {
        setGroups(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const toggleGroupDetails = (group) => {
    setSelectedGroup(selectedGroup?.identifier === group.identifier ? null : group);
  };

  const handleAddMember = async (groupId) => {
    if (!newMemberEmail.trim()) {
      alert("Ingrese un email válido.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5260/api/Groups/AddIntegrantToGroup/${groupId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMemberEmail),
      });

      if (!response.ok) throw new Error("Error al agregar integrante.");

      alert("Integrante agregado correctamente.");
      setNewMemberEmail("");

      // Refrescar la lista de grupos
      const updatedGroups = groups.map((group) =>
        group.identifier === groupId
          ? { ...group, integrants: [...group.integrants, { email: newMemberEmail }] }
          : group
      );
      setGroups(updatedGroups);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este grupo?")) return;

    try {
      const response = await fetch(`http://localhost:5260/api/Groups/DeleteGroup/${groupId}`, {
        method: "POST", headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailUser)
      });

      if (!response.ok) throw new Error("Error al eliminar el grupo.");

      alert("Grupo eliminado correctamente.");
      setGroups(groups.filter((group) => group.identifier !== groupId));
      setSelectedGroup(null);
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Cargando...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (groups.length === 0) return <p className="text-center text-gray-500">No eres dueño de ningún grupo.</p>;

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


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((group) => (
          <div
            key={group.identifier}
            onClick={() => toggleGroupDetails(group)}
            className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition-all"
          >
            <h3 className="text-lg font-semibold">{group.nameGroup}</h3>
            <p className="text-gray-600">Owner: {group.ownerGroup}</p>
            <p className="text-gray-500">Creado el: {new Date(group.creationGroupDate).toLocaleDateString()}</p>
            <p
              className={`mt-2 px-2 py-1 inline-block text-sm rounded ${group.groupStatus ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
                }`}
            >
              {group.groupStatus ? "Activo" : "Inactivo"}
            </p>

            {/* Mostrar detalles del grupo si está seleccionado */}
            {selectedGroup?.identifier === group.identifier && (
              <div className="mt-4 p-2 border-t">
                <h4 className="font-semibold mb-2">Integrantes:</h4>
                {group.integrants && group.integrants.length > 0 ? (
                  <ul className="text-sm text-gray-700">
                    {group.integrants.map((member, index) => (
                      <li key={index} className="py-1">
                        {member.email}
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
                    placeholder="Email del nuevo integrante"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="flex-grow p-2 border rounded-md"
                  />
                  <button
                    onClick={() => handleAddMember(group.identifier)}
                    className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Agregar
                  </button>
                </div>

                {/* Botón para eliminar grupo */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteGroup(group.identifier);
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
