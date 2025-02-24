import { useEffect, useState } from "react";
import DasboardLayout from "../../layouts/DashboardLayout";

export default function TaskGroupsPage() {
    return <DasboardLayout child={<TaskGroups />} />;
}

const TaskGroups = () => {
    const [groups, setGroups] = useState([]);
    const [tasks, setTasks] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const emailUser = localStorage.getItem("email");
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [updater, setUpdater] = useState(false);
    const [newTask, setNewTask] = useState({
        nameTask: "",
        descriptionTask: "",
        category: "",
        status: "In Progress",
        deadLine: "",
        emailOwner: emailUser,
    });

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
    }, [updater]);

    const fetchTasks = (groupId) => {
        fetch(`http://localhost:5260/api/MongoDB/getTasksByGroupId/${groupId}`)
            .then((response) => response.json())
            .then((data) => {
                setTasks((prev) => ({ ...prev, [groupId]: data }));
            });
    };

    const handleGroupClick = (group) => {
        if (group == selectedGroup) {
            setSelectedGroup(null)
            return;
        }

        setSelectedGroup(group);
        if (!tasks[group.identifier]) {
            fetchTasks(group.identifier);
        }
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold">Mis Grupos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groups.map((group) => (
                    <div key={group.identifier} className="bg-white p-4 rounded-lg shadow-md cursor-pointer" onClick={() => handleGroupClick(group)}>
                        <h3 className="text-lg font-semibold">{group.nameGroup}</h3>
                        <p className="text-gray-600">Owner: {group.ownerGroup}</p>
                        <p className="text-gray-500">Creado el: {new Date(group.creationGroupDate).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
            {selectedGroup && (
                <div className="mt-6">
                    <h3 className="text-xl font-bold">Tareas de {selectedGroup.nameGroup}</h3>
                    <div className="w-full">
                        <KanbanBoard tasks={tasks[selectedGroup.identifier] || []} updateAlltasks={setUpdater}/>
                    </div>
                        <TaskForm groupId={selectedGroup.identifier}/>
                </div>
            )}
        </div>
    );
};

const KanbanBoard = ({ tasks, updateTaskStatus, updateAlltasks }) => {
    const columns = [
        { name: "In Progress", color: "bg-blue-200" },
        { name: "Done", color: "bg-green-200" },
        { name: "Revision", color: "bg-yellow-200" },
        { name: "Paused", color: "bg-red-200" }
    ];

    const [selectedTask, setSelectedTask] = useState(null);

    const handleTaskClick = (task) => {
        setSelectedTask(task);
    };

    const handleStatusChange = async (newStatus) => {
        if (selectedTask) {
            const { id, ...taskDataWithoutId } = selectedTask; // Excluimos el id
            const res = await fetch(`http://localhost:5260/api/MongoDB/updateTaskGroup/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({ ...taskDataWithoutId, status: newStatus }) // Añades todos los demás datos y el nuevo status
            });

            if (res.ok) {
                // Actualizamos el estado de las tareas y mostramos una alerta de éxito
                updateTaskStatus(id, newStatus);
                alert("Estado de la tarea actualizado exitosamente.");
                setSelectedTask(null);  // Cerramos el modal
                updateAlltasks();  // Actualizamos las tareas en el grupo
            } else {
                // Mostramos una alerta de error si la respuesta no es exitosa
                alert("Error al actualizar el estado de la tarea.");
            }
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
            {columns.map(({ name, color }) => (
                <div key={name} className={`p-4 rounded-md ${color}`}>
                    <h4 className="text-md font-bold mb-2">{name}</h4>
                    <div className="space-y-2">
                        {tasks.filter((task) => task.status === name).map((task) => (
                            <div 
                                key={task.id} 
                                className="p-3 bg-white shadow rounded-md cursor-pointer"
                                onClick={() => handleTaskClick(task)}
                            >
                                <h5 className="font-semibold">{task.nameTask}</h5>
                                <p className="text-sm text-gray-600 truncate">{task.descriptionTask}</p>
                                <p className="text-xs text-gray-500">📅 {new Date(task.deadLine).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {selectedTask && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-md w-96">
                        <h3 className="text-lg font-bold mb-2">{selectedTask.nameTask}</h3>
                        <p className="text-sm mb-4">{selectedTask.descriptionTask}</p>
                        <p className="text-xs text-gray-500">📅 {new Date(selectedTask.deadLine).toLocaleDateString()}</p>
                        <div className="flex space-x-2 mt-4">
                            {columns.map(({ name }) => (
                                <button 
                                    key={name} 
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm"
                                    onClick={() => handleStatusChange(name)}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md" onClick={() => setSelectedTask(null)}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};




const TaskForm = ({ groupId }) => {
    const [newTask, setNewTask] = useState({
      nameTask: "",
      descriptionTask: "",
      deadLine: "",
      emailOwner: "",
      category: "" // Campo de categoría libre
    });
  
    const [groupMembers, setGroupMembers] = useState([]); // Estado para los miembros
  
    useEffect(() => {
      if (groupId) {
        fetch(`http://localhost:5260/api/Groups/getGroupById/${groupId}`)
          .then((response) => {
            if (!response.ok) throw new Error("Error al obtener los miembros del grupo");
            return response.json();
          })
          .then((data) => {
            setGroupMembers(data.integrants || []); // Guardar los integrantes en el estado
          })
          .catch((error) => console.error("Error:", error));
      }
    }, [groupId]);
  
    const handleTaskCreate = () => {
      if (!newTask.nameTask || !newTask.descriptionTask || !newTask.deadLine || !newTask.emailOwner) {
        alert("Todos los campos son obligatorios.");
        return;
      }
  
      fetch(`http://localhost:5260/api/MongoDB/createTaskGroup?groupId=${groupId}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Suponiendo que el token JWT se guarda en localStorage
        },
        body: JSON.stringify({ ...newTask, taskGroup: groupId, status: "In Progress" }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Error al crear la tarea");
          return response.json();
        })
        .then(() => {
          alert("Tarea creada exitosamente");
          setNewTask({ nameTask: "", descriptionTask: "", deadLine: "", emailOwner: "", category: "" }); // Reiniciar formulario
        })
        .catch((error) => console.error("Error:", error));
    };
  
    return (
      <div className="mt-6">
        <h3 className="text-lg font-bold">Crear Nueva Tarea</h3>
        <input
          className="border p-2 w-full"
          type="text"
          placeholder="Nombre"
          value={newTask.nameTask}
          onChange={(e) => setNewTask({ ...newTask, nameTask: e.target.value })}
        />
        <textarea
          className="border p-2 w-full mt-2"
          placeholder="Descripción"
          value={newTask.descriptionTask}
          onChange={(e) => setNewTask({ ...newTask, descriptionTask: e.target.value })}
        ></textarea>
        <input
          className="border p-2 w-full mt-2"
          type="date"
          value={newTask.deadLine}
          onChange={(e) => setNewTask({ ...newTask, deadLine: e.target.value })}
        />
  
        {/* Selección de asignado */}
        <select
          className="border p-2 w-full mt-2"
          value={newTask.emailOwner}
          onChange={(e) => setNewTask({ ...newTask, emailOwner: e.target.value })}
        >
          <option value="">Seleccionar asignado</option>
          {groupMembers.map((member) => (
            <option key={member.email} value={member.email}>
              {member.username} ({member.email})
            </option>
          ))}
        </select>
  
        {/* Campo libre para categoría */}
        <input
          className="border p-2 w-full mt-2"
          type="text"
          placeholder="Categoría"
          value={newTask.category}
          onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
        />
  
        <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded" onClick={handleTaskCreate}>
          Crear Tarea
        </button>
      </div>
    );
  };
  
  



