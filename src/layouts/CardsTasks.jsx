
const statusColors = {
  "Done": "bg-green-500",
  "In Progress": "bg-yellow-500",
  "Paused": "bg-red-500",
  "Revision": "bg-blue-500",
};

export default function TaskCards({tasks = []}) {
  return (
    <>
      {tasks && tasks.map((task) => (
        <div
          key={task.id.timestamp}
          className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200"
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
        </div>
      ))}
    </>
  );
}
