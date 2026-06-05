"use client";

import { useState } from "react";

interface PlanToggleProps {
  value: "enterprise" | "students";
  onChange: (value: "enterprise" | "students") => void;
}

export function PlanToggle({ value, onChange }: PlanToggleProps) {
  return (
    <div className="inline-flex items-center bg-muted rounded-full p-1 shadow-sm">
      <button
        onClick={() => onChange("enterprise")}
        className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-200 ${
          value === "enterprise"
            ? "bg-linear-to-r from-purple-600 to-orange-600 text-white shadow-lg"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Enterprise
      </button>
      <button
        onClick={() => onChange("students")}
        className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-200 ${
          value === "students"
            ? "bg-linear-to-r from-purple-600 to-orange-600 text-white shadow-lg"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Students
      </button>
    </div>
  );
}
