import { apiFetch, getFileUrl } from "./apiClient";

// Fetch Companies
export async function getCompanies() {
  const companies = await apiFetch("/companies");
  if (!companies) return [];
  return companies.map((comp) => ({
    ...comp,
    logo_url: getFileUrl(comp.logoUrl || comp.logo_url),
  }));
}

// Add Company
export async function addNewCompany(token, _, companyData) {
  const formData = new FormData();
  formData.append("name", companyData.name);
  if (companyData.logo) {
    formData.append("logo", companyData.logo);
  }

  const company = await apiFetch("/companies", {
    method: "POST",
    body: formData,
  });

  return {
    ...company,
    logo_url: getFileUrl(company.logoUrl),
  };
}
