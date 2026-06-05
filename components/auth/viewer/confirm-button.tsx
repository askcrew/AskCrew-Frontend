"use client";

import { Button } from "@/components/ui/button";

interface ConfirmButtonProps {
  onClick: () => void;
}

export default function ConfirmButton({ onClick }: ConfirmButtonProps) {
  return (
    <Button onClick={onClick} variant={"linear-1"} size={"xl"}>
      Confirm
    </Button>
  );
}
