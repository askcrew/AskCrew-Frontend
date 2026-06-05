"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, GraduationCap, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SwapAccountDialog } from "@/components/auth/swap-account-dialog";
import axiosInstance from "@/lib/axiosInstance";
import Swal from "sweetalert2";
import { AxiosError } from "axios";
import { useAuth } from "@/hooks/use-auth";

export default function SwapAccountPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [selectedType, setSelectedType] = useState<
    "enterprise" | "student" | null
  >(null);
  const [isLoading, setIsLoading] = useState<"enterprise" | "student" | null>(
    null
  );
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [dialogType, setDialogType] = useState<"enterprise" | "student">(
    "student"
  );

  const handleAccountTypeSelection = async (type: "enterprise" | "student") => {
    setSelectedType(type);
    setIsLoading(type);

    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to registration page for the selected account type
      router.push(
        type === "enterprise" ? "/enterprise/register" : "/student/register"
      );
      return;
    }

    try {
      // Try to swap account directly
      const endpoint =
        type === "enterprise"
          ? "/auth/profiles/swap-to-enterprise/"
          : "/auth/profiles/swap-to-student/";

      const response = await axiosInstance.post(endpoint);

      // If successful, redirect to the appropriate dashboard
      if (
        response.data?.success ||
        response.status === 200 ||
        response.status === 201
      ) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Your account has been swapped to ${
            type === "enterprise" ? "Enterprise" : "Student"
          } successfully!`,
        }).then(() => {
          router.push(
            type === "enterprise"
              ? "/enterprise/dashboard"
              : "/student/dashboard"
          );
        });
      }
    } catch (e) {
      const error = e as AxiosError<{ message: string }>;
      console.log("Swap error:", error.response?.data);

      // Check if this is a 401 (not logged in) - redirect to register
      if (error.response?.status === 401) {
        router.push(
          type === "enterprise" ? "/enterprise/register" : "/student/register"
        );
        return;
      }

      // Check if profile needs to be completed (400 or specific error message)
      const errorData = error.response?.data;
      const needsProfileCompletion = true;

      if (needsProfileCompletion) {
        // Show the complete profile dialog
        setDialogType(type);
        setShowCompleteDialog(true);
      } else {
        // Show error message
        const errorMsg =
          errorData?.message ||
          (errorData && typeof errorData === "object"
            ? Object.values(errorData).flat().join(", ")
            : "Failed to swap account. Please try again.");

        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMsg,
        });
      }
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative bg-linear-to-br from-purple-500/10 via-transparent to-orange-500/10 border-b border-border/50">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-purple-600 via-orange-500 to-pink-600 bg-clip-text text-transparent">
              Choose Your Account Type
            </span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Select the account type that best fits your needs. Whether
            you&apos;re a business or a student, we have the perfect solution
            for you.
          </p>
        </div>
      </div>

      {/* Account Type Cards */}
      <div className="px-6 py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Enterprise Card */}
          <div
            onClick={() =>
              !isLoading && !authLoading && handleAccountTypeSelection("enterprise")
            }
            className={`group relative bg-white rounded-3xl p-8 border-2 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:scale-105 ${
              selectedType === "enterprise"
                ? "border-orange-500 shadow-2xl scale-105"
                : "border-gray-200 hover:border-orange-300"
            } ${isLoading || authLoading ? "pointer-events-none opacity-70" : ""}`}
          >
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Building2 className="w-8 h-8 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Enterprise Account
            </h2>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              Perfect for businesses and organizations looking to hire talent,
              post jobs, and manage workshops.
            </p>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Post job opportunities
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Find talented students
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Host workshops and events
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Upload and manage content
              </li>
            </ul>

            {/* Button */}
            <Button
              variant="linear-1"
              size="lg"
              className="w-full group-hover:shadow-lg transition-shadow"
              disabled={isLoading === "enterprise"}
            >
              {isLoading === "enterprise" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Choose Enterprise
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </div>

          {/* Student Card */}
          <div
            onClick={() => !isLoading && !authLoading && handleAccountTypeSelection("student")}
            className={`group relative bg-white rounded-3xl p-8 border-2 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:scale-105 ${
              selectedType === "student"
                ? "border-purple-500 shadow-2xl scale-105"
                : "border-gray-200 hover:border-purple-300"
            } ${isLoading || authLoading ? "pointer-events-none opacity-70" : ""}`}
          >
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Student Account
            </h2>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              Ideal for students seeking opportunities, building portfolios, and
              connecting with enterprises.
            </p>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Apply for jobs and internships
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Showcase your portfolio
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Join workshops and events
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Connect with enterprises
              </li>
            </ul>

            {/* Button */}
            <Button
              variant="linear-1"
              size="lg"
              className="w-full group-hover:shadow-lg transition-shadow"
              disabled={isLoading === "student"}
            >
              {isLoading === "student" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Choose Student
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-sm text-muted-foreground">
          You can switch between account types later in your settings.
        </p>
      </div>

      {/* Complete Profile Dialog */}
      <SwapAccountDialog
        open={showCompleteDialog}
        onOpenChange={setShowCompleteDialog}
        accountType={dialogType}
      />
    </div>
  );
}
