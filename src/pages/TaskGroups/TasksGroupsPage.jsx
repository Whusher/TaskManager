import { useEffect, useState } from "react";
import DasboardLayout from "../../layouts/DashboardLayout";
import { toast } from "react-toastify";
import { getGroupById, getGroupsByOwner, getTasksByGroup } from "../../services/groupService";
import { createTask, createTaskAssignedGroup } from "../../services/taskServices";

export default function TaskGroupsPage() {
    return <DasboardLayout child={<TaskGroups />} />;
}

const TaskGroups = () => {
    const [groups, setGroups] = useState([]);
    const [tasks, setTasks] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const emailUser = localStorage.getItem("email");
    const Username = localStorage.getItem("username");
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [updater, setUpdater] = useState(false);
    const [newTask, setNewTask] = useState({
        titulo: "",
        descripcion: "",
        categoria: "",
        status: "In progress",
        deadline: "",
        emailOwner: emailUser,
    });
    const setUpdaterF = ()=> setUpdater(prev=>!prev)

    useEffect(() => {
        const fetchGoruj = async(Username) =>{
            setLoading(true)
            try{
                 const res= await getGroupsByOwner(Username)
                 setGroups(res);
            }catch(e){

                setError(error.message);
            }finally{
                setLoading(false);

            }
        }
        if(selectedGroup){
            setInterval(()=>{
                fetchTasks(selectedGroup)
            },4000)
        }
        fetchGoruj(Username)
    }, [updater]);

    const fetchTasks = (groupId) => {
        getTasksByGroup(groupId)
            .then((data) => {
                console.log(data)
                // data = data.filter(dt => dt.taskGroup == groupId)
                setTasks((prev) => ({ ...prev, [groupId]: data }));
            });
    };

    const handleGroupClick = (group) => {
        if (group == selectedGroup) {
            setSelectedGroup(null)
            return;
        }

        setSelectedGroup(group);
        if (!tasks[group._id]) {
            fetchTasks(group._id);
        }
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold">Mis Grupos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groups.map((group) => (
                    <div key={group._id} className="bg-white p-4 rounded-lg shadow-md cursor-pointer" onClick={() => handleGroupClick(group)}>
                        <h3 className="text-lg font-semibold">{group.nombre}</h3>
                        <p className="text-gray-600">Owner: {group.owner}</p>
                        <p className="text-gray-500">Creado el: {new Date(group.creationGroupDate).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
            {selectedGroup && (
                <div className="mt-6">
                    <h3 className="text-xl font-bold">Tareas de {selectedGroup.nombre}</h3>
                    <div className="w-full">
                        <KanbanBoard tasks={tasks[selectedGroup._id] || []} updateAlltasks={setUpdater} />
                    </div>
                    {console.log(selectedGroup._id)}
                    <TaskForm groupId={selectedGroup._id} updateAlltasks={setUpdaterF} />
                </div>
            )}
        </div>
    );
};

const KanbanBoard = ({ tasks, updateTaskStatus, updateAlltasks }) => {
    const columns = [
        { name: "In progress", color: "bg-blue-200" },
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
                toast.error("Error al actualizar el estado de la tarea.")
                // Mostramos una alerta de error si la respuesta no es exitosa            
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
                                <h5 className="font-semibold">{task.titulo}</h5>
                                <p className="text-sm text-gray-600 truncate">{task.descripcion}</p>
                                <p className="text-xs text-gray-500">📅 {new Date(task.deadline).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {selectedTask && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-md w-96">
                        <h3 className="text-lg font-bold mb-2">{selectedTask.titulo}</h3>
                        <p className="text-sm mb-4">{selectedTask.descripcion}</p>
                        <p className="text-xs text-gray-500">📅 {new Date(selectedTask.deadline).toLocaleDateString()}</p>
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


const TaskForm = ({ groupId, updateAlltasks }) => {
    const [newTask, setNewTask] = useState({
        titulo: "",
        descripcion: "",
        deadline: "",
        emailOwner: "",
        categoria: "" // Campo de categoría libre
    });

    const [groupMembers, setGroupMembers] = useState([]); // Estado para los miembros

    useEffect(() => {
        const fetchGroupId = async(groupIdh)=>{
            console.log("Hello there",groupIdh)
            try{
                const data = await getGroupById(groupIdh);
                setGroupMembers(data.integrantes || [])
            }catch(e){
                console.log(e)
            }
        }
        if (groupId) {
            fetchGroupId(groupId);
        }
    }, [groupId]);

    const handleTaskCreate = () => {
        if (!newTask.titulo || !newTask.descripcion || !newTask.deadline || !newTask.emailOwner) {
            toast.warn("Todos los campos son obligatorios.");
            return;
        }
        console.log({ ...newTask, groupId: groupId, status: "In progress" })
        createTaskAssignedGroup({ ...newTask, groupId: groupId, status: "In progress" })
            .then((res) => {
                if(res){
                    toast.success("Tarea creada exitosamente");
                    updateAlltasks();
                }else{
                    toast.error("Error al crear la tarea")
                }
                setNewTask({ titulo: "", descripcion: "", deadline: "", emailOwner: "", categoria: "" }); // Reiniciar formulario
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
                value={newTask.titulo}
                onChange={(e) => setNewTask({ ...newTask, titulo: e.target.value })}
            />
            <textarea
                className="border p-2 w-full mt-2"
                placeholder="Descripción"
                value={newTask.descripcion}
                onChange={(e) => setNewTask({ ...newTask, descripcion: e.target.value })}
            ></textarea>
            <input
                className="border p-2 w-full mt-2"
                type="date"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
            />

            {/* Selección de asignado */}
            <select
                className="border p-2 w-full mt-2"
                value={newTask.emailOwner}
                onChange={(e) => setNewTask({ ...newTask, emailOwner: e.target.value })}
            >
                <option value="">Seleccionar asignado</option>
                {groupMembers.map((member,idx) => (
                    <option key={idx} value={member}>
                        {member}
                    </option>
                ))}
            </select>

            {/* Campo libre para categoría */}
            <input
                className="border p-2 w-full mt-2"
                type="text"
                placeholder="Categoría"
                value={newTask.categoria}
                onChange={(e) => setNewTask({ ...newTask, categoria: e.target.value })}
            />

            <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded" onClick={handleTaskCreate}>
                Crear Tarea
            </button>
        </div>
    );
};





