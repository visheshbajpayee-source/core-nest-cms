const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

type AuthUser = { id?: string; email?: string };

export interface ProfileData {
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
  designation: string;
  dateOfJoining: string;
  employeeId: string;
  role: 'admin' | 'manager' | 'employee';
  status: 'active' | 'inactive';
  profilePicture?: string;
}

function normalizeProfile(employee: EmployeeApi): ProfileData {
  return {
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

  const user = getAuthUser(token);

  const response = await fetch(`${API}/employees`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Failed to load profile');
  }

  const list = (json.data ?? []) as EmployeeApi[];
  const current =
    (user.id ? list.find((item) => item.id === user.id) : undefined) ??
    (user.email ? list.find((item) => item.email === user.email) : undefined);

  if (!current) {
    throw new Error('Profile not found for logged in user');
  }

  const profile = normalizeProfile(current);
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

  const response = await fetch(`${API}/employees/${currentProfile.employeeId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      phoneNumber: updates.phoneNumber,
      profilePicture: updates.profilePicture,
    }),
  });

  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Failed to update profile');
  }

  const saved = json.data as EmployeeApi;

  const next: ProfileData = {
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

  localStorage.setItem('profileData', JSON.stringify(next));
  return next;
}
