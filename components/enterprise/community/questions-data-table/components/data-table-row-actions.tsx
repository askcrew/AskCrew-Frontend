"use client";

import { Row } from "@tanstack/react-table";
import { Question } from "../schema";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconDotsVertical,
  IconEye,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface DataTableRowActionsProps {
  row: Row<Question>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const router = useRouter();
  const question = row.original;

  const handleViewAnswers = () => {
    const isStudent = window.location.pathname.includes("/student/");
    const basePath = isStudent ? "/student" : "/enterprise";
    router.push(`${basePath}/dashboard/community/questions/${question.id}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex size-8 p-0 data-[state=open]:bg-muted"
          size="icon"
        >
          <IconDotsVertical className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleViewAnswers}>
          <IconEye className="mr-2 size-4" />
          View Answers
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <IconEdit className="mr-2 size-4" />
          Edit Question
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive">
          <IconTrash className="mr-2 size-4" />
          Delete Question
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
