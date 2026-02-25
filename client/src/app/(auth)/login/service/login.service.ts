const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

export interface LoginPayload {
  email: string;
  password: string;
}

interface LoginApiResponse {
  accessToken: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: 'admin' | 'manager' | 'employee';
  };
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

export async function loginAndStoreProfile(payload: LoginPayload): Promise<LoginApiResponse> {
  const loginRes = await fetch(`${API}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const loginJson = await loginRes.json();
  if (!loginRes.ok || !loginJson?.success) {
    throw new Error(loginJson?.message || 'Invalid credentials. Please try again.');
  }

  const data = loginJson.data as LoginApiResponse;

  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('user', JSON.stringify(data.user));

  try {
    const profileRes = await fetch(`${API}/employees`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${data.accessToken}`,
      },
    });

    if (profileRes.ok) {
      const profileJson = await profileRes.json();
      const list = (profileJson?.data ?? []) as EmployeeApi[];
      const current =
        list.find((item) => item.id === data.user.id) ??
        list.find((item) => item.email === data.user.email);

      if (current) {
        localStorage.setItem(
          'profileData',
          JSON.stringify({
            fullName: current.fullName,
            email: current.email,
            phoneNumber: current.phoneNumber ?? '',
            department: current.department,
            designation: current.designation,
            dateOfJoining: current.dateOfJoining,
            employeeId: current.employeeId,
            role: current.role,
            status: current.status,
            profilePicture: current.profilePicture,
          })
        );
      }
    }
  } catch {
  }

  return data;
}
