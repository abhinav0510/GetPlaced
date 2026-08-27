import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { State } from "country-state-city";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";

import JobCard from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Building2, SlidersHorizontal, Sparkles, Frown } from "lucide-react";

import { getCompanies } from "@/api/apiCompanies";
import { getJobs } from "@/api/apiJobs";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");

  const { isLoaded } = useAuth();

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

  const { data: companies, fn: fnCompanies } = useFetch(getCompanies);

  const {
    loading: loadingJobs,
    data: jobs,
    fn: fnJobs,
  } = useFetch(getJobs, {
    location: location === "all_locations" ? "" : location,
    company_id: company_id === "all_companies" ? "" : company_id,
    searchQuery,
  });

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, location, company_id, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    const query = formData.get("search-query");
    setSearchQuery(query || "");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
  };

  if (!isLoaded) {
    return (
      <div className="py-12 px-4 max-w-7xl mx-auto">
        <BarLoader className="mb-4 rounded-full" width={"100%"} color="#2563eb" />
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* ===== HERO HEADER SECTION ===== */}
      <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 sm:p-10 mb-8 shadow-2xs relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Decorative subtle background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Left Headline */}
        <div className="relative z-10 max-w-xl text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span>Latest</span>
            <span className="text-blue-600 relative inline-flex items-center gap-1">
              Jobs
              <Sparkles size={22} className="text-blue-500 animate-pulse" />
            </span>
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full my-3 mx-auto md:mx-0" />
          <p className="text-slate-500 text-sm sm:text-base font-normal mt-2 leading-relaxed">
            Discover exciting opportunities and take the next step in your career.
          </p>
        </div>

        {/* Right 3D Illustration Graphic */}
        <div className="relative z-10 flex-shrink-0 w-full md:w-80 lg:w-[420px] h-48 sm:h-56 md:h-60 flex items-center justify-center">
          <img
            src="/job-hero-3d.png"
            alt="Latest Jobs 3D Illustration"
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-500 drop-shadow-md"
          />
        </div>
      </div>

      {/* ===== SEARCH & FILTERS CONTROL BAR ===== */}
      <div className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-6 shadow-2xs mb-8 space-y-4">
        {/* Search Bar Form */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search jobs by title, keyword..."
              name="search-query"
              defaultValue={searchQuery}
              className="w-full h-[52px] pl-11 pr-4 bg-slate-50/50 border-slate-200/80 rounded-2xl text-slate-900 placeholder:text-slate-400 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs"
            />
          </div>
          <Button
            type="submit"
            className="w-full sm:w-auto h-[52px] px-8 bg-slate-950 hover:bg-slate-900 text-white font-semibold rounded-2xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search size={16} />
            <span>Search</span>
          </Button>
        </form>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Filter by Location */}
          <div className="md:col-span-5">
            <Select
              value={location}
              onValueChange={(val) => setLocation(val === "all_locations" ? "" : val)}
            >
              <SelectTrigger className="w-full h-[48px] bg-slate-50/50 border-slate-200/80 rounded-2xl px-4 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-100 shadow-2xs">
                <div className="flex items-center gap-2.5 text-slate-800 truncate">
                  <MapPin size={17} className="text-slate-400 flex-shrink-0" />
                  <SelectValue placeholder="All Locations" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 max-h-60 text-slate-900">
                <SelectItem value="all_locations">All Locations</SelectItem>
                <SelectGroup>
                  {State.getStatesOfCountry("IN").map(({ name }) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Filter by Company */}
          <div className="md:col-span-5">
            <Select
              value={company_id}
              onValueChange={(val) => setCompany_id(val === "all_companies" ? "" : val)}
            >
              <SelectTrigger className="w-full h-[48px] bg-slate-50/50 border-slate-200/80 rounded-2xl px-4 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-100 shadow-2xs">
                <div className="flex items-center gap-2.5 text-slate-800 truncate">
                  <Building2 size={17} className="text-slate-400 flex-shrink-0" />
                  <SelectValue placeholder="All Companies" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 max-h-60 text-slate-900">
                <SelectItem value="all_companies">All Companies</SelectItem>
                <SelectGroup>
                  {companies?.map(({ name, id }) => (
                    <SelectItem key={id} value={String(id)}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          <div className="md:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
              className="w-full h-[48px] border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
            >
              <SlidersHorizontal size={15} className="text-slate-500" />
              <span>Clear Filters</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ===== JOBS GRID LISTING ===== */}
      {loadingJobs && (
        <div className="py-8">
          <BarLoader className="mb-4 rounded-full" width={"100%"} color="#2563eb" />
        </div>
      )}

      {!loadingJobs && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs?.length ? (
            jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                savedInit={job?.saved?.length > 0}
              />
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-white border border-slate-100 rounded-3xl p-8 shadow-2xs">
              <Frown size={48} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-lg font-bold text-slate-900">No Jobs Found</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                We couldn&apos;t find any jobs matching your current search or filter criteria. Try clearing filters or searching for another keyword.
              </p>
              <Button
                onClick={clearFilters}
                className="mt-5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl cursor-pointer"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;
