"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Workflow, FileText, Loader2, PlayCircle, RotateCcw } from "lucide-react";

interface DiscoveryFormProps {
  onGenerate: (input: string) => Promise<void>;
  onLoadFallbackManual: () => void;
  isLoading: boolean;
  initialText?: string;
  onClearInput?: () => void;
}

export function DiscoveryForm({
  onGenerate,
  onLoadFallbackManual,
  isLoading,
  initialText = "",
  onClearInput,
}: DiscoveryFormProps) {
  const [input, setInput] = useState(initialText);

  useEffect(() => {
    if (initialText !== undefined) {
      setInput(initialText);
    }
  }, [initialText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    await onGenerate(input);
  };

  const handleClear = () => {
    setInput("");
    if (onClearInput) onClearInput();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#1c1a18]/90 border border-[#2e2a27] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden w-full"
    >
      <div className="flex items-center justify-between gap-3 mb-4 relative z-10">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#f5f3f0] flex items-center gap-2.5 tracking-tight">
            <FileText className="w-5 h-5 text-[#ff4d00]" />
            Entrada de Discovery do Produto
          </h2>
          <p className="text-xs sm:text-sm text-[#ab9f96] mt-1">
            Insira as anotações do projeto ou selecione um dos modelos no menu lateral.
          </p>
        </div>

        {input.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading}
            className="text-xs px-3 py-1.5 rounded-xl bg-[#131211] hover:bg-[#262320] text-[#ab9f96] hover:text-[#f5f3f0] border border-[#2e2a27] transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
            title="Limpar texto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Cole aqui o texto, anotações de reunião ou transcrição do discovery..."
            className="w-full h-44 sm:h-48 bg-[#131211] border border-[#2e2a27] rounded-2xl p-5 text-[#f5f3f0] placeholder-[#746a63] focus:outline-none focus:ring-2 focus:ring-[#ff4d00]/50 focus:border-[#ff4d00] resize-none text-sm sm:text-base leading-relaxed transition-all shadow-inner font-sans"
          />
          <div className="absolute bottom-4 right-4 text-xs font-mono text-[#ab9f96] bg-[#1c1a18] px-2.5 py-1 rounded-lg border border-[#2e2a27] shadow-sm">
            {input.length} caracteres
          </div>
        </div>

        {/* Linha de Ações Inferior */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#ff4d00] hover:bg-[#e04400] text-white text-sm font-semibold shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all flex items-center justify-center gap-2.5 group"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Processando com Gemini 3.6...</span>
              </>
            ) : (
              <>
                <Workflow className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
                <span>Gerar Especificação de Produto</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onLoadFallbackManual}
            disabled={isLoading}
            className="p-3.5 rounded-2xl bg-[#131211] hover:bg-[#262320] text-amber-400 border border-[#2e2a27] hover:border-amber-700/60 transition-all flex items-center justify-center shadow-sm hover:scale-105 shrink-0"
            title="Carregar Modelo de Exemplo (Cache Local)"
          >
            <PlayCircle className="w-5 h-5 text-amber-400" />
          </button>
        </div>
      </form>
    </motion.div>
  );
}


