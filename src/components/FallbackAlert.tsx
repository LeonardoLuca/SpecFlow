"use client";

import React from "react";
import { AlertTriangle, Info } from "lucide-react";

interface FallbackAlertProps {
  reason?: string;
  isManual?: boolean;
}

export function FallbackAlert({ reason, isManual }: FallbackAlertProps) {
  return (
    <div className="bg-amber-950/30 border border-amber-800/60 rounded-2xl p-4 text-amber-200 text-xs sm:text-sm flex items-start gap-3 shadow-lg backdrop-blur-xl">
      <div className="p-1.5 rounded-xl bg-amber-900/50 border border-amber-700/50 text-amber-400 shrink-0 mt-0.5 shadow-sm">
        <AlertTriangle className="w-4 h-4" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="font-semibold text-amber-300 flex items-center justify-between">
          <span>Modo Offline (Cache Local)</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-900/60 border border-amber-700/60 text-amber-300">
            {isManual ? "Seleção Manual" : "Fallback de Rede"}
          </span>
        </div>
        <p className="text-amber-200/90 leading-relaxed text-xs">
          {isManual
            ? "Especificação carregada a partir do repositório local de modelos para consulta rápida."
            : "A conexão com a nuvem não ficou disponível no momento. O modelo estático correspondente foi carregado para garantir a continuidade do trabalho."}
        </p>
        {reason && !isManual && (
          <div className="text-[11px] text-amber-400/90 font-mono mt-1 pt-1 border-t border-amber-900/60 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            <span>Diagnóstico do Sistema: {reason}</span>
          </div>
        )}
      </div>
    </div>
  );
}

