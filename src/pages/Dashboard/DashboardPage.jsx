import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import { useNavigate } from 'react-router';
import DashboardLayout from '../../layouts/DashboardLayout';
import { CloseSVG, PlusSVG } from '../../helpers/SVGExporter';
import TaskCards from '../../layouts/CardsTasks';
import { toast } from 'react-toastify';
import { getMyTasks, createTask } from '../../services/taskServices';

function Dashboard() {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para controlar la visibilidad del modal
  const [taskData, setTaskData] = useState({
    titulo: '',
    descripcion: '',
    deadline: '',
    status: 'In progress',
    categoria: '',
  });
  const [error, setError] = useState('');
  const [mytasks, setMyTasks] = useState([]);

  // Función para manejar el cierre del modal
  const closeModal = () => {
    setModalIsOpen(false);
    setTaskData({
      titulo: '',
      descripcion: '',
      deadline: '',
      status: 'In progress',
      categoria: '',
    });
    setError('');
  };

  // Función para manejar la apertura del modal
  const openModal = () => {
    setModalIsOpen(prev => !prev);
  };

  // Función para manejar el cambio en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!taskData.titulo || !taskData.descripcion || !taskData.deadline || !taskData.categoria) {
      setError('Please fill all fields.');
      return;
    }

    try {
      const response = await createTask(taskData);
      if (!response) {
        const errorMessage = "Try again later...";
        setError(errorMessage);
        return;
      }
      toast.success('Task created successfully!');
      closeModal(); // Cerrar el modal después de crear la tarea
    } catch (error) {
      setError('Something went wrong. Please try again later.');
    }
  };

  useEffect(()=>{
    const fetchTasks = async() =>{
      try{
        const data = await getMyTasks();
        if(!data){
          localStorage.clear();
          navigate('/')
        }
        else{
          setMyTasks(data)
        }
      }catch(e){
        console.log(e)
      }
    }
    fetchTasks();
  },[modalIsOpen])  

  return (
    <div className="relative">
      {/* Botón flotante para abrir el modal */}
      <button
        onClick={openModal}
        className="fixed bottom-8 right-8 cursor-pointer p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
      >
        { 
          modalIsOpen ?
          (
            CloseSVG()
          ):(

            PlusSVG()
          )
        }
      </button>

      {/* Modal de creación de tarea */}
      <div
        className={`${modalIsOpen? "block" :"hidden"}`}
      >
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Create Task</h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm">Name of Task</label>
              <input
                type="text"
                name="titulo"
                value={taskData.titulo}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm">Description</label>
              <textarea
                name="descripcion"
                value={taskData.descripcion}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm">Time until Finish / Remind me</label>
              <input
                type="datetime-local"
                name="deadline"
                value={taskData.deadline}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm">Status</label>
              <select
                name="status"
                value={taskData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="In progress">In progress</option>
                <option value="Done">Done</option>
                <option value="Paused">Paused</option>
                <option value="Revision">Revision</option>
              </select>
            </div>

            <div>
              <label className="block text-sm">Category</label>
              <input
                type="text"
                name="categoria"
                value={taskData.categoria}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-gray-400 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div> 
      {/* My list*/}
      <div className='w-full flex flex-col p-5 space-y-10'>
        <TaskCards tasks={mytasks}/>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div>
      {/* Contenedor para envolver toda la lógica */}
      <DashboardLayout child={<Dashboard />} />
    </div>
  );
}
