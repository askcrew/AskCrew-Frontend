import CustomSelect from "@/components/global/custom-select";
import { FileUploader } from "@/components/global/file-uplaod";
import FormGroup from "@/components/global/form-group";
import { Button } from "@/components/ui/button";
import { useMultiStepContext } from "@/hooks/use-multi-step-form";
import { toBase64 } from "@/lib/toBase64";
import { studentStepFive, studentStepFiveData } from "@/Schemas/auth/student-register";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

const PersonalInfoForm = () => {
  const { next, previous, saveStepData, formData, saveFiles } =
    useMultiStepContext<studentStepFiveData>();
  const [images, setImages] = useState<File[]>();
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<studentStepFiveData>({
    resolver: zodResolver(studentStepFive),
    mode: "all",
    defaultValues: {
      country: "",
      city: "",
      academic_year: "",
      profile_photo: "",
    },
  });

  const handleImage = (files: File[] | null) => {
    if (files?.[0]) {
      saveFiles("profile_photo", files);
    }
  };

  const onSubmit = async (data: studentStepFiveData) => {
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
        country: formData.country || "",
        city: formData.city || "",
        academic_year: formData.academic_year || "",
        // profile_photo: formData.profile_photo || "",
      });
    }
  }, [formData, reset]);

  return (
    <div className="bg-white p-4 md:p-10 flex-1">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Personal Information
        </h1>
        <p className="text-gray-500 text-sm">
          Please provide your academic and location details.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full grid">
        {/* User Name */}
        <FormGroup
          label="Your Country"
          size={"xl"}
          placeholder="Enter your country name"
          type="text"
          {...register("country")}
          message={errors.country?.message as string}
        />
        <FormGroup
          label="Your city"
          size={"xl"}
          placeholder="Enter your city name"
          type="text"
          {...register("city")}
          message={errors.city?.message as string}
        />

        <FileUploader
          label="Upload your profile picture"
          maxFiles={1}
          onChange={handleImage}
        />

        <Controller
          name="academic_year"
          control={control}
          render={({ field }) => (
            <CustomSelect
              label="Academic Year"
              className="w-full"
              value={field.value}
              onValueChange={field.onChange}
              options={[
                { value: "First Year", label: "First Year" },
                { value: "Second Year", label: "Second Year" },
                { value: "Third Year", label: "Third Year" },
                { value: "Fourth Year", label: "Fourth Year" },
                { value: "Fifth Year", label: "Fifth Year" },
              ]}
              message={errors.academic_year?.message as string}
            />
          )}
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
export default PersonalInfoForm;

