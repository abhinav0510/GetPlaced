import { apiFetch } from "./apiClient";

export async function getRecruiterProfile() {
  return apiFetch("/users/profile");
}

export async function updateRecruiterProfile(token, options, payload) {
  const actualPayload = payload?.profileData ? payload : (options?.profileData ? options : options);
  const profileData = actualPayload.profileData || actualPayload;
  const logoFile = actualPayload.logoFile;
  const avatarFile = actualPayload.avatarFile;
  const resumeFile = actualPayload.resumeFile;

  const formData = new FormData();
  formData.append("data", JSON.stringify(profileData));
  
  if (logoFile) {
    formData.append("logo", logoFile);
  }
  if (avatarFile) {
    formData.append("avatar", avatarFile);
  }
  if (resumeFile) {
    formData.append("resume", resumeFile);
  }

  const response = await fetch("http://localhost:8080/api/users/profile", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to update profile");
  }

  return response.json();
}
