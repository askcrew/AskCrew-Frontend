import PersonalDetailsForm from "@/components/auth/viewer/personal-details-form";
import { Suspense } from "react";

const ViewerProfilePage = () => {
  return (
    <Suspense>
      <div className="fixed sm:block hidden inset-0 bg-linear-to-br from-orange-500/15 via-transparent to-purple-600/15 pointer-events-none" />
      <PersonalDetailsForm />
    </Suspense>
  );
};
export default ViewerProfilePage;
