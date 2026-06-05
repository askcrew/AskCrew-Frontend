"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconArrowLeft,
  IconEye,
  IconMessage,
  IconClock,
} from "@tabler/icons-react";
import { useQuestionById, useQuestionAnswers } from "@/lib/queries/questions";
import { AnswerForm } from "@/components/enterprise/community/answer-form";
import { Loader2, AlertCircle } from "lucide-react";
import { useMemo } from "react";
import { Question as UIQuestion } from "@/components/enterprise/community/questions-data-table/schema";
import { Answer } from "@/lib/api/questions";

export default function StudentSingleQuestionPage() {
  const params = useParams();
  const router = useRouter();
  const questionId = parseInt(params.id as string);

  const {
    data: questionData,
    isLoading: isLoadingQuestion,
    isError: isErrorQuestion,
    error: questionError,
  } = useQuestionById(questionId);

  const {
    data: answersData,
    isLoading: isLoadingAnswers,
    refetch: refetchAnswers,
  } = useQuestionAnswers(questionId);

  // Map API data to UI structure
  const question: UIQuestion | null = useMemo(() => {
    if (!questionData) return null;
    return {
      id: String(questionData.id),
      title: questionData.title,
      description: questionData.body,
      category: questionData.specification,
      tags: [],
      answersCount: 0,
      viewsCount: 0,
      status: "open",
      createdAt: questionData.created_at,
      updatedAt: questionData.updated_at,
    };
  }, [questionData]);

  const answers = useMemo(() => {
    if (!answersData) return [];
    return Array.isArray(answersData) ? answersData : [];
  }, [answersData]);

  if (isLoadingQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6">
        <Loader2 className="size-12 animate-spin text-orange-500" />
        <p className="text-muted-foreground font-medium text-lg">
          Loading question...
        </p>
      </div>
    );
  }

  if (isErrorQuestion || !question) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6">
        <AlertCircle className="size-12 text-destructive" />
        <h1 className="text-2xl font-bold">Question not found</h1>
        <p className="text-muted-foreground">
          {(questionError as Error)?.message ||
            "The question you are looking for does not exist or has been removed."}
        </p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

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

  return (
    <div className="flex flex-col gap-6 p-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="w-fit hover:bg-orange-500/10"
      >
        <IconArrowLeft className="mr-2 size-4" />
        Back to Community
      </Button>

      <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-orange-500/10 via-purple-500/10 to-pink-500/10 p-8 border border-orange-200/20 dark:border-orange-500/20">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

        <div className="relative flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight mb-3">
                {question.title}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
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
            </div>
          </div>

          <p className="text-base text-foreground leading-relaxed whitespace-pre-wrap">
            {question.description}
          </p>

          <div className="flex gap-6 mt-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconMessage className="size-4" />
              <span className="text-sm font-medium">
                {isLoadingAnswers ? "..." : answers.length} Answers
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconEye className="size-4" />
              <span className="text-sm font-medium">
                {question.viewsCount} Views
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconClock className="size-4" />
              <span className="text-sm font-medium">
                Asked on{" "}
                {new Date(question.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border-2 border-orange-500/20 p-8 space-y-8">
        <h2 className="text-2xl font-bold bg-linear-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
          {isLoadingAnswers ? "..." : answers.length}{" "}
          {answers.length === 1 ? "Answer" : "Answers"}
        </h2>

        {isLoadingAnswers ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-8 animate-spin text-orange-500" />
          </div>
        ) : answers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <IconMessage className="size-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No answers yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Be the first to help! Share your knowledge below.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {answers.map((answer: Answer) => (
              <div
                key={answer.id}
                className="p-6 rounded-lg bg-orange-500/5 border border-orange-500/10 space-y-3"
              >
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {answer.body}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-orange-500/10">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-linear-to-r from-orange-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">
                      U
                    </div>
                    <span>Community Member</span>
                  </div>
                  <span>
                    {new Date(answer.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {question.status === "open" && (
          <div className="pt-6 border-t-2 border-orange-500/20">
            <h3 className="text-xl font-semibold mb-4">Your Answer</h3>
            <AnswerForm
              questionId={questionId}
              onSuccess={() => refetchAnswers()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
