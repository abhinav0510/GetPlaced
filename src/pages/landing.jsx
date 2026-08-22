import { useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import companies from "../data/companies.json";
import faqs from "../data/faq.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Briefcase,
  Users,
  Search,
  FileCheck,
  Building2,
  ShieldCheck,
  Headphones,
  ChevronRight,
  Code2,
  Database,
  Lock,
  Paintbrush,
  FormInput,
  FileText,
  Navigation,
} from "lucide-react";

const faqIcons = [Code2, Database, Lock, Paintbrush, FormInput, FileText, Navigation];

const LandingPage = () => {
  const { user, isLoaded } = useAuth();

  // Add light theme class to body on mount, remove on unmount
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    document.body.parentElement.classList.add("landing-active");

    return () => {
      // Restore dark theme when navigating away
      const savedTheme = localStorage.getItem("vite-ui-theme");
      if (savedTheme === "dark") {
        root.classList.add("dark");
      }
      document.body.parentElement.classList.remove("landing-active");
    };
  }, []);

  const handleRoleSelection = async (role) => {
    if (user) {
      await user.update({ unsafeMetadata: { role } });
    }
  };

  return (
    <main className="flex flex-col gap-0 relative overflow-hidden" style={{ background: '#ffffff', color: '#1a1a2e' }}>

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-8 pb-10 sm:pt-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Decorative dot patterns */}
        <div className="dot-pattern absolute top-8 left-4 w-24 h-24 sm:w-32 sm:h-32 opacity-40 animate-pulse-gentle" />
        <div className="dot-pattern absolute top-20 right-16 w-20 h-20 sm:w-28 sm:h-28 opacity-30 animate-pulse-gentle" style={{ animationDelay: '1.5s' }} />
        <div className="dot-pattern absolute bottom-20 left-1/4 w-16 h-16 opacity-25 hidden sm:block" />

        {/* Decorative SVG elements */}
        <svg className="absolute top-16 left-28 w-4 h-4 deco-triangle animate-float hidden sm:block" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 22,22 2,22" />
        </svg>
        <svg className="absolute top-32 left-12 w-3 h-3 deco-circle animate-float-reverse hidden sm:block" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" />
        </svg>
        <svg className="absolute top-12 right-10 w-8 h-8 deco-arrow animate-float hidden sm:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>

        {/* Main headline */}
        <div className="text-center animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            <span className="landing-gradient-title">Find Your </span>
            <span className="text-brand-blue">Dream Job</span>
            <br />
            <span className="flex items-center justify-center gap-3 sm:gap-5 mt-2">
              <span className="landing-gradient-title">and</span>
              <img
                src="/logo.png"
                className="h-14 sm:h-24 lg:h-32 object-contain"
                alt="getPlaced Logo"
              />
            </span>
          </h1>
          <p className="text-gray-500 mt-4 sm:mt-6 text-sm sm:text-lg max-w-xl mx-auto">
            Explore thousands of job listings or find the perfect candidate
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 sm:gap-6 justify-center mt-8 sm:mt-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          {isLoaded && (!user?.unsafeMetadata?.role || user.unsafeMetadata.role === "candidate") && (
            <Link to="/jobs">
              <button
                className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 sm:px-10 py-3.5 sm:py-4 rounded-full text-sm sm:text-base transition-all duration-300 shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:scale-[1.03]"
                onClick={() => {
                  localStorage.setItem("intended_role", "candidate");
                  if (user && !user.unsafeMetadata?.role) {
                    handleRoleSelection("candidate");
                  }
                }}
              >
                <Search size={18} />
                Find Jobs
                <ChevronRight size={16} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
              </button>
            </Link>
          )}
          {isLoaded && (!user?.unsafeMetadata?.role || user.unsafeMetadata.role === "recruiter") && (
            <Link to="/post-job">
              <button
                className="group flex items-center gap-2 border-2 border-blue-200 hover:border-blue-400 text-blue-700 hover:text-blue-800 font-semibold px-7 sm:px-10 py-3.5 sm:py-4 rounded-full text-sm sm:text-base transition-all duration-300 bg-white hover:bg-blue-50/50 hover:scale-[1.03]"
                onClick={() => {
                  localStorage.setItem("intended_role", "recruiter");
                  if (user && !user.unsafeMetadata?.role) {
                    handleRoleSelection("recruiter");
                  }
                }}
              >
                <Users size={18} />
                Post a Job
              </button>
            </Link>
          )}
          {!isLoaded && (
            <>
              <button className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-7 sm:px-10 py-3.5 sm:py-4 rounded-full text-sm sm:text-base opacity-60 cursor-not-allowed shadow-lg shadow-blue-200" disabled>
                <Search size={18} />
                Find Jobs
              </button>
              <button className="flex items-center gap-2 border-2 border-blue-200 text-blue-700 font-semibold px-7 sm:px-10 py-3.5 sm:py-4 rounded-full text-sm sm:text-base opacity-60 cursor-not-allowed" disabled>
                <Users size={18} />
                Post a Job
              </button>
            </>
          )}
        </div>
      </section>

      {/* ===== COMPANY LOGOS BAR ===== */}
      <section className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <div className="companies-bar rounded-2xl mx-4 sm:mx-8 lg:mx-auto max-w-6xl py-5 px-6">
          <Carousel
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="flex items-center gap-4 sm:gap-8">
              {companies.map(({ name, id, path }) => (
                <CarouselItem key={id} className="basis-1/3 lg:basis-1/6 flex items-center justify-center">
                  <img
                    src={path}
                    alt={name}
                    className="h-7 sm:h-10 object-contain grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* ===== HERO BANNER IMAGE ===== */}
      <section className="px-4 sm:px-8 lg:px-0 max-w-5xl mx-auto w-full mt-10 sm:mt-14 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
        <div className="banner-container">
          <img
            src="/banner-new.png"
            className="w-full h-auto"
            alt="getPlaced - Your dream job is closer than you think"
          />
        </div>
      </section>

      {/* ===== FEATURE CARDS ===== */}
      <section className="px-4 sm:px-8 lg:px-0 max-w-5xl mx-auto w-full mt-10 sm:mt-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Job Seekers Card */}
          <div className="feature-card flex items-start gap-4 animate-slide-in-left">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <Briefcase size={26} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">For Job Seekers</h3>
              <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                Search and apply for jobs, track applications, and more.
              </p>
            </div>
          </div>

          {/* Employers Card */}
          <div className="feature-card flex items-start gap-4 animate-slide-in-right">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-red-100 to-rose-200 flex items-center justify-center">
              <Building2 size={26} className="text-red-500" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">For Employers</h3>
              <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                Post jobs, manage applications, and find the best candidates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="px-4 sm:px-8 lg:px-0 max-w-5xl mx-auto w-full mt-14 sm:mt-20 mb-4">
        {/* Divider with dots */}
        <div className="faq-divider">
          <div className="faq-divider-dot" />
          <div className="faq-divider-dot" style={{ width: 6, height: 6 }} />
          <div className="faq-divider-dot" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-8 sm:mb-12 faq-section-title tracking-tight">
          Everything <span className="highlight">You Need to Know</span>
        </h2>

        <Accordion type="multiple" className="w-full space-y-3 stagger-children">
          {faqs.map((faq, index) => {
            const IconComp = faqIcons[index] || Code2;
            return (
              <AccordionItem
                key={index}
                value={`item-${index + 1}`}
                className="landing-faq-item animate-fade-in-up"
                style={{ animationDelay: `${0.1 * (index + 1)}s`, opacity: 0 }}
              >
                <AccordionTrigger className="text-left text-sm sm:text-base font-medium text-gray-800 hover:text-blue-700 hover:no-underline px-2 py-3">
                  <span className="flex items-center gap-3">
                    <IconComp size={18} className="text-blue-400 flex-shrink-0" />
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 text-sm leading-relaxed px-2 pb-3 pl-10">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </section>

      {/* ===== BOTTOM STATS BAR ===== */}
      <section className="stats-bar mt-14 sm:mt-20 py-6 sm:py-8 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="stat-item">
            <div className="stat-icon blue">
              <Briefcase size={22} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm sm:text-base">Thousands of Jobs</p>
              <p className="text-gray-400 text-xs sm:text-sm">From top companies</p>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon indigo">
              <FileCheck size={22} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm sm:text-base">Easy Application</p>
              <p className="text-gray-400 text-xs sm:text-sm">Apply in just a few clicks</p>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon violet">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm sm:text-base">Verified Employers</p>
              <p className="text-gray-400 text-xs sm:text-sm">Trusted by professionals</p>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon cyan">
              <Headphones size={22} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm sm:text-base">24/7 Support</p>
              <p className="text-gray-400 text-xs sm:text-sm">We&apos;re here to help</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
