"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function ToastListener() {
  useEffect(() => {
    const handleToast = (event: CustomEvent<{ message: string; type?: "success" | "error" | "info" }>) => {
      const { message, type = "success" } = event.detail;
      
      switch (type) {
        case "success":
          toast.success(message);
          break;
        case "error":
          toast.error(message);
          break;
        case "info":
          toast.info(message);
          break;
        default:
          toast(message);
      }
    };

    window.addEventListener("show-toast" as any, handleToast as EventListener);

    return () => {
      window.removeEventListener("show-toast" as any, handleToast as EventListener);
    };
  }, []);

  return null;
}

