const BASE_URL = 'http://localhost:5000/api/v1/worklogs';

function getToken() {
  return localStorage.getItem('accessToken') || '';
}

function getHeaders() {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export interface WorklogPayload {
  date: string;
  taskTitle: string;
  taskDescription?: string;
  // project should be the **id** of the project (ObjectId string)
  // the form was previously sending project *name*; the backend
  // expects an ObjectId, so we validate it here and drop non‑ids.
  project?: string;
  hoursSpent: number;
  // status may arrive in several formats, the service will normalize
  // before sending to API.  We accept either spaced or underscore
  // forms so that both UI and Postman payloads compile.
  status: 'in progress' | 'in_progress' | 'completed' | 'blocked' | '';
}

export interface WorklogResponse {
  _id: string;
  employee: string;
  date: string;
  taskTitle: string;
  taskDescription: string;
  project: string | null; // will be ObjectId or null
  hoursSpent: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

// convert a status string from whatever the UI provides into the
// backend's expected underscore lowercase form.
function normalizeStatus(status: string | undefined): string | undefined {
  if (!status) return undefined;
  return status.trim().toLowerCase().replace(/\s+/g, '_');
}
// quick check for a 24‑character hex string (Mongo ObjectId)
function isObjectId(str: string | undefined): boolean {
  return !!str && /^[0-9a-fA-F]{24}$/.test(str);
}
export async function getWorklogs() {
  const res = await fetch(BASE_URL, { headers: getHeaders() });
  const body = await handleResponse(res);
  // body.data is an array of worklogs
  return (body.data as WorklogResponse[]).map((w) => ({
    id: w._id,
    date: w.date.split('T')[0],
    title: w.taskTitle,
    description: w.taskDescription,
    project: w.project,
    hoursSpent: w.hoursSpent,
    status:
      w.status === 'completed'
        ? 'Completed'
        : w.status === 'in progress' || w.status === 'in_progress'
        ? 'In Progress'
        : 'Blocked',
  }));
}

export async function addWorklog(payload: Omit<WorklogPayload, 'status'> & { status: string }) {
  // only send project if it looks like a valid ObjectId; otherwise
  // drop it (frontend often passes a human name from a static list).
  const projectField = isObjectId(payload.project) ? payload.project : undefined;
  const normalizedStatus = normalizeStatus(payload.status);

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      date: payload.date,
      taskTitle: payload.taskTitle,
      taskDescription: payload.taskDescription,
      project: projectField,
      hoursSpent: payload.hoursSpent,
      status: normalizedStatus,
    }),
  });
  const body = await handleResponse(res);
  const w = body.data as WorklogResponse;
  return {
    id: w._id,
    date: w.date.split('T')[0],
    title: w.taskTitle,
    description: w.taskDescription,
    project: w.project || '',
    hoursSpent: w.hoursSpent,
    status:
      w.status === 'completed'
        ? 'Completed'
        : w.status === 'in progress' || w.status === 'in_progress'
        ? 'In Progress'
        : 'Blocked',
  };
}

export async function editWorklog(id: string, payload: Partial<WorklogPayload> & { status?: string }) {
  const projectField = isObjectId(payload.project) ? payload.project : undefined;
  const normalizedStatus = payload.status ? normalizeStatus(payload.status) : undefined;

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({
      date: payload.date,
      taskTitle: payload.taskTitle,
      taskDescription: payload.taskDescription,
      project: projectField,
      hoursSpent: payload.hoursSpent,
      status: normalizedStatus,
    }),
  });
  const body = await handleResponse(res);
  const w = body.data as WorklogResponse;
  return {
    id: w._id,
    date: w.date.split('T')[0],
    title: w.taskTitle,
    description: w.taskDescription,
    project: w.project || '',
    hoursSpent: w.hoursSpent,
    status:
      w.status === 'completed'
        ? 'Completed'
        : w.status === 'in progress' || w.status === 'in_progress'
        ? 'In Progress'
        : 'Blocked',
  };
}

export async function deleteWorklog(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  await handleResponse(res);
  return true;
}

export async function getSummary(employeeId: string, date: string) {
  const url = new URL(`${BASE_URL}/summary`);
  url.searchParams.set('employeeId', employeeId);
  url.searchParams.set('date', date);
  const res = await fetch(url.toString(), { headers: getHeaders() });
  const body = await handleResponse(res);
  return body.data;
}

// convenience method for retrieving projects so forms can show real IDs
export interface Project {
  _id: string;
  name: string;
}

export async function getProjects(): Promise<Project[]> {
  const res = await fetch('http://localhost:5000/api/v1/projects', {
    headers: getHeaders(),
  });
  const body = await handleResponse(res);
  // backend returns items in body.data
  return body.data as Project[];
}
