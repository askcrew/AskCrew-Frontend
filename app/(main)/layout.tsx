import Footer from "@/components/global/footer";
import { MainHeader } from "@/components/global/main-header";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="min-h-screen bg-background">
      <MainHeader />
      {children}
      <Footer />
    </main>
  );
};
export default Layout;
