"use client";

import { useEffect } from "react";
import { addToast, ToastProvider } from "@heroui/toast";

type ToastType = "success" | "error" | "info";

interface ToastHeroProps {
  title: string;
  type?: ToastType;
  duration?: number;
}

export function ToastHero({ title, type = "info", duration = 3000 }: ToastHeroProps) {
  useEffect(() => {
    addToast({ title, type, duration } as any);
  }, [title, type, duration]);

  return null;
}

// Wrapper global apenas para inicializar o provider
export const ToastWrapper: React.FC = () => {
  return <ToastProvider />;
};
