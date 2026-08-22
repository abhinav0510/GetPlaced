import { getCompanies } from "@/api/apiCompanies";
import { addNewJob } from "@/api/apiJobs";
import AddCompanyDrawer from "@/components/add-company-drawer";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { useAuth } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { State } from "country-state-city";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { z } from "zod";
import {
  Briefcase,
  Building2,
  FileText,
  MapPin,
  Send,
  ShieldCheck,
  SquarePen,
  Target,
  Users,
  Zap,
} from "lucide-react";

const schema = z.object({
  title: z.string().min(1, { message: "Job title is required" }),
  description: z.string().min(1, { message: "Job description is required" }),
  location: z.string().min(1, { message: "Please select a location" }),
  company_id: z.string().min(1, { message: "Please select or add a company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
});

const PostJob = () => {
  const { user, isLoaded } = useAuth();
  const navigate = useNavigate();
  const [draftSaved, setDraftSaved] = useState(false);

  // Add light theme class to document root on mount
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");

    return () => {
      const savedTheme = localStorage.getItem("vite-ui-theme");
      if (savedTheme === "dark") {
        root.classList.add("dark");
      }
    };
  }, []);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      company_id: "",
      requirements: "",
    },
    resolver: zodResolver(schema),
  });

  const descriptionValue = watch("description") || "";
  const wordCount = descriptionValue.trim() ? descriptionValue.trim().split(/\s+/).filter(Boolean).length : 0;

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);

  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });
  };

  useEffect(() => {
    if (dataCreateJob?.length > 0) navigate("/jobs");
  }, [loadingCreateJob, dataCreateJob, navigate]);

  const {
    loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  const handleSaveDraft = () => {
    const formValues = watch();
    localStorage.setItem("job_post_draft", JSON.stringify(formValues));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 3000);
  };

  if (!isLoaded || loadingCompanies) {
    return (
      <div className="py-12 px-4 max-w-7xl mx-auto">
        <BarLoader className="mb-4 rounded-full" width={"100%"} color="#2563eb" />
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto text-slate-900">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

        {/* ===== LEFT COLUMN: DARK SIDEBAR CARD ===== */}
        <div className="lg:col-span-4 bg-[#080c14] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col justify-between border border-slate-800">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              Hire Top<br />Talent, <span className="text-blue-500">Fast</span>
            </h2>
            <div className="w-12 h-1 bg-blue-500 rounded-full mt-3 mb-4" />
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Post your job in minutes and connect with skilled professionals ready to make an impact.
            </p>
          </div>

          {/* Central 3D Briefcase Illustration */}
          <div className="my-6 sm:my-8 flex items-center justify-center relative">
            <img
              src="/hire-talent-banner.png"
              alt="Hire Top Talent Illustration"
              className="w-full max-w-[240px] sm:max-w-[270px] h-auto object-contain rounded-2xl drop-shadow-[0_12px_30px_rgba(37,99,235,0.3)] transition-transform hover:scale-105 duration-500"
            />
          </div>

          {/* 4 Feature Points */}
          <div className="space-y-4 pt-2 border-t border-slate-800/80">
            {/* Feature 1 */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Users size={18} />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-white">Targeted Reach</h4>
                <p className="text-slate-400 text-xs mt-0.5 leading-snug">
                  Reach the right audience actively looking for opportunities.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Zap size={18} />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-white">Quick & Easy</h4>
                <p className="text-slate-400 text-xs mt-0.5 leading-snug">
                  Post in minutes and start receiving applications.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-white">Verified Candidates</h4>
                <p className="text-slate-400 text-xs mt-0.5 leading-snug">
                  Connect with pre-screened and verified professionals.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Target size={18} />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-white">Smart Matching</h4>
                <p className="text-slate-400 text-xs mt-0.5 leading-snug">
                  AI-powered matching to help you find the perfect fit.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== RIGHT COLUMN: MAIN FORM CARD ===== */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10">
          {/* Card Header */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 flex-shrink-0">
              <SquarePen size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Post a Job</h1>
              <p className="text-slate-500 text-sm mt-0.5">Fill in the details below to post your job opening.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* ===== JOB TITLE ===== */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="e.g. Senior Full Stack Developer"
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all shadow-2xs"
                  {...register("title")}
                />
              </div>
              {errors.title && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.title.message}</p>}
            </div>

            {/* ===== JOB DESCRIPTION ===== */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Job Description <span className="text-red-500">*</span>
              </label>
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all post-job-editor shadow-2xs">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <MDEditor
                      value={field.value}
                      onChange={(val) => {
                        field.onChange(val || "");
                        setValue("requirements", val || "");
                      }}
                      preview="edit"
                      height={240}
                      className="border-none shadow-none"
                    />
                  )}
                />
                <div className="flex justify-between items-center px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 text-xs text-slate-400">
                  <span className="truncate mr-2">Describe the role, responsibilities, requirements, and benefits...</span>
                  <span className="font-medium text-slate-500 flex-shrink-0">{wordCount} / 2000 words</span>
                </div>
              </div>
              {errors.description && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.description.message}</p>}
            </div>

            {/* ===== LOCATION & COMPANY ROW ===== */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pt-2">
              {/* Job Location */}
              <div className="md:col-span-5">
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Job Location <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full h-[48px] bg-white border-slate-200 text-slate-900 rounded-xl px-4 text-sm focus:ring-2 focus:ring-blue-500 shadow-2xs">
                        <div className="flex items-center gap-2.5 text-slate-900 overflow-hidden">
                          <MapPin size={18} className="text-slate-400 flex-shrink-0" />
                          <SelectValue placeholder="e.g. Chennai, India" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-white text-slate-900 border-slate-200 max-h-60">
                        <SelectGroup>
                          {State.getStatesOfCountry("IN").map(({ name }) => (
                            <SelectItem key={name} value={name}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.location && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.location.message}</p>}
              </div>

              {/* Company */}
              <div className="md:col-span-4">
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Company
                </label>
                <Controller
                  name="company_id"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full h-[48px] bg-white border-slate-200 text-slate-900 rounded-xl px-4 text-sm focus:ring-2 focus:ring-blue-500 shadow-2xs">
                        <div className="flex items-center gap-2.5 text-slate-900 overflow-hidden">
                          <Building2 size={18} className="text-slate-400 flex-shrink-0" />
                          <SelectValue placeholder="Select or add a company">
                            {field.value
                              ? companies?.find((com) => com.id === Number(field.value))?.name
                              : "Select or add a company"}
                          </SelectValue>
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-white text-slate-900 border-slate-200">
                        <SelectGroup>
                          {companies?.map(({ name, id }) => (
                            <SelectItem key={name} value={id}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.company_id && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.company_id.message}</p>}
              </div>

              {/* Add Company Drawer */}
              <div className="md:col-span-3 pt-0 md:pt-7">
                <AddCompanyDrawer fetchCompanies={fnCompanies} />
              </div>
            </div>

            {/* Error notifications */}
            {errorCreateJob?.message && (
              <p className="text-red-500 text-sm font-medium">{errorCreateJob?.message}</p>
            )}
            {loadingCreateJob && <BarLoader width={"100%"} color="#2563eb" />}

            {/* Draft Saved Toast */}
            {draftSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                ✓ Draft saved to local storage!
              </div>
            )}

            {/* ===== FOOTER ACTIONS ===== */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="w-full sm:w-auto px-5 py-3 border border-slate-200 rounded-xl text-slate-700 bg-white hover:bg-slate-50 font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <FileText size={18} className="text-slate-400" />
                Save as Draft
              </button>

              <button
                type="submit"
                disabled={loadingCreateJob}
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 cursor-pointer disabled:opacity-50"
              >
                <Send size={18} />
                Submit
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default PostJob;
