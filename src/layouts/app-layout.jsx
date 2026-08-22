import Header from "@/components/header";
import { Outlet, useLocation } from "react-router-dom";

const AppLayout = () => {
  const location = useLocation();
  const isLightPage = location.pathname === "/" || location.pathname === "/post-job";

  if (isLightPage) {
    return (
      <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
        <main className="min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Header />
          </div>
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div>
      <div className="grid-background"></div>
      <main className="min-h-screen container">
        <Header />
        <Outlet />
      </main>
      <div className="p-10 text-center bg-gray-800 mt-10">
        © 2024 Made by Abhinav Srivastava to get hired.
      </div>
    </div>
  );
};

export default AppLayout;
