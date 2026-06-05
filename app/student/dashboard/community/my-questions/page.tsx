"use client";

import { useMemo, useState } from "react";
import {
  QuestionsDataTable,
  type Question,
} from "@/components/enterprise/community/questions-data-table";
import { useQuestions } from "@/lib/queries/questions";
import { Loader2, AlertCircle } from "lucide-react";
import { IconMessageQuestion, IconPlus } from "@tabler/icons-react";
import { AddQuestionDialog } from "@/components/enterprise/community/add-question-dialog";
import { Button } from "@/components/ui/button";

const MyQuestionsPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { data, isLoading, isError, error } = useQuestions({ mine: true });

  const questions: Question[] = useMemo(() => {
    if (!data?.results) return [];
    return data.results.map((q) => ({
      id: String(q.id),
      title: q.title,
      description: q.body,
      category: q.specification,
      tags: [],
      answersCount: 0,
      viewsCount: 0,
      status: "open",
      createdAt: q.created_at,
      updatedAt: q.updated_at,
    }));
  }, [data]);

  const stats = useMemo(() => {
    return {
      total: questions.length,
      open: questions.filter((q) => q.status === "open").length,
      answered: questions.filter((q) => q.status === "answered").length,
      totalAnswers: questions.reduce((acc, q) => acc + q.answersCount, 0),
    };
  }, [questions]);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Section with Gradient Background */}
      <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-orange-500/10 via-purple-500/10 to-pink-500/10 p-8 border border-orange-200/20 dark:border-orange-500/20">
        {/* Decorative Background Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        {/* Content */}
        <div className="relative flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-linear-to-r from-orange-500 to-purple-500 rounded-full"></div>
                <span className="text-sm font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                  Student Community
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-orange-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                My Questions
              </h1>
            </div>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-linear-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <IconPlus className="mr-2 size-5" />
              Ask Question
            </Button>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Track your community contributions, see how others are engaging with
            your questions, and follow the discussion.
          </p>

          {/* Stats Cards */}
          <div className="flex gap-4 mt-4 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                {stats.open} Open
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                {stats.answered} Answered
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
              <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                {stats.totalAnswers} Total Answers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="size-12 animate-spin text-orange-500 mb-4" />
          <p className="text-muted-foreground font-medium text-lg">
            Loading your questions...
          </p>
        </div>
      ) : isError ? (
        <div className="p-4 rounded-lg bg-destructive/10 border-2 border-destructive/20 text-destructive flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <div className="flex flex-col">
            <span className="font-bold">Error Loading Questions</span>
            <span className="text-sm">
              {(error as Error)?.message ||
                "Something went wrong while fetching your questions."}
            </span>
          </div>
        </div>
      ) : questions.length > 0 ? (
        <QuestionsDataTable data={questions} />
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border-2 border-dashed border-orange-500/20 bg-muted/30">
          <IconMessageQuestion className="size-20 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No questions yet
          </h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            You haven&apos;t asked any questions in the community yet. Start by
            asking a question to get insights from other students!
          </p>
        </div>
      )}
      <AddQuestionDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
};

export default MyQuestionsPage;
