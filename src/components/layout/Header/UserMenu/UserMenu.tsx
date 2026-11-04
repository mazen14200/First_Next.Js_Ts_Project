"use client";

import styles from "./UserMenu.module.css";

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
import axios from "axios";

export default function UserMenu() {
  const router = useRouter();
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
      onClick: async () => {
        try {
          const response = await axios.post("/api/auth/logout");

          console.log("LOGOUT RESULT:", response.data);

          if (response.status === 200) {
            router.replace("/login");
          }
        } catch (error) {
          console.log("LOGOUT ERROR:", error);
        }
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