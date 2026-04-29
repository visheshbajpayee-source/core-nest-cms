const API =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

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
    role: "admin" | "manager" | "employee";
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
  role: "admin" | "manager" | "employee";
  status: "active" | "inactive";
  profilePicture?: string;
}

let role = "";

export async function loginAndStoreProfile(
  payload: LoginPayload
): Promise<LoginApiResponse> {
  const loginRes = await fetch(`${API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const loginJson = await loginRes.json();

  // ❌ handle login failure early
  if (!loginRes.ok || !loginJson?.success) {
    throw new Error(
      loginJson?.message || "Invalid credentials. Please try again."
    );
  }

  // correct data extraction
  const data = loginJson.data as LoginApiResponse;

  console.log("login role -", data.user.role);

  //  store token properly
  localStorage.setItem("token", data.accessToken);

  // optional: store role too
  localStorage.setItem("role", data.user.role);
  role = data.user.role;

  // Fetch profile
  try {
    const profileRes = await fetch(`${API}/employees/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.accessToken}`,
      },
    });

    const profileJson = await profileRes.json();

    if (profileRes.ok && profileJson?.success && profileJson?.data) {
      const current = profileJson.data as EmployeeApi;

      localStorage.setItem(
        "profileData",
        JSON.stringify({
          id: current.id,
          fullName: current.fullName,
          email: current.email,
          phoneNumber: current.phoneNumber ?? "",
          department: current.department,
          designation: current.designation,
          dateOfJoining: current.dateOfJoining,
          employeeId: current.employeeId,
          role: current.role,
          status: current.status,
          profilePicture: current.profilePicture,
        })
      );

      console.log("Profile data saved successfully");
    } else {
      console.warn("Invalid profile response format");
    }
  } catch (error) {
    console.error("Error fetching profile data:", error);
  }

  return data;
}

export { role };