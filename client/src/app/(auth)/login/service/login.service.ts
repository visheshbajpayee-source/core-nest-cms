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

let role = "admin";

export async function loginAndStoreProfile(payload: LoginPayload): Promise<LoginApiResponse> {
  const loginRes = await fetch(`${API}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const loginJson = await loginRes.json();
  console.log("login json response - ", loginJson.data.user.role);
  role = loginJson.data.user.role;
  if (!loginRes.ok || !loginJson?.success) {
    throw new Error(loginJson?.message || 'Invalid credentials. Please try again.');
  }

  const data = loginJson.data as LoginApiResponse;

  localStorage.setItem('accessToken', data.accessToken);
  // localStorage.setItem('user', JSON.stringify(data.user));

  // Fetch full profile data using /me endpoint (works for all users)
  try {
    const profileRes = await fetch(`${API}/employees/me`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${data.accessToken}`,
      },
    });

    if (profileRes.ok) {
      const profileJson = await profileRes.json();
      if (profileJson?.success && profileJson?.data) {
        const current = profileJson.data as EmployeeApi;
        localStorage.setItem(
          'profileData',
          JSON.stringify({
            id: current.id,
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
        console.log('✅ Profile data saved successfully');
      } else {
        console.warn('⚠️ Invalid profile response format');
      }
    } else {
      console.warn('⚠️ Failed to fetch profile data:', profileRes.status);
    }
  } catch (error) {
    console.error('⚠️ Error fetching profile data:', error);
  }

  return data;
}

export {role};