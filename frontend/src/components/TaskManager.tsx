"use client";
import { useState, useEffect, FormEvent } from "react";
import { getTasks, createTask, updateTask, deleteTask, Task } from "@/lib/api";

const initialFormState: Task = {
  taskName: "",
  title: "",
  description: "",
};

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [formData, setFormData] = useState<Task>(initialFormState);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await getTasks();
      setTasks(response);
      setError(null);
    } catch (err) {
      setError("Failed to fetch tasks. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.taskName || !formData.title || !formData.description) {
        alert("Please fill all fields");
        return;
    }

    try {
        if (isEditing !== null) {
            await updateTask(isEditing, formData);
        } else {
            await createTask(formData);
        }
        resetForm();
        fetchTasks();
    } catch (err) {
        setError("Failed to save task.");
    }
  };

  const handleEdit = (task: Task) => {
    if (task.id) {
        setIsEditing(task.id);
        setFormData(task);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
        try {
            await deleteTask(id);
            fetchTasks();
        } catch (err) {
            setError("Failed to delete task.");
        }
    }
  };

  const resetForm = () => {
    setIsEditing(null);
    setFormData(initialFormState);
  };

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
      {/* Form Section */}
      <div className="p-6 bg-white rounded-lg shadow-md md:col-span-1">
        <h3 className="mb-4 text-xl font-semibold">{isEditing ? "Edit Task" : "Create New Task"}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="taskName" className="block text-sm font-medium text-gray-700">Task Name (max 15 char)</label>
            <input type="text" name="taskName" value={formData.taskName} onChange={handleInputChange} maxLength={15} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} required rows={5} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div className="flex items-center space-x-4">
            <button type="submit" className="px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">{isEditing ? "Update Task" : "Add Task"}</button>
            {isEditing && (<button type="button" onClick={resetForm} className="px-4 py-2 font-bold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>)}
          </div>
        </form>
      </div>

      {/* Task List Section */}
      <div className="p-6 bg-white rounded-lg shadow-md md:col-span-2">
        <h3 className="mb-4 text-xl font-semibold">Existing Tasks</h3>
        {error && <p className="p-3 my-2 text-red-700 bg-red-100 rounded-md">{error}</p>}
        {isLoading ? (<p>Loading tasks...</p>) : (
          <div className="space-y-4">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-800">{task.taskName} : <span className="text-sm font-normal text-gray-800">{task.title}</span></h4>
                      <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(task)} className="px-3 py-1 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600">Edit</button>
                      <button onClick={() => task.id && handleDelete(task.id)} className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600">Delete</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (<p className="text-gray-500">No tasks have been added yet.</p>)}
          </div>
        )}
      </div>
    </div>
  );
}
