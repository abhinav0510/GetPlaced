import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";
import { Briefcase, PenBox, User, LogOut, Bookmark, FileText } from "lucide-react";
import AuthModal from "./auth-modal";

const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [search, setSearch] = useSearchParams();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (search.get("sign-in") === "true") {
      setShowAuthModal(true);
    }
  }, [search]);

  return (
    <>
      <nav className="py-4 flex justify-between items-center transition-colors duration-300">
        <Link to="/">
          <img src="/logo.png" className="h-12 sm:h-16 object-contain" alt="getPlaced Logo" />
        </Link>

        <div className="flex gap-3 sm:gap-4 items-center">
          {user?.unsafeMetadata?.role !== "recruiter" && (
            <Link to="/jobs">
              <button className="flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-medium px-4 py-2 rounded-xl text-sm transition-all shadow-xs cursor-pointer">
                <Briefcase size={17} className="text-blue-600" />
                View Jobs
              </button>
            </Link>
          )}

          {user?.unsafeMetadata?.role === "recruiter" && (
            <Link to="/post-job">
              <button className="flex items-center gap-2 bg-slate-950 hover:bg-slate-900 text-white font-medium px-4 py-2 rounded-xl text-sm transition-all shadow-sm cursor-pointer">
                <PenBox size={17} className="text-blue-400" />
                Post a Job
              </button>
            </Link>
          )}

          {!user ? (
            <Button
              variant="outline"
              onClick={() => setShowAuthModal(true)}
              className="rounded-xl border-blue-600 text-blue-700 hover:bg-blue-50 font-semibold text-xs sm:text-sm px-5 py-2 cursor-pointer"
            >
              Login
            </Button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shadow-md shadow-blue-500/20 hover:opacity-90 transition-all cursor-pointer overflow-hidden border border-white/20"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : user.name ? (
                  user.name.charAt(0).toUpperCase()
                ) : (
                  <User size={18} />
                )}
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in-up">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md capitalize">
                      {user.unsafeMetadata?.role || "candidate"}
                    </span>
                  </div>

                  <Link
                    to="/my-profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <User size={15} className="text-slate-400" />
                      My Profile
                    </div>
                    {user.unsafeMetadata?.role === "recruiter" && !user.profileCompleted && (
                      <span className="w-2 h-2 rounded-full bg-amber-500" title="Profile Incomplete" />
                    )}
                  </Link>

                  <Link
                    to="/my-jobs"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <FileText size={15} className="text-slate-400" />
                    {user.unsafeMetadata?.role === "recruiter" ? "My Jobs" : "My Applications"}
                  </Link>

                  {user.unsafeMetadata?.role !== "recruiter" && (
                    <Link
                      to="/saved-jobs"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Bookmark size={15} className="text-slate-400" />
                      Saved Jobs
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left border-t border-slate-100 mt-1 cursor-pointer"
                  >
                    <LogOut size={15} />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setSearch({});
        }}
      />
    </>
  );
};

export default Header;
