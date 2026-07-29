"use client";

import React from "react";
import { Workflow, Menu, Layers, Terminal } from "lucide-react";

interface HeaderProps {
  onToggleSidebar?: () => void;
  onOpenTechStack?: () => void;
  userName?: string;
}

export function Header({ onToggleSidebar, onOpenTechStack, userName }: HeaderProps) {
  return (
    <header className="h-16 border-b border-[#2e2a27] bg-[#131211]/90 backdrop-blur-xl sticky top-0 z-30 w-full flex items-center shrink-0">
      <div className="w-full px-4 sm:px-6 h-full flex items-center justify-between gap-4">
        {/* Left Side: Sidebar Toggle & Brand */}
        <div className="flex items-center gap-3 shrink-0">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl bg-[#1c1a18] border border-[#2e2a27] text-[#ab9f96] hover:text-white hover:bg-[#262320] transition-all shadow-sm"
              title="Alternar Barra Lateral"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#ff4d00] flex items-center justify-center shadow-md shrink-0">
              <Workflow className="w-4 h-4 text-white" />
            </div>
            <div className="leading-none flex items-center gap-2.5">
              <span className="font-bold text-base text-[#f5f3f0] tracking-tight flex items-center gap-1.5">
                SpecFlow
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d00] inline-block ml-0.5" />
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#1c1a18] text-[#ab9f96] border border-[#2e2a27] hidden xs:inline-block">
                Studio v1.0
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Tech Stack Button & User Profile */}
        <div className="flex items-center gap-3 text-xs font-medium shrink-0">
          {onOpenTechStack && (
            <button
              onClick={onOpenTechStack}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#1c1a18] hover:bg-[#262320] border border-[#2e2a27] text-[#f5f3f0] transition-all shadow-sm group"
            >
              <Layers className="w-3.5 h-3.5 text-[#ff4d00] shrink-0 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Arquitetura & Stack</span>
              <span className="sm:hidden">Stack</span>
            </button>
          )}

          {userName && (
            <div className="hidden md:flex items-center gap-2 text-xs text-[#ab9f96] border-l border-[#2e2a27] pl-3">
              <Terminal className="w-3.5 h-3.5 text-[#ff4d00]" />
              <span className="font-medium text-[#f5f3f0]">{userName}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


