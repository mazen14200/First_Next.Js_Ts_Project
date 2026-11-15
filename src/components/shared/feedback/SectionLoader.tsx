"use client";

import type { ReactNode } from "react";
import { Spin } from "antd";

interface SectionLoaderProps {
  children?: ReactNode;
  variant?: "skeleton" | "spinner";
  rows?: number;
}

const SectionLoader = ({
  variant = "skeleton",
  children,
}: SectionLoaderProps) => {
  if (variant === "spinner") {
    return (
      <div
        className="flex min-h-40 items-center justify-center"
        aria-busy="true"
      >
        <Spin />
      </div>
    );
  }

  return (
    <div aria-busy="true">{children}</div>
  );
};

export default SectionLoader;
