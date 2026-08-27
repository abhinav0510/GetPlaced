import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  Globe,
  Mail,
  User,
  ShieldCheck,
  Upload,
  Briefcase,
  AlertTriangle,
  BadgeCheck,
  IdCard,
  MapPin,
  Sparkles,
  GraduationCap,
  DollarSign,
  Heart,
  FileText,
  Plus,
  Trash2,
  Camera,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { updateRecruiterProfile } from "@/api/apiUser";

const parseExperiences = (expStr) => {
  if (!expStr) return [{ companyName: "", jobTitle: "", duration: "", description: "" }];
  try {
    const parsed = JSON.parse(expStr);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // If legacy plain text format
    return [{ companyName: "", jobTitle: expStr, duration: "", description: "" }];
  }
  return [{ companyName: "", jobTitle: "", duration: "", description: "" }];
};

const MyProfile = () => {
  const { user, updateUserState, refreshUser } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const isMandatory = searchParams.get("complete-profile") === "true";
  const [isEditing, setIsEditing] = useState(isMandatory || !user?.profileCompleted);

  // Files & Previews
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(user?.company?.logoUrl || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || "");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeName, setResumeName] = useState(user?.resumeUrl ? "Resume Uploaded" : "");

  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Candidate Work Experiences state array
  const [experiences, setExperiences] = useState(() => parseExperiences(user?.experiences));

  // Main Form Data
  const [formData, setFormData] = useState({
    name: user?.name || "",
    // Candidate fields
    education: user?.education || "",
    location: user?.location || "",
    currentOrganization: user?.currentOrganization || "",
    currentCtc: user?.currentCtc || "",
    expectedCtc: user?.expectedCtc || "",
    interests: user?.interests || "",
    // Recruiter fields
    designation: user?.designation || "",
    companyEmail: user?.companyEmail || user?.email || "",
    jobId: user?.jobId || "",
    companyName: user?.company?.name || "",
    branches: user?.company?.branches || "",
    industryType: user?.company?.industryType || "Software & Technology",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        education: user.education || "",
        location: user.location || "",
        currentOrganization: user.currentOrganization || "",
        currentCtc: user.currentCtc || "",
        expectedCtc: user.expectedCtc || "",
        interests: user.interests || "",
        designation: user.designation || "",
        companyEmail: user.companyEmail || user.email || "",
        jobId: user.jobId || "",
        companyName: user.company?.name || "",
        branches: user.company?.branches || "",
        industryType: user.company?.industryType || "Software & Technology",
      });
      if (user.company?.logoUrl) setLogoPreview(user.company.logoUrl);
      if (user.avatarUrl) setAvatarPreview(user.avatarUrl);
      if (user.resumeUrl) setResumeName("Resume Uploaded");
      if (user.experiences) setExperiences(parseExperiences(user.experiences));

      if (!user.profileCompleted || isMandatory) {
        setIsEditing(true);
      }
    }
  }, [user, isMandatory]);

  const { loading: loadingSave, fn: fnSaveProfile } = useFetch(updateRecruiterProfile);

  // File Change Handlers
  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleResumeFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      setResumeName(file.name);
    }
  };

  // Experience Handlers
  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      { companyName: "", jobTitle: "", duration: "", description: "" },
    ]);
  };

  const handleRemoveExperience = (index) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter((_, i) => i !== index));
    } else {
      setExperiences([{ companyName: "", jobTitle: "", duration: "", description: "" }]);
    }
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payloadData = {
        ...formData,
        experiences: JSON.stringify(experiences),
      };

      const updatedData = await fnSaveProfile({
        profileData: payloadData,
        logoFile: logoFile,
        avatarFile: avatarFile,
        resumeFile: resumeFile,
      });

      if (updatedData) {
        updateUserState(updatedData);
        await refreshUser();
        setIsEditing(false);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 4000);

        if (isMandatory) {
          const role = user?.unsafeMetadata?.role;
          setTimeout(() => navigate(role === "recruiter" ? "/post-job" : "/jobs"), 1200);
        }
      }
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  if (!user) {
    return <BarLoader className="mt-4" width={"100%"} color="#2563eb" />;
  }

  const isRecruiter = user?.unsafeMetadata?.role === "recruiter";
  const userExperiencesList = parseExperiences(user?.experiences);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 min-h-screen">
      {/* ===== HEADER BANNER ===== */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar Circle */}
            <div className="relative w-20 h-20 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center border-2 border-white/20 shadow-lg overflow-hidden flex-shrink-0">
              {avatarPreview ? (
                <img src={avatarPreview} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name ? user.name.charAt(0).toUpperCase() : <User size={32} />
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {user.name || "User Profile"}
                </h1>
                {user?.profileCompleted ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded-full">
                    <BadgeCheck size={15} /> Complete & Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-full animate-pulse">
                    <AlertTriangle size={15} /> Profile Pending
                  </span>
                )}
              </div>
              <p className="text-slate-300 text-xs sm:text-sm">
                {isRecruiter
                  ? "Recruiter & Official Company Identity"
                  : `${user.currentOrganization ? `${user.currentOrganization} • ` : ""}${user.location || "Job Seeker Candidate"}`}
              </p>
            </div>
          </div>

          <Button
            onClick={() => setIsEditing(!isEditing)}
            className={`rounded-xl px-5 py-2.5 font-semibold text-xs sm:text-sm cursor-pointer shadow-md transition-all ${
              isEditing
                ? "bg-slate-700 hover:bg-slate-600 text-white"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >
            {isEditing ? "View Profile Summary" : "Edit Profile Details"}
          </Button>
        </div>
      </div>

      {/* ===== MANDATORY ALERT ===== */}
      {(isMandatory || !user?.profileCompleted) && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-5 flex items-start gap-4 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-amber-950">
              Please Complete Your {isRecruiter ? "Recruiter" : "Candidate"} Profile
            </h3>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              {isRecruiter
                ? "As a recruiter, please fill out your credentials and company details to start posting jobs."
                : "Please fill out your education, work experience, salary expectations, and upload your resume to apply for top jobs."}
            </p>
          </div>
        </div>
      )}

      {/* ===== SUCCESS TOAST ===== */}
      {showSuccessToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-4 flex items-center gap-3 shadow-md">
          <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
          <p className="text-sm font-semibold text-emerald-900">
            Profile updated successfully! {isMandatory && "Redirecting..."}
          </p>
        </div>
      )}

      {/* ===== MAIN CONTENT: EDIT FORM VS SUMMARY VIEW ===== */}
      {isEditing ? (
        /* ===== EDIT FORM ===== */
        <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-8">
          {loadingSave && <BarLoader width={"100%"} color="#2563eb" className="rounded-t-3xl" />}

          {/* ===== SECTION 1: PROFILE PICTURE & BASIC DETAILS ===== */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <User size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">
                1. Personal Details & Profile Picture
              </h2>
            </div>

            {/* Profile Picture Upload Box */}
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <div className="relative w-20 h-20 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl overflow-hidden border border-slate-200 flex-shrink-0">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={28} className="text-slate-400" />
                )}
              </div>
              <div className="space-y-1.5 text-center sm:text-left flex-1">
                <h4 className="text-xs font-bold text-slate-900">Profile Picture</h4>
                <p className="text-xs text-slate-500">
                  Upload a clear portrait picture. This will be displayed on your candidate profile and applications.
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 cursor-pointer transition-all shadow-2xs">
                  <Upload size={15} /> Upload Profile Picture
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Basic Info Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Johnson"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Account Email (Read Only)
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200/80 rounded-xl text-slate-500 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Current Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Bengaluru, Karnataka"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {!isRecruiter && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Current Organization (If Any)
                  </label>
                  <div className="relative">
                    <Building2 size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={formData.currentOrganization}
                      onChange={(e) => setFormData({ ...formData, currentOrganization: e.target.value })}
                      placeholder="e.g. TechCorp Solutions or Freelance"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ===== SECTION 2: CANDIDATE SPECIFIC FIELDS ===== */}
          {!isRecruiter && (
            <>
              {/* Education & CTC Row */}
              <div className="space-y-5 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <GraduationCap size={20} className="text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-900">
                    2. Education & Salary Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-3">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Education & Qualifications <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <GraduationCap size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <textarea
                        required
                        rows={2}
                        value={formData.education}
                        onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                        placeholder="e.g. B.Tech in Computer Science, IIT Madras (2020 - 2024)"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all leading-relaxed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Current CTC (Annual)
                    </label>
                    <div className="relative">
                      <DollarSign size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={formData.currentCtc}
                        onChange={(e) => setFormData({ ...formData, currentCtc: e.target.value })}
                        placeholder="e.g. 8.5 LPA or $85,000"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Expected CTC (Annual) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={formData.expectedCtc}
                        onChange={(e) => setFormData({ ...formData, expectedCtc: e.target.value })}
                        placeholder="e.g. 12 LPA or $120,000"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Key Interests & Skills <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Heart size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={formData.interests}
                        onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                        placeholder="e.g. React, Spring Boot, UI/UX, Cloud"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Experience Section (MULTIPLE EXPERIENCES SUPPORTED) */}
              <div className="space-y-5 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Briefcase size={20} className="text-blue-600" />
                    <h2 className="text-lg font-bold text-slate-900">
                      3. Work Experience Details
                    </h2>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddExperience}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold rounded-xl px-3.5 py-2 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Plus size={15} /> Add Another Experience
                  </Button>
                </div>

                {experiences.map((exp, index) => (
                  <div
                    key={index}
                    className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 space-y-4 relative"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                      <span className="text-xs font-extrabold text-blue-700 uppercase tracking-wider">
                        Experience #{index + 1}
                      </span>
                      {experiences.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveExperience(index)}
                          className="text-slate-400 hover:text-red-600 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={exp.companyName}
                          onChange={(e) => handleExperienceChange(index, "companyName", e.target.value)}
                          placeholder="e.g. Acme Corp"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Job Profile / Title
                        </label>
                        <input
                          type="text"
                          value={exp.jobTitle}
                          onChange={(e) => handleExperienceChange(index, "jobTitle", e.target.value)}
                          placeholder="e.g. Software Engineer"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Duration (Dates / Years)
                        </label>
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) => handleExperienceChange(index, "duration", e.target.value)}
                          placeholder="e.g. 2022 - 2024 or 2 Years"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Job Profile Details & Key Responsibilities
                        </label>
                        <textarea
                          rows={2}
                          value={exp.description}
                          onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                          placeholder="Describe your role, key technologies used, achievements..."
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resume Upload Section */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <FileText size={20} className="text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-900">
                    4. Upload Resume
                  </h2>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Resume Document</h4>
                      <p className="text-xs text-slate-500">
                        {resumeName || "Upload PDF or DOC resume file for quick applications."}
                      </p>
                    </div>
                  </div>

                  <label className="cursor-pointer bg-slate-950 hover:bg-slate-900 text-white font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all flex-shrink-0">
                    <Upload size={16} /> Choose Resume File
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </>
          )}

          {/* ===== SECTION 3: RECRUITER SPECIFIC FIELDS ===== */}
          {isRecruiter && (
            <>
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Briefcase size={20} className="text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-900">
                    2. Recruiter Credentials
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Job Designation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      placeholder="e.g. HR Manager"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Official Work Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.companyEmail}
                      onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                      placeholder="e.g. hr@company.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Employee / Job ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.jobId}
                      onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
                      placeholder="e.g. EMP-901"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Company Info */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Building2 size={20} className="text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-900">
                    3. Company Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Catlin Corporation"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Industry Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.industryType}
                      onChange={(e) => setFormData({ ...formData, industryType: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Software & Technology">Software & Technology</option>
                      <option value="Finance & Banking">Finance & Banking</option>
                      <option value="Healthcare & Biotech">Healthcare & Biotech</option>
                      <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                      <option value="Consulting & Services">Consulting & Services</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Company Logo
                    </label>
                    <div className="flex items-center gap-4">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="w-14 h-14 rounded-xl object-contain border p-1 bg-slate-50" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-slate-100 border flex items-center justify-center text-slate-400">
                          <Building2 size={24} />
                        </div>
                      )}
                      <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 border transition-all">
                        <Upload size={15} /> Upload Company Logo
                        <input type="file" accept="image/*" onChange={handleLogoFileChange} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              disabled={loadingSave}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl text-sm shadow-md cursor-pointer transition-all"
            >
              {loadingSave ? "Saving Details..." : "Save & Complete Profile"}
            </Button>
          </div>
        </form>
      ) : (
        /* ===== PROFILE SUMMARY VIEW ===== */
        <div className="space-y-8">
          {!isRecruiter ? (
            /* Candidate Profile Summary Card Layout */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Side: Candidate Overview */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-2xs space-y-6 text-center">
                  <div className="relative w-28 h-28 mx-auto rounded-3xl bg-blue-600 text-white font-black text-3xl flex items-center justify-center border-4 border-white shadow-md overflow-hidden">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name ? user.name.charAt(0).toUpperCase() : <User size={40} />
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                    <p className="text-xs font-semibold text-blue-600 mt-1">Candidate / Job Seeker</p>
                  </div>

                  <div className="space-y-3 text-left border-t border-slate-100 pt-4 text-xs">
                    <div className="flex items-center gap-2.5 text-slate-600">
                      <Mail size={16} className="text-blue-500 flex-shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-slate-600">
                      <MapPin size={16} className="text-blue-500 flex-shrink-0" />
                      <span>{user.location || "Location not set"}</span>
                    </div>

                    {user.currentOrganization && (
                      <div className="flex items-center gap-2.5 text-slate-600">
                        <Building2 size={16} className="text-blue-500 flex-shrink-0" />
                        <span>{user.currentOrganization}</span>
                      </div>
                    )}
                  </div>

                  {user.resumeUrl && (
                    <div className="pt-2">
                      <a
                        href={user.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-slate-950 hover:bg-slate-900 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-2xs"
                      >
                        <FileText size={15} />
                        <span>View / Download Resume</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  )}
                </div>

                {/* Salary CTC Card */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-2xs space-y-4">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    Salary & Compensation
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                      <span className="text-xs text-slate-500 font-medium">Current CTC</span>
                      <span className="text-xs font-bold text-slate-900">{user.currentCtc || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                      <span className="text-xs text-emerald-700 font-medium">Expected CTC</span>
                      <span className="text-xs font-bold text-emerald-900">{user.expectedCtc || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Education, Experiences Timeline & Interests */}
              <div className="lg:col-span-2 space-y-6">
                {/* Education Card */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <GraduationCap size={20} className="text-blue-600" />
                    <h3 className="font-bold text-slate-900 text-base">Education & Qualifications</h3>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                    {user.education || "No education details added."}
                  </p>
                </div>

                {/* Work Experiences Timeline Card */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-5">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <Briefcase size={20} className="text-blue-600" />
                    <h3 className="font-bold text-slate-900 text-base">Work Experience History</h3>
                  </div>

                  <div className="space-y-4">
                    {userExperiencesList.length > 0 && userExperiencesList[0].jobTitle ? (
                      userExperiencesList.map((exp, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm">{exp.jobTitle}</h4>
                              <p className="text-xs font-semibold text-blue-600">{exp.companyName}</p>
                            </div>
                            {exp.duration && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 text-slate-600 text-[11px] font-semibold rounded-lg">
                                <Calendar size={12} /> {exp.duration}
                              </span>
                            )}
                          </div>
                          {exp.description && (
                            <p className="text-xs text-slate-600 leading-relaxed pt-1">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 font-medium">No work experience entries added.</p>
                    )}
                  </div>
                </div>

                {/* Key Interests & Skills */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <Heart size={20} className="text-blue-600" />
                    <h3 className="font-bold text-slate-900 text-base">Key Interests & Technical Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {user.interests ? (
                      user.interests.split(",").map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold rounded-xl">
                          {skill.trim()}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500">No interests added.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Recruiter Profile Summary Layout */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
                <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-extrabold text-2xl">
                    {user.name ? user.name.charAt(0).toUpperCase() : <User />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                    <p className="text-xs font-semibold text-blue-600">{user.designation || "Recruiter"}</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl">
                    <span className="text-slate-500 font-medium">Work Email</span>
                    <span className="font-bold text-slate-900">{user.companyEmail || user.email}</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl">
                    <span className="text-slate-500 font-medium">Employee / Job ID</span>
                    <span className="font-bold text-slate-900">{user.jobId || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  {user.company?.logoUrl && (
                    <img src={user.company.logoUrl} alt="Logo" className="w-12 h-12 object-contain rounded-xl border p-1" />
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{user.company?.name || "Company"}</h2>
                    <p className="text-xs font-medium text-slate-500">{user.company?.industryType}</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-xs font-semibold text-slate-700">Global Branches</p>
                  <p className="text-xs text-slate-600 mt-1">{user.company?.branches || "N/A"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyProfile;
