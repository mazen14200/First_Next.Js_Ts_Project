"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import Header from "@/components/layout/Header/Header";
import Sidebar from "@/components/layout/Sidebar/Sidebar";
import Footer from "@/components/layout/Footer/Footer";

export default function DashboardShell({ children }: { children: ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen">

      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={closeMobileSidebar}
      />

      <div className="flex min-w-0 flex-1 flex-col">

        <Header
          onSidebarToggle={toggleMobileSidebar}
        />

        <main className="flex-1">
          {children}
        </main>
        
        <Footer />

      </div>

    </div>
  );
}