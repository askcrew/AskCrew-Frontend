import AuthHeader from "@/components/global/auth-header";
import { ReactNode } from "react";

const ViewerLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
      <AuthHeader />
      {children}
    </main>
  );
};
export default ViewerLayout;
