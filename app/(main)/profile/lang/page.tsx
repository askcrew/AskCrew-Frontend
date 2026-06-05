import { LanguageSelector } from "@/components/profile/language-selector";

export default function ChangeLangPage() {
  return (
    <div className="min-h-screen pb-20">
      {/* Header Section */}
      <div className="border-b border-border/50 bg-muted/20 mx-4 mt-4 rounded-2xl">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Change Language
          </h1>
          <p className="text-sm text-muted-foreground">
            Select your preferred language
          </p>
        </div>
      </div>

      {/* Language Options */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <LanguageSelector />
      </div>
    </div>
  );
}
