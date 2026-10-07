"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Cpu,
  Compass,
  Scale,
  Sparkles,
  ShieldCheck,
  Gauge,
  MessageSquareQuote,
  ArrowRight,
  Lightbulb,
  AlertTriangle,
  Rocket,
} from "lucide-react";

interface TechStackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ---------- Pequenos blocos reutilizáveis ---------- */

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="text-[#ff4d00] bg-[#1c1a18] border border-[#2e2a27] px-1.5 py-0.5 rounded font-mono text-xs">
      {children}
    </code>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2.5 py-1 rounded-lg bg-[#1c1a18] border border-[#2e2a27] text-[#f5f3f0] font-mono text-[11px]">
      {children}
    </span>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="p-4 rounded-2xl bg-[#131211] border border-[#2e2a27] text-center">
      <div className="text-2xl font-bold text-[#ff4d00] font-mono">{value}</div>
      <div className="text-[11px] text-[#ab9f96] mt-1 leading-snug">{label}</div>
    </div>
  );
}

interface DecisionProps {
  title: string;
  decision: React.ReactNode;
  why: React.ReactNode;
  tradeoff: React.ReactNode;
}

function Decision({ title, decision, why, tradeoff }: DecisionProps) {
  return (
    <div className="p-5 rounded-2xl bg-[#131211] border border-[#2e2a27] space-y-3">
      <h4 className="font-bold text-sm text-[#f5f3f0]">{title}</h4>
      <p className="text-[#ab9f96] leading-relaxed">
        <span className="text-[#f5f3f0] font-semibold">O que: </span>
        {decision}
      </p>
      <p className="text-[#ab9f96] leading-relaxed">
        <span className="text-emerald-400 font-semibold">Por quê: </span>
        {why}
      </p>
      <p className="text-[#ab9f96] leading-relaxed">
        <span className="text-amber-400 font-semibold">Trade-off: </span>
        {tradeoff}
      </p>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 rounded-2xl bg-[#131211] border border-[#2e2a27] space-y-3">
      <h4 className="font-bold text-sm text-[#ff4d00] flex items-center gap-2">
        <Icon className="w-4 h-4 shrink-0" />
        <span>{title}</span>
      </h4>
      <div className="text-[#ab9f96] leading-relaxed space-y-2.5">{children}</div>
    </div>
  );
}

function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2 pl-4 list-disc marker:text-[#ff4d00]">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function Flow({ steps }: { steps: { title: string; text: React.ReactNode }[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3">
          <span className="w-6 h-6 rounded-lg bg-[#ff4d00] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
            {i + 1}
          </span>
          <div className="text-[#ab9f96] leading-relaxed">
            <span className="text-[#f5f3f0] font-semibold">{step.title}. </span>
            {step.text}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---------- Abas ---------- */

function OverviewTab() {
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-[#ff4d00]/10 border border-[#ff4d00]/30 text-[#f5f3f0] leading-relaxed">
        <strong className="text-[#ff4d00]">Em uma frase:</strong> o SpecFlow transforma anotações brutas de discovery em uma
        especificação de produto estruturada, em que <strong>cada história de usuário cita o trecho original</strong> que a
        justifica. A IA propõe, o código <strong>valida e mede</strong> o resultado antes de mostrá-lo.
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat value="2" label="provedores de IA alternáveis na interface" />
        <Stat value="3" label="modelos Gemini em cascata" />
        <Stat value="7" label="modelos gratuitos em cascata no OpenRouter" />
        <Stat value="10" label="campos no contrato validado por Zod" />
      </div>

      <Section icon={Compass} title="Caminho de uma requisição, de ponta a ponta">
        <Flow
          steps={[
            {
              title: "Entrada",
              text: (
                <>
                  O usuário cola o discovery e escolhe o provedor no formulário (<Code>DiscoveryForm</Code>).
                </>
              ),
            },
            {
              title: "Route Handler",
              text: (
                <>
                  <Code>POST /api/generate-spec</Code> roda no servidor, com <Code>maxDuration = 300</Code>. As chaves de API
                  nunca chegam ao navegador.
                </>
              ),
            },
            {
              title: "Chamada ao LLM",
              text: (
                <>
                  Gemini com <Code>responseSchema</Code> nativo, ou OpenRouter com <Code>response_format: json_object</Code> e
                  um prompt que descreve o contrato. Ambos usam <Code>temperature: 0.2</Code>.
                </>
              ),
            },
            {
              title: "Higienização (OpenRouter)",
              text: "Remove cercas de markdown, isola o objeto entre { e }, corrige vírgulas sobrando e normaliza chaves, porque modelos gratuitos nem sempre devolvem JSON limpo.",
            },
            {
              title: "Validação Zod",
              text: (
                <>
                  <Code>ProductSpecificationSchema.safeParse()</Code> trata a saída da IA como dado não confiável. Se não
                  bater com o contrato, a geração é considerada falha.
                </>
              ),
            },
            {
              title: "Harness de qualidade",
              text: "Verifica se as citações existem no texto original e calcula uma nota de 0 a 100 (aba Qualidade).",
            },
            {
              title: "Resposta tipada",
              text: (
                <>
                  Devolve <Code>{"{ source: \"live\" | \"fallback\", specification, metadata }"}</Code>. A interface mostra o
                  selo Live ou Cache, o modelo que respondeu e a nota.
                </>
              ),
            },
          ]}
        />
      </Section>
    </div>
  );
}

function DecisionsTab() {
  return (
    <div className="space-y-4">
      <p className="text-[#ab9f96] leading-relaxed">
        Cada decisão abaixo segue o mesmo roteiro: <strong className="text-[#f5f3f0]">o que</strong> foi escolhido,{" "}
        <strong className="text-emerald-400">por quê</strong> e <strong className="text-amber-400">o que se perde</strong> com
        isso. É a estrutura mais fácil de defender numa conversa técnica.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Decision
          title="Backend dentro do Next.js (App Router)"
          decision={
            <>
              Um único repositório com interface e <Code>Route Handler</Code>, publicado na Vercel.
            </>
          }
          why="As chaves de API ficam só no servidor, o deploy é um push e não há um segundo serviço para manter. Para um MVP, é o menor caminho seguro."
          tradeoff="Funções serverless têm limite de duração (aqui, 300s) e não há fila de jobs: a requisição é síncrona e o usuário espera."
        />
        <Decision
          title="Dois provedores de IA, alternáveis"
          decision="Google Gemini (SDK oficial) e OpenRouter (REST) escolhidos na interface."
          why="Mostra uma arquitetura sem dependência de um único fornecedor e permite operar com custo zero, usando os planos gratuitos dos dois."
          tradeoff="Os contratos de saída diferem (schema nativo vs. JSON mode), o que exige higienização e normalização extras no caminho do OpenRouter."
        />
        <Decision
          title="Zod como fonte da verdade do contrato"
          decision={
            <>
              Os tipos TypeScript são inferidos do schema (<Code>z.infer</Code>) e a saída da IA é validada em tempo de
              execução.
            </>
          }
          why="TypeScript só protege em tempo de compilação. Uma resposta de LLM chega em runtime e pode vir incompleta ou com campos trocados, então ela é tratada como entrada externa."
          tradeoff={
            <>
              O contrato existe duas vezes: o <Code>responseSchema</Code> do SDK do Gemini e o schema Zod. Eles podem divergir
              com o tempo.
            </>
          }
        />
        <Decision
          title="Rastreabilidade literal como requisito de produto"
          decision="Cada história de usuário carrega o trecho exato do discovery que a originou."
          why="Torna a saída auditável: quem lê consegue conferir de onde veio cada requisito. É a principal defesa contra invenção de requisitos."
          tradeoff="Exige prompt e verificação adicionais, e modelos pequenos às vezes parafraseiam em vez de citar."
        />
        <Decision
          title="Temperatura baixa (0.2)"
          decision="Decodificação quase determinística em ambos os provedores."
          why="O objetivo é estrutura válida e fidelidade ao texto, não criatividade. Menos variância significa menos JSON quebrado."
          tradeoff="Hipóteses de solução tendem a ser mais conservadoras e parecidas entre execuções."
        />
        <Decision
          title="Fallback estático com o mesmo contrato"
          decision={
            <>
              Se tudo falhar, a API devolve um exemplo local, validado pelo mesmo Zod, marcado com <Code>source: "fallback"</Code>.
            </>
          }
          why="A demonstração e a interface nunca ficam quebradas por falha de terceiros, e o motivo da falha é exposto em fallbackReason."
          tradeoff="Pode mascarar uma falha real se ninguém olhar o selo. Por isso a interface destaca visualmente o modo Cache."
        />
        <Decision
          title="Estado no cliente, sem banco de dados"
          decision={
            <>
              O histórico vive em <Code>useState</Code> e o login é simulado na interface.
            </>
          }
          why="Mantém o MVP sem custo e sem infraestrutura, focado no que é o diferencial: geração estruturada e verificada."
          tradeoff="O histórico some ao recarregar a página e não há autenticação real. É uma limitação consciente, listada na aba Entrevista."
        />
        <Decision
          title="UI: Tailwind CSS 3 + Framer Motion"
          decision={
            <>
              Design system escuro (Warm Graphite e Signal Orange) com utilitários, <Code>tailwind-merge</Code> e animações
              declarativas.
            </>
          }
          why="Iteração visual rápida e consistência sem escrever CSS à mão; as animações reforçam o estado do pipeline."
          tradeoff="Classes utilitárias longas no JSX e dependência de uma biblioteca de animação no bundle do cliente."
        />
      </div>
    </div>
  );
}

function AiTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section icon={Sparkles} title="Gemini: cascata de modelos">
          <Flow
            steps={[
              { title: "gemini-3.6-flash", text: "Modelo principal, com a melhor qualidade." },
              { title: "gemini-3.5-flash-lite", text: "Reserva estável e leve." },
              { title: "gemini-3.1-flash-lite", text: "Segunda reserva estável." },
            ]}
          />
          <p>
            <strong className="text-[#f5f3f0]">Por que essa ordem?</strong> É uma decisão baseada em dados reais do deploy. No
            plano gratuito, o <Code>3.6 Flash</Code> permite só 20 requisições por dia e chegou a responder{" "}
            <Code>503 ServiceUnavailable</Code> por sobrecarga. Os modelos Lite permitem 500 por dia e 15 por minuto.
          </p>
          <p>
            Cada tentativa tem um limite de 60s via <Code>Promise.race()</Code>. Três tentativas somam no máximo 180s, dentro
            dos 300s da função.
          </p>
        </Section>

        <Section icon={Sparkles} title="OpenRouter: modelos gratuitos">
          <p>Tenta em ordem, parando no primeiro que devolver um JSON utilizável:</p>
          <div className="flex flex-wrap gap-2">
            <Chip>openrouter/free</Chip>
            <Chip>gemma-4-31b</Chip>
            <Chip>gemma-4-26b</Chip>
            <Chip>gpt-oss-20b</Chip>
            <Chip>nemotron-3-ultra</Chip>
            <Chip>north-mini-code</Chip>
            <Chip>ling-3.0-flash</Chip>
          </div>
          <p>
            <strong className="text-[#f5f3f0]">Por que tantos?</strong> Modelos gratuitos têm disponibilidade variável. A
            cascata troca latência por taxa de sucesso: a resposta pode demorar mais, mas raramente falha.
          </p>
          <p>
            Como não há schema nativo, o prompt descreve os 10 campos obrigatórios e a camada de higienização corrige o que
            for possível antes do Zod.
          </p>
        </Section>
      </div>

      <Section icon={MessageSquareQuote} title="Prompt de sistema: princípios">
        <Bullets
          items={[
            <>
              <strong className="text-[#f5f3f0]">Não inventar:</strong> analisar exclusivamente o conteúdo fornecido, sem criar
              números, integrações ou regras de negócio.
            </>,
            <>
              <strong className="text-[#f5f3f0]">Dúvida vira dúvida:</strong> informação ausente vai para{" "}
              <Code>duvidasEmAberto</Code> em vez de virar suposição.
            </>,
            <>
              <strong className="text-[#f5f3f0]">MVP pequeno:</strong> escopo mínimo e executável, com critérios de aceite
              objetivos e verificáveis.
            </>,
            <>
              <strong className="text-[#f5f3f0]">Citação obrigatória:</strong> um trecho literal por história de usuário.
            </>,
          ]}
        />
      </Section>

      <Section icon={Cpu} title="Contrato de saída (10 campos)">
        <div className="flex flex-wrap gap-2">
          {[
            "titulo",
            "problema",
            "hipotese",
            "escopoIncluido",
            "escopoExcluido",
            "historiasUsuario (mín. 3)",
            "backlog",
            "metricasSugeridas",
            "riscos",
            "duvidasEmAberto",
          ].map((field) => (
            <Chip key={field}>{field}</Chip>
          ))}
        </div>
      </Section>
    </div>
  );
}

function ResilienceTab() {
  return (
    <div className="space-y-4">
      <Section icon={ShieldCheck} title="Camadas de defesa, da mais interna à mais externa">
        <Flow
          steps={[
            {
              title: "Cascata de modelos",
              text: "Se um modelo falha, o próximo do mesmo provedor é tentado. A maioria das falhas termina aqui.",
            },
            {
              title: "Limite de tempo por modelo",
              text: "Um modelo que não responde é abandonado após 60s no Gemini, para não prender a requisição inteira.",
            },
            {
              title: "Validação do contrato",
              text: "Resposta que não passa no Zod é tratada como falha, nunca exibida ao usuário.",
            },
            {
              title: "Fallback estático",
              text: (
                <>
                  Se tudo falhar, a API devolve o exemplo local com <Code>source: "fallback"</Code> e o motivo em{" "}
                  <Code>fallbackReason</Code>.
                </>
              ),
            },
          ]}
        />
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section icon={Gauge} title="Observabilidade">
          <Bullets
            items={[
              <>
                Cada modelo que falha gera um <Code>console.warn</Code> com o motivo, visível nos logs de runtime da Vercel.
              </>,
              <>
                A resposta inclui <Code>durationMs</Code>, o modelo usado e a nota do harness, e a interface mostra o modelo
                que respondeu.
              </>,
              "Foi assim que se diagnosticou o 503 do Gemini em produção: o log mostrou a chamada sem resposta e o painel do Google mostrou o erro.",
            ]}
          />
        </Section>

        <Section icon={AlertTriangle} title="Comportamento a conhecer (honestidade técnica)">
          <Bullets
            items={[
              "Os provedores são independentes: se o OpenRouter esgotar a cascata, o sistema vai direto ao cache estático, sem tentar o Gemini.",
              "O pior caso do OpenRouter pode ser longo, porque tenta 7 modelos em sequência e sem limite de tempo individual.",
              "O fallback estático também recebe nota do harness, então uma nota alta com selo Cache não indica geração ao vivo.",
            ]}
          />
        </Section>
      </div>
    </div>
  );
}

function QualityTab() {
  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-[#131211] border border-[#2e2a27] space-y-4">
        <h4 className="font-bold text-sm text-[#ff4d00] flex items-center gap-2">
          <Scale className="w-4 h-4" />
          <span>Como a nota de 0 a 100 é calculada</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Stat value="50%" label="Grounding: citações encontradas no texto original" />
          <Stat value="35%" label="Completude: 5 critérios de estrutura" />
          <Stat value="15%" label="Clareza: penalidade por termos vagos" />
        </div>
        <p className="text-[#ab9f96] leading-relaxed">
          Aprovado quando a nota é <strong className="text-[#f5f3f0]">≥ 75</strong> e pelo menos{" "}
          <strong className="text-[#f5f3f0]">60%</strong> das citações forem confirmadas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section icon={Lightbulb} title="Por que avaliação determinística (sem outra IA)?">
          <Bullets
            items={[
              "É reproduzível: a mesma entrada gera a mesma nota, o que permite comparar modelos e prompts.",
              "Custa zero e roda em milissegundos, sem gastar a cota gratuita dos provedores.",
              "Evita o problema de usar um LLM para julgar outro LLM, que herda os mesmos vieses.",
            ]}
          />
        </Section>

        <Section icon={ShieldCheck} title="O que cada critério verifica">
          <Bullets
            items={[
              <>
                <strong className="text-[#f5f3f0]">Grounding:</strong> busca o trecho no discovery, de forma exata, depois sem
                acentos, caixa e pontuação.
              </>,
              <>
                <strong className="text-[#f5f3f0]">Completude:</strong> problema e hipótese preenchidos, escopo incluído e
                excluído, e pelo menos 3 histórias.
              </>,
              <>
                <strong className="text-[#f5f3f0]">Clareza:</strong> palavras como "rápido", "fácil" e "simples" nos critérios
                de aceite reduzem a nota em 15% cada.
              </>,
            ]}
          />
        </Section>
      </div>

      <Section icon={AlertTriangle} title="Limitações conhecidas do harness">
        <Bullets
          items={[
            "A checagem de citação aceita também uma correspondência frouxa (80% das palavras longas presentes). Isso reduz falsos negativos, mas pode aprovar um trecho levemente alterado.",
            "Verificar que o trecho existe não prova que a história decorre dele: mede fidelidade de origem, não qualidade do raciocínio.",
            <>
              O campo <Code>selfCorrectionAttempts</Code> existe na resposta, mas hoje é sempre 0: ainda não há laço que reenvie
              ao modelo as citações reprovadas.
            </>,
          ]}
        />
      </Section>
    </div>
  );
}

function InterviewTab() {
  const qa: { q: string; a: React.ReactNode }[] = [
    {
      q: "Por que validar a saída da IA se o Gemini já aceita um schema?",
      a: "O schema nativo reduz erros, mas não os elimina, e o OpenRouter nem o tem. O Zod garante o mesmo contrato para qualquer provedor e protege o restante do código, que passa a receber só dados já validados.",
    },
    {
      q: "O que acontece se a IA falhar durante uma demonstração?",
      a: "Há quatro camadas: troca de modelo, limite de tempo, validação do contrato e, por fim, um fallback estático com o mesmo contrato. A interface sinaliza o modo Cache para não enganar o usuário.",
    },
    {
      q: "Como você sabe que a IA não inventou requisitos?",
      a: "Exijo uma citação literal por história e verifico por código que o trecho existe no texto original. É uma garantia de origem, não de qualidade, e essa diferença está documentada nas limitações.",
    },
    {
      q: "Por que a ordem dos modelos do Gemini é essa?",
      a: "Foi observado em produção: o modelo principal tem 20 requisições por dia no plano gratuito e retornou 503 por sobrecarga. Os modelos Lite, mais estáveis e com 500 por dia, entram como reserva.",
    },
    {
      q: "Como isso escalaria para muitos usuários?",
      a: "Hoje a requisição é síncrona e a rota é pública. Para escalar, eu moveria a geração para uma fila com streaming do progresso, adicionaria limite de requisições por usuário e persistiria o histórico.",
    },
  ];

  return (
    <div className="space-y-4">
      <Section icon={MessageSquareQuote} title="Perguntas prováveis e respostas curtas">
        <div className="space-y-4">
          {qa.map((item) => (
            <div key={item.q} className="space-y-1">
              <p className="text-[#f5f3f0] font-semibold flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-[#ff4d00] shrink-0 mt-0.5" />
                {item.q}
              </p>
              <p className="pl-6">{item.a}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section icon={AlertTriangle} title="Limitações assumidas do MVP">
          <Bullets
            items={[
              "Login simulado na interface e histórico só em memória (perdido ao recarregar).",
              "A rota de geração é pública e sem limite de uso: qualquer pessoa pode consumir a cota gratuita.",
              <>
                O loader de 5 etapas é cronometrado na interface: ilustra o pipeline, mas <strong>não</strong> reflete o
                progresso real do servidor.
              </>,
              "Não há testes automatizados; a validação hoje é o contrato Zod e o harness em tempo de execução.",
              "Contrato duplicado entre o schema do SDK do Gemini e o schema Zod.",
            ]}
          />
        </Section>

        <Section icon={Rocket} title="Próximos passos que eu priorizaria">
          <Bullets
            items={[
              "Streaming (SSE) para que as etapas do loader reflitam o progresso real.",
              "Laço de autocorreção: reenviar ao modelo as citações reprovadas, ligando o selfCorrectionAttempts.",
              "Limite de requisições por IP ou usuário e autenticação real.",
              "Persistência do histórico (por exemplo, Postgres) e testes automatizados para o harness e para o Zod.",
              "Gerar o schema do Gemini a partir do Zod, para ter uma única fonte do contrato.",
            ]}
          />
        </Section>
      </div>
    </div>
  );
}

/* ---------- Modal ---------- */

const TABS = [
  { id: "overview", label: "Visão geral", icon: Compass },
  { id: "decisions", label: "Decisões", icon: Scale },
  { id: "ai", label: "IA & contrato", icon: Sparkles },
  { id: "resilience", label: "Resiliência", icon: ShieldCheck },
  { id: "quality", label: "Qualidade", icon: Gauge },
  { id: "interview", label: "Entrevista", icon: MessageSquareQuote },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function TechStackModal({ isOpen, onClose }: TechStackModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#131211]/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Arquitetura e especificações técnicas de engenharia"
        onClick={(event) => event.stopPropagation()}
        className="bg-[#1c1a18] border border-[#2e2a27] rounded-3xl max-w-6xl w-full p-6 sm:p-8 shadow-2xl space-y-5 relative my-auto"
      >
        {/* Cabeçalho */}
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
                Como o SpecFlow funciona, por que cada decisão foi tomada e o que ela custa.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-2 rounded-xl text-[#ab9f96] hover:text-white hover:bg-[#262320] transition-colors shrink-0 border border-[#2e2a27]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas */}
        <div role="tablist" className="flex gap-2 overflow-x-auto pb-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap border transition-colors ${
                  isActive
                    ? "bg-[#ff4d00] border-[#ff4d00] text-white"
                    : "bg-[#131211] border-[#2e2a27] text-[#ab9f96] hover:text-white hover:bg-[#262320]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Conteúdo */}
        <div className="text-xs sm:text-sm text-[#f5f3f0] min-h-[24rem]" role="tabpanel">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "decisions" && <DecisionsTab />}
          {activeTab === "ai" && <AiTab />}
          {activeTab === "resilience" && <ResilienceTab />}
          {activeTab === "quality" && <QualityTab />}
          {activeTab === "interview" && <InterviewTab />}
        </div>

        {/* Rodapé */}
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
