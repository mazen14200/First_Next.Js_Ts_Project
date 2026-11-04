"use client";

import {
  CalendarOutlined,
  CloseOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useLocale } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

import styles from "./DatePicker.module.css";

interface DatePickerProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
}

const WEEK_DAYS = {
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  ar: ["أحد", "اثن", "ثلا", "أرب", "خمي", "جمع", "سبت"],
};

const CALENDAR_WIDTH = 300;
const VIEWPORT_MARGIN = 16;

const padNumber = (value: number) =>
  String(value).padStart(2, "0");

const formatDateValue = (date: Date) =>
  `${date.getFullYear()}-${padNumber(
    date.getMonth() + 1
  )}-${padNumber(date.getDate())}`;

const parseDateValue = (value: string) => {
  if (!value) {
    return null;
  }

  const [year, month, day] = value
    .split("-")
    .map(Number);

  if (
    !year ||
    !month ||
    !day ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  return new Date(year, month - 1, day);
};

const DatePicker = ({
  label,
  value = "",
  onChange,
  placeholder,
  disabled = false,
  min,
  max,
}: DatePickerProps) => {
  const locale = useLocale();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isArabic = locale === "ar";

  const selectedDate = useMemo(
    () => parseDateValue(value),
    [value]
  );

  const minDate = useMemo(
    () => parseDateValue(min ?? ""),
    [min]
  );

  const [isOpen, setIsOpen] = useState(false);

  const [calendarPosition, setCalendarPosition] = useState({
    top: 0,
    left: 0,
  });

  const [visibleMonth, setVisibleMonth] = useState(() => {
    const initialDate =
      selectedDate ?? minDate ?? new Date();

    return new Date(
      initialDate.getFullYear(),
      initialDate.getMonth(),
      1
    );
  });

  const updateCalendarPosition = () => {
    if (!wrapperRef.current) {
      return;
    }

    const rect = wrapperRef.current.getBoundingClientRect();

    const preferredLeft = isArabic
      ? rect.right - CALENDAR_WIDTH
      : rect.left;

    const maxLeft =
      window.innerWidth -
      CALENDAR_WIDTH -
      VIEWPORT_MARGIN;

    const left = Math.min(
      Math.max(preferredLeft, VIEWPORT_MARGIN),
      Math.max(VIEWPORT_MARGIN, maxLeft)
    );

    setCalendarPosition({
      top: rect.bottom + 8,
      left,
    });
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    updateCalendarPosition();

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false);
      }
    };

    const handlePositionUpdate = () => {
      updateCalendarPosition();
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    window.addEventListener(
      "resize",
      handlePositionUpdate
    );

    window.addEventListener(
      "scroll",
      handlePositionUpdate,
      true
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

      window.removeEventListener(
        "resize",
        handlePositionUpdate
      );

      window.removeEventListener(
        "scroll",
        handlePositionUpdate,
        true
      );
    };
  }, [isOpen, isArabic]);

  const monthLabel = new Intl.DateTimeFormat(
    isArabic ? "ar-EG" : "en-US",
    {
      month: "long",
      year: "numeric",
    }
  ).format(visibleMonth);

  const calendarDays = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();

    const daysInMonth = new Date(
      year,
      month + 1,
      0
    ).getDate();

    const previousMonthDays = new Date(
      year,
      month,
      0
    ).getDate();

    const days = [];

    for (let index = firstDay - 1; index >= 0; index--) {
      const day = previousMonthDays - index;

      days.push({
        date: new Date(year, month - 1, day),
        currentMonth: false,
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        currentMonth: true,
      });
    }

    let nextMonthDay = 1;

    while (days.length < 42) {
      days.push({
        date: new Date(
          year,
          month + 1,
          nextMonthDay
        ),
        currentMonth: false,
      });

      nextMonthDay++;
    }

    return days;
  }, [visibleMonth]);

  const isDateDisabled = (date: Date) => {
    const dateValue = formatDateValue(date);

    if (min && dateValue < min) {
      return true;
    }

    if (max && dateValue > max) {
      return true;
    }

    return false;
  };

  const isSelected = (date: Date) => {
    return formatDateValue(date) === value;
  };

  const isToday = (date: Date) => {
    const today = new Date();

    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const handleSelectDate = (date: Date) => {
    if (disabled || isDateDisabled(date)) {
      return;
    }

    setVisibleMonth(
      new Date(
        date.getFullYear(),
        date.getMonth(),
        1
      )
    );

    onChange?.(formatDateValue(date));
    setIsOpen(false);
  };

  const handlePreviousMonth = () => {
    setVisibleMonth(
      (currentMonth) =>
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() - 1,
          1
        )
    );
  };

  const handleNextMonth = () => {
    setVisibleMonth(
      (currentMonth) =>
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1,
          1
        )
    );
  };

  const handleClear = () => {
    if (disabled) {
      return;
    }

    onChange?.("");
    setIsOpen(false);
  };

  const handleToggleCalendar = () => {
    if (disabled) {
      return;
    }

    if (!isOpen && selectedDate) {
      setVisibleMonth(
        new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          1
        )
      );
    }

    if (!isOpen) {
      requestAnimationFrame(() => {
        updateCalendarPosition();
      });
    }

    setIsOpen((open) => !open);
  };

  const displayValue = selectedDate
    ? new Intl.DateTimeFormat(
        isArabic ? "ar-EG" : "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      ).format(selectedDate)
    : "";

  const displayPlaceholder =
    placeholder ??
    (isArabic ? "اختر التاريخ" : "Select date");

  return (
    <div
      ref={wrapperRef}
      className="relative flex min-w-0 flex-1 flex-col"
    >
      <div className="mb-2 flex items-center justify-start">
        <label
          className={`font-['mainFont',sans-serif] text-[12px] font-extrabold tracking-[0.02em] text-[#304b5d] ${
            disabled ? "opacity-50" : ""
          }`}
        >
          {label}
        </label>
      </div>

      <div
        className={`${styles.datePickerWrapper} ${
          isOpen ? styles.focused : ""
        } ${disabled ? styles.disabled : ""}`}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={handleToggleCalendar}
          className={styles.trigger}
          aria-label={label}
          aria-expanded={isOpen}
        >
          <CalendarOutlined
            className={styles.calendarIcon}
          />

          {displayValue ? (
            <span className={styles.value}>
              {displayValue}
            </span>
          ) : (
            <span className={styles.placeholder}>
              {displayPlaceholder}
            </span>
          )}
        </button>

        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearButton}
            aria-label={`Clear ${label}`}
          >
            <CloseOutlined />
          </button>
        )}
      </div>

      {isOpen && !disabled && (
        <div
          className={`${styles.calendarPopup} ${
            isArabic ? styles.rtl : ""
          }`}
          style={{
            top: `${calendarPosition.top}px`,
            left: `${calendarPosition.left}px`,
          }}
        >
          <div className={styles.calendarHeader}>
            <button
              type="button"
              onClick={
                isArabic
                  ? handleNextMonth
                  : handlePreviousMonth
              }
              className={styles.navigationButton}
              aria-label={
                isArabic
                  ? "الشهر التالي"
                  : "Previous month"
              }
            >
              {isArabic ? (
                <RightOutlined />
              ) : (
                <LeftOutlined />
              )}
            </button>

            <div className={styles.monthTitle}>
              {monthLabel}
            </div>

            <button
              type="button"
              onClick={
                isArabic
                  ? handlePreviousMonth
                  : handleNextMonth
              }
              className={styles.navigationButton}
              aria-label={
                isArabic
                  ? "الشهر السابق"
                  : "Next month"
              }
            >
              {isArabic ? (
                <LeftOutlined />
              ) : (
                <RightOutlined />
              )}
            </button>
          </div>

          <div className={styles.weekDays}>
            {WEEK_DAYS[
              isArabic ? "ar" : "en"
            ].map((day) => (
              <span
                key={day}
                className={styles.weekDay}
              >
                {day}
              </span>
            ))}
          </div>

          <div className={styles.calendarGrid}>
            {calendarDays.map(
              ({ date, currentMonth }) => {
                const dateValue =
                  formatDateValue(date);

                const selected = isSelected(date);
                const today = isToday(date);
                const dateDisabled =
                  isDateDisabled(date);

                return (
                  <button
                    key={dateValue}
                    type="button"
                    disabled={dateDisabled}
                    onClick={() =>
                      handleSelectDate(date)
                    }
                    className={`${styles.dayButton} ${
                      !currentMonth
                        ? styles.otherMonth
                        : ""
                    } ${
                      selected
                        ? styles.selectedDay
                        : ""
                    } ${
                      today && !selected
                        ? styles.today
                        : ""
                    } ${
                      dateDisabled
                        ? styles.dayDisabled
                        : ""
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
