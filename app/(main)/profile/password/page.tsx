import { PasswordForm } from "@/components/profile/password-form";

export default function ChangePasswordPage() {
  return (
    <div className="min-h-screen pb-20">
      {/* Header Section */}
      <div className="border-b border-border/50 bg-muted/20">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Change Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Create a new password. Ensure it differs from previous ones for
            security
          </p>
        </div>
      </div>

      {/* Password Form */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <PasswordForm />
      </div>
    </div>
  );
}
