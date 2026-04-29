import api from "../../../lib/api";

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
  let loginJson: any;
  try {
    const loginRes = await api.post("/api/v1/login", payload);
    loginJson = loginRes.data;
  } catch (err: any) {
    loginJson = err?.response?.data;
    if (!loginJson) {
      throw new Error("Invalid credentials. Please try again.");
    }
  }

  console.log("login json response - ", loginJson?.data?.user?.role);

  if (!loginJson?.success) {
    throw new Error(
      loginJson?.message || "Invalid credentials. Please try again."
    );
  }

  const data = loginJson.data as LoginApiResponse;

  role = data.user.role;

  console.log("login role -", data.user.role);

  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("role", data.user.role);
  localStorage.setItem("user", JSON.stringify(data.user));

  try {
    const profileRes = await api.get("/api/v1/employees/me");
    const profileJson = profileRes.data;

    if (profileJson?.success && profileJson?.data) {
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
