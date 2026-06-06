import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import Logo from "./logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Blog", href: "/blog" },
    ],
    support: [
      { label: "Help Center", href: "/help" },
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Feedback", href: "/feedback" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  };

  return (
    <footer className="relative border-t border-white/20 bg-background/50 backdrop-blur-xl mt-12 shadow-2xl">
      {/* Enhanced gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-purple-500 to-transparent" />

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-purple-500/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-6 relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {/* Brand section - takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <Logo />
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Your ultimate destination for streaming entertainment. Watch
              thousands of movies and shows anytime, anywhere.
            </p>

            {/* Contact info */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-purple-600" />
                </div>
                <span>askcrew.kw@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-orange-600" />
                </div>
                <span>+965 55583770</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-pink-600" />
                </div>
                <span>Kuwait</span>
              </div>
            </div>
          </div>

          {/* Links sections */}
          <div className="text-center pt-12">
            <h3 className="font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent mb-2 text-sm uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-1.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-purple-600 transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center pt-12">
            <h3 className="font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent mb-2 text-sm uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-1.5">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-purple-600 transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center pt-12">
            <h3 className="font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent mb-2 text-sm uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-1.5">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-purple-600 transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-3 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
            <p>© {currentYear} Pear. All rights reserved.</p>
            <div className="hidden md:block w-1 h-1 rounded-full bg-muted-foreground/30" />
            <p>Made with ❤️ for movie lovers</p>
          </div>

          {/* App badges or additional info */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-lg bg-linear-to-r from-purple-500/10 to-orange-500/10 border border-purple-500/20">
              <span className="text-xs font-semibold bg-linear-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
                Premium Streaming
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
