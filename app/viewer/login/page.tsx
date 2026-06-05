import LoginForm from "@/components/auth/viewer/login-form";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
      <LoginForm />
    </div>
  );
}
