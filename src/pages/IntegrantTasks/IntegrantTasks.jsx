import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout"
import TaskCards from '../../layouts/CardsTasks';
import { toast } from "react-toastify";
import { getGroupsByOwner, getGroupsByUser, getTasksByGroup } from "../../services/groupService";


export default function IntegrantTasks() {
    return (
        <DashboardLayout child={<IntegrantView />} />
    )
}

function IntegrantView() {
    const [groups, setGroups] = useState([]);
    const [tasks, setTasks] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [show,setShow ] = useState(false);
    const emailUser = localStorage.getItem("email");
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [updater, setUpdater] = useState(false);
    useEffect(() => {
        setTimeout(()=>{
            setUpdater(prev =>!prev)
        }, 4000)
        getGroupsByUser(localStorage.getItem("username"))
            .then((data) => {
                console.log(data)
                setGroups(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
        if(selectedGroup){
            fetchTasks(selectedGroup._id)
        }
        return clearTimeout();
    }, [updater]);

    const updaterM = () => setUpdater(prev => !prev)

    const fetchTasks = (groupId) => {
        getTasksByGroup(groupId)
            .then((data) => {
                console.log(data)
                // data = data.filter(dt => dt.taskGroup == groupId)
                setTasks((prev) => ({ ...prev, [groupId]: data }));
            });
    };

    const handleGroupClick = (group) => {
        setUpdater(prev => !prev);
        setShow(prev => !prev);
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
    if (error) return <p className="text-center p-4 text-2xl">{error}</p>;
    return (
        <div className="flex flex-col justify-center items-center w-full h-auto  p-4">
            <h1 className="font-semibold text-2xl">Estas son las tareas asignadas para ti en tus grupos</h1>
            <div className="w-full flex overflow-x-scroll">
            {groups.map((group) => (
                    <div key={group._id} className="bg-white m-4 p-5 rounded-lg shadow-md shadow-sky-600 cursor-pointer" onClick={() => handleGroupClick(group)}>
                        <h3 className="text-lg font-semibold">{group.nombre}</h3>
                        <p className="text-gray-600">Owner: {group.owner}</p>
                        <p className="text-gray-500">Creado el: {new Date(group.creationGroupDate).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
            {/* My list*/}
              {  show
                   && 
                    <TaskCards tasks={tasks[selectedGroup._id]} updater={updaterM} isgroup={true}/>
              }
        </div>
    )
}
