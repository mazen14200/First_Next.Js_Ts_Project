"use client";

import styles from "@/components/layout/Header/UserMenu/UserMenu.module.css";

import {
  SettingOutlined,
  LogoutOutlined,
  DownOutlined,
} from "@ant-design/icons";

import { Dropdown } from "antd";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

import { useLogout } from "@/features/auth/hooks/useLogout";

export default function UserMenu() {
  const router = useRouter();
  const logout = useLogout();
  const [open, setOpen] = useState(false);

  const locale = useLocale();
  const t = useTranslations("header");

  const changeLanguage = () => {
    const newLocale = locale === "ar" ? "en" : "ar";

    document.cookie = `locale=${newLocale}; path=/`;

    router.refresh();
  };


  const userMenuItems = [
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: t("settings"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: t("logout"),
      danger: true,
      onClick: () => {
        void logout();
      },
    },
  ];


  return (
    <div className={styles.userSection}>

      {/* Language Toggle */}
      <button
        type="button"
        onClick={changeLanguage}
        className={`${styles.languageToggle} ${
          locale === "ar" ? styles.arabic : styles.english
        }`}
        aria-label={t("language")}
      >
        <span
          className={`${styles.languageOption} ${
            locale === "ar" ? styles.active : ""
          }`}
        >
          AR
        </span>

        <span className={styles.divider} />

        <span
          className={`${styles.languageOption} ${
            locale === "en" ? styles.active : ""
          }`}
        >
          EN
        </span>
      </button>

      {/* User Menu */}
      <Dropdown
        open={open}
        onOpenChange={setOpen}
        menu={{
          items: userMenuItems,
        }}
        placement="bottomRight"
        trigger={["click"]}
      >
        <button
          type="button"
          className={styles.userButton}
          aria-label="User menu"
        >
          <Image
            src="/images/avatar-1.jpg"
            width={34}
            height={34}
            className={styles.avatar}
            alt="user-image"
          />

          <span className={styles.userName}>
            Smart Vision
          </span>

          <DownOutlined
            className={`${styles.profileArrow} ${
              open ? styles.open : ""
            }`}
          />
        </button>
      </Dropdown>

    </div>
  );
}