"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Eye, Code, Copy, Check, Download, FileCode } from "lucide-react";

interface MarkdownViewerProps {
  markdownText: string;
  title: string;
}

export function MarkdownViewer({ markdownText, title }: MarkdownViewerProps) {
  const [viewMode, setViewMode] = useState<"compiled" | "raw">("compiled");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownText], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `specflow-${title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#1c1a18]/90 border border-[#2e2a27] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      {/* Header do Visualizador */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2e2a27] pb-4">
        <div className="flex items-center gap-2 text-[#ff4d00] font-bold text-sm">
          <FileCode className="w-5 h-5" />
          <span>Visualizador de Documento Markdown (.md)</span>
        </div>

        {/* Toggle de Modo: Renderizado vs Raw */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center p-1 bg-[#131211] rounded-xl border border-[#2e2a27]">
            <button
              onClick={() => setViewMode("compiled")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === "compiled"
                  ? "bg-[#ff4d00] text-white shadow-sm"
                  : "text-[#ab9f96] hover:text-[#f5f3f0]"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Renderizado</span>
            </button>

            <button
              onClick={() => setViewMode("raw")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === "raw"
                  ? "bg-[#ff4d00] text-white shadow-sm"
                  : "text-[#ab9f96] hover:text-[#f5f3f0]"
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Código Raw</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-[#131211] hover:bg-[#262320] text-[#f5f3f0] text-xs font-medium border border-[#2e2a27] transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copiado!" : "Copiar"}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-xl bg-[#ff4d00] hover:bg-[#e04400] text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar .md</span>
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo: Renderizado ou Raw */}
      {viewMode === "compiled" ? (
        <div className="bg-[#131211] border border-[#2e2a27] rounded-2xl p-6 sm:p-8 text-[#f5f3f0] text-sm leading-relaxed max-w-none space-y-4">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-xl sm:text-2xl font-bold text-[#f5f3f0] tracking-tight border-b border-[#2e2a27] pb-3 mb-4">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-lg font-bold text-[#ff4d00] tracking-tight mt-6 mb-3 border-b border-[#2e2a27] pb-2">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-base font-bold text-[#f5f3f0] tracking-tight mt-4 mb-2">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-[#ab9f96] leading-relaxed text-sm my-2">
                  {children}
                </p>
              ),
              blockquote: ({ children }) => (
                <blockquote className="p-4 rounded-xl bg-[#262320]/80 border-l-4 border-[#ff4d00] text-[#f5f3f0] italic text-xs sm:text-sm my-4">
                  {children}
                </blockquote>
              ),
              ul: ({ children }) => (
                <ul className="space-y-1.5 list-disc pl-5 my-3 text-[#f5f3f0]">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="space-y-1.5 list-decimal pl-5 my-3 text-[#f5f3f0]">
                  {children}
                </ol>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-4 rounded-xl border border-[#2e2a27]">
                  <table className="w-full text-left text-xs border-collapse divide-y divide-[#2e2a27]">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-[#1c1a18] text-[#f5f3f0] font-bold uppercase tracking-wider text-[11px]">
                  {children}
                </thead>
              ),
              tr: ({ children }) => (
                <tr className="border-b border-[#2e2a27] hover:bg-[#1c1a18]/60">
                  {children}
                </tr>
              ),
              th: ({ children }) => (
                <th className="p-3 font-semibold text-[#f5f3f0]">{children}</th>
              ),
              td: ({ children }) => (
                <td className="p-3 text-[#ab9f96]">{children}</td>
              ),
              hr: () => <hr className="border-[#2e2a27] my-6" />,
              code: ({ children }) => (
                <code className="bg-[#1c1a18] text-[#ff4d00] px-1.5 py-0.5 rounded text-xs font-mono border border-[#2e2a27]">
                  {children}
                </code>
              ),
            }}
          >
            {markdownText}
          </ReactMarkdown>
        </div>
      ) : (
        <pre className="w-full max-h-[600px] overflow-y-auto bg-[#131211] p-5 rounded-2xl border border-[#2e2a27] text-xs font-mono text-[#f5f3f0] leading-relaxed whitespace-pre-wrap font-mono select-all scrollbar-thin scrollbar-thumb-[#2e2a27]">
          {markdownText}
        </pre>
      )}
    </div>
  );
}

