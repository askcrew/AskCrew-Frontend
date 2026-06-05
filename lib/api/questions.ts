import axiosInstance from "@/lib/axiosInstance";

export interface Question {
  id: number;
  body: string;
  title: string;
  specification: string;
  created_at: string;
  updated_at: string;
}

export interface QuestionsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Question[];
}

export interface AddQuestionPayload {
  body: string;
  title: string;
  specification: string;
}

export interface RemoveQuestionPayload {
  id: number;
}

export const getQuestions = async (
  page = 1,
  mine = false,
): Promise<QuestionsResponse> => {
  const response = await axiosInstance.get<QuestionsResponse>(
    `community/questions/?page=${page}&mine=${mine}`,
  );
  return response.data;
};

export const addQuestion = async (
  payload: AddQuestionPayload,
): Promise<unknown> => {
  const response = await axiosInstance.post("/community/questions", payload);
  return response.data;
};

export const removeQuestion = async (
  payload: RemoveQuestionPayload,
): Promise<unknown> => {
  const response = await axiosInstance.delete("/community/questions/remove/", {
    data: payload,
  });
  return response.data;
};

export const getQuestionById = async (id: number): Promise<Question> => {
  const response = await axiosInstance.get<Question>(
    `community/questions/${id}/`,
  );
  return response.data;
};

export const getQuestionAnswers = async (id: number): Promise<Answer[]> => {
  const response = await axiosInstance.get<Answer[]>(
    `community/answers/${id}/`,
  );
  return response.data;
};

export interface AddQuestionAnswerPayload {
  body: string;
  question: number;
}

export interface Answer {
  id: number;
  body: string;
  question: number;
  created_at: string;
  updated_at: string;
}

export const addQuestionAnswer = async (
  payload: AddQuestionAnswerPayload,
): Promise<unknown> => {
  const response = await axiosInstance.post("/community/answers/", payload);
  return response.data;
};
