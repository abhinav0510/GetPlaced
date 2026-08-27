/* eslint-disable react/prop-types */
import {
  Bookmark,
  MapPin,
  Trash2Icon,
  XCircle,
  CheckCircle2,
  DollarSign,
  Award,
  Building2,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { deleteJob, saveJob, updateHiringStatus } from "@/api/apiJobs";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const formatPostedDate = (createdAt) => {
  if (!createdAt) return "Posted recently";
  const date = new Date(createdAt);
  if (isNaN(date.getTime())) return "Posted recently";
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Posted today";
  if (diffDays === 1) return "Posted yesterday";
  if (diffDays < 7) return `Posted ${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Posted ${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }
  return `Posted ${date.toLocaleDateString()}`;
};

const JobCard = ({
  job,
  savedInit = false,
  onJobAction = () => {},
  isMyJob = false,
}) => {
  const [saved, setSaved] = useState(savedInit);
  const { user } = useAuth();

  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
    job_id: job.id,
  });

  const { loading: loadingStatusToggle, fn: fnStatusToggle } = useFetch(
    updateHiringStatus,
    {
      job_id: job.id,
    }
  );

  const {
    loading: loadingSavedJob,
    data: savedJob,
    fn: fnSavedJob,
  } = useFetch(saveJob);

  const handleSaveJob = async () => {
    await fnSavedJob({
      user_id: user?.id,
      job_id: job.id,
    });
    setSaved(!saved);
    onJobAction();
  };

  const handleDeleteJob = async () => {
    await fnDeleteJob();
    onJobAction();
  };

  const handleToggleHiringStatus = async () => {
    const nextStatus = !job.isOpen;
    await fnStatusToggle(nextStatus);
    onJobAction();
  };

  useEffect(() => {
    if (savedJob !== undefined) setSaved(savedJob?.length > 0);
  }, [savedJob]);

  const shortDesc = job?.description
    ? job.description.indexOf(".") > 0
      ? job.description.substring(0, job.description.indexOf(".") + 1)
      : job.description.substring(0, 100) + "..."
    : "";

  return (
    <div
      className={`group bg-white border border-slate-100 rounded-3xl p-5 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
        job.isOpen === false ? "opacity-80 bg-slate-50/50" : ""
      }`}
    >
      {(loadingDeleteJob || loadingStatusToggle) && (
        <BarLoader className="absolute top-0 left-0 right-0 rounded-t-3xl" width={"100%"} color="#2563eb" />
      )}

      <div>
        {/* Top Card Row: Company Icon/Logo + Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-blue-50/80 border border-blue-100/60 flex items-center justify-center text-blue-600 flex-shrink-0 shadow-2xs">
            {job.company?.logoUrl || job.company?.logo_url ? (
              <img
                src={job.company.logoUrl || job.company.logo_url}
                alt={job.company?.name || "Company"}
                className="w-7 h-7 object-contain rounded-lg"
              />
            ) : (
              <Building2 size={20} className="text-blue-600" />
            )}
          </div>

          <div className="flex items-center gap-2">
            {isMyJob ? (
              <button
                type="button"
                onClick={handleDeleteJob}
                disabled={loadingDeleteJob}
                title="Delete Job"
                className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2Icon size={18} />
              </button>
            ) : (
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                  job.isOpen !== false
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100/80"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    job.isOpen !== false ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
                {job.isOpen !== false ? "Active" : "Closed"}
              </span>
            )}
          </div>
        </div>

        {/* Title and Company Name */}
        <div>
          <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
            {job.title}
          </h3>
          {job.company?.name && (
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              {job.company.name}
            </p>
          )}
        </div>

        {/* Separator line */}
        <div className="border-t border-slate-100 my-3.5" />

        {/* Location & Metadata Badges */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <MapPin size={14} className="text-blue-500 flex-shrink-0" />
            <span>{job.location}</span>
          </div>

          {(job.salary || job.experience) && (
            <div className="flex flex-wrap gap-2 text-xs font-medium pt-0.5">
              {job.salary && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50/90 text-emerald-700 border border-emerald-200/60 font-semibold text-xs">
                  <DollarSign size={13} className="text-emerald-600" />
                  {job.salary}
                </span>
              )}
              {job.experience && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50/90 text-blue-700 border border-blue-200/60 font-semibold text-xs">
                  <Award size={13} className="text-blue-600" />
                  {job.experience}
                </span>
              )}
            </div>
          )}

          {shortDesc && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1">
              {shortDesc}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
        {/* Date + Save Icon Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <Clock size={13} className="text-slate-400" />
            <span>{formatPostedDate(job.createdAt || job.created_at)}</span>
          </div>

          {!isMyJob && (
            <button
              type="button"
              onClick={handleSaveJob}
              disabled={loadingSavedJob}
              className={`w-9 h-9 border rounded-xl flex items-center justify-center transition-all bg-white shadow-2xs cursor-pointer ${
                saved
                  ? "border-blue-200 bg-blue-50 text-blue-600"
                  : "border-slate-200 text-slate-400 hover:text-blue-600 hover:border-slate-300"
              }`}
              title={saved ? "Saved Job" : "Save Job"}
            >
              <Bookmark
                size={16}
                className={saved ? "fill-blue-600 text-blue-600" : ""}
              />
            </button>
          )}
        </div>

        {/* More Details Full Width Button */}
        <div className="w-full">
          <Link to={`/job/${job.id}`}>
            <Button
              variant="ghost"
              className="w-full bg-slate-50 hover:bg-slate-100/90 border border-slate-200/70 text-slate-800 font-semibold py-2.5 h-11 rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <span>More Details</span>
              <ArrowRight size={15} className="text-slate-500" />
            </Button>
          </Link>

          {/* Recruiter Actions: Close Hiring / Re-open Hiring */}
          {isMyJob && (
            <div className="w-full pt-2">
              {job.isOpen !== false ? (
                <button
                  type="button"
                  onClick={handleToggleHiringStatus}
                  disabled={loadingStatusToggle}
                  className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <XCircle size={15} className="text-amber-600" />
                  Close Hiring
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleToggleHiringStatus}
                  disabled={loadingStatusToggle}
                  className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  Re-open Hiring
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
