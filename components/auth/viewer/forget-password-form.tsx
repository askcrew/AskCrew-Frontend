"use client";

import type React from "react";

import Logo from "@/components/global/logo";
import PhoneInputComponent from "@/components/global/phone-input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function FrogetPasswordForm() {
  const [formData, setFormData] = useState({
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="w-full container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Hero Content */}
        <div className="hidden lg:block text-white">
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Start Your{" "}
            <span className="bg-linear-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
              Streaming
            </span>{" "}
            Journey
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Join millions of users enjoying unlimited entertainment. Create your
            account in seconds and start streaming your favorite content today.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-gray-300">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Unlimited streaming access
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Watch on any device
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Cancel anytime
            </li>
          </ul>
        </div>

        {/* Right Side - Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo />
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Forgot Your Password ?
            </h1>
            <p className="text-gray-500 text-sm">
              Enter your registered phone number on Ask Crew to create a new
              password
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Address */}
            <PhoneInputComponent
              value={formData.phone}
              onChange={(number) => {
                setFormData((prev) => ({
                  ...prev,
                  phone: number || "",
                }));
              }}
              label="Phone Number"
            />

            {/* Register Button */}
            <Button type="submit" variant={"linear-1"} size={"xl"}>
              Continue
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
