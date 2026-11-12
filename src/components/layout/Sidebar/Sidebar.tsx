"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  AppstoreOutlined,
  ApartmentOutlined,
  HistoryOutlined,
  ProjectOutlined,
  SafetyOutlined,
  SolutionOutlined,
  TagsOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import { useTranslations } from "next-intl";

import styles from "@/components/layout/Sidebar/Sidebar.module.css";
import { useState } from "react";

export default function Sidebar({
  mobileOpen,
  onMobileClose,
}: {
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const t = useTranslations("sidebar");
  const pathname = usePathname();

  // Sidebar states
  const [isPinnedOpen, setIsPinnedOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const isOpen = isPinnedOpen || isHovered;

  const handleSidebarToggle = () => {
    setIsPinnedOpen((prev) => !prev);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const menuItems = [
    {
      href: "/",
      label: t("home"),
      icon: <AppstoreOutlined />,
    },
    {
      href: "/projects",
      label: t("projects"),
      icon: <ProjectOutlined />,
    },
    {
      href: "/teams",
      label: t("teams"),
      icon: <TeamOutlined />,
    },
    {
      href: "/team-members",
      label: t("team-members"),
      icon: <TeamOutlined />,
    },
    {
      href: "/team-projects",
      label: t("team-projects"),
      icon: <ProjectOutlined />,
    },
    {
      href: "/departments",
      label: t("departments"),
      icon: <ApartmentOutlined />,
    },
    {
      href: "/skills",
      label: t("skills"),
      icon: <TagsOutlined />,
    },
    {
      href: "/skill-levels",
      label: t("skillLevels"),
      icon: <SolutionOutlined />,
    },
    {
      href: "/employee-skills",
      label: t("employeeSkills"),
      icon: <TeamOutlined />,
    },
    {
      href: "/roles",
      label: t("roles"),
      icon: <SafetyOutlined />,
    },
    {
      href: "/status",
      label: t("status"),
      icon: <CheckCircleOutlined />,
    },
    {
      href: "/history",
      label: t("history"),
      icon: <HistoryOutlined />,
    },
  ];

  return (
    <>
      <aside
        className={`${styles.sidebar} ${
          !isOpen ? styles.collapsed : ""
        } ${mobileOpen ? styles.mobileOpen : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Sidebar Header */}
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.logo} onClick={onMobileClose}>
            <Image
              src="/images/sv-logo.png"
              alt="Smart Vision"
              width={140}
              height={70}
              className={styles.logoLarge}
            />

            <Image
              src="/images/sv-logo-icon.png"
              alt="Smart Vision"
              width={50}
              height={50}
              className={styles.logoSmall}
            />
          </Link>

          {/* Desktop Toggle */}
          <button
            type="button"
            className={styles.toggleButton}
            onClick={handleSidebarToggle}
            aria-label="Toggle sidebar"
          >
            <span
              className={`${styles.toggleDot} ${
                isPinnedOpen ? styles.toggleDotActive : ""
              }`}
            />
          </button>

          {/* Mobile / Tablet Close */}
          {mobileOpen && (
            <button
              type="button"
              className={styles.mobileCloseButton}
              onClick={onMobileClose}
              aria-label="Close sidebar"
            >
              <CloseOutlined className="text-sm" />
            </button>
          )}
        </div>

        {/* Sidebar Links */}
        <nav className={styles.sidebarLinks}>
          <ul className={styles.sideNav}>
            {/* Section Title */}
            <li className={styles.sideNavTitle}>
              {t("mainMenu")}
            </li>

            {menuItems.map((item) => {
              const active = isActive(item.href);

              return (
                <li
                  key={item.href}
                  className={styles.sideNavItem}
                >
                  <Link
                    href={item.href}
                    onClick={onMobileClose}
                    className={`${styles.sideNavLink} ${
                      active ? styles.active : ""
                    }`}
                  >
                    <span className={styles.menuIcon}>
                      {item.icon}
                    </span>

                    <span className={styles.menuText}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}
    </>
  );
}
