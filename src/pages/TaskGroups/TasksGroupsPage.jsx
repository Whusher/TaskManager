import { useEffect, useState, useCallback } from "react";
import DasboardLayout from "../../layouts/DashboardLayout";
import { toast } from "react-toastify";
import { getGroupById, getGroupsByOwner, getTasksByGroup } from "../../services/groupService";
import { createTaskAssignedGroup } from "../../services/taskServices";

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

    const fetchTasks = useCallback(async (groupId) => {
        try {
            const data = await getTasksByGroup(groupId);
            setTasks((prev) => ({ ...prev, [groupId]: data }));
        } catch (error) {
            toast.error("Error al cargar tareas");
        }
    }, []);

    useEffect(() => {
        const fetchGroups = async () => {
            setLoading(true);
            try {
                const res = await getGroupsByOwner(Username);
                setGroups(res);
            } catch (e) {
                setError(e.message);
                toast.error("Error al cargar grupos");
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, [Username]);

    const handleGroupClick = (group) => {
        setSelectedGroup(group === selectedGroup ? null : group);
        if (group && !tasks[group._id]) {
            fetchTasks(group._id);
        }
    };

    const updateTasksForGroup = (groupId) => {
        fetchTasks(groupId);
    };

    if (loading) return <p className="text-center text-xl mt-10">Cargando...</p>;
    if (error) return <p className="text-center text-red-500 mt-10">Error: {error}</p>;

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Mis Grupos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => (
                    <div 
                        key={group._id} 
                        className={`
                            bg-white p-5 rounded-xl shadow-lg transition-all duration-300
                            ${selectedGroup?._id === group._id 
                                ? 'border-2 border-blue-500 scale-105' 
                                : 'hover:shadow-xl hover:border-blue-200'}
                            cursor-pointer
                        `} 
                        onClick={() => handleGroupClick(group)}
                    >
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{group.nombre}</h3>
                        <p className="text-gray-600">Owner: {group.owner}</p>
                    </div>
                ))}
            </div>
            
            {selectedGroup && (
                <div className="mt-8 bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">
                        Tareas de {selectedGroup.nombre}
                    </h3>
                    <KanbanBoard 
                        tasks={tasks[selectedGroup._id] || []} 
                        groupId={selectedGroup._id}
                        updateTasksForGroup={updateTasksForGroup}
                    />
                    <TaskForm 
                        groupId={selectedGroup._id} 
                        updateTasksForGroup={updateTasksForGroup} 
                    />
                </div>
            )}
        </div>
    );
};

const KanbanBoard = ({ tasks, groupId, updateTasksForGroup }) => {
    const columns = [
        { name: "In progress", color: "bg-blue-100", textColor: "text-blue-800" },
        { name: "Done", color: "bg-green-100", textColor: "text-green-800" },
        { name: "Revision", color: "bg-yellow-100", textColor: "text-yellow-800" },
        { name: "Paused", color: "bg-red-100", textColor: "text-red-800" }
    ];

    const [selectedTask, setSelectedTask] = useState(null);

    const handleStatusChange = async (newStatus) => {
        if (selectedTask) {
            try {
                const { _id, ...taskData } = selectedTask;
                console.log(_id)
                const res = await fetch(`https://task-man-backend.vercel.app/api/tasks/tasks/${_id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                    body: JSON.stringify({ ...taskData, status: newStatus })
                });

                if (res.ok) {
                    toast.success("Estado de la tarea actualizado");
                    updateTasksForGroup(groupId);
                    setSelectedTask(null);
                } else {
                    toast.error("Error al actualizar el estado de la tarea");
                }
            } catch (error) {
                toast.error("Error en la solicitud",error);
            }
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
            {columns.map(({ name, color, textColor }) => (
                <div 
                    key={name} 
                    className={`p-4 rounded-lg ${color} min-h-[300px]`}
                >
                    <h4 className={`text-lg font-bold mb-4 ${textColor}`}>{name}</h4>
                    <div className="space-y-4">
                        {tasks.filter((task) => task.status === name).map((task) => (
                            <div
                                key={task.id}
                                className="p-4 bg-white shadow-md rounded-lg cursor-pointer hover:shadow-xl transition-all"
                                onClick={() => setSelectedTask(task)}
                            >
                                <h5 className="font-semibold text-gray-800 mb-1">{task.titulo}</h5>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{task.descripcion}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">📅 {new Date(task.deadline).toLocaleDateString()}</span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${textColor} ${color}`}>
                                        {name}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-[500px] max-w-full">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800">{selectedTask.titulo}</h3>
                        <p className="text-gray-600 mb-4">{selectedTask.descripcion}</p>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-gray-500">📅 {new Date(selectedTask.deadline).toLocaleDateString()}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            {columns.map(({ name }) => (
                                <button
                                    key={name}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                    onClick={() => handleStatusChange(name)}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                        <button 
                            className="mt-4 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors"
                            onClick={() => setSelectedTask(null)}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const TaskForm = ({ groupId, updateTasksForGroup }) => {
    const [newTask, setNewTask] = useState({
        titulo: "",
        descripcion: "",
        deadline: "",
        emailOwner: "",
        categoria: ""
    });

    const [groupMembers, setGroupMembers] = useState([]);

    useEffect(() => {
        const fetchGroupMembers = async () => {
            try {
                const data = await getGroupById(groupId);
                setGroupMembers(data.integrantes || []);
            } catch (error) {
                toast.error("Error al cargar miembros del grupo");
            }
        };

        if (groupId) {
            fetchGroupMembers();
        }
    }, [groupId]);

    const handleTaskCreate = async () => {
        if (!newTask.titulo || !newTask.descripcion || !newTask.deadline || !newTask.emailOwner) {
            toast.warn("Todos los campos son obligatorios.");
            return;
        }

        try {
            const taskData = { 
                ...newTask, 
                groupId: groupId, 
                status: "In progress" 
            };
            const res = await createTaskAssignedGroup(taskData);
            
            if (res) {
                toast.success("Tarea creada exitosamente");
                updateTasksForGroup(groupId);
                setNewTask({ titulo: "", descripcion: "", deadline: "", emailOwner: "", categoria: "" });
            } else {
                toast.error("Error al crear la tarea");
            }
        } catch (error) {
            toast.error("Error en la solicitud");
        }
    };

    return (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Crear Nueva Tarea</h3>
            <div className="space-y-4">
                <input
                    className="border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-blue-500"
                    type="text"
                    placeholder="Nombre de la tarea"
                    value={newTask.titulo}
                    onChange={(e) => setNewTask({ ...newTask, titulo: e.target.value })}
                />
                <textarea
                    className="border-2 border-gray-300 p-3 w-full rounded-lg h-24 focus:outline-none focus:border-blue-500"
                    placeholder="Descripción de la tarea"
                    value={newTask.descripcion}
                    onChange={(e) => setNewTask({ ...newTask, descripcion: e.target.value })}
                ></textarea>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        className="border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-blue-500"
                        type="date"
                        value={newTask.deadline}
                        onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                    />
                    <select
                        className="border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-blue-500"
                        value={newTask.emailOwner}
                        onChange={(e) => setNewTask({ ...newTask, emailOwner: e.target.value })}
                    >
                        <option value="">Seleccionar asignado</option>
                        {groupMembers.map((member, idx) => (
                            <option key={idx} value={member}>
                                {member}
                            </option>
                        ))}
                    </select>
                </div>
                <input
                    className="border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-blue-500"
                    type="text"
                    placeholder="Categoría"
                    value={newTask.categoria}
                    onChange={(e) => setNewTask({ ...newTask, categoria: e.target.value })}
                />
                <button 
                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={handleTaskCreate}
                >
                    Crear Tarea
                </button>
            </div>
        </div>
    );
};
