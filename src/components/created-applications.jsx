import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import ApplicationCard from "./application-card";
import { getApplications } from "@/api/apiApplication";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  LayoutGrid,
  Lightbulb,
  Search,
  Send,
  UserCheck,
  UserPlus,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const CreatedApplications = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("recent");

  const {
    loading: loadingApplications,
    data: applications,
    fn: fnApplications,
  } = useFetch(getApplications, {
    user_id: user?.id,
  });

  useEffect(() => {
    if (user?.id) {
      fnApplications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Calculate overview metrics
  const stats = {
    total: applications?.length || 0,
    applied: applications?.filter((a) => (a.status || "").toLowerCase() === "applied").length || 0,
    underReview: applications?.filter(
      (a) =>
        (a.status || "").toLowerCase() === "under review" ||
        (a.status || "").toLowerCase() === "reviewing"
    ).length || 0,
    interview: applications?.filter(
      (a) =>
        (a.status || "").toLowerCase() === "interview" ||
        (a.status || "").toLowerCase() === "interviewing"
    ).length || 0,
    offered: applications?.filter(
      (a) =>
        (a.status || "").toLowerCase() === "offered" ||
        (a.status || "").toLowerCase() === "hired"
    ).length || 0,
    rejected: applications?.filter((a) => (a.status || "").toLowerCase() === "rejected").length || 0,
  };

  // Filter & sort logic
  const filteredApplications = (applications || [])
    .filter((app) => {
      // Tab filter
      if (activeTab === "Applied") return (app.status || "").toLowerCase() === "applied";
      if (activeTab === "Under Review")
        return (
          (app.status || "").toLowerCase() === "under review" ||
          (app.status || "").toLowerCase() === "reviewing"
        );
      if (activeTab === "Interview")
        return (
          (app.status || "").toLowerCase() === "interview" ||
          (app.status || "").toLowerCase() === "interviewing"
        );
      if (activeTab === "Offered")
        return (
          (app.status || "").toLowerCase() === "offered" ||
          (app.status || "").toLowerCase() === "hired"
        );
      if (activeTab === "Rejected") return (app.status || "").toLowerCase() === "rejected";
      return true;
    })
    .filter((app) => {
      // Search filter
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const title = app?.job?.title?.toLowerCase() || "";
      const company = app?.job?.company?.name?.toLowerCase() || "";
      return title.includes(q) || company.includes(q);
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.created_at || 0).getTime();
      const dateB = new Date(b.createdAt || b.created_at || 0).getTime();
      return sortOrder === "recent" ? dateB - dateA : dateA - dateB;
    });

  if (loadingApplications) {
    return (
      <div className="py-12">
        <BarLoader width={"100%"} color="#2563eb" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Row with Title & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Applications
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Track your applications and stay updated on your progress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title or company..."
              className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Filters Button */}
          <button
            type="button"
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <Filter size={14} className="text-slate-500" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Sidebar & Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Overview & Tips Cards) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: Application Overview */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Application Overview
            </h3>

            <div className="space-y-3">
              {/* Total Applications */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <LayoutGrid size={14} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">Total Applications</span>
                </div>
                <span className="text-sm font-extrabold text-slate-900">{stats.total}</span>
              </div>

              {/* Applied */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Send size={14} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">Applied</span>
                </div>
                <span className="text-sm font-extrabold text-blue-600">{stats.applied}</span>
              </div>

              {/* Under Review */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock size={14} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">Under Review</span>
                </div>
                <span className="text-sm font-extrabold text-amber-600">{stats.underReview}</span>
              </div>

              {/* Interview */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <UserCheck size={14} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">Interview</span>
                </div>
                <span className="text-sm font-extrabold text-purple-600">{stats.interview}</span>
              </div>

              {/* Offered */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 size={14} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">Offered</span>
                </div>
                <span className="text-sm font-extrabold text-emerald-600">{stats.offered}</span>
              </div>

              {/* Rejected */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                    <XCircle size={14} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">Rejected</span>
                </div>
                <span className="text-sm font-extrabold text-rose-600">{stats.rejected}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Quick Tip */}
          <div className="bg-gradient-to-br from-blue-50/80 via-blue-50/40 to-indigo-50/60 rounded-2xl p-5 border border-blue-100/80 shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <Lightbulb size={14} />
              </div>
              <h4 className="text-xs font-bold text-blue-900">Quick Tip</h4>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Tailor your resume for each job application to increase your chances of getting shortlisted.
            </p>
          </div>

          {/* Card 3: Improve Your Profile */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserPlus size={20} />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">Improve your profile</h4>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Complete your profile to get better job recommendations.
              </p>
            </div>
            <Link
              to="/my-profile"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-600 hover:text-blue-700 pt-1 transition-colors"
            >
              Update Profile <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Right Column (Applications List) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Filter Tabs Row */}
          <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-2xs flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-1">
              {["All", "Applied", "Under Review", "Interview", "Offered", "Rejected"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-blue-600 text-white shadow-2xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Sort Toggle */}
            <div className="hidden sm:flex items-center gap-1 pr-2">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Cards Stack */}
          {filteredApplications.length > 0 ? (
            <div className="space-y-3.5">
              {filteredApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  isCandidate={true}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FileText size={24} />
              </div>
              <h3 className="text-base font-extrabold text-slate-800">No applications found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {activeTab !== "All"
                  ? `You have no applications under "${activeTab}".`
                  : "You haven't submitted any job applications yet. Explore available jobs and apply today!"}
              </p>
              <Link
                to="/jobs"
                className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
              >
                Browse Jobs
              </Link>
            </div>
          )}

          {/* Pagination Footer */}
          {filteredApplications.length > 0 && (
            <div className="flex items-center justify-between pt-4 text-xs text-slate-500 font-medium">
              <span>
                Showing 1 to {filteredApplications.length} of {filteredApplications.length} applications
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
    </div>
  );
};

export default CreatedApplications;
