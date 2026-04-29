import api from '@/app/lib/api';

export interface WorklogPayload {
  date: string;
  taskTitle: string;
  taskDescription?: string;
  project?: string;
  hoursSpent: number;
  status: 'in progress' | 'in_progress' | 'completed' | 'blocked' | '';
}

export interface WorklogResponse {
  _id: string;
  employee: string;
  date: string;
  taskTitle: string;
  taskDescription: string;
  project: string | null;
  hoursSpent: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

function normalizeStatus(status: string | undefined): string | undefined {
  if (!status) return undefined;
  return status.trim().toLowerCase().replace(/\s+/g, '_');
}

function isObjectId(str: string | undefined): boolean {
  return !!str && /^[0-9a-fA-F]{24}$/.test(str);
}

function mapWorklog(w: WorklogResponse) {
  return {
    id: w._id,
    date: w.date.split('T')[0],
    title: w.taskTitle,
    description: w.taskDescription,
    project: w.project ?? '',
    hoursSpent: w.hoursSpent,
    status:
      w.status === 'completed'
        ? 'Completed'
        : w.status === 'in progress' || w.status === 'in_progress'
        ? 'In Progress'
        : 'Blocked',
  };
}

export async function getWorklogs() {
  const res = await api.get('/api/v1/worklogs');
  const list = (res.data?.data ?? []) as WorklogResponse[];
  return list.map(mapWorklog);
}

export async function addWorklog(payload: Omit<WorklogPayload, 'status'> & { status: string }) {
  const projectField = isObjectId(payload.project) ? payload.project : undefined;
  const normalizedStatus = normalizeStatus(payload.status);

  const res = await api.post('/api/v1/worklogs', {
    date: payload.date,
    taskTitle: payload.taskTitle,
    taskDescription: payload.taskDescription,
    project: projectField,
    hoursSpent: payload.hoursSpent,
    status: normalizedStatus,
  });
  return mapWorklog(res.data.data as WorklogResponse);
}

export async function editWorklog(id: string, payload: Partial<WorklogPayload> & { status?: string }) {
  const projectField = isObjectId(payload.project) ? payload.project : undefined;
  const normalizedStatus = payload.status ? normalizeStatus(payload.status) : undefined;

  const res = await api.put(`/api/v1/worklogs/${id}`, {
    date: payload.date,
    taskTitle: payload.taskTitle,
    taskDescription: payload.taskDescription,
    project: projectField,
    hoursSpent: payload.hoursSpent,
    status: normalizedStatus,
  });
  return mapWorklog(res.data.data as WorklogResponse);
}

export async function deleteWorklog(id: string) {
  await api.delete(`/api/v1/worklogs/${id}`);
  return true;
}

export async function getSummary(employeeId: string, date: string) {
  const res = await api.get('/api/v1/worklogs/summary', { params: { employeeId, date } });
  return res.data?.data;
}

export interface Project {
  _id: string;
  name: string;
}

export async function getProjects(): Promise<Project[]> {
  const res = await api.get('/api/v1/projects');
  return (res.data?.data ?? []) as Project[];
}
