import CreatedApplications from "@/components/created-applications";
import CreatedJobs from "@/components/created-jobs";
import { useAuth } from "@/context/AuthContext";
import { BarLoader } from "react-spinners";

const MyJobs = () => {
  const { user, isLoaded } = useAuth();

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#2563eb" />;
  }

  const isCandidate = user?.role === "candidate" || user?.unsafeMetadata?.role === "candidate";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {isCandidate ? <CreatedApplications /> : <CreatedJobs />}
    </div>
  );
};

export default MyJobs;
