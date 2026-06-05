"use client";
import CheckboxWithLabelGroup from "@/components/global/checkbox-with-label-group";
import ErrorDialog from "@/components/global/error-dialog";
import FormGroup from "@/components/global/form-group";
import Logo from "@/components/global/logo";
import PasswordInput from "@/components/global/password-input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  LoginFormData,
  LoginResponse,
} from "@/Schemas/auth/login";
import axiosInstance, {
  AuthCookieAPI,
  setCachedToken,
} from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post<LoginResponse>(
        "/auth/login",
        data,
        { withCredentials: true }
      );

      // Store tokens securely in httpOnly cookies via API
      await AuthCookieAPI.setTokens({
        accessToken: response.data.tokens.access,
        userType: response.data.user.type,
      });

      // Cache token in memory for immediate axios usage
      setCachedToken(response.data.tokens.access);

      // Redirect based on user type
      const userType = response.data.user.type;
      if (userType === "enterprise") {
        router.push("/enterprise/dashboard");
      } else if (userType === "student") {
        router.push("/student/dashboard");
      } else {
        router.push("/");
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      const message =
        (
          error as {
            response?: { data?: { message?: string; detail?: string } };
          }
        ).response?.data?.message ||
        (
          error as {
            response?: { data?: { message?: string; detail?: string } };
          }
        ).response?.data?.detail ||
        "Login failed. Please check your credentials.";

      setErrorMessage(message);
      setErrorDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ErrorDialog
        open={errorDialogOpen}
        onOpenChange={setErrorDialogOpen}
        title="Login Failed"
        message={errorMessage}
      />
      <div className="w-full container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 ">
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
              Join millions of users enjoying unlimited entertainment. Create
              your account in seconds and start streaming your favorite content
              today.
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
                Login To Your Account
              </h1>
              <p className="text-gray-500 text-sm">
                Join us in just a few steps and start streaming right away.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Address */}
              <FormGroup
                label="Email Address"
                {...register("email")}
                placeholder="enter your email"
                type="email"
                variant={"rounded"}
                size={"xl"}
                message={errors.email?.message}
              />

              {/* Password */}
              <PasswordInput
                label="Password"
                {...register("password")}
                variant={"rounded"}
                size={"xl"}
                message={errors.password?.message}
              />

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between">
                <CheckboxWithLabelGroup
                  variant={"orange"}
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  label={"Remember Me"}
                />
                <Link
                  href={"/viewer/forget-password"}
                  className="text-[#615B5C] text-[13px] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                variant={"linear-1"}
                size={"xl"}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-500 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Social Login */}
            <div className="flex justify-center gap-6 mb-8">
              {/* Google */}
              <button className="w-12 h-12 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <img src="/icons/google.svg" alt="" />
                <span className="sr-only">Sign in with google</span>
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-700 text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/viewer/sign-up"
                  className="text-orange-500 font-semibold hover:text-orange-600 underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
