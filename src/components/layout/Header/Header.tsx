"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";
import {
  BellOutlined,
  CheckOutlined,
  MenuOutlined,
} from "@ant-design/icons";

import UserMenu from "./UserMenu/UserMenu";

const notifications = [
  {
    id: 1,
    title: "New task assigned to you",
    description:
      "You have been assigned a new task in Project Alpha.",
    time: "5 min ago",
    unread: true,
  },
  {
    id: 2,
    title: "Project status updated",
    description:
      "Project Beta status has been changed.",
    time: "20 min ago",
    unread: true,
  },
  {
    id: 3,
    title: "Task deadline approaching",
    description:
      "The deadline for UI/UX Design is tomorrow.",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 4,
    title: "New comment",
    description:
      "Ahmed added a comment to your task.",
    time: "3 hours ago",
    unread: false,
  },
];

export default function Header({
  onSidebarToggle,
}: {
  onSidebarToggle: () => void;
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`${styles.header} flex h-[82px] items-center bg-white shadow-lg`}
    >
      <div className="flex w-full items-center justify-between px-6">

        {/* Left Section */}
        <div className="flex items-center gap-2">

          {/* Sidebar Toggle */}
          <button
            type="button"
            onClick={onSidebarToggle}
            className="flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-[#eef2f5] lg:hidden"
            aria-label="Toggle sidebar"
          >
            <MenuOutlined className="text-xl text-[#173b52]" />
          </button>

          {/* Header Title */}
          <h2 className="m-0 hidden text-[20px] font-bold text-black/75 md:block">
            Smart Vision SPMS
          </h2>

        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">

          {/* Notifications */}
          <div
            ref={notificationRef}
            className="relative"
          >
            {/* Notification Button */}
            <button
              type="button"
              onClick={() =>
                setNotificationsOpen((previous) => !previous)
              }
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#c4cace] bg-gray-100 shadow-md text-[#173b52] transition-all duration-200 hover:border-[#c5d3dc] hover:bg-[#f3f7f9] hover:text-[#1470ad] cursor-pointer"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
            >
              <BellOutlined className="text-[19px]" />

              {/* Unread Badge */}
              {unreadCount > 0 && (
                <span className="absolute -right-[2px] -top-[2px] flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-[#ff0000] px-1 text-[10px] font-bold leading-none text-white shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 top-[52px] z-50 w-[360px] overflow-hidden rounded border border-[#d8e1e7] bg-white shadow-[0_18px_45px_rgba(8,29,56,0.16)]">

                {/* Dropdown Header */}
                <div className="border-b border-[#e8edf0] bg-[#173b52] px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="m-0 text-[15px] font-bold text-white">
                        Notifications
                      </h3>

                      <p className="m-0 mt-1 text-[11px] text-white/65">
                        You have {unreadCount} unread notifications
                      </p>
                    </div>

                    {unreadCount > 0 && (
                      <span className="rounded-full bg-[#ff0000] px-2.5 py-1 text-[10px] font-bold text-white">
                        {unreadCount} New
                      </span>
                    )}
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-[360px] overflow-y-auto">

                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      className={`group flex w-full gap-3 border-b border-[#edf1f3] px-5 py-4 text-left transition-colors duration-200 hover:bg-[#f6f9fb] ${
                        notification.unread
                          ? "bg-[#f7fafc]"
                          : "bg-white"
                      }`}
                    >
                      {/* Notification Icon */}
                      <div className="relative flex-shrink-0">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full ${
                            notification.unread
                              ? "bg-[#e8f2f8] text-[#1470ad]"
                              : "bg-[#f0f3f5] text-[#82919b]"
                          }`}
                        >
                          <BellOutlined className="text-[15px]" />
                        </div>

                        {/* Unread Dot */}
                        {notification.unread && (
                          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#f37828]" />
                        )}
                      </div>

                      {/* Notification Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            className={`m-0 text-[12px] leading-5 ${
                              notification.unread
                                ? "font-bold text-[#173b52]"
                                : "font-semibold text-[#52616b]"
                            }`}
                          >
                            {notification.title}
                          </h4>

                          {notification.unread && (
                            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#f37828]" />
                          )}
                        </div>

                        <p className="m-0 mt-1 text-[11px] leading-[18px] text-[#74828b]">
                          {notification.description}
                        </p>

                        <span className="mt-1.5 block text-[10px] font-medium text-[#9aa6ad]">
                          {notification.time}
                        </span>
                      </div>
                    </button>
                  ))}

                </div>

                {/* Dropdown Footer */}
                <div className="flex items-center justify-between border-t border-[#e8edf0] bg-[#fbfcfd] px-5 py-3">

                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-[#1470ad] transition-colors hover:text-[#0f5f91]"
                  >
                    <CheckOutlined className="text-[11px]" />
                    Mark all as read
                  </button>

                  <button
                    type="button"
                    className="text-[11px] font-semibold text-[#173b52] transition-colors hover:text-[#1470ad]"
                  >
                    View all
                  </button>

                </div>
              </div>
            )}
          </div>

          {/* User Section */}
          <UserMenu />

        </div>

      </div>
    </header>
  );
}