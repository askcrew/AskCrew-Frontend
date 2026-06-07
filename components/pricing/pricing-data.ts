import axiosInstance from "@/lib/axiosInstance";
import { PricingPlan } from "./pricing-card";

// API Response Types
interface ApiFeature {
  id: number;
  feature_key: string;
  feature_key_display: string;
  limit: number | null;
}

export interface ApiPlan {
  id: number;
  plan_type: "enterprise" | "student";
  tier: string;
  name: string;
  description: string | null;
  price: string;
  currency: string;
  is_active: boolean;
  features: ApiFeature[];
  created_at: string;
  updated_at: string;
}

interface ApiPlansResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiPlan[];
}

// Transform API data to PricingPlan format
export function transformApiPlans(apiResponse: ApiPlansResponse): {
  enterprisePlans: PricingPlan[];
  studentPlans: PricingPlan[];
} {
  const enterprisePlans: PricingPlan[] = [];
  const studentPlans: PricingPlan[] = [];

  const results = Array.isArray(apiResponse.results) ? apiResponse.results : [];

  results.forEach((plan) => {
    const pricingPlan: PricingPlan = {
      id: plan.id,
      name: plan.name,
      price: parseFloat(plan.price),
      period: "month",
      tier: plan.tier,
      description: plan.description || `${plan.tier} tier plan`,
      features: Array.isArray(plan.features) 
        ? plan.features.map((f) => {
            if (f.limit !== null && f.limit !== undefined) {
              return `${f.feature_key_display} (${f.limit})`;
            }
            return f.feature_key_display;
          }) 
        : [],
      buttonText: parseFloat(plan.price) === 0 ? "Book a Call" : "Get started",
      highlighted: plan.tier === "pro" || plan.tier === "diamond",
      badge: plan.tier === "pro" ? "Most Popular" : undefined,
    };

    if (plan.plan_type === "enterprise") {
      enterprisePlans.push(pricingPlan);
    } else if (plan.plan_type === "student") {
      studentPlans.push(pricingPlan);
    }
  });

  return { enterprisePlans, studentPlans };
}

// Fetch and transform plans
export async function fetchPlans(type?: "enterprise" | "student") {
  const endpoints = [
    "auth/plans/",
    "auth/plans/discounts/",
  ];

  let lastError: any = null;

  for (const endpoint of endpoints) {
    try {
      const params = type ? `?type=${type}` : "";
      const response = await fetch(`https://admin.askcrews.com/api/v1/${endpoint}${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log(`Plans API Response from ${endpoint}:`, data);
      
      // Handle both paginated and direct array responses
      let results: ApiPlan[] = [];
      if (Array.isArray(data)) {
        results = data;
      } else if (data && Array.isArray(data.results)) {
        results = data.results;
      } else if (data && data.data && Array.isArray(data.data)) {
        results = data.data;
      }

      if (results.length > 0) {
        const apiResponse: ApiPlansResponse = {
          count: results.length,
          next: null,
          previous: null,
          results: results,
        };
        
        return transformApiPlans(apiResponse);
      }
    } catch (error: any) {
      console.warn(`Failed to fetch from ${endpoint}:`, error.message);
      lastError = error;
      // Continue to next endpoint if 404
      if (error.response?.status !== 404) {
        // If it's not a 404, we might want to stop, but for reliability we'll try all
      }
    }
  }

  console.error("All plan endpoints failed. Last error:", lastError);
  throw lastError || new Error("Failed to fetch plans from any endpoint");
}
