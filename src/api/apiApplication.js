import { apiFetch, getFileUrl } from "./apiClient";

// Apply to job (candidate)
export async function applyToJob(token, _, jobData) {
  const formData = new FormData();
  formData.append("jobId", jobData.job_id);
  if (jobData.resume) {
    formData.append("resume", jobData.resume);
  }
  if (jobData.resumeUrl) {
    formData.append("resumeUrl", jobData.resumeUrl);
  }
  if (jobData.skills) formData.append("skills", jobData.skills);
  if (jobData.experience) formData.append("experience", jobData.experience);
  if (jobData.education) formData.append("education", jobData.education);

  const application = await apiFetch("/applications", {
    method: "POST",
    body: formData,
  });

  return {
    ...application,
    resume: getFileUrl(application.resumeUrl),
  };
}

// Edit Application Status (recruiter)
export async function updateApplicationStatus(token, { job_id }, status) {
  return apiFetch(`/applications/${job_id}/status?status=${status.toUpperCase()}`, {
    method: "PATCH",
  });
}

// Get candidate applications
export async function getApplications() {
  const applications = await apiFetch("/applications/my-applications");
  if (!applications) return [];

  return applications.map((app) => ({
    ...app,
    candidate_id: app.candidate?.id,
    resume: getFileUrl(app.resumeUrl),
  }));
}
