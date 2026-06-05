import { toFormData } from "../utils";
import axiosInstance from "../axiosInstance";

interface PayForContentProps {
  with_wallet: boolean;
  content_id: string;
  content_type: string;
  code?: string;
}

export async function payForContent({
  code,
  content_id,
  content_type,
  with_wallet,
}: PayForContentProps) {
  const formData = toFormData({
    code,
    content_id,
    content_type,
    with_wallet: with_wallet ? 1 : 0,
  });
  const response = await axiosInstance.post(
    "/payment/content/payment",
    formData
  );

  return response.data;
}
