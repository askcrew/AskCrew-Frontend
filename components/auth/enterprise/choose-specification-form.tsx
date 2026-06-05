"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useMultiStepContext } from "@/hooks/use-multi-step-form";
import { CheckboxGroup, type Option } from "@/components/global/checkbox-group";
import CustomSelect from "@/components/global/custom-select";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EnterpriseFormData extends Record<string, unknown> {
  specification?: string[];
  selectedCategory?: string;
}

const formatLabel = (str: string) => {
  if (!str || typeof str !== "string") return "";
  return str
    .split("_")
    .map((word) => {
      if (word === "/") return "/";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ")
    .replace(/ \/ /g, " / ")
    .replace(/Dop/g, "DOP")
    .replace(/Vfx/g, "VFX")
    .replace(/Cgi/g, "CGI");
};

const fallbackSpecifications: Record<string, string[]> = {
  direction: [
    "director",
    "executive_director",
    "assistant_director",
    "art_director",
    "lighting_director",
    "scenic_director",
    "workshop_director",
  ],
  acting: [
    "actor",
    "actress",
    "lead_actor",
    "supporting_actor",
    "character_actor",
    "extra_/_background_actor",
    "stand_in",
    "stunt_double",
    "voice_actor",
  ],
  production: [
    "producer",
    "executive_producer",
    "line_producer",
    "co_producer",
    "production_manager",
    "production_assistant",
    "production_coordinator",
    "location_manager",
  ],
  cinematography: [
    "director_of_photography_dop",
    "camera_operator",
    "photographer",
    "1st_assistant_camera_focus_puller",
    "2nd_assistant_camera_clapper",
    "steadicam_operator",
    "crane_operator",
  ],
  sound: [
    "sound_engineer",
    "sound_designer",
    "sound_recordist_/_production_mixer",
    "re_recording_mixer",
    "foley_artist",
    "sound_editor",
  ],
  lighting: [
    "gaffer",
    "lighting_technician",
    "best_boy_electric",
    "generator_operator",
  ],
  art_set_decoration: [
    "production_designer",
    "set_designer",
    "set_decorator",
    "scenic_artist",
    "prop_master_/_props",
    "construction_coordinator",
    "painter",
  ],
  graphics_vfx: [
    "vfx_artist",
    "graphic_designer",
    "vfx_supervisor",
    "motion_graphics_artist",
    "cgi_artist",
    "compositor",
  ],
  editing: [
    "video_editor",
    "assistant_editor",
    "online_editor",
    "offline_editor",
    "colorist",
  ],
  makeup_wardrobe: [
    "makeup_artist",
    "makeup_assistant",
    "special_effects_makeup_artist",
    "hair_stylist",
    "costume_designer",
    "costume_assistant",
    "wardrobe_supervisor",
    "stylist",
  ],
  engineering_technicians: [
    "chief_engineer",
    "studio_technician",
    "video_engineer",
    "camera_technician",
    "rigging_technician",
    "chroma_key_technician",
  ],
  writing_preparation: [
    "scriptwriter",
    "author_/_writer",
    "screenwriter",
    "copywriter",
    "preparer_/_developer",
    "researcher",
    "dialogue_writer",
  ],
};

const ChooseSpecificationForm = () => {
  const { next, previous, saveStepData, formData } = useMultiStepContext<EnterpriseFormData>();
  
  const [specs, setSpecs] = React.useState<{ specification: string[] }>(() => ({
    specification: formData.specification || [],
  }));
  const [selectedCategory, setSelectedCategory] = React.useState<string>(formData.selectedCategory || "");
  const [error, setError] = React.useState<string>("");

  // Using the provided data directly to avoid 404 errors until the API is ready
  const specificationsData = fallbackSpecifications;

  const categoryOptions = React.useMemo(() => {
    return Object.keys(specificationsData).map((key) => ({
      label: formatLabel(key),
      value: key,
    }));
  }, []);

  const currentCategoryOptions: Option[] = React.useMemo(() => {
    if (!selectedCategory || !specificationsData[selectedCategory]) {
      return [];
    }
    return specificationsData[selectedCategory].map((item: string) => ({
      label: formatLabel(item),
      value: item,
    }));
  }, [selectedCategory]);

  const currentCategoryValues = React.useMemo(() => {
    if (!selectedCategory || !specificationsData[selectedCategory]) {
      return [];
    }
    const categorySpecs = specificationsData[selectedCategory];
    return specs.specification.filter((s) => categorySpecs.includes(s));
  }, [selectedCategory, specs.specification]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that at least one spec is selected
    if (specs.specification.length === 0) {
      setError("Please select at least one specification");
      return;
    }

    setError("");
    saveStepData({
      ...specs,
      selectedCategory,
    });
    next();
  };

  const handleRemoveSpec = (specToRemove: string) => {
    setSpecs((prev) => ({
      ...prev,
      specification: prev.specification.filter((s) => s !== specToRemove),
    }));
  };

  const handleBack = () => {
    saveStepData({
      ...specs,
      selectedCategory,
    });
    previous();
  };

  return (
    <div className="bg-white p-4 md:p-10 flex-1">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Choose Your Specification
        </h1>
        <p className="text-gray-500 text-sm">
          Tell us your area of expertise to personalize your experience.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <CustomSelect
          label="Select Category"
          placeholder="Choose a category..."
          options={categoryOptions}
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value)}
        />

        {selectedCategory && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <h3 className="font-medium text-gray-700">
              Select roles in {formatLabel(selectedCategory)}:
            </h3>
            <CheckboxGroup
              options={currentCategoryOptions}
              value={currentCategoryValues}
              listClassName="grid md:grid-cols-2 gap-4"
              onValueChange={(value: string[]) => {
                const categorySpecs = specificationsData[selectedCategory];
                
                // Remove all current category specs from the global list
                const otherCategorySpecs: string[] = specs.specification.filter(
                  (s) => !categorySpecs.includes(s)
                );
                
                // Add the new selections for this category
                const newSpecs = Array.from(new Set([...otherCategorySpecs, ...value]));
                
                setSpecs({
                  specification: newSpecs,
                });

                if (newSpecs.length > 0) {
                  setError("");
                }
              }}
            />
          </div>
        )}

        {/* Selected Specs Summary */}
        {specs.specification.length > 0 && (
          <div className="pt-6 border-t">
            <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">
              Selected Specifications ({specs.specification.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {specs.specification.map((spec, index) => (
                <Badge
                  key={`${spec}-${index}`}
                  variant="secondary"
                  className="pl-3 pr-1 py-1 flex items-center gap-1 bg-orange-50 text-orange-700 border-orange-200"
                >
                  {formatLabel(spec)}
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(spec)}
                    className="p-0.5 hover:bg-orange-200 rounded-full transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {/* Buttons */}
        <div className="pt-4 flex gap-4">
          <Button
            type="button"
            variant="outline"
            size="xl"
            className="flex-1"
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="linear-1"
            size="xl"
            className="flex-[2]"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChooseSpecificationForm;
