"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconEye,
  IconMessage,
  IconClock,
  IconMessagePlus,
} from "@tabler/icons-react";
import { Question } from "./questions-data-table/schema";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { AddAnswerDialog } from "./add-answer-dialog";

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [answerDialogOpen, setAnswerDialogOpen] = useState(false);

  const statusConfig = {
    open: {
      label: "Open",
      className:
        "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400",
    },
    answered: {
      label: "Answered",
      className:
        "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400",
    },
    closed: {
      label: "Closed",
      className:
        "bg-gray-500/10 border-gray-500/20 text-gray-700 dark:text-gray-400",
    },
  };

  const config = statusConfig[question.status as keyof typeof statusConfig];

  const handleViewQuestion = () => {
    const isStudent = pathname.includes("/student");
    const basePath = isStudent
      ? "/student/dashboard/community"
      : "/enterprise/dashboard/community/questions";
    router.push(`${basePath}/${question.id}`);
  };

  return (
    <>
      <Card className="group relative overflow-hidden border-2 border-orange-500/10 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-linear-to-br from-orange-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-orange-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300 pointer-events-none" />

        <CardHeader className="relative space-y-3 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={config.className}>
                  {config.label}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-400"
                >
                  {question.category}
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold leading-tight group-hover:text-orange-600 transition-colors cursor-pointer line-clamp-2">
                {question.title}
              </CardTitle>
            </div>
          </div>
          <CardDescription className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {question.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative space-y-3 pb-4">
          {/* Tags */}
          {question.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {question.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-400 hover:bg-orange-500/20 transition-colors cursor-pointer"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <IconMessage className="size-4" />
              <span className="font-medium">{question.answersCount}</span>
              <span className="hidden sm:inline">
                {question.answersCount === 1 ? "Answer" : "Answers"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <IconEye className="size-4" />
              <span className="font-medium">{question.viewsCount}</span>
              <span className="hidden sm:inline">
                {question.viewsCount === 1 ? "View" : "Views"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <IconClock className="size-4" />
              <span className="text-xs">
                {new Date(question.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="relative pt-4 border-t border-orange-500/10 gap-2">
          <Button
            onClick={() => setAnswerDialogOpen(true)}
            variant="outline"
            className="flex-1 border-2 hover:bg-orange-500/10 hover:border-orange-500/30 transition-all"
          >
            <IconMessagePlus className="mr-2 size-4" />
            Add Answer
          </Button>

          <Button
            onClick={handleViewQuestion}
            className={`bg-linear-to-r flex-1 from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300`}
          >
            <IconMessage className="mr-2 size-4" />
            {question.answersCount > 0 ? "View Answers" : "View Question"}
          </Button>
        </CardFooter>
      </Card>

      <AddAnswerDialog
        questionTitle={question.title}
        open={answerDialogOpen}
        onOpenChange={setAnswerDialogOpen}
      />
    </>
  );
}
