"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

type ImageInputProps = {
  primaryImage?: string;
  className?: string;
  onImageChange?: (image: File) => void;
};

const ImageInput = ({
  primaryImage,
  className,
  onImageChange,
}: ImageInputProps) => {
  const [imgSrc, setImgSrc] = useState(primaryImage);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const imageUrl = URL.createObjectURL(e.target.files[0]);
    setImgSrc(imageUrl);
    if (onImageChange) onImageChange(e.target.files[0]);
  };
  return (
    <label
      className={cn(
        "overflow-clip size-[130px] rounded-xl block cursor-pointer border border-transparent hover:border-[#CCD0D7] relative",
        className
      )}
      htmlFor="upload-img"
    >
      <input type="file" onChange={handleImageChange} hidden id="upload-img" />
      <img
        src={imgSrc}
        alt="uploaded image"
        className="size-full object-center object-cover"
      />
      <img
        src="/icons/add-gallary.svg"
        className="absolute bottom-0 right-0"
        alt=""
      />
    </label>
  );
};
export default ImageInput;
