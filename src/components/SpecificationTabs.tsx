"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Bookmark,
  AlertTriangle,
  HelpCircle,
  BarChart3,
  Download,
  Copy,
  Check,
  Quote,
  Info,
  Layers,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileCode,
  Eye,
} from "lucide-react";
import { GenerateSpecResponse } from "@/types/spec";
import { GenerationDetailsModal } from "./GenerationDetailsModal";
import { HarnessEvalModal } from "./HarnessEvalModal";
import { MarkdownViewer } from "./MarkdownViewer";

interface SpecificationTabsProps {
  data: GenerateSpecResponse;
}

export function SpecificationTabs({ data }: SpecificationTabsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "stories" | "backlog" | "risks" | "markdown">("overview");
  const [copied, setCopied] = useState(false);
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);

  const { specification: spec, source, metadata } = data;

  const displayModelName = metadata.model || "Gemini 3.6 Flash";

  const generateMarkdown = () => {
    return `# Especificação de Produto: ${spec.titulo}

> **Fonte:** ${source === "live" ? `Gerado via Google ${displayModelName}` : "Modelo Estático de Cache Local"}  
> **Data:** ${new Date(metadata.generatedAt).toLocaleString("pt-BR")}

---

## 1. Problema Principal
${spec.problema}

## 2. Hipótese de Solução
${spec.hipotese}

---

## 3. Escopo do MVP

### ✅ Incluído no Escopo
${spec.escopoIncluido.map((item) => `- ${item}`).join("\n")}

### ❌ Excluído do Escopo
${spec.escopoExcluido.map((item) => `- ${item}`).join("\n")}

---

## 4. Histórias de Usuário & Rastreabilidade

${spec.historiasUsuario
  .map(
    (us) => `### [${us.id}] ${us.titulo}
**Descrição:** ${us.descricao}  
**Trecho de Rastreabilidade (Original):** *"${us.trechoRastreabilidade}"*

**Critérios de Aceite:**
${us.criteriosAceite.map((ca) => `- ${ca}`).join("\n")}
`
  )
  .join("\n\n")}

---

## 5. Backlog Inicial
| Item | Prioridade |
|---|---|
${spec.backlog.map((b) => `| ${b.item} | ${b.prioridade} |`).join("\n")}

---

## 6. Métricas Sugeridas (KPIs)
${spec.metricasSugeridas.map((m) => `- ${m}`).join("\n")}

## 7. Riscos Identificados
${spec.riscos.map((r) => `- ${r}`).join("\n")}

## 8. Dúvidas em Aberto
${spec.duvidasEmAberto.map((d) => `- ${d}`).join("\n")}
`;
  };

  const markdownText = generateMarkdown();

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdownText], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `specflow-${spec.titulo.toLowerCase().replace(/[^a-z0-9]/g, "-")}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6 w-full"
    >
      {/* Header do Card de Especificação */}
      <div className="bg-[#1c1a18]/90 border border-[#2e2a27] rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Modal 1: Provedor & Modelo (OpenRouter / Gemini / Cache) */}
            <span
              onClick={() => setIsTechModalOpen(true)}
              className={`cursor-pointer text-xs font-semibold px-3 py-1 rounded-full border flex items-center gap-1.5 transition-all hover:scale-105 ${
                source === "live"
                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-800/80 shadow-sm"
                  : "bg-amber-950/80 text-amber-300 border-amber-800/80 shadow-sm"
              }`}
              title="Clique para ver os detalhes técnicos do provedor e tempo de resposta"
            >
              {source === "live" ? (
                <>
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Gerado com {displayModelName}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Modelo de Cache Local</span>
                </>
              )}
            </span>

{/*             <button
              onClick={() => setIsTechModalOpen(true)}
              className="text-xs text-[#ab9f96] hover:text-[#f5f3f0] underline flex items-center gap-1 transition-colors mr-1"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Detalhes da geração</span>
            </button> */}

            {/* Modal 2: Validação & Evals de Harness Engineering */}
            <button
              onClick={() => setIsEvalModalOpen(true)}
              className={`cursor-pointer text-xs font-semibold px-3 py-1 rounded-full border flex items-center gap-1.5 transition-all hover:scale-105 ${
                (metadata.harness?.evalScore ?? 100) >= 80
                  ? "bg-[#ff4d00]/15 text-[#ff4d00] border-[#ff4d00]/40 shadow-sm hover:bg-[#ff4d00]/25"
                  : "bg-amber-950/80 text-amber-300 border-amber-800/80 shadow-sm"
              }`}
              title="Clique para ver a análise de Evals, Grounding Check e Validação do Harness"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#ff4d00]" />
              <span>Harness Evals: {metadata.harness?.evalScore ?? 100}/100</span>
            </button>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-[#f5f3f0] tracking-tight leading-tight">
            {spec.titulo}
          </h1>
        </div>

        {/* Botões de Ação em Lote */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            onClick={handleCopyMarkdown}
            className="px-3.5 py-2 rounded-xl bg-[#131211] hover:bg-[#262320] text-[#f5f3f0] text-xs font-medium border border-[#2e2a27] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copiado!" : "Copiar MD"}</span>
          </button>

          <button
            onClick={() => setActiveTab("markdown")}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
              activeTab === "markdown"
                ? "bg-[#262320] text-[#ff4d00] border-[#ff4d00]/60 shadow-sm"
                : "bg-[#131211] hover:bg-[#262320] text-[#ab9f96] border-[#2e2a27]"
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-[#ff4d00]" />
            <span>Visualizar MD</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="px-4 py-2 rounded-xl bg-[#ff4d00] hover:bg-[#e04400] text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar .md</span>
          </button>
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="border-b border-[#2e2a27] flex gap-2 overflow-x-auto pb-px scrollbar-none">
        {[
          { id: "overview", label: "Visão Geral & Escopo", icon: Target },
          { id: "stories", label: "Histórias & Rastreabilidade", icon: Bookmark, badge: spec.historiasUsuario.length },
          { id: "backlog", label: "Backlog do MVP", icon: Layers, badge: spec.backlog.length },
          { id: "risks", label: "Riscos & Métricas", icon: BarChart3 },
          { id: "markdown", label: "Markdown (.md)", icon: FileCode },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`relative px-4 py-3 font-medium text-xs sm:text-sm rounded-t-2xl transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive ? "text-[#ff4d00] font-semibold" : "text-[#ab9f96] hover:text-[#f5f3f0]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#1c1a18] text-[#ab9f96] font-mono border border-[#2e2a27]">
                  {tab.badge}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff4d00]"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Conteúdo com AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Aba 1: Visão Geral & Escopo */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1c1a18]/90 border border-[#2e2a27] rounded-3xl p-6 space-y-3 shadow-md">
                  <div className="flex items-center gap-2 text-rose-400 text-sm font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Problema Mapeado</span>
                  </div>
                  <p className="text-[#f5f3f0] text-sm leading-relaxed">{spec.problema}</p>
                </div>

                <div className="bg-[#1c1a18]/90 border border-[#2e2a27] rounded-3xl p-6 space-y-3 shadow-md">
                  <div className="flex items-center gap-2 text-[#ff4d00] text-sm font-bold">
                    <Target className="w-4 h-4" />
                    <span>Hipótese de Solução</span>
                  </div>
                  <p className="text-[#f5f3f0] text-sm leading-relaxed">{spec.hipotese}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1c1a18]/90 border border-emerald-900/40 rounded-3xl p-6 space-y-4 shadow-md">
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Escopo Incluído no MVP</span>
                  </h3>
                  <ul className="space-y-2.5">
                    {spec.escopoIncluido.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#f5f3f0]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#1c1a18]/90 border border-[#2e2a27] rounded-3xl p-6 space-y-4 shadow-md">
                  <h3 className="text-sm font-bold text-[#ab9f96] flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-[#746a63]" />
                    <span>Fora do Escopo (Fases Futuras)</span>
                  </h3>
                  <ul className="space-y-2.5">
                    {spec.escopoExcluido.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#ab9f96]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#746a63] mt-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Aba 2: Histórias & Rastreabilidade */}
          {activeTab === "stories" && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-[#1c1a18] border border-[#2e2a27] text-xs text-[#ab9f96] flex items-center gap-2.5">
                <Quote className="w-4 h-4 text-[#ff4d00] shrink-0" />
                <span>
                  Cada História de Usuário preserva o trecho literal exato do discovery que justificou sua criação.
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {spec.historiasUsuario.map((us) => (
                  <div
                    key={us.id}
                    className="bg-[#1c1a18]/90 border border-[#2e2a27] rounded-3xl p-6 space-y-4 shadow-md hover:border-[#ff4d00]/40 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2e2a27] pb-3">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-lg bg-[#262320] border border-[#2e2a27] text-[#ff4d00] font-mono text-xs font-bold">
                          {us.id}
                        </span>
                        <h3 className="font-bold text-[#f5f3f0] text-base">{us.titulo}</h3>
                      </div>
                    </div>

                    <p className="text-sm text-[#f5f3f0] leading-relaxed bg-[#131211] p-4 rounded-2xl border border-[#2e2a27] font-normal">
                      {us.descricao}
                    </p>

                    <div className="p-4 rounded-2xl bg-[#262320]/60 border border-[#ff4d00]/30 text-xs space-y-1.5">
                      <div className="text-[#ff4d00] font-semibold flex items-center gap-1.5">
                        <Quote className="w-3.5 h-3.5" />
                        <span>Trecho de Rastreabilidade (Discovery Original):</span>
                      </div>
                      <p className="text-[#f5f3f0]/90 italic font-mono pl-5">
                        "{us.trechoRastreabilidade}"
                      </p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-[#ab9f96] uppercase tracking-wider block">
                        Critérios de Aceite Verificáveis
                      </span>
                      <ul className="space-y-2">
                        {us.criteriosAceite.map((ca, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#f5f3f0]">
                            <CheckCircle2 className="w-4 h-4 text-[#ff4d00] shrink-0 mt-0.5" />
                            <span>{ca}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aba 3: Backlog do MVP */}
          {activeTab === "backlog" && (
            <div className="bg-[#1c1a18]/90 border border-[#2e2a27] rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
              <h3 className="text-base font-bold text-[#f5f3f0] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#ff4d00]" />
                <span>Itens Priorizados para Desenvolvimento</span>
              </h3>

              <div className="divide-y divide-[#2e2a27]">
                {spec.backlog.map((b, idx) => (
                  <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                    <span className="text-sm text-[#f5f3f0]">{b.item}</span>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${
                        b.prioridade === "Alta"
                          ? "bg-rose-950/80 text-rose-300 border border-rose-800/60"
                          : b.prioridade === "Média"
                          ? "bg-amber-950/80 text-amber-300 border border-amber-800/60"
                          : "bg-[#262320] text-[#ab9f96] border border-[#2e2a27]"
                      }`}
                    >
                      Prioridade {b.prioridade}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aba 4: Riscos, Métricas & Dúvidas */}
          {activeTab === "risks" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#1c1a18]/90 border border-[#2e2a27] rounded-3xl p-6 space-y-4 shadow-md">
                <h3 className="text-sm font-bold text-[#ff4d00] flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Métricas de Sucesso (KPIs)</span>
                </h3>
                <ul className="space-y-3">
                  {spec.metricasSugeridas.map((m, idx) => (
                    <li key={idx} className="text-xs text-[#f5f3f0] flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d00] mt-1.5 shrink-0" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#1c1a18]/90 border border-[#2e2a27] rounded-3xl p-6 space-y-4 shadow-md">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Riscos Identificados</span>
                </h3>
                <ul className="space-y-3">
                  {spec.riscos.map((r, idx) => (
                    <li key={idx} className="text-xs text-[#f5f3f0] flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#1c1a18]/90 border border-[#2e2a27] rounded-3xl p-6 space-y-4 shadow-md">
                <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  <span>Dúvidas em Aberto</span>
                </h3>
                <ul className="space-y-3">
                  {spec.duvidasEmAberto.map((d, idx) => (
                    <li key={idx} className="text-xs text-[#f5f3f0] flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Aba 5: Visualizador de Markdown Compilado / Raw */}
          {activeTab === "markdown" && (
            <MarkdownViewer markdownText={markdownText} title={spec.titulo} />
          )}
        </motion.div>
      </AnimatePresence>

      <GenerationDetailsModal
        isOpen={isTechModalOpen}
        onClose={() => setIsTechModalOpen(false)}
        metadata={metadata}
        source={source}
      />

      <HarnessEvalModal
        isOpen={isEvalModalOpen}
        onClose={() => setIsEvalModalOpen(false)}
        harnessData={metadata.harness}
        storiesCount={spec.historiasUsuario?.length || 0}
      />
    </motion.div>
  );
}


