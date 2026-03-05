// components/admin/AdminShell.js
"use client";
import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { Menu } from "lucide-react";

export default function AdminShell({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F1EB] flex relative overflow-hidden">

      <aside
        className={`
          fixed inset-y-0 left-0 z-60 w-64 bg-[#1A1A1A] text-white transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden animate-in fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 h-screen">

        <header className="lg:hidden flex items-center justify-between px-6 h-20 bg-white border-b border-black/5 shrink-0">
          <h1 className="text-2xl font-serif italic tracking-tight">
            ZÁLEA{" "}
            <span className="text-[8px] uppercase not-italic opacity-30 tracking-[0.3em] ml-2 font-sans">
              Admin
            </span>
          </h1>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-[#F5F1EB] rounded-full transition-colors"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
        </header>

        <div className="hidden lg:block">
          <AdminNavbar />
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 bg-[#F0EDE9]">
          <div className="max-w-5xl mx-auto">{children}</div>
        </main>

      </div>
    </div>
  );
}
