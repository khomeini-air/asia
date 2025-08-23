"use client";
import { useState, useEffect, FormEvent } from "react";
import { getTasks, Task, createCandidateTask, getCandidateTasks, deleteCandidateTask, updateCandidateTask, CandidateTask } from "@/lib/api";
import Modal from "./Modal";

const initialFormState: Omit<CandidateTask, 'uuid' | 'submissionLink' | 'taskName'> & { taskId: number } = {
  email: "",
  firstName: "",
  lastName: "",
  taskId: 0,
  duration: 60,
  extraTime: 15,
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ApplicantManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [applicants, setApplicants] = useState<CandidateTask[]>([]);
  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New state for update modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApplicant, setEditingApplicant] = useState<CandidateTask | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [tasksResponse, applicantsResponse] = await Promise.all([getTasks(), getCandidateTasks()]);
      setTasks(tasksResponse);
      setApplicants(applicantsResponse);
      setError(null);
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // New input change handler for the edit form
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingApplicant) return;
    const { name, value } = e.target;
    setEditingApplicant({ ...editingApplicant, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    const selectedTask = tasks.find(task => task.id === Number(formData.taskId));
    if (!selectedTask) {
      setError("Please select a task.");
      return;
    }

    const newApplicantData: CandidateTask = {
      ...formData,
      taskId: Number(formData.taskId),
      taskName: selectedTask.taskName,
      duration: Number(formData.duration),
      extraTime: Number(formData.extraTime)
    };

    try {
      setError(null);
      await createCandidateTask(newApplicantData);
      setFormData(initialFormState);
      fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to add applicant.");
    }
  };

  const handleDelete = async (uuid: string) => {
    if (window.confirm("Are you sure you want to delete this applicant assignment?")) {
      try {
        await deleteCandidateTask(uuid);
        fetchData();
      } catch (err) {
        setError("Failed to delete applicant assignment.");
      }
    }
  };

  const copyUrlToClipboard = (uuid: string) => {
    const url = `${window.location.origin}/candidate/task/${uuid}`;
    navigator.clipboard.writeText(url)
      .then(() => alert('URL copied to clipboard!'))
      .catch(() => alert('Failed to copy URL.'));
  };

  // New functions to handle update flow
  const handleUpdateClick = (applicant: CandidateTask) => {
    setEditingApplicant(applicant);
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingApplicant || !editingApplicant.uuid) return;

    const selectedTask = tasks.find(task => task.id === Number(editingApplicant.taskId));
    if (!selectedTask) {
        alert("Invalid task selected.");
        return;
    }

    const updatedData: CandidateTask = {
        ...editingApplicant,
        taskId: Number(editingApplicant.taskId),
        taskName: selectedTask.taskName,
        duration: Number(editingApplicant.duration),
        extraTime: Number(editingApplicant.extraTime),
    };

    try {
        await updateCandidateTask(editingApplicant.uuid, updatedData);
        setIsModalOpen(false);
        setEditingApplicant(null);
        fetchData();
    } catch (err) {
        alert("Failed to update applicant.");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        {/* Form Section */}
        <div className="p-6 bg-white rounded-lg shadow-md md:col-span-1">
          <h3 className="mb-4 text-xl font-semibold">Add New Applicant</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ... (existing form inputs) ... */}
            <div><label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label><input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"/></div>
            <div><label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label><input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"/></div>
            <div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"/></div>
            <div><label htmlFor="taskId" className="block text-sm font-medium text-gray-700">Assign Task</label><select name="taskId" value={formData.taskId} onChange={handleInputChange} required className="w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm"><option value={0} disabled>Select a task</option>{tasks.map(task => (<option key={task.id} value={task.id} title={task.title}>{task.taskName}</option>))}</select></div>
            <div><label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (minutes)</label><input type="number" name="duration" value={formData.duration} onChange={handleInputChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"/></div>
            <div><label htmlFor="extraTime" className="block text-sm font-medium text-gray-700">Extra Time (minutes)</label><input type="number" name="extraTime" value={formData.extraTime} onChange={handleInputChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"/></div>
            <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700">Add Applicant</button>
          </form>
        </div>

        {/* Applicant List Section */}
        <div className="p-6 bg-white rounded-lg shadow-md md:col-span-2">
          <h3 className="mb-4 text-xl font-semibold">Assigned Applicants</h3>
          {error && <p className="p-3 my-2 text-red-700 bg-red-100 rounded-md">{error}</p>}
          {isLoading ? (<p>Loading...</p>) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Task</th>
                    <th className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Duration</th>
                    <th className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Extra Time</th>
                    <th className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applicants.length > 0 ? applicants.map(applicant => {
                    // Find the full task object to get the title for the tooltip
                    const assignedTask = tasks.find(task => task.id === applicant.taskId);

                    return (
                      <tr key={applicant.uuid}>
                        <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{applicant.firstName} {applicant.lastName}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{applicant.email}</td>
                        <td
                          className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap"
                          title={assignedTask?.title || 'No title available'} // This adds the hover tooltip
                        >
                          {applicant.taskName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{applicant.duration} min</td>
                        <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{applicant.extraTime} min</td>
                        <td className="px-4 py-3 text-sm font-medium whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button onClick={() => copyUrlToClipboard(applicant.uuid!)} className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">Copy URL</button>
                            <button onClick={() => handleUpdateClick(applicant)} className="px-3 py-1 text-sm font-semibold text-white bg-yellow-500 rounded-md shadow-sm hover:bg-yellow-600">Update</button>
                            <button onClick={() => applicant.uuid && handleDelete(applicant.uuid)} className="px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700">Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan={6} className="px-4 py-4 text-sm text-center text-gray-500">No applicants have been added yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Update Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Update Applicant">
        {editingApplicant && (
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <input type="text" name="firstName" value={editingApplicant.firstName} onChange={handleEditInputChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"/>
            </div>
             <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input type="text" name="lastName" value={editingApplicant.lastName} onChange={handleEditInputChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"/>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" value={editingApplicant.email} readOnly className="w-full px-3 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md shadow-sm"/>
            </div>
             <div>
                <label htmlFor="taskId" className="block text-sm font-medium text-gray-700">Assign Task</label>
                <select name="taskId" value={editingApplicant.taskId} onChange={handleEditInputChange} required className="w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm">
                    {tasks.map(task => (<option key={task.id} value={task.id} title={task.title}>{task.taskName}</option>))}
                </select>
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
              <input type="number" name="duration" value={editingApplicant.duration} onChange={handleEditInputChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"/>
            </div>
            <div>
              <label htmlFor="extraTime" className="block text-sm font-medium text-gray-700">Extra Time (minutes)</label>
              <input type="number" name="extraTime" value={editingApplicant.extraTime} onChange={handleEditInputChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"/>
            </div>
            <div className="flex justify-end pt-4 space-x-2 border-t">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
              <button type="submit" className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Save Changes</button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
