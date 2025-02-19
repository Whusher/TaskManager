import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import DashboardLayout from '../../layouts/DashboardLayout';
import { CloseSVG, PlusSVG } from '../../helpers/SVGExporter';
import TaskCards from '../../layouts/CardsTasks';

function Dashboard() {
  const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para controlar la visibilidad del modal
  const [taskData, setTaskData] = useState({
    nameTask: '',
    descriptionTask: '',
    deadline: '',
    status: 'In Progress',
    category: '',
  });
  const [error, setError] = useState('');
  const [mytasks, setMyTasks] = useState([]);

  // Función para manejar el cierre del modal
  const closeModal = () => {
    setModalIsOpen(false);
    setTaskData({
      nameTask: '',
      descriptionTask: '',
      deadline: '',
      status: 'In Progress',
      category: '',
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
    if (!taskData.nameTask || !taskData.descriptionTask || !taskData.deadline || !taskData.category) {
      setError('Please fill all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5260/api/MongoDB/createTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Suponiendo que el token JWT se guarda en localStorage
        },
        body: JSON.stringify({
          NameTask: taskData.nameTask,
          DescriptionTask: taskData.descriptionTask,
          DeadLine: new Date(taskData.deadline),
          Status: taskData.status,
          Category: taskData.category,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        setError(errorMessage);
        return;
      }

      alert('Task created successfully!');
      closeModal(); // Cerrar el modal después de crear la tarea
    } catch (error) {
      setError('Something went wrong. Please try again later.');
    }
  };

  useEffect(()=>{
    const fetchTasks = async() =>{
      try{
        const res = await fetch(`http://localhost:5260/api/MongoDB/getTasks`,
          {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              "Authorization" : `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        )
        const data = await res.json();
        console.log(data);
        setMyTasks(data)
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
        className="fixed bottom-8 right-8 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
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
        // isOpen={modalIsOpen}
        // onRequestClose={closeModal}
        // contentLabel="Create Task"
        // className="modal-content"
        // overlayClassName="modal-overlay"
      >
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Create Task</h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm">Name of Task</label>
              <input
                type="text"
                name="nameTask"
                value={taskData.nameTask}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm">Description</label>
              <textarea
                name="descriptionTask"
                value={taskData.descriptionTask}
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
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                <option value="Paused">Paused</option>
                <option value="Revision">Revision</option>
              </select>
            </div>

            <div>
              <label className="block text-sm">Category</label>
              <input
                type="text"
                name="category"
                value={taskData.category}
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
