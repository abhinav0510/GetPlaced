import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  BadgeCheck,
  Bookmark,
  Briefcase,
  Building2,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Copy,
  Check,
  DoorClosed,
  DoorOpen,
  Linkedin,
  MapPin,
  Send,
  Twitter,
  UserCheck,
  Users,
  Wallet,
  Share2,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApplyJobDrawer } from "@/components/apply-job";
import ApplicationCard from "@/components/application-card";

import useFetch from "@/hooks/use-fetch";
import { getSingleJob, updateHiringStatus, saveJob, getSavedJobs } from "@/api/apiJobs";

const formatDate = (dateString) => {
  if (!dateString) return "12 May 2024";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "12 May 2024";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatLastDate = (dateString) => {
  const d = dateString ? new Date(dateString) : new Date();
  if (isNaN(d.getTime())) d.setTime(Date.now());
  d.setDate(d.getDate() + 30);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const JobPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  const { fn: fnSavedJob, loading: loadingSavedJob } = useFetch(saveJob);
  const { data: savedJobsData, fn: fnGetSavedJobs } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) {
      fnJob();
      if (user) fnGetSavedJobs();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (savedJobsData && Array.isArray(savedJobsData)) {
      const isAlreadySaved = savedJobsData.some(
        (sj) => sj.job?.id === Number(id) || sj.job_id === Number(id)
      );
      setSaved(isAlreadySaved);
    }
  }, [savedJobsData, id]);

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    {
      job_id: id,
    }
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  const handleSaveJob = async () => {
    await fnSavedJob({
      user_id: user?.id,
      job_id: Number(id),
    });
    setSaved(!saved);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isLoaded || loadingJob) {
    return <BarLoader className="mb-4" width={"100%"} color="#2563eb" />;
  }

  const isRecruiter =
    job?.recruiter?.id === user?.id || job?.recruiter_id === user?.id;

  const hasApplied = job?.applications?.some(
    (ap) => ap.candidate_id === user?.id || ap.candidate?.id === user?.id
  );

  return (
    <div className="min-h-screen bg-slate-50/60 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Back to Jobs Link */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors mb-6 group"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        Back to Jobs
      </Link>

      {/* Main Card Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xs border border-slate-100/90 flex flex-col gap-8">
        {/* Top Job Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-100/60">
          <div className="flex items-start sm:items-center gap-5">
            {/* Company Logo Box */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-50/80 border border-blue-100/80 flex items-center justify-center text-blue-600 flex-shrink-0 shadow-2xs">
              {job?.company?.logoUrl || job?.company?.logo_url ? (
                <img
                  src={job.company.logoUrl || job.company.logo_url}
                  alt={job?.company?.name || "Company"}
                  className="w-10 h-10 object-contain rounded-xl"
                />
              ) : (
                <Building2 size={32} className="text-blue-600" />
              )}
            </div>

            {/* Title & Meta Details */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {job?.title}
              </h1>
              <div className="flex items-center gap-1.5 mt-1 text-slate-700 font-bold text-base sm:text-lg">
                <span>{job?.company?.name || "Catlin Tablet"}</span>
                <BadgeCheck size={20} className="text-blue-500 fill-blue-500 text-white" />
              </div>
              <p className="text-slate-500 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed font-medium">
                We are looking for a passionate and skilled {job?.title} to join our dynamic team and build amazing products.
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap flex-shrink-0 self-start md:self-center">
            {!isRecruiter && (
              <button
                type="button"
                onClick={handleSaveJob}
                disabled={loadingSavedJob}
                className={`px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-2xs ${
                  saved
                    ? "bg-blue-50 border-blue-200 text-blue-600"
                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <Bookmark size={16} className={saved ? "fill-blue-600 text-blue-600" : ""} />
                {saved ? "Saved" : "Save Job"}
              </button>
            )}

            {!isRecruiter && (
              job?.isOpen !== false ? (
                <ApplyJobDrawer
                  job={job}
                  user={user}
                  fetchJob={fnJob}
                  applied={hasApplied}
                >
                  <button
                    type="button"
                    disabled={hasApplied}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                      hasApplied
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    {hasApplied ? (
                      <>
                        <CheckCircle2 size={16} /> Applied
                      </>
                    ) : (
                      <>
                        <Send size={16} /> Apply Now
                      </>
                    )}
                  </button>
                </ApplyJobDrawer>
              ) : (
                <button
                  disabled
                  className="px-5 py-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-sm font-semibold flex items-center gap-2"
                >
                  <DoorClosed size={16} /> Hiring Closed
                </button>
              )
            )}

            {isRecruiter && (
              <div className="min-w-[180px]">
                <Select onValueChange={handleStatusChange}>
                  <SelectTrigger
                    className={`w-full font-semibold h-11 rounded-xl text-sm transition-all ${
                      job?.isOpen !== false
                        ? "bg-emerald-600 text-white hover:bg-emerald-700 border-none"
                        : "bg-slate-800 text-white hover:bg-slate-900 border-none"
                    }`}
                  >
                    <SelectValue
                      placeholder={
                        "Hiring Status: " + (job?.isOpen !== false ? "Open" : "Closed")
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open (Active)</SelectItem>
                    <SelectItem value="closed">Closed (Hiring Stopped)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* 4 Colored Feature Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Location Badge */}
          <div className="bg-blue-50/50 border border-blue-100/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center flex-shrink-0">
              <MapPin size={22} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Location
              </p>
              <p className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
                {job?.location || "Chhattisgarh, India"}
              </p>
            </div>
          </div>

          {/* Salary Badge */}
          <div className="bg-emerald-50/50 border border-emerald-100/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Wallet size={22} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Salary
              </p>
              <p className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
                {job?.salary || "₹12,000,000 – ₹18,000,000 / year"}
              </p>
            </div>
          </div>

          {/* Experience Badge */}
          <div className="bg-purple-50/50 border border-purple-100/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-purple-100/70 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Briefcase size={22} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Experience
              </p>
              <p className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
                {job?.experience || "3+ Years"}
              </p>
            </div>
          </div>

          {/* Vacancies / Applicants Badge */}
          <div className="bg-amber-50/50 border border-amber-100/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-amber-100/70 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Users size={22} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Vacancies
              </p>
              <p className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
                {job?.vacancies || (job?.applications?.length > 0 ? `${job.applications.length} Applicants` : "2 Openings")}
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Body Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* About the Company Section */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">About the Company</h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-normal">
                {job?.company?.name || "Catlin Tablet"} is a fast-growing tech company focused on building innovative digital solutions that empower businesses and improve everyday lives.
              </p>
              <div className="flex flex-wrap items-center gap-6 mt-4 pt-2">
                <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm font-medium">
                  <Users size={16} className="text-slate-400" />
                  <span>50-100 Employees</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm font-medium">
                  <Building2 size={16} className="text-slate-400" />
                  <span>IT Services & Consulting</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm font-medium">
                  <Calendar size={16} className="text-slate-400" />
                  <span>Founded in 2020</span>
                </div>
              </div>
            </div>

            <div className="border-b border-slate-100" />

            {/* Job Description Section */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Job Description</h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-normal">
                {job?.description || "We are seeking a Senior Full Stack Developer who can design, develop, and maintain scalable web applications while collaborating with cross-functional teams."}
              </p>
            </div>

            <div className="border-b border-slate-100" />

            {/* Responsibilities Section */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Responsibilities</h2>
              {job?.requirements ? (
                <div className="prose prose-slate max-w-none text-slate-600 text-sm sm:text-base">
                  <MDEditor.Markdown source={job.requirements} className="bg-transparent text-slate-600" />
                </div>
              ) : (
                <ul className="space-y-2.5 text-slate-600 text-sm sm:text-base">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                    <span>Design and develop robust, scalable, and secure web applications.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                    <span>Build reusable components and front-end libraries for future use.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                    <span>Work with databases, APIs, and third-party services.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                    <span>Collaborate with designers, product managers and other developers.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                    <span>Optimize applications for maximum speed and scalability.</span>
                  </li>
                </ul>
              )}
            </div>

            {/* Recruiter Applications Section */}
            {isRecruiter && job?.applications?.length > 0 && (
              <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
                <h2 className="font-bold text-xl text-slate-900">
                  Applications ({job.applications.length})
                </h2>
                {job.applications.map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Overview Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Job Overview Box */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs space-y-5">
              <h3 className="text-lg font-bold text-slate-900">Job Overview</h3>
              <div className="space-y-4">
                {/* Job Type */}
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Job Type</p>
                    <p className="text-sm font-bold text-slate-900">Full-time</p>
                  </div>
                </div>

                {/* Department */}
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Department</p>
                    <p className="text-sm font-bold text-slate-900">Engineering</p>
                  </div>
                </div>

                {/* Role */}
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                    <UserCheck size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Role</p>
                    <p className="text-sm font-bold text-slate-900 line-clamp-1">
                      {job?.title || "Full Stack Development"}
                    </p>
                  </div>
                </div>

                {/* Posted On */}
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Posted On</p>
                    <p className="text-sm font-bold text-slate-900">
                      {formatDate(job?.createdAt || job?.created_at)}
                    </p>
                  </div>
                </div>

                {/* Last Date to Apply */}
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                    <CalendarDays size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Last Date to Apply</p>
                    <p className="text-sm font-bold text-slate-900">
                      {formatLastDate(job?.createdAt || job?.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Share this job Box */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Share this job</h3>
              <div className="flex items-center gap-3">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors cursor-pointer"
                  title="Share on LinkedIn"
                >
                  <Linkedin size={18} />
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out this job opening: ${job?.title}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-11 h-11 rounded-xl bg-sky-50 text-sky-500 hover:bg-sky-100 flex items-center justify-center transition-colors cursor-pointer"
                  title="Share on Twitter"
                >
                  <Twitter size={18} />
                </a>

                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Job opening for ${job?.title}: ${window.location.href}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors cursor-pointer"
                  title="Share on WhatsApp"
                >
                  <Share2 size={18} />
                </a>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer relative"
                  title="Copy Link"
                >
                  {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPage;

