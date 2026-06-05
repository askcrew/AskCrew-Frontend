"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Settings,
  CreditCard,
  FileText,
  LogOut,
  User,
  Languages,
  Lock,
  Headphones,
  ChevronRight,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LogoutDialog } from "@/components/profile/logout-dialog";
import { DeleteAccountDialog } from "@/components/profile/delete-account-dialog";
import { logout } from "@/lib/actions/auth";
import { getCurrentUserProfile } from "@/lib/api/profiles";
import { useWatermarkPayment } from "@/lib/queries/payment";
import Swal from "sweetalert2";

interface Profile {
  name: string;
  email: string;
  avatar: string;
  subscription?: string;
  model?: string;
  is_verified?: boolean;
}

interface MenuItem {
  label: string;
  value?: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
}

const SAMPLE_PROFILE_DATA: Profile = {
  name: "Eugene An",
  email: "eugene@kokonutui.com",
  avatar:
    "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/profile-mjss82WnWBRO86MHHGxvJ2TVZuyrDv.jpeg",
  subscription: "PRO",
  model: "Gemini 2.0 Flash",
  is_verified: false,
};

interface ProfileDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: Profile;
  showTopbar?: boolean;
}

export default function ProfileDropdown({
  data: propData,
  className,
  ...props
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [profileData, setProfileData] = React.useState<Profile>(
    propData || SAMPLE_PROFILE_DATA,
  );
  const [isLoading, setIsLoading] = React.useState(!propData);

  const { mutate: getVerified, isPending: isVerifying } = useWatermarkPayment();

  React.useEffect(() => {
    if (!propData) {
      const fetchProfile = async () => {
        try {
          const result = await getCurrentUserProfile();

          if (result.success && result.data) {
            // Map the API response to Profile interface
            setProfileData({
              name: result.data.fullname || result.data.email || "User",
              email: result.data.email || "",
              avatar:
                result.data.profile_photo ||
                "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/profile-mjss82WnWBRO86MHHGxvJ2TVZuyrDv.jpeg",
              subscription: result.data.profile?.plan?.tier || "FREE",
              model: result.data.profile?.plan?.name,
              is_verified: result.data.is_verified,
            });
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProfile();
    }
  }, [propData]);

  const data = profileData;

  const handleVerifyRequest = () => {
    Swal.fire({
      title: "Get Verified Account",
      text: "Would you like to use your loyalty points for a discount on the watermark payment?",
      icon: "question",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Use Points",
      denyButtonText: "Don't Use Points",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#9333ea",
      denyButtonColor: "#f97316",
    }).then((result) => {
      if (result.isConfirmed) {
        getVerified(true);
      } else if (result.isDenied) {
        getVerified(false);
      }
    });
  };

  const handleLogout = () => {
    // Add your logout logic here
    logout();
    setShowLogoutDialog(false);
    // Redirect to login page or perform logout action
  };

  const handleDeleteAccount = (password: string) => {
    // Add your delete account logic here
    console.log("Account deletion requested with password:", password);
    setShowDeleteDialog(false);
    // Perform account deletion and redirect
  };
  const menuItems: MenuItem[] = [
    {
      label: "Profile",
      href: "/profile/details",
      icon: <User className="w-4 h-4" />,
    },
    {
      label: "Favorites",
      href: "/favorites",
      icon: <Heart className="w-4 h-4" />,
    },
    {
      label: "My Paid Subs",
      value: data.subscription,
      href: "/profile/paid-subs",
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      label: "Technical Support",
      href: "/profile/support",
      icon: <FileText className="w-4 h-4" />,
      external: true,
    },
  ];

  const settingsItems = [
    {
      label: "Change Language",
      href: "/profile/lang",
      icon: <Languages className="w-4 h-4" />,
    },
    {
      label: "Change Password",
      href: "/profile/password",
      icon: <Lock className="w-4 h-4" />,
    },
    {
      label: "Technical Support",
      href: "/profile/support",
      icon: <Headphones className="w-4 h-4" />,
    },
  ];

  return (
    <div className={cn("relative", className)} {...props}>
      <DropdownMenu onOpenChange={setIsOpen}>
        <div className="group relative">
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-16 w-full md:p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 hover:shadow-sm transition-all duration-200 focus:outline-none"
              disabled={isLoading}
            >
              <div className="text-left flex-1 md:block hidden">
                {isLoading ? (
                  <>
                    <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse mb-1"></div>
                    <div className="h-3 w-32 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
                        {data.name}
                      </div>
                      {data.is_verified && (
                        <CheckCircle2 className="size-3.5 fill-blue-500 text-blue-500" />
                      )}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 tracking-tight leading-tight">
                      {data.email}
                    </div>
                  </>
                )}
              </div>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-zinc-900">
                    {isLoading ? (
                      <div className="w-full h-full bg-zinc-200 dark:bg-zinc-700 rounded-full animate-pulse"></div>
                    ) : (
                      <Image
                        src={data.avatar}
                        alt={data.name}
                        width={36}
                        height={36}
                        className="w-full h-full object-cover rounded-full"
                      />
                    )}
                  </div>
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>

          {/* Bending line indicator on the right */}
          <div
            className={cn(
              "absolute dark -right-3 top-1/2 -translate-y-1/2 transition-all duration-200",
              isOpen ? "opacity-100" : "opacity-60 group-hover:opacity-100",
            )}
          >
            <svg
              width="12"
              height="24"
              viewBox="0 0 12 24"
              fill="none"
              className={cn(
                "transition-all duration-200",
                isOpen
                  ? "text-blue-500 dark:text-blue-400 scale-110"
                  : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300",
              )}
              aria-hidden="true"
            >
              <path
                d="M2 4C6 8 6 16 2 20"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>

          <DropdownMenuContent
            align="center"
            sideOffset={4}
            className="w-64 p-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl shadow-xl shadow-zinc-900/5 dark:shadow-zinc-950/20 
                    data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-top-right"
          >
            {/* Get Verified Section */}
            {!data.is_verified && !isLoading && (
              <>
                <div className="p-1 px-1.5 mb-1">
                  <button
                    onClick={handleVerifyRequest}
                    disabled={isVerifying}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/15 border border-orange-500/20 transition-all group overflow-hidden relative"
                  >
                    <div className="size-8 rounded-lg bg-orange-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-orange-500/20">
                      {isVerifying ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <ShieldCheck className="size-5" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-wider leading-tight">
                        Get Verified
                      </div>
                      <div className="text-[10px] text-orange-500/80 font-medium leading-tight">
                        Unlock elite features
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-orange-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
                <DropdownMenuSeparator className="mx-2 mb-2 bg-zinc-200/50 dark:bg-zinc-800/50" />
              </>
            )}

            <div className="space-y-1">
              {menuItems.map((item) => (
                <DropdownMenuItem key={item.label} asChild>
                  <Link
                    href={item.href}
                    className="flex items-center p-3 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 rounded-xl transition-all duration-200 cursor-pointer group hover:shadow-sm border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-700/50"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {item.icon}
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight whitespace-nowrap group-hover:text-zinc-950 dark:group-hover:text-zinc-50 transition-colors">
                        {item.label}
                      </span>
                    </div>
                    <div className="shrink-0 ml-auto">
                      {item.value && (
                        <span
                          className={cn(
                            "text-xs font-medium rounded-md py-1 px-2 tracking-tight",
                            item.label === "Model"
                              ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10 border border-blue-500/10"
                              : "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-500/10 border border-purple-500/10",
                          )}
                        >
                          {item.value}
                        </span>
                      )}
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}

              {/* Settings Accordion */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="settings" className="border-none">
                  <AccordionTrigger className="flex items-center p-3 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 rounded-xl transition-all duration-200 group hover:shadow-sm border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-700/50 data-[state=open]:bg-zinc-100/80 dark:data-[state=open]:bg-zinc-800/60 hover:no-underline font-normal!">
                    <div className="flex items-center gap-2 flex-1">
                      <Settings className="w-4 h-4" />
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight whitespace-nowrap group-hover:text-zinc-950 dark:group-hover:text-zinc-50 transition-colors">
                        Settings
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-0 pt-1">
                    <div className="space-y-1 pl-2">
                      {settingsItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="flex items-center gap-2 p-2.5 pl-4 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 rounded-lg transition-all duration-200 group border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-700/50"
                        >
                          {item.icon}
                          <span className="text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors flex-1">
                            {item.label}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <DropdownMenuSeparator className="my-3 bg-linear-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800" />

            {/* Delete Account */}
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setShowDeleteDialog(true);
              }}
            >
              <button
                type="button"
                className="w-full flex items-center gap-3 p-2 duration-200 bg-red-500/10 rounded-xl hover:bg-red-500/20 cursor-pointer border border-transparent hover:border-red-500/30 hover:shadow-sm transition-all group mb-2"
              >
                <Trash2 className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                <span className="text-sm font-medium text-red-500 group-hover:text-red-600">
                  Delete Account
                </span>
              </button>
            </DropdownMenuItem>

            {/* Sign Out */}
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setShowLogoutDialog(true);
              }}
            >
              <button
                type="button"
                className="w-full flex items-center gap-3 p-2 duration-200 bg-red-500/10 rounded-xl hover:bg-red-500/20 cursor-pointer border border-transparent hover:border-red-500/30 hover:shadow-sm transition-all group"
              >
                <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                <span className="text-sm font-medium text-red-500 group-hover:text-red-600">
                  Sign Out
                </span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </div>
      </DropdownMenu>

      {/* Logout Confirmation Dialog */}
      <LogoutDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleLogout}
      />

      {/* Delete Account Dialog */}
      <DeleteAccountDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
}
