import { apiFetch } from "./apiClient";

// Fetch Jobs
export async function getJobs(token, { location, company_id, searchQuery } = {}) {
  const params = new URLSearchParams();
  if (location) params.append("location", location);
  if (company_id) params.append("companyId", company_id);
  if (searchQuery) params.append("searchQuery", searchQuery);

  const queryString = params.toString() ? `?${params.toString()}` : "";
  return apiFetch(`/jobs${queryString}`);
}

// Read Saved Jobs
export async function getSavedJobs() {
  return apiFetch("/saved-jobs");
}

// Read single job
export async function getSingleJob(token, { job_id }) {
  return apiFetch(`/jobs/${job_id}`);
}

// Add / Remove Saved Job
export async function saveJob(token, { alreadySaved }, saveData) {
  return apiFetch(`/saved-jobs/toggle/${saveData.job_id}`, {
    method: "POST",
  });
}

// Job hiring status toggle
export async function updateHiringStatus(token, { job_id }, isOpen) {
  return apiFetch(`/jobs/${job_id}/status?isOpen=${isOpen}`, {
    method: "PATCH",
  });
}

// Get my created jobs (recruiter)
export async function getMyJobs() {
  return apiFetch("/jobs/my-jobs");
}

// Delete job
export async function deleteJob(token, { job_id }) {
  return apiFetch(`/jobs/${job_id}`, {
    method: "DELETE",
  });
}

// Post job
export async function addNewJob(token, _, jobData) {
  return apiFetch("/jobs", {
    method: "POST",
    body: JSON.stringify({
      title: jobData.title,
      description: jobData.description,
      requirements: jobData.requirements,
      location: jobData.location,
      companyId: Number(jobData.company_id),
      isOpen: jobData.isOpen !== undefined ? jobData.isOpen : true,
    }),
  });
}
