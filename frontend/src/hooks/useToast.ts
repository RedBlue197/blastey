// hooks/useToast.ts
import { useState } from "react";

export function useToast() {
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("info");
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (type: "success" | "error" | "warning" | "info", message: string) => {
    setToastType(type);
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000); // Adjust the duration as needed
  };

  return { showToast, toastType, toastMessage, triggerToast };
}
