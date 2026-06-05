export type Notification = {
  id: number;
  notification_type: "payment" | "message" | "custom" | string;
  title: string;
  message: string;
  is_read: boolean;
  metadata: {
    amount: number;
    content_id: number;
  };
  created_at: string;
};
