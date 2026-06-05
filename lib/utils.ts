import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * Converts a JavaScript object to FormData
 * Handles nested objects, arrays, files, and primitive values
 * @param obj - The object to convert
 * @param formData - Optional existing FormData instance
 * @param parentKey - Used internally for nested keys
 * @returns FormData instance
 */
export const toFormData = (
  obj: Record<string, unknown>,
  formData: FormData = new FormData(),
  parentKey: string = ""
): FormData => {
  if (obj === null || obj === undefined) {
    return formData;
  }

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const formKey = parentKey ? `${parentKey}[${key}]` : key;

    if (value === null || value === undefined) {
      // Skip null/undefined values
      return;
    }

    if (value instanceof File || value instanceof Blob) {
      // Handle File/Blob objects
      formData.append(formKey, value);
    } else if (Array.isArray(value)) {
      // Handle arrays
      value.forEach((item, index) => {
        if (item instanceof File || item instanceof Blob) {
          formData.append(formKey, item);
        } else if (typeof item === "object" && item !== null) {
          toFormData({ [index]: item }, formData, formKey);
        } else {
          formData.append(formKey, String(item));
        }
      });
    } else if (typeof value === "object" && !(value instanceof Date)) {
      // Handle nested objects (excluding Date objects)
      toFormData(value as Record<string, unknown>, formData, formKey);
    } else if (value instanceof Date) {
      // Handle Date objects
      formData.append(formKey, value.toISOString());
    } else if (typeof value === "boolean") {
      // Handle booleans
      formData.append(formKey, value ? "true" : "false");
    } else {
      // Handle primitive values (string, number)
      formData.append(formKey, String(value));
    }
  });

  return formData;
};
