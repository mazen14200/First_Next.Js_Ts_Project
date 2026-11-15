"use client";

import { Spin } from "antd";

interface InlineLoaderProps {
  size?: "small" | "default";
}

const InlineLoader = ({ size = "small" }: InlineLoaderProps) => {
  return (
    <span
      className="inline-flex items-center"
      aria-busy="true"
      aria-label="Loading"
    >
      <Spin size={size} />
    </span>
  );
};

export default InlineLoader;
