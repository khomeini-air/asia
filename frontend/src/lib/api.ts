export interface Task {
  id?: number;
  taskName: string;
  title: string;
  description: string;
}

export interface CandidateTask {
  uuid?: string; // Changed from id
  email: string;
  firstName: string;
  lastName: string;
  taskId: number;
  taskName: string;
  duration: number;
  extraTime: number;
  submissionLink?: string;
  status?: string;
  startedAt?: string;
  submittedAt?: string;
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

export const getCandidateTasks = async (): Promise<CandidateTask[]> => {
  const response = await fetch(`${API_URL}/candidateTask`);
  return handleResponse<CandidateTask[]>(response);
};

export const createCandidateTask = async (candidateTask: CandidateTask): Promise<CandidateTask> => {
  const response = await fetch(`${API_URL}/candidateTask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(candidateTask),
  });
  // Special handling for 409 Conflict error
  if (response.status === 409) {
    throw new Error('Email already exists. Please use a different email.');
  }
  return handleResponse<CandidateTask>(response);
};

export const updateCandidateTask = async (id: string, candidateTask: CandidateTask): Promise<CandidateTask> => {
  const response = await fetch(`${API_URL}/candidateTask/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(candidateTask),
  });
  return handleResponse<CandidateTask>(response);
};

export const deleteCandidateTask = async (uuid: string): Promise<void> => {
  const response = await fetch(`${API_URL}/candidateTask/${uuid}`, {
    method: 'DELETE',
  });
  await handleResponse<void>(response);
};

export const getCandidateTaskByUuid = async (uuid: string): Promise<CandidateTask> => {
  const response = await fetch(`${API_URL}/candidateTask/${uuid}`);
  if (!response.ok) {
    throw new Error('Task not found or invalid link.');
  }
  return handleResponse<CandidateTask>(response);
};

export const getTaskDetails = async (id: number): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks/${id}`);
  return handleResponse<Task>(response);
};

export const startCandidateTask = async (uuid: string): Promise<void> => {
  const response = await fetch(`${API_URL}/candidateTask/${uuid}/start`, { method: 'POST' });
  if (response.status === 410) {
    throw new Error('This task has expired and can no longer be started.');
  }
  await handleResponse<void>(response);
};

interface SubmissionBody {
    submissionLink: string;
    comments: string;
    submittedAt: number;
}

export const submitCandidateTask = async (uuid: string, body: SubmissionBody): Promise<void> => {
    const response = await fetch(`${API_URL}/candidateTask/${uuid}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (response.status === 410) {
        throw new Error("Time is out. Your submission could not be processed.");
    }
    await handleResponse<void>(response);
};
