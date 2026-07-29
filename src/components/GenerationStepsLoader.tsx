"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Workflow,
  CheckCircle2,
  Loader2,
  Terminal,
  Cpu,
  FileText,
  Bookmark,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { ProviderOption } from "@/types/spec";

interface GenerationStepsLoaderProps {
  provider?: ProviderOption;
}

interface Step {
  id: number;
  label: string;
  icon: React.ElementType;
  thought: string;
}

export function GenerationStepsLoader({ provider = "gemini" }: GenerationStepsLoaderProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const steps: Step[] = [
    {
      id: 1,
      label: "Lendo e analisando as anotações do discovery",
      icon: FileText,
      thought: "Processando linguagem natural e identificando contexto de negócios...",
    },
    {
      id: 2,
      label: "Mapeando o problema principal, hipótese e limites do MVP",
      icon: Workflow,
      thought: "Definindo fronteiras estritas de escopo incluído e excluído...",
    },
    {
      id: 3,
      label: "Extraindo Histórias de Usuário e vinculando rastreabilidade literal",
      icon: Bookmark,
      thought: "Isolando citações exatas do texto original para cada US...",
    },
    {
      id: 4,
      label: "Compilando backlog priorizado, métricas e matriz de riscos",
      icon: Zap,
      thought: "Sugerindo KPIs de sucesso e mapeando potenciais bloqueios...",
    },
    {
      id: 5,
      label: "Validando o contrato estruturado via Schema estrito Zod",
      icon: ShieldCheck,
      thought: "Verificando conformidade técnica de tipos e garantindo 0% AI Slop...",
    },
  ];

  // Alternância progressiva de etapas a cada 1.4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1400);

    return () => clearInterval(interval);
  }, [steps.length]);

  const activeStep = steps[currentStepIndex];
  const progressPercent = Math.min(100, Math.round(((currentStepIndex + 1) / steps.length) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#1c1a18]/95 border border-[#2e2a27] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden w-full"
    >
      {/* Header do Pipeline de Pensamento */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2e2a27] pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#ff4d00] flex items-center justify-center shadow-md shrink-0">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#f5f3f0] tracking-tight flex items-center gap-2">
              Pipeline de Pensamento do SpecFlow
              <span className="w-2 h-2 rounded-full bg-[#ff4d00] animate-ping" />
            </h3>
            <p className="text-xs text-[#ab9f96] mt-0.5">
              Engenharia de produto processando via{" "}
              <strong className="text-[#f5f3f0]">
                {provider === "openrouter" ? "OpenRouter Multi-Model" : "Google Gemini 3.6 Flash"}
              </strong>
            </p>
          </div>
        </div>

        {/* Indicador de Progresso em Porcentagem */}
        <div className="flex items-center gap-3 self-start sm:self-auto font-mono">
          <span className="text-xs text-[#ab9f96]">Etapa {currentStepIndex + 1} de {steps.length}</span>
          <span className="px-3 py-1 rounded-full bg-[#131211] text-[#ff4d00] border border-[#ff4d00]/40 text-xs font-bold shadow-sm">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Barra de Progresso Animada */}
      <div className="w-full bg-[#131211] h-2 rounded-full overflow-hidden border border-[#2e2a27] p-0.5">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-[#ff4d00] rounded-full shadow-sm"
        />
      </div>

      {/* Etapa Atual em Destaque */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep.id}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.25 }}
          className="p-4 sm:p-5 rounded-2xl bg-[#131211] border border-[#ff4d00]/40 space-y-2 relative overflow-hidden"
        >
          <div className="flex items-center gap-2.5">
            <activeStep.icon className="w-4 h-4 text-[#ff4d00] shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-[#f5f3f0]">
              {activeStep.label}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#ab9f96] pl-6">
            <Terminal className="w-3.5 h-3.5 text-[#ff4d00] shrink-0" />
            <span className="italic">{activeStep.thought}</span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Lista Completa de Etapas com Estado de Conclusão */}
      <div className="space-y-2 pt-1">
        {steps.map((step, index) => {
          const isDone = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          const StepIcon = step.icon;

          return (
            <div
              key={step.id}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between text-xs ${
                isCurrent
                  ? "bg-[#262320] border-[#ff4d00] text-white shadow-sm"
                  : isDone
                  ? "bg-[#131211]/80 border-emerald-900/40 text-[#ab9f96]"
                  : "bg-[#131211]/40 border-[#2e2a27]/60 text-[#746a63]"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-[#ff4d00] animate-spin" />
                  ) : (
                    <StepIcon className="w-4 h-4 text-[#746a63]" />
                  )}
                </div>

                <span
                  className={`truncate font-medium ${
                    isCurrent
                      ? "text-[#f5f3f0] font-semibold"
                      : isDone
                      ? "text-[#ab9f96] line-through decoration-[#746a63]"
                      : "text-[#746a63]"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              <span className="font-mono text-[10px] shrink-0 ml-2">
                {isDone ? (
                  <span className="text-emerald-400 font-bold">Concluído</span>
                ) : isCurrent ? (
                  <span className="text-[#ff4d00] font-bold">Executando...</span>
                ) : (
                  <span className="text-[#746a63]">Aguardando</span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
