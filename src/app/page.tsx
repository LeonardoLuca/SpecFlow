"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { DiscoveryForm } from "@/components/DiscoveryForm";
import { FallbackAlert } from "@/components/FallbackAlert";
import { SpecificationTabs } from "@/components/SpecificationTabs";
import { LoginPage } from "@/components/LoginPage";
import { TechStackModal } from "@/components/TechStackModal";
import { InteractiveBackground } from "@/components/InteractiveBackground";
import { GenerationStepsLoader } from "@/components/GenerationStepsLoader";
import { GenerateSpecResponse, ProductSpecificationSchema, ProviderOption } from "@/types/spec";
import { DiscoveryPreset } from "@/data/discovery-presets";
import fallbackSpecRaw from "@/data/fallback-spec.json";

export default function Home() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isTechStackOpen, setIsTechStackOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<ProviderOption>("gemini");
  const [currentSpec, setCurrentSpec] = useState<GenerateSpecResponse | null>(null);
  const [activeSpecId, setActiveSpecId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");

  const [history, setHistory] = useState<GenerateSpecResponse[]>([]);

  if (!user) {
    return <LoginPage onLogin={(userData) => setUser(userData)} />;
  }

  const handleGenerate = async (input: string, provider: ProviderOption = "gemini") => {
    setIsLoading(true);
    setCurrentProvider(provider);
    setCurrentSpec(null);
    setActiveSpecId(null);

    try {
      const response = await fetch("/api/generate-spec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input, provider }),
      });

      if (!response.ok) {
        throw new Error(`Erro na API (${response.status})`);
      }

      const data: GenerateSpecResponse = await response.json();
      const specId = `spec-${Date.now()}`;
      const itemWithId: GenerateSpecResponse = { ...data, id: specId };

      setCurrentSpec(itemWithId);
      setActiveSpecId(specId);
      setHistory((prev) => [itemWithId, ...prev]);

    } catch (err: unknown) {
      console.error("Erro na comunicação com o backend:", err);

      const fallbackSpec = ProductSpecificationSchema.parse(fallbackSpecRaw);
      const specId = `spec-${Date.now()}`;
      const fallbackData: GenerateSpecResponse = {
        id: specId,
        source: "fallback",
        specification: fallbackSpec,
        metadata: {
          generatedAt: new Date().toISOString(),
          fallbackReason: "Falha de conexão com o servidor local.",
        },
      };

      setCurrentSpec(fallbackData);
      setActiveSpecId(specId);
      setHistory((prev) => [fallbackData, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadFallbackManual = () => {
    setCurrentSpec(null);
    setActiveSpecId(null);

    const fallbackSpec = ProductSpecificationSchema.parse(fallbackSpecRaw);
    const specId = `spec-${Date.now()}`;
    const fallbackData: GenerateSpecResponse = {
      id: specId,
      source: "fallback",
      specification: fallbackSpec,
      metadata: {
        generatedAt: new Date().toISOString(),
        fallbackReason: "Carregamento manual do modelo armazenado.",
      },
    };

    setCurrentSpec(fallbackData);
    setActiveSpecId(specId);
    setHistory((prev) => [fallbackData, ...prev]);
  };

  const handleSelectPreset = (preset: DiscoveryPreset) => {
    setInputText(preset.discoveryText);
  };

  const handleSelectHistoryItem = (item: GenerateSpecResponse) => {
    setCurrentSpec(item);
    if (item.id) {
      setActiveSpecId(item.id);
    }
  };

  const handleNewSpec = () => {
    setCurrentSpec(null);
    setActiveSpecId(null);
    setInputText("");
  };

  const handleDeleteHistoryItem = (idToDelete: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== idToDelete));
    if (activeSpecId === idToDelete) {
      setCurrentSpec(null);
      setActiveSpecId(null);
    }
  };

  return (
    <div className="h-screen w-screen flex bg-[#131211] text-[#f5f3f0] font-sans overflow-hidden relative">
      <InteractiveBackground subtle />

      <Sidebar
        user={user}
        history={history}
        activeSpecId={activeSpecId}
        onSelectPreset={handleSelectPreset}
        onSelectHistoryItem={handleSelectHistoryItem}
        onNewSpec={handleNewSpec}
        onDeleteHistoryItem={handleDeleteHistoryItem}
        onLogout={() => setUser(null)}
        isOpen={sidebarOpen}
        onToggleOpen={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col min-w-0 bg-[#131211]/50 backdrop-blur-[1px] h-screen overflow-hidden relative z-10">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenTechStack={() => setIsTechStackOpen(true)}
          userName={user.name}
        />

        <main className="flex-1 flex flex-col justify-between overflow-y-auto w-full px-4 sm:px-6 lg:px-8 py-6 scrollbar-thin scrollbar-thumb-[#2e2a27]">
          <div className="max-w-[1400px] w-full mx-auto space-y-6 pb-8">
            <DiscoveryForm
              onGenerate={handleGenerate}
              onLoadFallbackManual={handleLoadFallbackManual}
              isLoading={isLoading}
              initialText={inputText}
              onClearInput={() => setInputText("")}
            />

            {isLoading && <GenerationStepsLoader provider={currentProvider} />}

            {currentSpec && currentSpec.source === "fallback" && (
              <FallbackAlert
                reason={currentSpec.metadata.fallbackReason}
                isManual={currentSpec.metadata.fallbackReason?.includes("manual")}
              />
            )}

            {currentSpec && <SpecificationTabs data={currentSpec} />}
          </div>

          <footer className="max-w-[1400px] w-full mx-auto border-t border-[#2e2a27] py-6 text-center text-xs text-[#ab9f96] mt-auto shrink-0 font-mono">
            SpecFlow &copy; {new Date().getFullYear()} &mdash; Studio Inteligente de Especificação de Produto
          </footer>
        </main>

      </div>

      <TechStackModal
        isOpen={isTechStackOpen}
        onClose={() => setIsTechStackOpen(false)}
      />
    </div>
  );

}


