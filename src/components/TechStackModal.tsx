"use client";

import React from "react";
import { X, Cpu, ShieldCheck, Palette, Terminal, Workflow } from "lucide-react";

interface TechStackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TechStackModal({ isOpen, onClose }: TechStackModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#131211]/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
      <div className="bg-[#1c1a18] border border-[#2e2a27] rounded-3xl max-w-6xl w-full p-6 sm:p-8 md:p-10 shadow-2xl space-y-6 relative my-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#2e2a27] pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#ff4d00] flex items-center justify-center shadow-md shrink-0">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#f5f3f0] tracking-tight">
                Arquitetura & Especificações Técnicas de Engenharia
              </h2>
              <p className="text-xs sm:text-sm text-[#ab9f96] mt-0.5">
                Detalhamento técnico da stack, pipeline generativo de IA, resiliência e padrões de código do SpecFlow.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#ab9f96] hover:text-white hover:bg-[#262320] transition-colors shrink-0 border border-[#2e2a27]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Grid 2x2 Ampliado em Tela Larga */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-[#f5f3f0]">
          {/* Card 1: Arquitetura Core */}
          <div className="p-6 rounded-2xl bg-[#131211] border border-[#2e2a27] space-y-3 flex flex-col justify-start">
            <h3 className="font-bold text-sm sm:text-base text-[#ff4d00] flex items-center gap-2">
              <Terminal className="w-4 h-4 shrink-0 text-[#ff4d00]" />
              <span>Arquitetura Core & Runtime</span>
            </h3>
            <ul className="space-y-2.5 pl-4 list-disc text-[#ab9f96] leading-relaxed">
              <li>
                <strong className="text-[#f5f3f0]">Next.js 15 (App Router):</strong> Separação estrita entre Server Components e client-side handlers (<code className="text-[#ff4d00] bg-[#1c1a18] border border-[#2e2a27] px-1.5 py-0.5 rounded font-mono text-xs">POST /api/generate-spec</code>).
              </li>
              <li>
                <strong className="text-[#f5f3f0]">React 19 & TypeScript (Strict Mode):</strong> Tipagem forte de ponta a ponta sem suppressões ou tipos amorfos (<code className="text-[#ff4d00] bg-[#1c1a18] border border-[#2e2a27] px-1.5 py-0.5 rounded font-mono text-xs">any</code>), usando unions e generics.
              </li>
              <li>
                <strong className="text-[#f5f3f0]">Tailwind CSS v4:</strong> Design System baseado em variáveis HSL/OKLCH customizadas, componentes utilitários e composições com <code className="text-[#ff4d00] bg-[#1c1a18] border border-[#2e2a27] px-1.5 py-0.5 rounded font-mono text-xs">tailwind-merge</code>.
              </li>
              <li>
                <strong className="text-[#f5f3f0]">Framer Motion Engine:</strong> Animações físicas declarativas com <code className="text-[#ff4d00] bg-[#1c1a18] border border-[#2e2a27] px-1.5 py-0.5 rounded font-mono text-xs">AnimatePresence</code> e sincronização via <code className="text-[#ff4d00] bg-[#1c1a18] border border-[#2e2a27] px-1.5 py-0.5 rounded font-mono text-xs">layoutId</code>.
              </li>
            </ul>
          </div>

          {/* Card 2: Pipeline Generativo de IA */}
          <div className="p-6 rounded-2xl bg-[#131211] border border-[#2e2a27] space-y-3 flex flex-col justify-start">
            <h3 className="font-bold text-sm sm:text-base text-[#ff4d00] flex items-center gap-2">
              <Workflow className="w-4 h-4 shrink-0 text-[#ff4d00]" />
              <span>Pipeline Generativo de IA</span>
            </h3>
            <ul className="space-y-2.5 pl-4 list-disc text-[#ab9f96] leading-relaxed">
              <li>
                <strong className="text-[#f5f3f0]">SDK oficial Google Gen AI (<code className="text-[#ff4d00] bg-[#1c1a18] border border-[#2e2a27] px-1.5 py-0.5 rounded font-mono text-xs">@google/genai</code>):</strong> Integração assíncrona otimizada para o modelo <code className="text-[#ff4d00] bg-[#1c1a18] border border-[#2e2a27] px-1.5 py-0.5 rounded font-mono text-xs">gemini-3.6-flash</code>.
              </li>
              <li>
                <strong className="text-[#f5f3f0]">Structured Outputs Nativo:</strong> Mapeamento do contrato da especificação enviando <code className="text-[#ff4d00] bg-[#1c1a18] border border-[#2e2a27] px-1.5 py-0.5 rounded font-mono text-xs">responseSchema</code> em formato JSON Schema diretamente na chamada do modelo.
              </li>
              <li>
                <strong className="text-[#f5f3f0]">Prompting Orientado a Domínio:</strong> Instrução de sistema determinística que proíbe invenção de regras não presentes no discovery de entrada.
              </li>
              <li>
                <strong className="text-[#f5f3f0]">Configuração de Decodificação:</strong> Baixa variância criativa (<code className="text-[#ff4d00] bg-[#1c1a18] border border-[#2e2a27] px-1.5 py-0.5 rounded font-mono text-xs">temperature: 0.2</code>) para manter coerência técnica e sintaxe válida.
              </li>
            </ul>
          </div>

          {/* Card 3: Resiliência & Fault Tolerance */}
          <div className="p-6 rounded-2xl bg-[#131211] border border-[#2e2a27] space-y-3 flex flex-col justify-start">
            <h3 className="font-bold text-sm sm:text-base text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Resiliência & Validação Defensiva</span>
            </h3>
            <ul className="space-y-2.5 pl-4 list-disc text-[#ab9f96] leading-relaxed">
              <li>
                <strong className="text-[#f5f3f0]">Validação Dupla (IA + Schema Zod):</strong> Orienta a IA no provedor e re-valida o JSON recebido no servidor via <code className="text-[#ff4d00] bg-[#1c1a18] border border-[#2e2a27] px-1.5 py-0.5 rounded font-mono text-xs">ProductSpecificationSchema.safeParse()</code>.
              </li>
              <li>
                <strong className="text-[#f5f3f0]">Timeout Controller (20s):</strong> Disparo concorrente via <code className="text-[#ff4d00] bg-[#1c1a18] border border-[#2e2a27] px-1.5 py-0.5 rounded font-mono text-xs">Promise.race()</code> que aborta requisições travadas, prevenindo pendências na UI.
              </li>
              <li>
                <strong className="text-[#f5f3f0]">Isomorfismo de Contrato no Fallback:</strong> Retorna uma especificação estática em caso de falha de rede/cota com o mesmo contrato Zod exigido pela UI.
              </li>
              <li>
                <strong className="text-[#f5f3f0]">Telemetria & Metadados de Resposta:</strong> Retorno de diagnósticos contendo <code className="text-[#ff4d00] bg-[#1c1a18] border border-[#2e2a27] px-1.5 py-0.5 rounded font-mono text-xs">source: "live" | "fallback"</code>, duração em milissegundos e timestamp.
              </li>
            </ul>
          </div>

          {/* Card 4: UX System & Rastreabilidade */}
          <div className="p-6 rounded-2xl bg-[#131211] border border-[#2e2a27] space-y-3 flex flex-col justify-start">
            <h3 className="font-bold text-sm sm:text-base text-[#ff4d00] flex items-center gap-2">
              <Palette className="w-4 h-4 shrink-0 text-[#ff4d00]" />
              <span>UX System, Rastreabilidade & Portabilidade</span>
            </h3>
            <ul className="space-y-2.5 pl-4 list-disc text-[#ab9f96] leading-relaxed">
              <li>
                <strong className="text-[#f5f3f0]">Rastreabilidade de Requisitos:</strong> Vinculação determinística do trecho literal exato do texto original de discovery em cada História de Usuário.
              </li>
              <li>
                <strong className="text-[#f5f3f0]">Gestão Imutável de Estado:</strong> Sincronização do histórico de especificações criadas na sessão com destaque de seleção na barra lateral.
              </li>
              <li>
                <strong className="text-[#f5f3f0]">Visualizador Compilado de Markdown:</strong> Compilador dinâmico usando <code className="text-[#ff4d00] bg-[#1c1a18] border border-[#2e2a27] px-1.5 py-0.5 rounded font-mono text-xs">react-markdown</code> e <code className="text-[#ff4d00] bg-[#1c1a18] border border-[#2e2a27] px-1.5 py-0.5 rounded font-mono text-xs">remark-gfm</code> com suporte a tabelas e sintaxe.
              </li>
              <li>
                <strong className="text-[#f5f3f0]">Portabilidade de Dados:</strong> Geração instantânea de objetos Blob para exportação/download de arquivos <code className="text-[#ff4d00] bg-[#1c1a18] border border-[#2e2a27] px-1.5 py-0.5 rounded font-mono text-xs">.md</code> formatados para Jira/Notion.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Action */}
        <div className="pt-3 text-right border-t border-[#2e2a27]">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#262320] hover:bg-[#34302c] text-[#f5f3f0] text-xs sm:text-sm font-semibold transition-colors border border-[#2e2a27]"
          >
            Fechar Especificações
          </button>
        </div>
      </div>
    </div>
  );
}


