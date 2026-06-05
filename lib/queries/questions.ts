import * as questionsApi from "@/lib/api/questions";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useQuestions = ({
  page = 1,
  mine = false,
}: {
  page?: number;
  mine?: boolean;
}) => {
  return useQuery({
    queryKey: ["questions", page, mine],
    queryFn: () => questionsApi.getQuestions(page, mine),
  });
};

export const useAddQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: questionsApi.addQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
};

export const useRemoveQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: questionsApi.removeQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
};

export const useQuestionById = (id: number) => {
  return useQuery({
    queryKey: ["question", id],
    queryFn: () => questionsApi.getQuestionById(id),
    enabled: !!id,
  });
};

export const useAddQuestionAnswer = (questionId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: questionsApi.addQuestionAnswer,
    onSuccess: () => {
      if (questionId) {
        queryClient.invalidateQueries({
          queryKey: ["question-answers", questionId],
        });
      }
    },
  });
};

export const useQuestionAnswers = (id: number) => {
  return useQuery({
    queryKey: ["question-answers", id],
    queryFn: () => questionsApi.getQuestionAnswers(id),
    enabled: !!id,
  });
};
