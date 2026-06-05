"use client";

import CustomSelect from "@/components/global/custom-select";
import DatePicker from "@/components/global/date-picker";
import { FileUploader } from "@/components/global/file-uplaod";
import FormGroup from "@/components/global/form-group";
import FormText from "@/components/global/form-text";
import LocationInput from "@/components/global/location-input";
import { TimePicker } from "@/components/global/time-picker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IconPlus, IconSparkles } from "@tabler/icons-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  workshopCreateSchema,
  WorkshopCreateSchemaType,
} from "./workshops-data-table/schema";
import axiosInstance from "@/lib/axiosInstance";
import Swal from "sweetalert2";

const specs = [
  {
    label: "Director",
    value: "director",
  },
  {
    label: "Producer",
    value: "producer",
  },
  {
    label: "Copywriter",
    value: "copywriter",
  },
  {
    label: "Photography",
    value: "photography",
  },
  {
    label: "Assistant Director",
    value: "assistant-director",
  },
  {
    label: "Art Director",
    value: "art-director",
  },
  {
    label: "Camera Operator",
    value: "camera-operator",
  },
  {
    label: "Video Editor",
    value: "video-editor",
  },
  {
    label: "Film Distributor",
    value: "film-distributor",
  },
  {
    label: "VFX Artist",
    value: "vfx-artist",
  },
  {
    label: "Mentor",
    value: "mentor",
  },
  {
    label: "Stylist",
    value: "stylist",
  },
  {
    label: "Makeup Artist",
    value: "makeup-artist",
  },
  {
    label: "Casting Director",
    value: "casting-director",
  },
  {
    label: "Sound Engineer",
    value: "sound-engineer",
  },
  {
    label: "Studio Owner",
    value: "studio-owner",
  },
];

export function AddWorkshopDialog() {
  const [open, setOpen] = React.useState(false);
  const [specialization, setSpecialization] = React.useState("");
  const [coverImage, setCoverImage] = React.useState<File[] | null>(null);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<WorkshopCreateSchemaType>({
    resolver: zodResolver(workshopCreateSchema),
    defaultValues: {
      name: "",
      description: "",
      cover_image: null,
      location: "",
      start_date: "",
      start_time: "",
      end_date: "",
      specialization: "",
    },
  });

  const onSubmit = async (data: WorkshopCreateSchemaType) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    if (coverImage && coverImage.length > 0) {
      formData.append("cover_image", coverImage[0]);
    }
    formData.append("location", data.location);
    formData.append(
      "number_of_participants",
      data.number_of_participants.toString()
    );
    formData.append("specialization", data.specialization);
    formData.append("start_date", `${data.start_date}T${data.start_time}`);
    if (data.end_date && data.end_time) {
      formData.append("end_date", `${data.end_date}T${data.end_time}`);
    }
    
    console.log("formData",formData);
    
    try {
      const res = await axiosInstance.post("/workshop/", formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Workshop created successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      setOpen(false);
      reset();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Failed to create workshop",
      });
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant={"outline"}
          className="border-orange-500 border-2 hover:bg-orange-500/10 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20"
        >
          <IconPlus className="mr-2 size-4 text-orange-500" />
          Add Workshop
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader className="space-y-3 border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-linear-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30">
              <IconSparkles className="size-6 text-orange-500" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-linear-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
              Schedule New Workshop
            </DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Create a new workshop session. Fill in the details below to schedule
            your workshop and start accepting applicants.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <ScrollArea className="h-[50vh]">
            <div className="grid gap-4">
              <FileUploader
                label="Workshop Image"
                value={coverImage}
                onChange={setCoverImage}
              />

              <FormGroup
                label="Workshop Title"
                placeholder="e.g., Advanced React Patterns"
                {...register("name")}
                className="h-11 border-2 focus-visible:border-orange-500 focus-visible:ring-orange-500/20 transition-all"
                labelClassName="text-base font-semibold text-foreground"
                message={errors.name?.message as string}
              />

              <FormText
                label="Workshop Description"
                placeholder="Enter Your Workshop description"
                {...register("description")}
                className="min-h-30 resize-none border-2 focus-visible:border-orange-500 focus-visible:ring-orange-500/20 transition-all"
                message={errors.description?.message as string}
              />

              <LocationInput
                label="Workshop Location"
                {...register("location")}
                className="rounded-lg"
                placeholder="Enter workshop location"
                message={errors.location?.message as string}
              />

              <FormGroup
                label="Number of People"
                placeholder="Enter number of people"
                {...register("number_of_participants", { valueAsNumber: true })}
                className="h-11 border-2 focus-visible:border-orange-500 focus-visible:ring-orange-500/20 transition-all"
                labelClassName="text-base font-semibold text-foreground"
                message={errors.number_of_participants?.message as string}
              />

              <CustomSelect
                options={specs}
                value={specialization}
                onValueChange={(value) => {
                  setSpecialization(value);
                  setValue("specialization", value);
                }}
                className="h-12!"
                placeholder="Select Specialization"
                label="Workshop Specialization"
                message={errors.specialization?.message as string}
              />

              <div className="space-y-4 p-4 rounded-lg bg-linear-to-br from-orange-500/5 to-purple-500/5 border border-orange-500/20">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-1 h-4 bg-linear-to-b from-orange-500 to-purple-600 rounded-full"></span>
                  Start Date & Time
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DatePicker
                    label="Start Date"
                    value={new Date(watch("start_date"))}
                    onValueChange={(date) =>
                      setValue(
                        "start_date",
                        date ? date.toISOString().split("T")[0] : ""
                      )
                    }
                    placeholder="Select start date"
                    className="w-full border-2 focus-visible:border-orange-500 h-11"
                    labelClassName="text-sm font-medium text-foreground"
                    message={errors.start_date?.message as string}
                  />
                  <TimePicker
                    label="Start Time"
                    value={watch("start_time")}
                    onChange={(time) => setValue("start_time", time || "")}
                    className="w-full border-2 focus-visible:border-orange-500 h-11"
                    error={errors.start_time?.message as string}
                  />
                </div>
              </div>

              <div className="space-y-4 p-4 rounded-lg bg-linear-to-br from-purple-500/5 to-orange-500/5 border border-purple-500/20">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-1 h-4 bg-linear-to-b from-purple-600 to-orange-500 rounded-full"></span>
                  End Date & Time
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DatePicker
                    label="End Date"
                    value={new Date(watch("end_date") || "")}
                    onValueChange={(date) =>
                      setValue("end_date", date ?  date.toISOString().split("T")[0] : "")
                    }
                    placeholder="Select end date"
                    className="w-full border-2 focus-visible:border-purple-500 h-11"
                    labelClassName="text-sm font-medium text-foreground"
                  />
                  <TimePicker
                    label="End Time"
                    value={watch("end_time")}
                    onChange={(time) => setValue("end_time", time || "")}
                    className="w-full border-2 focus-visible:border-orange-500 h-11"
                  />
                </div>
              </div>
            </div>
          </ScrollArea>
          <div className="flex items-center gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              className="flex-1 h-11 border-2 hover:bg-muted transition-all"
            >
              Reset
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-linear-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300"
            >
              <IconSparkles className="mr-2 size-4" />
              Create Workshop
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
