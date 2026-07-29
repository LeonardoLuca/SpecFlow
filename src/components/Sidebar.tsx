"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Workflow,
  Plus,
  History,
  Trash2,
  LogOut,
  Stethoscope,
  ShoppingCart,
  CreditCard,
  Rocket,
  ChevronLeft,
  BookOpen,
} from "lucide-react";
import { DISCOVERY_PRESETS, DiscoveryPreset } from "@/data/discovery-presets";
import { GenerateSpecResponse } from "@/types/spec";

interface SidebarProps {
  user: { name: string; email: string } | null;
  history: GenerateSpecResponse[];
  activeSpecId: string | null;
  onSelectPreset: (preset: DiscoveryPreset) => void;
  onSelectHistoryItem: (item: GenerateSpecResponse) => void;
  onNewSpec: () => void;
  onDeleteHistoryItem: (id: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export function Sidebar({
  user,
  history,
  activeSpecId,
  onSelectPreset,
  onSelectHistoryItem,
  onNewSpec,
  onDeleteHistoryItem,
  onLogout,
  isOpen,
  onToggleOpen,
}: SidebarProps) {

  const getPresetIcon = (iconName: DiscoveryPreset["iconName"]) => {
    switch (iconName) {
      case "clinic":
        return <Stethoscope className="w-4 h-4 text-[#ff4d00]" />;
      case "cart":
        return <ShoppingCart className="w-4 h-4 text-[#ff4d00]" />;
      case "card":
        return <CreditCard className="w-4 h-4 text-[#ff4d00]" />;
      case "saas":
        return <Rocket className="w-4 h-4 text-[#ff4d00]" />;
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggleOpen}
            className="lg:hidden fixed inset-0 z-40 bg-[#131211]/80 backdrop-blur-md"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed lg:static top-0 left-0 z-40 h-screen bg-[#131211] border-r border-[#2e2a27] flex flex-col justify-between transition-all duration-300 ${
          isOpen ? "w-72" : "w-0"
        } overflow-hidden shrink-0`}
      >
        <div className="flex flex-col h-full w-72">
          {/* Header da Sidebar */}
          <div className="h-16 px-4 border-b border-[#2e2a27] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#ff4d00] flex items-center justify-center shadow-md shrink-0">
                <Workflow className="w-4 h-4 text-white" />
              </div>
              <div className="leading-none">
                <span className="font-bold text-base text-[#f5f3f0] tracking-tight block">
                  SpecFlow
                </span>
                <span className="text-[10px] text-[#ff4d00] font-mono font-medium">
                  Product Studio
                </span>
              </div>
            </div>

            <button
              onClick={onToggleOpen}
              className="lg:hidden p-1.5 rounded-lg text-[#ab9f96] hover:text-white hover:bg-[#1c1a18] border border-[#2e2a27]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Botão Principal: Nova Especificação */}
          <div className="p-4">
            <button
              onClick={onNewSpec}
              className="w-full py-2.5 px-4 rounded-xl bg-[#ff4d00] hover:bg-[#e04400] text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              <span>Nova Especificação</span>
            </button>
          </div>

          {/* Conteúdo Rolável: Presets + Histórico */}
          <div className="flex-1 overflow-y-auto px-4 space-y-6 scrollbar-thin scrollbar-thumb-[#2e2a27]">
            {/* Seção 1: Exemplos de Discovery */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 px-1">
                <BookOpen className="w-3 h-3 text-[#ff4d00]" />
                <span className="text-[10px] font-bold text-[#746a63] uppercase tracking-wider block">
                  Modelos de Discovery
                </span>
              </div>

              <div className="space-y-1.5">
                {DISCOVERY_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onSelectPreset(preset)}
                    className="w-full text-left p-2.5 rounded-xl bg-[#1c1a18]/60 hover:bg-[#1c1a18] border border-[#2e2a27] hover:border-[#ff4d00]/50 transition-all group flex items-start gap-2.5"
                  >
                    <div className="p-1.5 rounded-lg bg-[#131211] border border-[#2e2a27] shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      {getPresetIcon(preset.iconName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-[#f5f3f0] group-hover:text-[#ff4d00] block truncate">
                        {preset.title}
                      </span>
                      <span className="text-[10px] text-[#ab9f96] block truncate">
                        {preset.shortDesc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Seção 2: Histórico de Especificações */}
            <div className="space-y-2.5 pt-3 border-t border-[#2e2a27]">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold text-[#746a63] uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-3 h-3 text-[#ff4d00]" />
                  Especificações ({history.length})
                </span>
              </div>

              {history.length === 0 ? (
                <div className="p-3.5 text-center rounded-xl bg-[#1c1a18]/40 border border-[#2e2a27] text-[11px] text-[#746a63]">
                  Nenhuma especificação nesta sessão.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {history.map((item) => {
                    const isActive = activeSpecId === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => onSelectHistoryItem(item)}
                        className={`group relative p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-start justify-between gap-2 ${
                          isActive
                            ? "bg-[#262320] border-[#ff4d00] text-white shadow-sm"
                            : "bg-[#1c1a18]/50 hover:bg-[#1c1a18] border-[#2e2a27] text-[#ab9f96]"
                        }`}
                      >
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                item.source === "live" ? "bg-emerald-400" : "bg-amber-400"
                              }`}
                            />
                            <span className={`text-xs font-medium truncate block ${isActive ? "text-[#ff4d00] font-semibold" : "text-[#f5f3f0]"}`}>
                              {item.specification.titulo}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-[#ab9f96]">
                            <span
                              className={`px-1.5 py-0.2 rounded font-mono text-[9px] ${
                                item.source === "live"
                                  ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/50"
                                  : "bg-amber-950/60 text-amber-300 border border-amber-800/50"
                              }`}
                            >
                              {item.source === "live" ? "Live" : "Cache"}
                            </span>
                            <span className="font-mono">{new Date(item.metadata.generatedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.id) onDeleteHistoryItem(item.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#746a63] hover:text-rose-400 hover:bg-[#262320] transition-all"
                          title="Remover item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer da Sidebar */}
          <div className="p-4 border-t border-[#2e2a27] bg-[#131211]">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#1c1a18] border border-[#2e2a27]">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#262320] border border-[#2e2a27] flex items-center justify-center text-[#ff4d00] font-bold text-xs shrink-0">
                  {user?.name ? user.name[0] : "U"}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-[#f5f3f0] block truncate">
                    {user?.name || "Product Manager"}
                  </span>
                  <span className="text-[10px] text-[#ab9f96] block truncate font-mono">
                    {user?.email || "usuario@specflow.io"}
                  </span>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-[#ab9f96] hover:text-rose-400 hover:bg-[#262320] transition-colors"
                title="Sair da Conta"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}


