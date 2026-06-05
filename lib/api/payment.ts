import axiosInstance from "@/lib/axiosInstance";

export interface WatermarkPaymentResponse {
  id: string;
  transaction: {
    url: string;
  };
  response: {
    code: string;
    message: string;
  };
}

export const createWatermarkPayment = async (
  use_points?: boolean,
): Promise<WatermarkPaymentResponse> => {
  const response = await axiosInstance.post("/payment/watermark/", {
    use_points: use_points ? 1 : 0, // Assuming 1/0 or just use true/false based on backend expectation, the user said "optional use_points in the body"
  });
  return response.data;
};
