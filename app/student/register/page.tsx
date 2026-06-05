"use client";

import StudentRegisterForm from "@/components/auth/student/student-register-form";
import Image from "next/image";
import { Suspense } from "react";

const StudentRegisterPage = () => {
  return (
    <div className="flex items-center min-h-screen bg-background">
      {/* Left Sidebar - Enhanced */}
      <section className="hidden w-1/2 m-5 rounded-3xl self-stretch items-center justify-center relative overflow-hidden lg:flex xl:w-2/5">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-linear-to-br from-orange-500 via-purple-600 to-pink-600" />

        {/* Animated Blobs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-orange-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

        {/* Content */}
        <div className="relative flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12 p-10 z-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/icons/logo.svg"
              alt="logo"
              width={224}
              height={82}
              priority
              className="w-auto h-auto drop-shadow-2xl"
            />
          </div>

          {/* Text Content */}
          <div className="space-y-6 text-white">
            <div className="space-y-3">
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                <span className="text-sm font-semibold">Student Platform</span>
              </div>
              <h1 className="text-4xl font-bold leading-tight drop-shadow-lg">
                Start Your Creative Journey
              </h1>
            </div>
            <p className="text-lg text-white/90 leading-relaxed">
              Join our vibrant community of talented students. Learn from
              industry experts, showcase your portfolio, and launch your
              creative career.
            </p>

            {/* Features List */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-white/90">
                  Access exclusive workshops
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-white/90">Build your portfolio</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-white/90">Connect with mentors</span>
              </div>
            </div>
          </div>

          {/* Decorative Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl" />
            <Image
              src="/images/files.png"
              alt="Files"
              width={342}
              height={342}
              className="relative transition-all hover:rotate-2 hover:scale-105 drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Right Side - Form */}
      <section className="flex flex-1 flex-col items-center bg-background p-4 lg:justify-center lg:p-10 lg:py-0">
        <div className="mb-16 lg:hidden flex items-center gap-2">
          <Image
            src="/icons/logo.svg"
            alt="logo"
            width={224}
            height={82}
            className="h-auto w-[100px] lg:w-[180px]"
          />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <StudentRegisterForm />
        </Suspense>
      </section>
    </div>
  );
};
export default StudentRegisterPage;
