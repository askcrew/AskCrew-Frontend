"use client";

import { useState } from "react";
import { RadioGroup } from "@/components/ui/radio-group";
import { LanguageOption } from "./language-option";

const languages = [
  { value: "ar", label: "Arabic" },
  { value: "en", label: "English" },
];

export function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    // Add your language change logic here
    console.log("Language changed to:", value);
  };

  return (
    <div className="space-y-3">
      <RadioGroup value={selectedLanguage} onValueChange={handleLanguageChange}>
        {languages.map((language) => (
          <LanguageOption
            key={language.value}
            value={language.value}
            label={language.label}
          />
        ))}
      </RadioGroup>
    </div>
  );
}
