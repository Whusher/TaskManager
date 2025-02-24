import { useState } from "react";

const statusColors = {
  "Done": "bg-green-500",
  "In Progress": "bg-yellow-500",
  "Paused": "bg-red-500",
  "Revision": "bg-blue-500",
};

const stages = [
  "Done", "Paused", "In Progress", "Revision" 
]

export default function TaskCards({ tasks = [] }) {
  return (
    <div className="flex w-full min-h-screen rounded-md ">
      <div className= {`basis-1/4 p-2 ${statusColors["In Progress"]}rounded-md`}>In progress 
        {GetTasksByType(tasks, "In Progress")}
      </div>
      <div className= {`basis-1/4 p-2 ${statusColors["Done"]} rounded-md`}>Done
        {GetTasksByType(tasks, "Done")}
      </div>
      <div className= {`basis-1/4 p-2 ${statusColors["Paused"]} rounded-md`}>Paused
        {GetTasksByType(tasks, "Paused")}
      </div>
      <div className= {`basis-1/4 p-2 ${statusColors["Revision"]} rounded-md`}>Revision
        {GetTasksByType(tasks, "Revision")}
      </div>
    </div>
  );
}

function GetTasksByType(tasks, type) {
  const [hoveredTask, setHoveredTask] = useState(null);

  return (
    <>
      {tasks &&
        tasks
          .filter((obj) => obj.status === type)
          .map((task) => (
            <div
              key={task.id}
              className="bg-white shadow-lg cursor-pointer hover:scale-105 transition-all ease-in delay-75 hover:shadow-sky-600 shadow-sky-700/35 rounded-2xl p-6 border border-gray-200 mt-5"
              // onMouseEnter={() => setHoveredTask(task.id)}
              onClick={() => setHoveredTask(task.id)}
              onMouseLeave={() => setHoveredTask(null)}
            >
              <h3 className="text-xl font-semibold mb-2">{task.nameTask}</h3>
              <p className="text-gray-600 mb-4">{task.descriptionTask}</p>
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 text-white text-sm rounded-lg ${statusColors[task.status]}`}
                >
                  {task.status}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(task.deadLine).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-3">Category: {task.category}</p>

              {/* Menú de opciones visible solo si la tarea está en hover */}
              {hoveredTask === task.id && (
                <div className=" mt-5 bg-white rounded-md w-full p-2">
                  <ul className="text-sm text-gray-700">
                    <label>
                      Send to:
                    </label>
                    <ul>
                      {stages.filter(val => val != task.status).map((value, idx)=>{
                        return (
                          <li key={idx} className={`text-white font-semibold m-2 p-2  hover:text-black hover:bg-current/40 ${statusColors[value]} rounded-lg`}>
                            {value}
                          </li>
                        )
                        })
                      }
                    </ul>
                    <li className="p-1 hover:bg-gray-100 cursor-pointer">Edit</li>  
                    <li className="p-1 hover:bg-gray-100 cursor-pointer text-red-500">Delete</li>
                    <li className="p-1 hover:bg-gray-100 cursor-pointer">Details</li>
                  </ul>
                </div>
              )}
            </div>
          ))}
    </>
  );
}
