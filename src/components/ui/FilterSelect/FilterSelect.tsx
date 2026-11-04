"use client";

import { Select } from "antd";
import type { SelectProps } from "antd";

import styles from "./FilterSelect.module.css";

interface FilterSelectProps extends SelectProps {
  label?: string;
  compact?: boolean;
}

const FilterSelect = ({
  label,
  compact = false,
  ...props
}: FilterSelectProps) => {
  return (
    <div
      className={`${styles.wrapper} ${
        compact ? styles.compactWrapper : ""
      }`}
    >
      {label && (
        <div className={styles.labelWrapper}>
          <span className={styles.labelAccent} />

          <label className={styles.label}>
            {label}
          </label>
        </div>
      )}

      <Select
        {...props}
        popupMatchSelectWidth
        className={`${styles.select} ${
          compact ? styles.compactSelect : ""
        }`}
        classNames={{
          popup: {
            root: styles.dropdown,
          },
        }}
      />
    </div>
  );
};

export default FilterSelect;
