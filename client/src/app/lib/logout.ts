export function logout(redirectPath: string = "/login") {
  if (typeof window === "undefined") return;

  localStorage.removeItem("accessToken");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
  localStorage.removeItem("profileData");
  localStorage.removeItem("token");

  window.location.replace(redirectPath);
}
