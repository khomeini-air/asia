export interface Task {
  id?: number;
  shortName: string;
  title: string;
  description: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Helper function to handle fetch responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.statusText} - ${errorText}`);
  }
  // Handle cases with no content (like DELETE)
  if (response.status === 204 || response.headers.get("Content-Length") === "0") {
    return null as T;
  }
  return response.json();
}


export const getTasks = async (): Promise<Task[]> => {
  const response = await fetch(`${API_URL}/tasks`, {
    cache: 'no-store', // Ensures fresh data is fetched every time
  });
  return handleResponse<Task[]>(response);
};

export const createTask = async (task: Task): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  return handleResponse<Task>(response);
};

export const updateTask = async (id: number, task: Task): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  return handleResponse<Task>(response);
};

export const deleteTask = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
  await handleResponse<void>(response);
};