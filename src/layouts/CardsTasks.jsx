import { useState } from "react";
import { updateTask } from "../services/taskServices";
import { toast } from "react-toastify";

const statusColors = {
  "Done": "bg-green-500",
  "In progress": "bg-yellow-500",
  "Paused": "bg-red-500",
  "Revision": "bg-blue-500",
};

const stages = [
  "Done", "Paused", "In progress", "Revision" 
]

export default function TaskCards({ tasks = [] , isgroup = false, updater}) {
  // tasks = isgroup ? tasks.filter(task => task.taskGroup == null) : tasks.filter(task => task.taskGroup != null)  
  return (
    <div className="flex w-full min-h-screen rounded-md  space-x-2 text-white text-xl font-bold">
      <div className= {`basis-1/4 p-2 bg-amber-400 rounded-md`}>In progress 
        {GetTasksByType(tasks, "In progress", isgroup, updater)}
      </div>
      <div className= {`basis-1/4 p-2 ${statusColors["Done"]} rounded-md`}>Done
        {GetTasksByType(tasks, "Done", isgroup, updater)}
      </div>
      <div className= {`basis-1/4 p-2 ${statusColors["Paused"]} rounded-md`}>Paused
        {GetTasksByType(tasks, "Paused", isgroup, updater)}
      </div>
      <div className= {`basis-1/4 p-2 ${statusColors["Revision"]} rounded-md`}>Revision
        {GetTasksByType(tasks, "Revision", isgroup, updater)}
      </div>
    </div>
  );
}

function GetTasksByType(tasks, type, showOwner, updater) {
  const [hoveredTask, setHoveredTask] = useState(null);
  const emailUser = localStorage.getItem("email")
  const handleUpdateTask = async(action, task) =>{
    console.log("hellooo")
    if(showOwner){
      //Validate if the person can move the task
      if(task.emailOwner == emailUser){
        task.status = action;
        // legitimate copy of the object
        const updatedTask = {...task}
        //drop id before submmit
        delete task._id;
        try{
          const res = await updateTask(updatedTask._id, task);
          console.log(res);
          // const res = await fetch(`http://localhost:5260/api/MongoDB/updateTaskGroup/${encodeURI(updatedTask.id)}`,{
          //   headers: {
          //     'Content-Type': 'application/json',
          //     'Authorization': `Bearer ${localStorage.getItem('token')}`, // Suponiendo que el token JWT se guarda en localStorage
          //   },
          //   method: "POST",
          //   body: JSON.stringify(task)
          // })
          if(res){
            toast.success("Task changed to: "+ action);
            updater();
          }
          else{
            toast.error("Error unable to change task status")
          }

        }catch(e){
          console.log(e);
        }

      }else{
        toast.error("You are not allowed to do that");
      }
    }else{
      task.status = action;
      // legitimate copy of the object
      const updatedTask = {...task}
      //drop id before submmit
      delete task._id;
      try{
        const res = await updateTask(updatedTask._id, task);
        console.log(res);
        // const res = await fetch(`http://localhost:5260/api/MongoDB/updateTaskGroup/${encodeURI(updatedTask.id)}`,{
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`, // Suponiendo que el token JWT se guarda en localStorage
        //   },
        //   method: "POST",
        //   body: JSON.stringify(task)
        // })
        if(res){
          toast.success("Task changed to: "+ action);
          updater();
        }
        else{
          toast.error("Error unable to change task status")
        }

      }catch(e){
        console.log(e);
      }
    }
  }

  return (
    <>
      {tasks &&
        tasks
          .filter((obj) => obj.status === type)
          .map((task) => (
            <div
              key={task._id}
              className="bg-white shadow-lg cursor-pointer hover:scale-105 text-black transition-all ease-in delay-75 hover:shadow-sky-600 shadow-sky-700/35 rounded-2xl p-6 border border-gray-200 mt-5"
              // onMouseEnter={() => setHoveredTask(task.id)}
              onClick={() => {
                  hoveredTask == task._id ? setHoveredTask(null) :setHoveredTask(task._id)
              }}
              //onMouseLeave={() => setHoveredTask(null)}
            >
              <h3 className="text-xl font-semibold mb-2">{task.titulo}</h3>
              {
                hoveredTask && hoveredTask == task._id &&
                  <p className="text-gray-600 text-sm mb-4">{task.descripcion}</p>
              }
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 text-white text-sm rounded-lg ${statusColors[task.status]}`}
                >
                  {task.status}
                </span>
                <span className="text-sm text-gray-500">
                  {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No due date"}
                </span>
              </div>
                {
                  showOwner &&
                  <span className="text-sm text-black font-semibold my-3">
                    Responsible:<br></br> {task.emailOwner}
                  </span>
                }
              <p className="text-xs text-gray-500 mt-3">Category: {task.categoria}</p>

              {/* Menú de opciones visible solo si la tarea está en hover */}
              {hoveredTask === task._id && (
                <div className=" mt-5 bg-white rounded-md w-full p-2">
                  <ul className="text-sm text-gray-700">
                    <label>
                      Send to:
                    </label>
                    <ul>
                      {stages.filter(val => val != task.status).map((value, idx)=>{
                        return (
                          <li key={idx} onClick={()=>handleUpdateTask(value, task)} className={`text-white font-semibold m-2 p-2  hover:text-black hover:bg-current/40 ${statusColors[value]} rounded-lg`}>
                            {value}
                          </li>
                        )
                        })
                      }
                    </ul>
                    {/* <li className="p-1 hover:bg-gray-100 cursor-pointer">Edit</li>  
                    <li className="p-1 hover:bg-gray-100 cursor-pointer text-red-500">Delete</li>
                    <li className="p-1 hover:bg-gray-100 cursor-pointer">Details</li> */}
                  </ul>
                </div>
              )}
            </div>
          ))
      }
    </>
  );
}
