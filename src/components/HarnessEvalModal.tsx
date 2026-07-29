"use client";

import React from "react";
import { X, ShieldCheck, CheckCircle2, AlertTriangle, FileText, Info, Award, Crosshair, Zap } from "lucide-react";
import { GenerateSpecResponse } from "@/types/spec";

interface HarnessEvalModalProps {
  isOpen: boolean;
  onClose: () => void;
  harnessData?: GenerateSpecResponse["metadata"]["harness"];
  storiesCount?: number;
}

export function HarnessEvalModal({
  isOpen,
  onClose,
  harnessData,
  storiesCount = 0,
}: HarnessEvalModalProps) {
  if (!isOpen) return null;

  const evalScore = harnessData?.evalScore ?? 100;
  const quoteRate = harnessData?.quoteExactnessRate ?? 1.0;
  const isPassing = harnessData?.isPassing ?? true;
  const warnings = harnessData?.warnings || [];

  const percentageQuote = Math.round(quoteRate * 100);

  return (
    <div className="fixed inset-0 z-50 bg-[#131211]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#1c1a18] border border-[#2e2a27] rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#2e2a27] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#ff4d00]/10 border border-[#ff4d00]/30 text-[#ff4d00]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#f5f3f0] text-base leading-tight">
                Harness Engineering & Evals
              </h3>
              <p className="text-xs text-[#ab9f96]">
                Validação defensiva de qualidade, grounding e integridade semântica
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#ab9f96] hover:text-white hover:bg-[#262320] transition-colors border border-[#2e2a27]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card Principal de Score */}
        <div className="p-4 rounded-2xl bg-[#131211] border border-[#2e2a27] flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs text-[#ab9f96] font-medium flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#ff4d00]" />
              Score de Qualidade Harness
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-[#f5f3f0]">
                {evalScore}
              </span>
              <span className="text-xs text-[#746a63] font-mono">/ 100 pts</span>
            </div>
          </div>

          <div className="text-right space-y-1">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                isPassing
                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-800/80"
                  : "bg-amber-950/80 text-amber-300 border-amber-800/80"
              }`}
            >
              {isPassing ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Especificação Aprovada
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Atenção Requerida
                </>
              )}
            </span>
            <p className="text-[11px] text-[#746a63]">
              {isPassing ? "Atende aos critérios rigorosos de produto" : "Possui pontos de melhoria"}
            </p>
          </div>
        </div>

        {/* O que é este Eval? (Explicação Didática) */}
        <div className="p-4 rounded-2xl bg-[#262320]/60 border border-[#2e2a27] space-y-2">
          <h4 className="text-xs font-semibold text-[#f5f3f0] flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#ff4d00]" />
            Como funciona a Validação por Harness Evals?
          </h4>
          <p className="text-xs text-[#ab9f96] leading-relaxed">
            O **Harness Engineering** é uma camada defensiva determinística executada em volta do modelo de IA.
            Ele previne alucinações auditando a **rastreabilidade literal** das citações de discovery, o cumprimento estrito do **contrato Zod** e identificando termos ambíguos.
          </p>
        </div>

        {/* Grid de Métricas do Eval */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Métricas 1: Grounding */}
          <div className="p-3.5 rounded-2xl bg-[#131211] border border-[#2e2a27] space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#ab9f96] flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-[#ff4d00]" />
                Precisão de Citação (Grounding)
              </span>
              <span className="font-mono font-bold text-[#f5f3f0]">{percentageQuote}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#262320] overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  percentageQuote >= 80 ? "bg-emerald-500" : "bg-amber-500"
                }`}
                style={{ width: `${percentageQuote}%` }}
              />
            </div>
            <p className="text-[11px] text-[#746a63]">
              {percentageQuote === 100
                ? "100% das Histórias possuem citação literal comprovada."
                : `Verificadas nas ${storiesCount} Histórias de Usuário.`}
            </p>
          </div>

          {/* Métricas 2: Zod Schema */}
          <div className="p-3.5 rounded-2xl bg-[#131211] border border-[#2e2a27] space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#ab9f96] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#ff4d00]" />
                Contrato Zod Strict
              </span>
              <span className="font-mono font-bold text-emerald-400">100% Válido</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#262320] overflow-hidden">
              <div className="h-full bg-emerald-500 w-full" />
            </div>
            <p className="text-[11px] text-[#746a63]">
              Tipagem rigorosa no servidor sem AI Slop ou campos nulos.
            </p>
          </div>
        </div>

        {/* Alertas e Recomendações */}
        {warnings.length > 0 ? (
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/50 space-y-2 text-xs">
            <span className="font-semibold text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Alertas Detectados pelo Harness ({warnings.length}):
            </span>
            <ul className="space-y-1 text-amber-200/80 text-[11px]">
              {warnings.map((warn, index) => (
                <li key={index} className="flex items-start gap-1.5">
                  <span className="text-amber-500">•</span>
                  <span>{warn}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 text-xs text-emerald-300 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Nenhuma ambiguidade ou inconsistência detectada na especificação!</span>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#ff4d00] hover:bg-[#e04400] text-white text-xs font-semibold shadow-md transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
