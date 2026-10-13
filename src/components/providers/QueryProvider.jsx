"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { queryClient } from "@/lib/queryClient";

export default function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Global Toaster — dark admin theme, mounted once */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#FFFFFF",
            color: "#25313C",
            border: "1px solid #E2E7E5",
            borderRadius: "10px",
            padding: "12px 16px",
            fontSize: "13px",
            boxShadow: "0 10px 30px rgba(37, 49, 60, 0.12)",
          },
          success: {
            iconTheme: { primary: "#287451", secondary: "#E8F4EC" },
            style: { borderLeft: "4px solid #287451" },
          },
          error: {
            iconTheme: { primary: "#B54747", secondary: "#FBECEC" },
            style: { borderLeft: "4px solid #B54747" },
          },
        }}
      />
    </QueryClientProvider>
  );
}
