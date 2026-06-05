import { FileUploader } from "@/components/global/file-uplaod";
import FormGroup from "@/components/global/form-group";
import FormMessage from "@/components/global/form-message";
import FormText from "@/components/global/form-text";
import { Button } from "@/components/ui/button";
import { useMultiStepContext } from "@/hooks/use-multi-step-form";
import {
  studentStepThree,
  studentStepThreeData,
} from "@/Schemas/auth/student-register";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const DefineExperienceForm = () => {
  const { next, previous, saveStepData, formData, saveFiles } = useMultiStepContext();
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<studentStepThreeData>({
    resolver: zodResolver(studentStepThree),
    mode: "all",
    defaultValues: {
      institute: "",
      personal_info: "",
      cv: "",
    },
  });

  const onSubmit = async (data: studentStepThreeData) => {
    console.log("Form submitted:", data);
    const { cv, ...safeData } = data;
    saveStepData(safeData);
    next();
  };

  const handleBack = () => {
    const data = getValues();
    const { cv, ...safeData } = data;
    saveStepData(safeData);
    previous();
  };
  useEffect(() => {
    if (formData) {
      reset({
        institute: typeof formData.institute === "string" ? formData.institute : "",
        personal_info: typeof formData.personal_info === "string" ? formData.personal_info : "",
      });
    }
  }, [formData, reset]);

 const handleCV = (files: File[] | null) => {
  if (files?.[0]) {
    saveFiles("cv", files);
  }
};
  // useEffect(() => {
  //   const processCV = async () => {
  //     if (cv && cv.length > 0) {
  //       const CV_String = await toBase64(cv[0]);
  //       setValue("cv", CV_String);
  //       clearErrors("cv");
  //     }
  //   };
  //   processCV();
  // }, [cv, setValue, clearErrors]);
  return (
    <div className="bg-white p-4 md:p-10 flex-1 space-y-5">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tell Us About Your Experience
        </h1>
        <p className="text-gray-500 text-sm">
          Provide your institute name, upload your CV, and add a short personal
          bio so we can better understand your background.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full grid">
        <FormGroup
          label="Your Institute"
          size={"xl"}
          placeholder="Enter your institute name"
          type="text"
          {...register("institute")}
          message={errors.institute?.message ? String(errors.institute.message) : undefined}
        />

        <FileUploader label="Upload your CV" maxFiles={1} onChange={handleCV} />
        <FormMessage message={errors.cv?.message ? String(errors.cv.message) : undefined} />
        <FormText
          label="Personal Info ( optional )"
          placeholder="some info about you...."
          {...register("personal_info")}
          message={errors.personal_info?.message ? String(errors.personal_info.message) : undefined}
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
export default DefineExperienceForm;
