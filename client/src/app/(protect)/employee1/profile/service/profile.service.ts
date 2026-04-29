import api from '@/app/lib/api';

type AuthUser = { id?: string; email?: string };

export interface ProfileData {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  employeeId: string;
  role: 'admin' | 'manager' | 'employee';
  status: 'active' | 'inactive';
  profilePicture?: string;
}

interface EmployeeApi {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  department: string;
  departmentId?: string;
  designation: string;
  designationId?: string;
  dateOfJoining: string;
  employeeId: string;
  role: 'admin' | 'manager' | 'employee';
  status: 'active' | 'inactive';
  profilePicture?: string;
}

interface DepartmentApi {
  _id: string;
  name: string;
}

interface DesignationApi {
  _id: string;
  title: string;
}

const isObjectIdLike = (value?: string) => /^[a-fA-F0-9]{24}$/.test((value ?? '').trim());

function normalizeProfile(employee: EmployeeApi): ProfileData {
  return {
    id: employee.id,
    fullName: employee.fullName,
    email: employee.email,
    phoneNumber: employee.phoneNumber ?? '',
    department: employee.department,
    designation: employee.designation,
    dateOfJoining: employee.dateOfJoining,
    employeeId: employee.employeeId,
    role: employee.role,
    status: employee.status,
    profilePicture: employee.profilePicture,
  };
}

async function getDepartmentNameById(id: string): Promise<string | null> {
  try {
    const response = await api.get(`/api/v1/departments/${id}`);
    const data = (response.data?.data ?? null) as DepartmentApi | null;
    return data?.name ?? null;
  } catch { return null; }
}

async function getDesignationTitleById(id: string): Promise<string | null> {
  try {
    const response = await api.get(`/api/v1/designations/${id}`);
    const data = (response.data?.data ?? null) as DesignationApi | null;
    return data?.title ?? null;
  } catch { return null; }
}

async function hydrateReferenceNames(profile: ProfileData): Promise<ProfileData> {
  return hydrateReferenceNamesWithIds(profile, {});
}

async function hydrateReferenceNamesWithIds(
  profile: ProfileData,
  ids: { departmentId?: string; designationId?: string }
): Promise<ProfileData> {
  const next = { ...profile };

  const departmentLookupId = isObjectIdLike(next.department)
    ? next.department
    : (isObjectIdLike(ids.departmentId) ? ids.departmentId : undefined);

  if (departmentLookupId) {
    const departmentName = await getDepartmentNameById(departmentLookupId);
    if (departmentName) next.department = departmentName;
  }

  const designationLookupId = isObjectIdLike(next.designation)
    ? next.designation
    : (isObjectIdLike(ids.designationId) ? ids.designationId : undefined);

  if (designationLookupId) {
    const designationTitle = await getDesignationTitleById(designationLookupId);
    if (designationTitle) next.designation = designationTitle;
  }

  return next;
}

export function getStoredProfile(): ProfileData | null {
  const raw = localStorage.getItem('profileData');
  if (!raw) return null;

  try {
    return JSON.parse(raw) as ProfileData;
  } catch {
    return null;
  }
}

function parseUserFromToken(token: string): AuthUser {
  try {
    const payloadPart = token.split('.')[1];
    if (!payloadPart) return {};

    const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(normalized)) as {
      id?: string;
      sub?: string;
      email?: string;
    };

    return {
      id: decoded.id ?? decoded.sub,
      email: decoded.email,
    };
  } catch {
    return {};
  }
}

function getAuthUser(token: string): AuthUser {
  const userRaw = localStorage.getItem('user');
  if (!userRaw) {
    return parseUserFromToken(token);
  }

  try {
    const parsed = JSON.parse(userRaw) as AuthUser;
    if (parsed?.id || parsed?.email) return parsed;
    return parseUserFromToken(token);
  } catch {
    return parseUserFromToken(token);
  }
}

export async function fetchMyProfile(): Promise<ProfileData> {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

  if (!token) {
    throw new Error('Please login first.');
  }

  let json: any;
  try {
    const response = await api.get(`/api/v1/employees/me`);
    json = response.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to load profile');
  }

  if (!json.success) {
    throw new Error(json.message || 'Failed to load profile');
  }

  const employee = (json.data ?? {}) as EmployeeApi;
  const rawProfile = normalizeProfile(employee);
  const profile = await hydrateReferenceNamesWithIds(rawProfile, {
    departmentId: employee.departmentId,
    designationId: employee.designationId,
  });
  localStorage.setItem('profileData', JSON.stringify(profile));

  return profile;
}

export async function updateMyProfile(
  currentProfile: ProfileData,
  updates: Partial<ProfileData>
): Promise<ProfileData> {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('Please login again');
  }

  let json: any;
  try {
    const response = await api.put(`/api/v1/employees/${currentProfile.employeeId}`, {
      phoneNumber: updates.phoneNumber,
      profilePicture: updates.profilePicture,
    });
    json = response.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to update profile');
  }

  if (!json.success) {
    throw new Error(json.message || 'Failed to update profile');
  }

  const saved = json.data as EmployeeApi;

  const next: ProfileData = {
    id: saved.id ?? currentProfile.id,
    fullName: saved.fullName ?? currentProfile.fullName,
    email: saved.email ?? currentProfile.email,
    phoneNumber: saved.phoneNumber ?? updates.phoneNumber ?? currentProfile.phoneNumber,
    department: saved.department ?? currentProfile.department,
    designation: saved.designation ?? currentProfile.designation,
    dateOfJoining: saved.dateOfJoining ?? currentProfile.dateOfJoining,
    employeeId: saved.employeeId ?? currentProfile.employeeId,
    role: saved.role ?? currentProfile.role,
    status: saved.status ?? currentProfile.status,
    profilePicture: saved.profilePicture ?? updates.profilePicture ?? currentProfile.profilePicture,
  };

  const hydrated = await hydrateReferenceNamesWithIds(next, {
    departmentId: saved.departmentId,
    designationId: saved.designationId,
  });
  localStorage.setItem('profileData', JSON.stringify(hydrated));
  return hydrated;
}
