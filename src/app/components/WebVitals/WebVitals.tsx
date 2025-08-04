"use client";

import { useReportWebVitals } from "next/web-vitals";

export default function WebVitals() {
  useReportWebVitals((metric) => {
    console.log("[Web Vital]", metric);
  });

  return null;
}
