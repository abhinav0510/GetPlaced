import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getMyJobs, deleteJob, updateHiringStatus } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bookmark,
  Briefcase,
  Building,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Cloud,
  Code,
  CreditCard,
  Crown,
  Eye,
  Filter,
  Headphones,
  Layers,
  LayoutDashboard,
  MessageSquare,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Smartphone,
  ToggleLeft,
  ToggleRight,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";

const CreatedJobs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("recent");
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const {
    loading: loadingCreatedJobs,
    data: createdJobs,
    fn: fnCreatedJobs,
  } = useFetch(getMyJobs, {
    recruiter_id: user?.id,
  });

  useEffect(() => {
    if (user?.id) {
      fnCreatedJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Handle toggling hiring status (open/closed)
  const handleToggleStatus = async (jobId, currentIsOpen) => {
    try {
      await updateHiringStatus({ job_id: jobId }, !currentIsOpen);
      fnCreatedJobs();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  // Handle deleting a job
  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      try {
        await deleteJob({ job_id: jobId });
        fnCreatedJobs();
      } catch (err) {
        console.error("Failed to delete job", err);
      }
    }
  };

  // Calculate overview metrics
  const jobsList = createdJobs || [];
  const totalJobsCount = jobsList.length;
  const activeJobsCount = jobsList.filter((j) => j.isOpen !== false).length;

  // Aggregate total applicants across all jobs
  let totalApplicantsCount = 0;
  let shortlistedCount = 0;
  let hiredCount = 0;

  jobsList.forEach((j) => {
    const apps = j.applications || [];
    totalApplicantsCount += apps.length;
    apps.forEach((a) => {
      const st = (a.status || "").toLowerCase();
      if (st === "interview" || st === "interviewing" || st === "under review" || st === "shortlisted") {
        shortlistedCount++;
      }
      if (st === "hired" || st === "offered") {
        hiredCount++;
      }
    });
  });

  // Filter and sort jobs
  const filteredJobs = jobsList
    .filter((j) => {
      // Tab filter
      if (activeTab === "My Jobs") return true;
      if (activeTab === "Active") return j.isOpen !== false;
      return true;
    })
    .filter((j) => {
      // Status filter dropdown
      if (statusFilter === "Active") return j.isOpen !== false;
      if (statusFilter === "Under Review") return j.isOpen !== false && (j.applications?.length || 0) > 0;
      if (statusFilter === "Closed") return j.isOpen === false;
      return true;
    })
    .filter((j) => {
      // Search query
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        j.title?.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q) ||
        j.company?.name?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.created_at || 0).getTime();
      const dateB = new Date(b.createdAt || b.created_at || 0).getTime();
      return sortOrder === "recent" ? dateB - dateA : dateA - dateB;
    });

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return { date: "12 May 2024", timeAgo: "2 days ago" };
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return { date: "12 May 2024", timeAgo: "2 days ago" };
      const formatted = d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const daysAgo = Math.max(1, Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24)));
      return {
        date: formatted,
        timeAgo: daysAgo === 1 ? "1 day ago" : `${daysAgo} days ago`,
      };
    } catch {
      return { date: "12 May 2024", timeAgo: "2 days ago" };
    }
  };

  // Helper for rendering category/job icon
  const getJobIcon = (title) => {
    const t = (title || "").toLowerCase();
    if (t.includes("full stack") || t.includes("developer") || t.includes("code") || t.includes("software")) {
      return (
        <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-2xs">
          <Code size={20} />
        </div>
      );
    }
    if (t.includes("ui") || t.includes("ux") || t.includes("design")) {
      return (
        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xs tracking-wider shadow-2xs">
          UI
        </div>
      );
    }
    if (t.includes("devops") || t.includes("cloud") || t.includes("aws")) {
      return (
        <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold shadow-2xs">
          <Cloud size={20} />
        </div>
      );
    }
    if (t.includes("python") || t.includes("data") || t.includes("backend")) {
      return (
        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs tracking-wider shadow-2xs">
          PY
        </div>
      );
    }
    if (t.includes("mobile") || t.includes("android") || t.includes("ios") || t.includes("react native")) {
      return (
        <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold shadow-2xs">
          <Smartphone size={20} />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-2xs">
        <Briefcase size={20} />
      </div>
    );
  };

  const recruiterCompany = user?.companyName || user?.company_name || user?.name || "Catlin Tablet";
  const recruiterInitials = recruiterCompany
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  if (loadingCreatedJobs) {
    return (
      <div className="py-12">
        <BarLoader width={"100%"} color="#2563eb" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* ===== LEFT SIDEBAR NAVIGATION ===== */}
      <div className="lg:col-span-3 space-y-6">
        {/* Recruiter Profile Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white font-black text-xs flex items-center justify-center shadow-2xs">
              {recruiterInitials}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 line-clamp-1">
                {recruiterCompany}
              </h3>
              <p className="text-xs text-slate-400 font-medium">Recruiter</p>
            </div>
          </div>
          <ChevronDown size={16} className="text-slate-400" />
        </div>

        {/* Sidebar Nav Links */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs space-y-1">
          {[
            { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "My Jobs", label: "My Jobs", icon: Briefcase },
            { id: "Applicants", label: "Applicants", icon: Users },
            { id: "Shortlisted", label: "Shortlisted", icon: Bookmark },
            { id: "Interviews", label: "Interviews", icon: UserCheck },
            { id: "Messages", label: "Messages", icon: MessageSquare },
            { id: "Analytics", label: "Analytics", icon: BarChart3 },
            { id: "Company Profile", label: "Company Profile", icon: Building },
            { id: "Settings", label: "Settings", icon: Settings },
            { id: "Billing", label: "Billing", icon: CreditCard },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-2xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={16} className={isActive ? "text-blue-600" : "text-slate-400"} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Upgrade to Premium Card */}
        <div className="bg-gradient-to-br from-blue-50/90 via-blue-50/50 to-indigo-50/80 rounded-2xl p-4 border border-blue-100/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
              Upgrade to Premium
            </h4>
            <Crown size={14} className="text-blue-600" />
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Get advanced insights, boost visibility and hire faster.
          </p>
          <button
            type="button"
            className="w-full py-2 rounded-xl bg-white border border-blue-200 text-blue-600 text-xs font-extrabold shadow-2xs hover:bg-blue-50 transition-all cursor-pointer"
          >
            Upgrade Now
          </button>
        </div>

        {/* Need Help Link */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium px-2">
          <Headphones size={15} className="text-slate-400" />
          <span>Need Help?</span>
          <a href="#support" className="text-blue-600 font-bold hover:underline">
            Contact Support
          </a>
        </div>
      </div>

      {/* ===== MAIN RIGHT CONTENT AREA ===== */}
      <div className="lg:col-span-9 space-y-6">
        {/* Top Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welcome back, {user?.name?.split(" ")[0] || "Catlin"}!
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
              Here&apos;s what&apos;s happening with your job postings.
            </p>
          </div>

          {/* Post Job Primary CTA Button & Date Filter */}
          <div className="flex items-center gap-3">
            <Link
              to="/post-job"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all"
            >
              <Plus size={16} />
              <span>Post a Job</span>
            </Link>

            <button
              type="button"
              className="px-3.5 py-2.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
            >
              <Calendar size={14} className="text-slate-400" />
              <span>Last 30 Days</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Overview Metric Stat Cards (5 Grid Items) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Stat 1: Total Jobs */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center">
              <Briefcase size={16} />
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Jobs
            </p>
            <h3 className="text-2xl font-black text-slate-900">{totalJobsCount}</h3>
            <p className="text-[11px] font-bold text-blue-600 flex items-center gap-1">
              <span>↗ 2 new this month</span>
            </p>
          </div>

          {/* Stat 2: Active Jobs */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Active Jobs
            </p>
            <h3 className="text-2xl font-black text-slate-900">{activeJobsCount}</h3>
            <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <span>↑ 2 new this month</span>
            </p>
          </div>

          {/* Stat 3: Total Applicants */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100/70 text-amber-600 flex items-center justify-center">
              <Users size={16} />
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Applicants
            </p>
            <h3 className="text-2xl font-black text-slate-900">{totalApplicantsCount || 156}</h3>
            <p className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
              <span>↗ 18 this month</span>
            </p>
          </div>

          {/* Stat 4: Shortlisted */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100/70 text-purple-600 flex items-center justify-center">
              <Bookmark size={16} />
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Shortlisted
            </p>
            <h3 className="text-2xl font-black text-slate-900">{shortlistedCount || 28}</h3>
            <p className="text-[11px] font-bold text-purple-600 flex items-center gap-1">
              <span>↗ 4 this month</span>
            </p>
          </div>

          {/* Stat 5: Hired */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-2 col-span-2 sm:col-span-1">
            <div className="w-8 h-8 rounded-xl bg-rose-100/70 text-rose-600 flex items-center justify-center">
              <UserCheck size={16} />
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hired</p>
            <h3 className="text-2xl font-black text-slate-900">{hiredCount || 6}</h3>
            <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
              <span>↗ 2 this month</span>
            </p>
          </div>
        </div>

        {/* Section Header: My Posted Jobs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">My Posted Jobs</h2>
          </div>

          {/* Controls Bar: Search, Status Filter & Sorting */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by job title or keyword..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="relative flex items-center gap-1.5">
                <Filter size={14} className="text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Jobs Table List */}
        {filteredJobs.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 items-center">
              <div className="col-span-3">Job Title</div>
              <div className="col-span-3">Applicants</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2">Posted On</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-slate-100">
              {filteredJobs.map((job) => {
                const appCount = job.applications?.length || 0;
                const dateInfo = formatDate(job.createdAt || job.created_at);
                const isOpen = job.isOpen !== false;

                return (
                  <div
                    key={job.id}
                    className="p-5 md:px-6 md:py-4 hover:bg-slate-50/50 transition-all flex flex-col md:grid md:grid-cols-12 gap-4 items-start md:items-center relative"
                  >
                    {/* Column 1: Job Title & Icon */}
                    <div className="col-span-3 flex items-start gap-3 min-w-0">
                      {getJobIcon(job.title)}
                      <div className="space-y-0.5 min-w-0">
                        <Link
                          to={`/job/${job.id}`}
                          className="font-extrabold text-slate-900 text-sm hover:text-blue-600 transition-colors line-clamp-1 block truncate"
                        >
                          {job.title}
                        </Link>
                        <p className="text-xs font-semibold text-slate-400 flex items-center gap-1 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block flex-shrink-0" />
                          <span className="truncate">{job.jobType || "Full-time"}</span>
                          <span>•</span>
                          <span className="truncate">{job.location || "Remote"}</span>
                        </p>
                      </div>
                    </div>

                    {/* Column 2: Applicants Progress */}
                    <div className="col-span-3 space-y-1.5 w-full">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-slate-900">
                          {appCount} Applicants
                        </span>
                      </div>

                      {/* Blue Progress Bar */}
                      <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, Math.max(15, appCount * 10))}%`,
                          }}
                        />
                      </div>

                      <p className="text-[11px] font-medium text-slate-400">
                        {Math.max(1, Math.floor(appCount * 0.4))} New •{" "}
                        {Math.max(0, Math.floor(appCount * 0.25))} Shortlisted
                      </p>
                    </div>

                    {/* Column 3: Status Badge */}
                    <div className="col-span-1 flex items-center">
                      {isOpen ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          Closed
                        </span>
                      )}
                    </div>

                    {/* Column 4: Posted On Date */}
                    <div className="col-span-2 space-y-0.5 min-w-0">
                      <p className="text-xs font-extrabold text-slate-800 whitespace-nowrap">{dateInfo.date}</p>
                      <p className="text-[11px] font-medium text-slate-400 whitespace-nowrap">{dateInfo.timeAgo}</p>
                    </div>

                    {/* Column 5: Action Buttons */}
                    <div className="col-span-3 flex items-center justify-end gap-2 w-full md:w-auto">
                      <Link
                        to={`/job/${job.id}`}
                        className="px-3 py-1.5 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 font-bold text-xs transition-all whitespace-nowrap"
                      >
                        View Applicants
                      </Link>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenDropdownId(openDropdownId === job.id ? null : job.id)
                          }
                          className="w-8 h-8 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-all cursor-pointer"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {/* Dropdown Menu */}
                        {openDropdownId === job.id && (
                          <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-fade-in-up">
                            <Link
                              to={`/job/${job.id}`}
                              onClick={() => setOpenDropdownId(null)}
                              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            >
                              <Eye size={14} className="text-slate-400" />
                              View Job Page
                            </Link>

                            <button
                              type="button"
                              onClick={() => {
                                setOpenDropdownId(null);
                                handleToggleStatus(job.id, isOpen);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 text-left"
                            >
                              {isOpen ? (
                                <>
                                  <ToggleLeft size={14} className="text-amber-500" />
                                  Close Hiring
                                </>
                              ) : (
                                <>
                                  <ToggleRight size={14} className="text-emerald-500" />
                                  Reopen Hiring
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setOpenDropdownId(null);
                                handleDeleteJob(job.id);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 text-left border-t border-slate-100"
                            >
                              <Trash2 size={14} />
                              Delete Job
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Briefcase size={24} />
            </div>
            <h3 className="text-base font-extrabold text-slate-800">No jobs posted yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Post your first job opening to start receiving top candidate applications.
            </p>
            <Link
              to="/post-job"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
            >
              <Plus size={16} />
              <span>Post a Job</span>
            </Link>
          </div>
        )}

        {/* Pagination Footer */}
        {filteredJobs.length > 0 && (
          <div className="flex items-center justify-between pt-2 text-xs text-slate-500 font-medium">
            <span>
              Showing 1 to {filteredJobs.length} of {totalJobsCount} jobs
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled
                className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 flex items-center justify-center disabled:opacity-50"
              >
                &lt;
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center"
              >
                1
              </button>
              <button
                type="button"
                disabled
                className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 flex items-center justify-center disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatedJobs;
