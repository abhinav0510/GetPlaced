/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  BadgeCheck,
  Briefcase,
  Building2,
  Calendar,
  ChevronRight,
  Download,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { updateApplicationStatus } from "@/api/apiApplication";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

const ApplicationCard = ({ application, isCandidate = false }) => {
  const handleDownload = (e) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = application?.resumeUrl || application?.resume;
    link.target = "_blank";
    link.click();
  };

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateApplicationStatus,
    {
      job_id: application?.job_id || application?.job?.id,
    }
  );

  const handleStatusChange = (status) => {
    fnHiringStatus(status).then(() => fnHiringStatus());
  };

  // Format date nicely
  const formatDate = (dateStr) => {
    if (!dateStr) return "12 May 2024";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "12 May 2024";
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "12 May 2024";
    }
  };

  const status = (application?.status || "APPLIED").toUpperCase();

  const getStatusBadge = () => {
    switch (status) {
      case "INTERVIEW":
      case "INTERVIEWING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
            Interview
          </span>
        );
      case "UNDER REVIEW":
      case "REVIEWING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Under Review
          </span>
        );
      case "OFFERED":
      case "HIRED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Offered
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Rejected
          </span>
        );
      case "APPLIED":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Applied
          </span>
        );
    }
  };

  const [imgError, setImgError] = useState(false);

  const companyName = application?.job?.company?.name || "Catlin Tablet";
  const companyLogo = application?.job?.company?.logoUrl || application?.job?.company?.logo_url;
  const companyInitials = companyName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all group">
      {loadingHiringStatus && <BarLoader width={"100%"} color="#2563eb" className="mb-2" />}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left Section: Company Logo & Details */}
        <div className="flex items-start gap-4">
          {/* Logo Box */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-2xs">
            {companyLogo && !imgError ? (
              <img
                src={companyLogo}
                alt={companyName}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover rounded-2xl p-1 bg-white"
              />
            ) : (
              <span>{companyInitials || "CT"}</span>
            )}
          </div>

          {/* Info Stack */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to={`/job/${application?.job?.id || application?.job_id}`}
                className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-blue-600 transition-colors line-clamp-1"
              >
                {application?.job?.title || "Senior Full Stack Developer"}
              </Link>
            </div>

            {/* Company Name */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600">
              <span>{companyName}</span>
              <BadgeCheck size={16} className="text-blue-500 fill-blue-500 text-white" />
            </div>

            {/* Metadata Pills */}
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500 pt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-slate-400" />
                {application?.job?.location || application?.location || "Chhattisgarh, India"}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase size={13} className="text-slate-400" />
                {application?.job?.jobType || "Full-time"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={13} className="text-slate-400" />
                Applied on {formatDate(application?.createdAt || application?.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Status, ID & Action */}
        <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="flex items-center gap-3">
            {getStatusBadge()}
            
            {(application?.resumeUrl || application?.resume) && (
              <button
                type="button"
                onClick={handleDownload}
                title="Download Resume"
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 bg-slate-50 hover:bg-blue-50 transition-all cursor-pointer"
              >
                <Download size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-semibold text-slate-400 tracking-wider">
              Application ID: #GP100{application?.id || "12345"}
            </span>

            {!isCandidate ? (
              <Select
                onValueChange={handleStatusChange}
                defaultValue={application?.status}
              >
                <SelectTrigger className="w-36 h-8 text-xs font-semibold">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="interviewing">Interviewing</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Link
                to={`/job/${application?.job?.id || application?.job_id}`}
                className="w-8 h-8 rounded-full border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-400 hover:text-blue-600 flex items-center justify-center transition-all"
              >
                <ChevronRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
