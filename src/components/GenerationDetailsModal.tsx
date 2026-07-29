"use client";

import React from "react";
import { X, Clock, Cpu, Calendar, ShieldCheck, Terminal } from "lucide-react";
import { GenerateSpecResponse } from "@/types/spec";

interface GenerationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: GenerateSpecResponse["metadata"];
  source: GenerateSpecResponse["source"];
}

export function GenerationDetailsModal({
  isOpen,
  onClose,
  metadata,
  source,
}: GenerationDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#131211]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#1c1a18] border border-[#2e2a27] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
        <div className="flex items-center justify-between border-b border-[#2e2a27] pb-3">
          <h3 className="font-semibold text-[#f5f3f0] text-base flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#ff4d00]" />
            Detalhes Técnicos da Geração
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#ab9f96] hover:text-white hover:bg-[#262320] transition-colors border border-[#2e2a27]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#131211] border border-[#2e2a27]">
            <span className="text-[#ab9f96] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#ff4d00]" />
              Origem dos Dados:
            </span>
            <span
              className={`font-semibold px-2.5 py-0.5 rounded-full ${
                source === "live"
                  ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/80"
                  : "bg-amber-950/80 text-amber-300 border border-amber-800/80"
              }`}
            >
              {source === "live" ? "IA Conectada (Live)" : "Fallback Local"}
            </span>
          </div>

          {metadata.provider && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#131211] border border-[#2e2a27]">
              <span className="text-[#ab9f96] flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#ff4d00]" />
                Provedor de IA:
              </span>
              <span className="font-semibold text-[#f5f3f0]">{metadata.provider}</span>
            </div>
          )}

          {metadata.model && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#131211] border border-[#2e2a27]">
              <span className="text-[#ab9f96] flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#ff4d00]" />
                Modelo Utilizado:
              </span>
              <span className="font-mono text-[#f5f3f0]">{metadata.model}</span>
            </div>
          )}


          {metadata.durationMs !== undefined && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#131211] border border-[#2e2a27]">
              <span className="text-[#ab9f96] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#ff4d00]" />
                Tempo de Processamento:
              </span>
              <span className="font-mono text-[#f5f3f0]">
                {(metadata.durationMs / 1000).toFixed(2)} s ({metadata.durationMs} ms)
              </span>
            </div>
          )}

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#131211] border border-[#2e2a27]">
            <span className="text-[#ab9f96] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#ff4d00]" />
              Gerado em:
            </span>
            <span className="font-mono text-[#f5f3f0]">
              {new Date(metadata.generatedAt).toLocaleString("pt-BR")}
            </span>
          </div>

          {metadata.fallbackReason && (
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/50 text-amber-300">
              <span className="font-semibold block mb-1">Motivo do Fallback:</span>
              <span className="font-mono text-[11px] break-words text-amber-300/80">
                {metadata.fallbackReason}
              </span>
            </div>
          )}
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#262320] hover:bg-[#34302c] text-[#f5f3f0] text-xs font-medium transition-colors border border-[#2e2a27]"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}


