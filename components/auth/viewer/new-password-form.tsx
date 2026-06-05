"use client";

import type React from "react";

import Logo from "@/components/global/logo";
import PasswordInput from "@/components/global/password-input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function NewPasswordForm() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
              Set a New Password
            </h1>
            <p className="text-gray-500 text-sm">
              Create a new password. Ensure it differs from previous ones for
              security
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Password */}
            <PasswordInput
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              variant={"rounded"}
              size={"xl"}
            />
            <PasswordInput
              label="Confirm Password"
              name="confirm-password"
              value={formData.password}
              onChange={handleInputChange}
              variant={"rounded"}
              size={"xl"}
            />

            {/* Register Button */}
            <Button type="submit" variant={"linear-1"} size={"xl"}>
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
