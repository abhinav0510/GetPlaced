import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 transition-colors duration-300">
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Header />
        </div>
        <Outlet />
      </main>
      <footer className="py-8 text-center bg-white border-t border-slate-200/80 text-slate-500 text-xs sm:text-sm font-medium mt-16 shadow-2xs">
        © 2024 getPlaced — Connecting Talent to Opportunity.
      </footer>
    </div>
  );
};

export default AppLayout;
