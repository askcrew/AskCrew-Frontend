import { SupportOptions } from "@/components/profile/support-options";

export default function TechnicalSupportPage() {
  return (
    <div className="min-h-screen pb-20">
      {/* Header Section */}
      <div className="border-b border-border/50 bg-muted/20 mx-4 mt-4 rounded-2xl">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Technical Support
          </h1>
          <p className="text-sm text-muted-foreground">
            We're here to help! Get in touch with our support team
          </p>
        </div>
      </div>

      {/* Support Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-muted/30 rounded-2xl p-6 mb-8">
          <p className="text-sm text-muted-foreground leading-relaxed text-center">
            We're here to help! If you're experiencing issues, please check the
            resources below. Help us improve by sharing your experience with our
            support team.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed text-center mt-4">
            Our support team is available{" "}
            <span className="font-semibold text-foreground">24 hours/day</span>{" "}
            across telegram, whatsapp or call support system.
          </p>
        </div>

        {/* Support Channels */}
        <SupportOptions />
      </div>
    </div>
  );
}
