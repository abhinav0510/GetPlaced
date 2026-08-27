/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  BadgeCheck,
  Building2,
  Check,
  FileText,
  Link as LinkIcon,
  Mail,
  MapPin,
  Phone,
  Send,
  UploadCloud,
  User,
  X,
} from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { applyToJob } from "@/api/apiApplication";
import { BarLoader } from "react-spinners";

export function ApplyJobDrawer({ user, job, fetchJob, applied = false, children }) {
  const [open, setOpen] = useState(false);
  const [resumeOption, setResumeOption] = useState("profile"); // 'profile' | 'new'
  const [selectedFile, setSelectedFile] = useState(null);
  const [coverLetterFile, setCoverLetterFile] = useState(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.name || user.fullName || "");
      setEmail(user.email || "");
      setLocation(user.location || "");
      if (user.resumeUrl) {
        setResumeOption("profile");
      } else {
        setResumeOption("new");
      }
    }
  }, [user, open]);

  const {
    loading: loadingApply,
    error: errorApply,
    fn: fnApply,
  } = useFetch(applyToJob);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (!fullName || !email) {
      setFormError("Full Name and Email are required.");
      return;
    }

    if (resumeOption === "new" && !selectedFile) {
      setFormError("Please select a resume file to upload.");
      return;
    }

    if (resumeOption === "profile" && !user?.resumeUrl) {
      setFormError("No profile resume found. Please upload a resume.");
      return;
    }

    if (!agreed) {
      setFormError("You must agree to the Terms & Conditions.");
      return;
    }

    const payload = {
      job_id: job.id,
      candidate_id: user.id,
      name: fullName,
      email: email,
      phone: phone,
      location: location,
      portfolioUrl: portfolioUrl,
      skills: user?.interests || "",
      experience: "1",
      education: user?.education || "Graduate",
    };

    if (resumeOption === "profile" && user?.resumeUrl) {
      payload.resumeUrl = user.resumeUrl;
    } else if (selectedFile) {
      payload.resume = selectedFile;
    }

    fnApply(payload).then((res) => {
      if (res) {
        fetchJob();
        setOpen(false);
      }
    });
  };

  return (
    <Drawer open={applied ? false : open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            size="lg"
            variant={job?.isOpen && !applied ? "blue" : "destructive"}
            disabled={!job?.isOpen || applied}
          >
            {job?.isOpen ? (applied ? "Applied" : "Apply") : "Hiring Closed"}
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="max-w-4xl mx-auto max-h-[90vh] flex flex-col rounded-t-3xl bg-white border-t border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          {/* Top Navigation & Stepper Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <DrawerClose asChild>
              <button
                type="button"
                className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <X size={16} /> Cancel
              </button>
            </DrawerClose>

            {/* Stepper progress */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-blue-600">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>Apply</span>
              </div>
              <span className="w-6 sm:w-10 h-[1px] bg-slate-200" />
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>Review</span>
              </div>
              <span className="w-6 sm:w-10 h-[1px] bg-slate-200" />
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>Submitted</span>
              </div>
            </div>
          </div>

          {/* Company & Job Card Banner */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100/70">
            <div className="w-12 h-12 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center flex-shrink-0">
              {job?.company?.logoUrl || job?.company?.logo_url ? (
                <img
                  src={job.company.logoUrl || job.company.logo_url}
                  className="w-8 h-8 object-contain rounded-lg"
                  alt={job?.company?.name}
                />
              ) : (
                <Building2 size={24} />
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl line-clamp-1">
                {job?.title}
              </h3>
              <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-sm mt-0.5">
                <span>{job?.company?.name || "Catlin Tablet"}</span>
                <BadgeCheck size={16} className="text-blue-500 fill-blue-500 text-white" />
              </div>
            </div>
          </div>

          {/* Form Header Title */}
          <div>
            <div className="flex items-center gap-2">
              <FileText className="text-blue-600 w-5 h-5" />
              <h2 className="text-xl font-extrabold text-slate-900">Apply for this job</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Fill in the details below to apply. Fields marked with{" "}
              <span className="text-rose-500 font-bold">*</span> are required.
            </p>
          </div>

          {/* Application Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Grid (2 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* Current Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Current Location <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter your current location"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Resume Selection / Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Resume Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Resume / CV <span className="text-rose-500">*</span>
                </label>

                {user?.resumeUrl ? (
                  <div className="space-y-2.5">
                    {/* Choice A: Saved Profile Resume */}
                    <div
                      onClick={() => setResumeOption("profile")}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        resumeOption === "profile"
                          ? "border-blue-500 bg-blue-50/60 shadow-2xs"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-900">
                            Use Saved Profile Resume
                          </p>
                          <p className="text-[11px] text-slate-500 truncate max-w-[200px]">
                            {user.resumeUrl.split("/").pop() || "Profile_Resume.pdf"}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          resumeOption === "profile"
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300"
                        }`}
                      >
                        {resumeOption === "profile" && <Check size={12} />}
                      </div>
                    </div>

                    {/* Choice B: Upload New Resume */}
                    <div
                      onClick={() => setResumeOption("new")}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        resumeOption === "new"
                          ? "border-blue-500 bg-blue-50/60 shadow-2xs"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
                          <UploadCloud size={18} />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-900">
                            Upload New Resume
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Select a different file from device
                          </p>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          resumeOption === "new"
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300"
                        }`}
                      >
                        {resumeOption === "new" && <Check size={12} />}
                      </div>
                    </div>

                    {/* File Dropzone if Upload New selected */}
                    {resumeOption === "new" && (
                      <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/60 text-center relative hover:border-blue-400 transition-colors">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setSelectedFile(e.target.files[0])}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <UploadCloud size={24} className="mx-auto text-blue-500 mb-1" />
                        <p className="text-xs font-semibold text-blue-600 truncate">
                          {selectedFile ? selectedFile.name : "Upload your resume"}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          PDF, DOC, DOCX (Max 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Standard file dropzone if no profile resume */
                  <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/60 text-center relative hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <UploadCloud size={28} className="mx-auto text-blue-500 mb-1.5" />
                    <p className="text-xs sm:text-sm font-semibold text-blue-600 truncate">
                      {selectedFile ? selectedFile.name : "Upload your resume"}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      PDF, DOC, DOCX (Max 5MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Cover Letter (Optional) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Cover Letter (Optional)
                </label>
                <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/60 text-center relative hover:border-blue-400 transition-colors h-[120px] flex flex-col items-center justify-center">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setCoverLetterFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <UploadCloud size={28} className="mx-auto text-blue-500 mb-1.5" />
                  <p className="text-xs sm:text-sm font-semibold text-blue-600 truncate">
                    {coverLetterFile ? coverLetterFile.name : "Upload your cover letter"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    PDF, DOC, DOCX (Max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Portfolio / Website Link */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Portfolio / LinkedIn / Website (Optional)
              </label>
              <div className="relative">
                <LinkIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="Paste your portfolio, LinkedIn or website link"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>
            </div>

            {/* Checkbox Terms & Conditions */}
            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs sm:text-sm text-slate-600 font-medium cursor-pointer">
                I agree to the <span className="text-blue-600 font-semibold underline">Terms & Conditions</span> and{" "}
                <span className="text-blue-600 font-semibold underline">Privacy Policy</span>
              </label>
            </div>

            {/* Error Notifications */}
            {(formError || errorApply?.message) && (
              <p className="text-xs font-semibold text-rose-500 bg-rose-50 border border-rose-200 p-3 rounded-xl">
                {formError || errorApply?.message}
              </p>
            )}

            {loadingApply && <BarLoader width={"100%"} color="#2563eb" />}

            {/* Action Buttons Row */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <DrawerClose asChild>
                <button
                  type="button"
                  className="px-6 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </DrawerClose>

              <button
                type="submit"
                disabled={loadingApply}
                className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Send size={16} />
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

