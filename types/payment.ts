export type PaymentResponse = {
  id: string;
  object: string;
  live_mode: boolean;
  customer_initiated: boolean;
  api_version: string;
  method: string;
  status: string;
  amount: number;
  currency: string;
  threeDSecure: boolean;
  card_threeDSecure: boolean;
  save_card: boolean;
  product: string;
  description: string;
  metadata: {
    type: string;
    user_id: string;
  };
  order: Record<string, unknown>;
  transaction: {
    timezone: string;
    created: string;
    url: string;
    expiry: {
      period: number;
      type: string;
    };
    asynchronous: boolean;
    amount: number;
    currency: string;
    date: {
      created: number;
      transaction: number;
    };
  };
  response: {
    code: string;
    message: string;
  };
  receipt: {
    email: boolean;
    sms: boolean;
  };
  customer: {
    first_name: string;
    email: string;
    phone: {
      country_code: string;
      number: string;
    };
  };
  merchant: {
    country: string;
    currency: string;
    id: string;
  };
  source: {
    object: string;
    type: string;
    payment_type: string;
    channel: string;
    id: string;
    on_file: boolean;
    payment_method: string;
  };
  redirect: {
    status: string;
    url: string;
  };
  post: {
    status: string;
    url: string;
  };
  activities: Array<{
    id: string;
    object: string;
    created: number;
    status: string;
    currency: string;
    amount: number;
    remarks: string;
    txn_id: string;
  }>;
  auto_reversed: boolean;
  intent: {
    id: string;
  };
  initiator: string;
};
