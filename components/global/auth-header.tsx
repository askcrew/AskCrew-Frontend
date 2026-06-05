import Logo from "./logo";
import MobileMenu from "./mobile-menu";
import SiteNav from "./nav";

export default function AuthHeader() {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 grid grid-cols-3 items-center">
        {/* Logo */}
        <div className="flex justify-start">
          <Logo />
        </div>

        {/* Navigation */}
        <div className="flex justify-center">
          <SiteNav />
        </div>

        {/* Mobile Navigation */}
        <div className="flex justify-end">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
