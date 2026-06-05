"use client";

import { useState, useMemo } from "react";
import { QuestionCard } from "@/components/enterprise/community/question-card";
import { QuestionsFilter } from "@/components/enterprise/community/questions-filter";
import { Question as UIQuestion } from "@/components/enterprise/community/questions-data-table/schema";
import {
  IconMessageQuestion,
  IconSparkles,
  IconPlus,
} from "@tabler/icons-react";
import { useQuestions } from "@/lib/queries/questions";
import { AddQuestionDialog } from "@/components/enterprise/community/add-question-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";

const CommunityQuestionsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [page] = useState(1);

  const { data, isLoading, isError, error } = useQuestions({ page });

  // Map API data to UI structure
  const questions: UIQuestion[] = useMemo(() => {
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

  // Get unique categories from questions
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(questions.map((q) => q.category)),
    );
    return uniqueCategories.sort();
  }, [questions]);

  // Filter questions based on search and filters
  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      // Search filter
      const matchesSearch =
        !searchQuery ||
        question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        question.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      // Category filter
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(question.category);

      // Status filter
      const matchesStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(question.status);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [questions, searchQuery, selectedCategories, selectedStatuses]);

  // Calculate stats
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
                  Community
                </span>
              </div>
              <div className="flex items-center gap-3">
                <IconMessageQuestion className="size-10 text-orange-500" />
                <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-orange-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Community Questions
                </h1>
              </div>
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
            Explore questions from the community, share your expertise, and help
            others succeed in their creative journey.
          </p>

          {/* Stats Cards */}
          <div className="flex gap-4 mt-4 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <IconSparkles className="size-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                {stats.total} Total Questions
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                {stats.open} Need Answers
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                {stats.answered} Answered
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <IconMessageQuestion className="size-4 text-purple-500" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                {stats.totalAnswers} Total Answers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <QuestionsFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategories={selectedCategories}
        onCategoriesChange={setSelectedCategories}
        selectedStatuses={selectedStatuses}
        onStatusesChange={setSelectedStatuses}
        categories={categories}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {filteredQuestions.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-foreground">
            {questions.length}
          </span>{" "}
          questions
        </p>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="size-12 animate-spin text-orange-500 mb-4" />
          <p className="text-muted-foreground font-medium text-lg">
            Loading community questions...
          </p>
        </div>
      ) : isError ? (
        <div className="p-4 rounded-lg bg-destructive/10 border-2 border-destructive/20 text-destructive flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <div className="flex flex-col">
            <span className="font-bold">Error Loading Questions</span>
            <span className="text-sm">
              {(error as Error)?.message ||
                "Something went wrong while fetching the questions. Please try again later."}
            </span>
          </div>
        </div>
      ) : filteredQuestions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border-2 border-dashed border-orange-500/20">
          <IconMessageQuestion className="size-20 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No questions found
          </h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            {searchQuery ||
            selectedCategories.length > 0 ||
            selectedStatuses.length > 0
              ? "Try adjusting your filters or search query to find more questions."
              : "Be the first to ask a question in the community!"}
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

export default CommunityQuestionsPage;
