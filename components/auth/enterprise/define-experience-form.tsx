import { CheckboxGroup, Option } from "@/components/global/checkbox-group";
import FormText from "@/components/global/form-text";
import { Button } from "@/components/ui/button";
import { useMultiStepContext } from "@/hooks/use-multi-step-form";
import { useState } from "react";

const experienceYearsOptions: Option[] = [
  {
    label: "Beginner ( less than 1 year )",
    value: "Beginner",
  },
  {
    label: "Intermediate ( 1 - 3 years )",
    value: "intermediate",
  },
  {
    label: "Advanced ( 3 - 7 years )",
    value: "advanced",
  },
  {
    label: "Expert ( +7 years )",
    value: "expert",
  },
];

const DefineExperienceForm = () => {
  const {
    next,
    previous,
    saveStepData,
    formData: contextFormData,
  } = useMultiStepContext();

  const [formData, setFormData] = useState({
    experience: (contextFormData?.experience as string[]) || [],
    personalInfo: (contextFormData?.personalInfo as string) || "",
  });

  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate experience
    if (formData.experience.length === 0) {
      setError("Please select at least one experience level");
      return;
    }

    setError("");
    saveStepData(formData);
    console.log("Form submitted:", formData);
    next();
  };

  const handleBack = () => {
    saveStepData(formData);
    previous();
  };

  return (
    <div className="bg-white p-4 md:p-10 flex-1 space-y-5">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Define Your Experience
        </h1>
        <p className="text-gray-500 text-sm">
          Select how many years you&apos;ve been working in the industry.
        </p>
      </div>

      <CheckboxGroup
        options={experienceYearsOptions}
        value={formData.experience}
        onValueChange={(value) => {
          // Keep only the last selected item to ensure single selection
          const singleValue = value.length > 0 ? [value[value.length - 1]] : [];
          setFormData((prev) => ({
            ...prev,
            experience: singleValue,
          }));
          if (singleValue.length > 0) {
            setError("");
          }
        }}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <FormText
        label="Personal Info ( optional )"
        placeholder="some info about you...."
        value={formData.personalInfo}
        onChange={(value) => {
          setFormData((prev) => ({
            ...prev,
            personalInfo: value.target.value,
          }));
        }}
      />

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5 w-full">
        {/* Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            size="xl"
            className="flex-1"
            onClick={handleBack}
          >
            Back
          </Button>
          <Button type="submit" variant="linear-1" size="xl" className="flex-[2]">
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};
export default DefineExperienceForm;
