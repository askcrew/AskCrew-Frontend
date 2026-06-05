import * as React from "react";
import CustomSelect, { SelectOptions } from "@/components/global/custom-select";
import { FileUploader } from "@/components/global/file-uplaod";
import FormGroup from "@/components/global/form-group";
import { Button } from "@/components/ui/button";
import { useMultiStepContext } from "@/hooks/use-multi-step-form";
import { toBase64 } from "@/lib/toBase64";
import {
  enterpriseStepFour,
  EnterpriseStepFourData,
} from "@/Schemas/auth/enterprise-register";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

const MY_WORK_OPTIONS: SelectOptions[] = [
  { value: "producer", label: "Producer" },
  { value: "actor", label: "Actor" },
  { value: "author", label: "Author" },
  { value: "photographer", label: "Photographer" },
  { value: "director", label: "Director" },
  { value: "writer", label: "Writer" },
];

const PersonalInfoForm = () => {
  const { next, previous, saveStepData, formData } =
    useMultiStepContext<EnterpriseStepFourData>();
  const [images, setImages] = React.useState<File[]>([]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<EnterpriseStepFourData>({
    resolver: zodResolver(enterpriseStepFour),
    mode: "all",
    defaultValues: {
      country: formData?.country || "",
      city: formData?.city || "",
      myWork: (formData?.myWork as string) || "",
      images: formData?.images || "",
    },
  });

  const handleImage = React.useCallback((files: File[] | null) => {
    if (files && files.length > 0) {
      setImages(files);
    } else {
      setImages([]);
    }
  }, []);

  const handleBack = React.useCallback(async () => {
    const values = watch();
    
    if (images && images.length > 0) {
      const imageBase64 = await toBase64(images[0]);
      values.images = imageBase64;
    }
    
    saveStepData(values);
    previous();
  }, [images, watch, saveStepData, previous]);

  const onSubmit = React.useCallback(async (data: EnterpriseStepFourData) => {
    if (images && images.length > 0) {
      const imageBase64 = await toBase64(images[0]);
      data.images = imageBase64;
    }
    
    saveStepData(data);
    next();
  }, [images, saveStepData, next]);

  const primaryPreviewFile = React.useMemo(() => 
    formData.images && typeof formData.images === "string" && formData.images.startsWith("data:") 
      ? formData.images 
      : undefined, 
  [formData.images]);

  return (
    <div className="bg-white p-4 md:p-10 flex-1">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Personal Information
        </h1>
        <p className="text-gray-500 text-sm">
          Please provide your location and work type details.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
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
          primaryPreviewFile={primaryPreviewFile}
        />

        <Controller
          name="myWork"
          control={control}
          render={({ field }) => (
            <CustomSelect
              label="My Work"
              className="w-full"
              value={field.value}
              onValueChange={field.onChange}
              options={MY_WORK_OPTIONS}
              message={errors.myWork?.message as string}
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
