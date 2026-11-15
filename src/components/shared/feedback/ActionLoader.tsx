"use client";

import { Spin } from "antd";

interface ActionLoaderProps {
  active?: boolean;
  label?: string;
}

const ActionLoader = ({ active = false, label }: ActionLoaderProps) => {
  if (!active) {
    return null;
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500"
      aria-busy="true"
    >
      <Spin size="small" />
      {label}
    </span>
  );
};

export default ActionLoader;
