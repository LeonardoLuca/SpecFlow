"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Quote,
  ShieldCheck,
  FileCode,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  Terminal,
} from "lucide-react";

interface ShowcaseFeature {
  id: string;
  badge: string;
  title: string;
  tagline: string;
  icon: React.ElementType;
  renderPreview: () => React.ReactNode;
}

export function ProductShowcaseCards() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const features: ShowcaseFeature[] = [
    {
      id: "velocity",
      badge: "Velocidade Radical",
      title: "Discovery ➔ Spec em 3 Segundos",
      tagline: "Velocity is the product. Elimine semanas de reuniões e especificações manuais.",
      icon: Zap,
      renderPreview: () => (
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-[#131211] border border-[#2e2a27] text-[#ab9f96]">
            <div className="text-[10px] text-[#ff4d00] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-[#ff4d00]" />
              <span>Input: Discovery Bruto</span>
            </div>
            <p className="text-[#f5f3f0]/90 italic">
              "Queremos permitir que pacientes agendem consultas médicas pelo WhatsApp com confirmação em tempo real..."
            </p>
          </div>

          <div className="flex justify-center">
            <motion.div
              animate={{ y: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-[#ff4d00]"
            >
              ↓
            </motion.div>
          </div>

          <div className="p-3 rounded-xl bg-[#262320]/90 border border-[#ff4d00]/40 text-[#f5f3f0] space-y-1.5">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[#ff4d00] font-bold font-mono">[US-01] Agendamento via WhatsApp</span>
              <span className="text-emerald-400 font-mono text-[9px] bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60">
                Gerado em 2.8s
              </span>
            </div>
            <p className="text-[11px] text-[#ab9f96] leading-tight">
              Como paciente, quero selecionar horário via chat para agendar consultas sem instalar apps.
            </p>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 pt-1 border-t border-[#2e2a27]">
              <CheckCircle2 className="w-3 h-3" />
              <span>3 Critérios de Aceite Verificáveis</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "traceability",
      badge: "100% Rastreável",
      title: "Vínculo Literal com o Discovery",
      tagline: "Cada História de Usuário cita exatamente o trecho original que justificou sua criação.",
      icon: Quote,
      renderPreview: () => (
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-[#262320]/80 border border-[#ff4d00]/40 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-[#131211] text-[#ff4d00] font-mono font-bold text-[10px] border border-[#2e2a27]">
                US-02 • Notificações push de lembrete
              </span>
              <span className="text-[10px] text-[#ab9f96]">Rastreabilidade Ativa</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#131211] border border-[#2e2a27] text-[11px] text-[#ab9f96] italic">
              <span className="text-[#ff4d00] font-bold not-italic">Quote Literal: </span>
              "Temos 35% de no-show porque os pacientes esquecem a consulta no dia anterior."
            </div>
            <div className="space-y-1 pt-1">
              <div className="text-[11px] font-semibold text-[#f5f3f0] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#ff4d00]" />
                <span>Critério de Aceite 1: Notificação H-24 enviada via SMS/WhatsApp</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "defensive",
      badge: "Validação Defensiva",
      title: "Engenharia Zod em Runtime",
      tagline: "Garantia de 0% hallucination com verificação rigorosa de schemas em TypeScript.",
      icon: ShieldCheck,
      renderPreview: () => (
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-[#131211] border border-emerald-900/60 text-emerald-300 space-y-2">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                ProductSpecificationSchema.safeParse()
              </span>
              <span className="text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded text-[9px]">
                VALIDATED (OK)
              </span>
            </div>
            <div className="text-[11px] text-[#ab9f96] space-y-1">
              <div className="flex justify-between">
                <span>• historiasUsuario:</span>
                <span className="text-[#f5f3f0]">Array[3] Validated</span>
              </div>
              <div className="flex justify-between">
                <span>• escopoIncluido:</span>
                <span className="text-[#f5f3f0]">5 itens mapeados</span>
              </div>
              <div className="flex justify-between">
                <span>• matrizDeRiscos:</span>
                <span className="text-[#f5f3f0]">3 riscos tipados</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "export",
      badge: "Portabilidade Total",
      title: "Pronto para Jira, Linear & Notion",
      tagline: "Exportação em Markdown estruturado para colar direto no backlog da sua squad.",
      icon: FileCode,
      renderPreview: () => (
        <div className="space-y-2.5 font-mono text-xs">
          <div className="p-3 rounded-xl bg-[#131211] border border-[#2e2a27] text-[#ab9f96] space-y-1.5">
            <div className="text-[10px] text-[#ff4d00] font-bold"># Especificação do MVP: Telemedicina</div>
            <div className="text-[10px] text-[#f5f3f0]">## 1. Problema Principal</div>
            <div className="text-[10px] text-[#ab9f96]">Altas taxas de absenteísmo em consultas presenciais...</div>
            <div className="text-[10px] text-[#f5f3f0] pt-1">## 2. Histórias de Usuário [US-01]</div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#ff4d00]">
            <span>✓ Formato Markdown GFM</span>
            <span>1-Click Download (.md)</span>
          </div>
        </div>
      ),
    },
  ];

  // Alternância automática a cada 4 segundos se não estiver pausado
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, features.length]);

  const currentFeature = features[activeTab];
  const IconComponent = currentFeature.icon;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="space-y-6 w-full max-w-xl mx-auto"
    >
      {/* Selector de Abas do Carrossel */}
      <div className="grid grid-cols-4 gap-2">
        {features.map((feat, index) => {
          const isActive = activeTab === index;
          return (
            <button
              key={feat.id}
              onClick={() => setActiveTab(index)}
              className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? "bg-[#262320] border-[#ff4d00] text-white shadow-md"
                  : "bg-[#131211]/80 hover:bg-[#1c1a18] border-[#2e2a27] text-[#ab9f96]"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <feat.icon className={`w-3.5 h-3.5 ${isActive ? "text-[#ff4d00]" : "text-[#746a63]"}`} />
                <span className="text-[9px] font-mono text-[#746a63]">0{index + 1}</span>
              </div>
              <span className={`text-[10px] font-semibold truncate block ${isActive ? "text-[#f5f3f0]" : "text-[#ab9f96]"}`}>
                {feat.badge}
              </span>

              {/* Barra de Progresso Animada no item ativo */}
              {isActive && !isPaused && (
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 4, ease: "linear" }}
                  className="absolute bottom-0 left-0 h-0.5 bg-[#ff4d00]"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Card de Exibição Principal Animado com Elevação 3D ao Passar o Mouse */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentFeature.id}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          whileHover={{
            y: -6,
            scale: 1.015,
            boxShadow: "0 25px 50px -12px rgba(255, 77, 0, 0.22), 0 0 0 1px rgba(255, 77, 0, 0.3)",
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#1c1a18]/90 border border-[#2e2a27] rounded-3xl p-6 shadow-2xl space-y-4 relative overflow-hidden cursor-pointer"
        >

          {/* Header do Card */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#131211] border border-[#2e2a27] text-[#ff4d00] text-[10px] font-mono font-bold">
                <IconComponent className="w-3 h-3" />
                <span>{currentFeature.badge}</span>
              </div>
              <h3 className="text-base font-bold text-[#f5f3f0] tracking-tight">
                {currentFeature.title}
              </h3>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#ff4d00] animate-ping shrink-0 mt-1" />
          </div>

          <p className="text-xs text-[#ab9f96] leading-relaxed">
            {currentFeature.tagline}
          </p>

          {/* Área de Demonstração Interativa */}
          <div className="pt-2">{currentFeature.renderPreview()}</div>
        </motion.div>
      </AnimatePresence>

      {/* Métricas de Impacto no Estilo Volund */}
      <div className="grid grid-cols-3 gap-3 pt-2">
        <div className="p-3 rounded-2xl bg-[#1c1a18]/60 border border-[#2e2a27] text-center space-y-0.5">
          <span className="text-lg font-bold text-[#ff4d00] font-mono block">3.5s</span>
          <span className="text-[10px] text-[#ab9f96] block uppercase tracking-wider font-medium">
            Tempo Médio
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-[#1c1a18]/60 border border-[#2e2a27] text-center space-y-0.5">
          <span className="text-lg font-bold text-[#f5f3f0] font-mono block">100%</span>
          <span className="text-[10px] text-[#ab9f96] block uppercase tracking-wider font-medium">
            Rastreável
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-[#1c1a18]/60 border border-[#2e2a27] text-center space-y-0.5">
          <span className="text-lg font-bold text-emerald-400 font-mono block">0% Slop</span>
          <span className="text-[10px] text-[#ab9f96] block uppercase tracking-wider font-medium">
            Strict Zod
          </span>
        </div>
      </div>
    </div>
  );
}
