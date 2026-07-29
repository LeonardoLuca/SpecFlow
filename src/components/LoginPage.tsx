"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Workflow, ArrowRight, Lock, Mail, Github, LogIn, Cpu, Zap } from "lucide-react";
import { ProductShowcaseCards } from "./ProductShowcaseCards";
import { InteractiveBackground } from "./InteractiveBackground";

interface LoginPageProps {
  onLogin: (user: { name: string; email: string }) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("alex.product@specflow.io");
  const [password, setPassword] = useState("••••••••••••");
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        name: "Alex Silva (Product Lead)",
        email: email || "alex.product@specflow.io",
      });
      setIsLoading(false);
    }, 400);
  };

  const handleGuestLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        name: "Alex Silva (Product Lead)",
        email: "alex.product@specflow.io",
      });
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#131211] text-[#f5f3f0] font-sans relative overflow-hidden">
      <InteractiveBackground />

      {/* Ícone discreto do GitHub no canto superior direito para acesso direto ao repositório */}
      <a
        href="https://github.com/LeonardoLuca/SpecFlow"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-5 right-5 z-30 p-2.5 rounded-xl bg-[#1c1a18]/80 hover:bg-[#262320] border border-[#2e2a27] text-[#ab9f96] hover:text-white transition-all flex items-center gap-2 text-xs backdrop-blur-md shadow-sm group"
        title="Ver Repositório no GitHub"
      >
        <Github className="w-4 h-4 group-hover:scale-110 text-[#f5f3f0] transition-transform" />
        <span className="hidden sm:inline font-mono text-[11px]">GitHub</span>
      </a>

      {/* Lado Esquerdo - Showcase de Produto Interativo */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-between p-10 xl:p-12 overflow-y-auto border-r border-[#2e2a27] bg-[#131211]/30 backdrop-blur-[2px]">
        {/* Top Branding Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff4d00] flex items-center justify-center shadow-md">
              <Workflow className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-[#f5f3f0] tracking-tight flex items-center gap-2">
              SpecFlow
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d00]" />
            </span>
          </div>
        </div>


        {/* Dynamic Interactive Showcase Cards */}
        <div className="my-auto py-8">
          <ProductShowcaseCards />
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-[#ab9f96] flex items-center justify-between border-t border-[#2e2a27] pt-4 font-mono">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#ff4d00]" />
            AI-Native Product Studio
          </span>
          <span className="text-[#ff4d00]">SpecFlow Engine v1.0</span>
        </div>
      </div>

      {/* Lado Direito - Form de Login */}
      <div className="w-full lg:w-1/2 relative z-10 flex items-center justify-center p-6 sm:p-12 bg-[#131211]/20 backdrop-blur-[2px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md w-full space-y-8 bg-[#1c1a18]/90 border border-[#2e2a27] p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden"
        >
          <div className="lg:hidden flex items-center gap-2.5 justify-center mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#ff4d00] flex items-center justify-center shadow-md">
              <Workflow className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-[#f5f3f0]">SpecFlow</span>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-2xl font-bold text-[#f5f3f0] tracking-tight">
              Acessar o SpecFlow Studio
            </h1>
            <p className="text-xs text-[#ab9f96]">
              Entre com suas credenciais de equipe ou acesse diretamente a workspace.
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#f5f3f0] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#ff4d00]" />
                E-mail Corporativo
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#131211] border border-[#2e2a27] rounded-xl px-4 py-3 text-sm text-[#f5f3f0] placeholder-[#746a63] focus:outline-none focus:ring-2 focus:ring-[#ff4d00]/50 focus:border-[#ff4d00] transition-all font-sans"
                placeholder="seu.nome@empresa.com"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[#f5f3f0] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#ff4d00]" />
                  Senha
                </label>
                <span className="text-[11px] text-[#746a63] hover:text-[#ff4d00] cursor-pointer transition-colors">
                  Esqueceu a senha?
                </span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#131211] border border-[#2e2a27] rounded-xl px-4 py-3 text-sm text-[#f5f3f0] placeholder-[#746a63] focus:outline-none focus:ring-2 focus:ring-[#ff4d00]/50 focus:border-[#ff4d00] transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#ff4d00] hover:bg-[#e04400] text-white text-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              <span>{isLoading ? "Entrando..." : "Entrar na Workspace"}</span>
            </button>
          </form>

          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-[#2e2a27] w-full" />
            <span className="bg-[#1c1a18] px-3 text-[11px] font-mono text-[#746a63] uppercase tracking-wider absolute">
              Acesso Rapido
            </span>
          </div>

          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-[#131211] hover:bg-[#262320] border border-[#2e2a27] text-[#f5f3f0] text-xs font-semibold transition-all flex items-center justify-center gap-2 group shadow-sm"
          >
            <Workflow className="w-4 h-4 text-[#ff4d00]" />
            <span>Entrar como Convidado</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleGuestLogin}
              className="py-2.5 px-3 rounded-xl bg-[#131211] hover:bg-[#262320] border border-[#2e2a27] text-[#f5f3f0] text-xs font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            <a
              href="https://github.com/LeonardoLuca/SpecFlow"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-[#131211] hover:bg-[#262320] border border-[#2e2a27] text-[#f5f3f0] text-xs font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Github className="w-4 h-4 text-[#f5f3f0]" />
              <span>GitHub</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
