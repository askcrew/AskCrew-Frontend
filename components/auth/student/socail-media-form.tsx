import FormGroup from "@/components/global/form-group";
import { Button } from "@/components/ui/button";
import { useMultiStepContext } from "@/hooks/use-multi-step-form";
import {
  studentStepFour,
  studentStepFourData,
} from "@/Schemas/auth/student-register";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const SocailMediaForm = () => {
  const { next, previous, saveStepData, formData } =
    useMultiStepContext<studentStepFourData>();
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<studentStepFourData>({
    resolver: zodResolver(studentStepFour),
    mode: "all",
    defaultValues: {},
  });

  const onSubmit = async (data: studentStepFourData) => {
    console.log("Form submitted:", data);
    saveStepData(data);
    next();
  };

  const handleBack = () => {
    saveStepData(getValues());
    previous();
  };
  useEffect(() => {
    if (formData) {
      reset({
        facebook_link: formData.facebook_link || "",
        instagram_link: formData.instagram_link || "",
        linkedin_link: formData.linkedin_link || "",
        youtube_link: formData.youtube_link || "",
      });
    }
  }, [formData, reset]);

  return (
    <div className="bg-white p-4 md:p-10 flex-1">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Add Your Social Profiles
        </h1>
        <p className="text-gray-500 text-sm">
          Share links to your Facebook, Instagram, LinkedIn, and YouTube so we
          can showcase your work and let others find you.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full grid">
        {/* Facebook Link */}
        <FormGroup
          label="Facebook Link"
          size={"xl"}
          placeholder="Enter your Facebook profile link"
          type="text"
          {...register("facebook_link")}
          message={errors.facebook_link?.message as string}
        />

        {/* Instagram Link */}
        <FormGroup
          label="Instagram Link"
          size={"xl"}
          placeholder="Enter your Instagram profile link"
          type="text"
          {...register("instagram_link")}
          message={errors.instagram_link?.message as string}
        />

        {/* LinkedIn Link */}
        <FormGroup
          label="LinkedIn Link"
          size={"xl"}
          placeholder="Enter your LinkedIn profile link"
          type="text"
          {...register("linkedin_link")}
          message={errors.linkedin_link?.message as string}
        />

        {/* YouTube Link */}
        <FormGroup
          label="YouTube Link"
          size={"xl"}
          placeholder="Enter your YouTube channel link"
          type="text"
          {...register("youtube_link")}
          message={errors.youtube_link?.message as string}
        />

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
export default SocailMediaForm;
