# SpecFlow — AI Spec Studio

> **Studio Inteligente de Especificação de Produto (MVP)**  
> Transforme anotações brutas de discovery e reuniões em especificações estruturadas de produto com rastreabilidade literal, backlog priorizado e matriz de riscos utilizando **Google Gemini 3.6 Flash**, **OpenRouter (Modelos Gratuitos)** e validação defensiva com **Zod**.

---

## [Visão Geral]

O **SpecFlow** foi desenvolvido para resolver a desconexão entre anotações não estruturadas de discovery e os entregáveis necessários para times de engenharia. A ferramenta analisa transcrições e anotações brutas para gerar:

- **Problema & Hipótese de Solução:** Diagnóstico claro da dor e tese a ser validada.
- **Limites de Escopo:** Definição objetiva do que entra e do que fica fora do MVP.
- **Histórias de Usuário Rastreáveis:** Cada *User Story* preserva o trecho literal exato do discovery que a justificou.
- **Backlog Priorizado & Matriz de Riscos:** Lista organizada com prioridades e mapeamento de KPIs de sucesso.
- **Exportação & Leitor de Markdown:** Transforma a especificação em um documento `.md` compilado e exportável em 1 clique.

---

## [Destaques de Engenharia & UX Studio]

### 1. Geração Estruturada Multi-Provedor com IA & Validação Dupla
A aplicação suporta múltiplos provedores generativos alternáveis diretamente na interface:
1. **Google Gemini Direto:** Integração oficial com `@google/genai` (v2.13) usando o modelo **`gemini-3.6-flash`** com `responseSchema` nativo.
2. **OpenRouter (Modelos Gratuitos):** Integração REST v1 com suporte a modelos sem custo (ex: `google/gemini-2.0-flash-exp:free`, `meta-llama/llama-3.3-70b-instruct:free`).

Todos os retornos de ambos os provedores passam por uma segunda camada de validação estrita no servidor com **Zod** (`ProductSpecificationSchema.safeParse()`).

### 2. Pipeline de Pensamento da IA por Etapas (`GenerationStepsLoader`)
Em vez de um simples spinner de carregamento, o usuário visualiza o raciocínio e o progresso da IA em 5 etapas claras:
- **Etapa 1:** Análise de linguagem natural e contexto de negócios.
- **Etapa 2:** Mapeamento de problema, hipótese e fronteiras do MVP.
- **Etapa 3:** Extração de User Stories com citações literais para rastreabilidade.
- **Etapa 4:** Compilação do backlog priorizado e matriz de riscos.
- **Etapa 5:** Validação do contrato JSON via Schema estrito Zod (0% AI Slop).

### 3. Fundo Interativo de Elevação Topográfica 3D (`InteractiveBackground`)
Interface escura no tom **Warm Graphite & Signal Orange** com efeito espacial reativo ao mouse a 60fps:
- **Malha SVG Topográfica:** Nós em formato de quadradinhos (`<rect>`) que se elevam verticalmente no espaço 3D (até `-8px` no eixo Y) e expandem de diâmetro sob a área do ponteiro.
- **Modo Sutil para Aplicação:** Na tela de trabalho pós-login, o fundo opera sem sombras ou manchas de luz turvas, destacando exclusivamente os quadradinhos que sobem sob o cursor.

### 4. Layout App Shell Fixo com Rolagem Interna
- Cabeçalho superior (`Header`) e barra lateral (`Sidebar`) imóveis e travados na janela (`h-screen sticky top-0`).
- Rolagem contida exclusivamente na área de conteúdo principal (`<main> className="flex-1 overflow-y-auto"`).

### 5. Camada de Harness Engineering & Evals Engine
- **Auditoria de Grounding (`quote-verifier.ts`):** Validação determinística que garante que cada trecho literal de rastreabilidade citado nas User Stories realmente exista no texto de discovery.
- **Suíte de Avaliação Contínua (`eval-suite.ts`):** Cálculo de nota final de qualidade (0 a 100 pts) ponderando grounding, completude de escopo e penalidade por termos ambíguos ("rápido", "fácil").
- **Modal Dedicado de Evals (`HarnessEvalModal.tsx`):** Interface didática que explica o funcionamento do Harness, exibe barras de precisão e reporta recomendações de refinamento de produto.

### 6. Sistema Defensivo com Multi-Level Fallback
Para garantir disponibilidade ininterrupta durante falhas de rede, excedente de cota da API ou ausência de chave:
1. **Redirecionamento Automático:** Se a chamada via OpenRouter falhar ou não possuir chave, o servidor tenta transparentemente o Gemini Direto.
2. **Timeout Controller (20s):** Cancela requisições pendentes via `Promise.race()`.
3. **Fallback Estático:** Em caso de falha de todos os provedores ao vivo, a aplicação serve um modelo estático em cache isolado com o mesmo contrato Zod.
4. **Fallback Manual:** Permite ao usuário carregar o modelo de demonstração offline via botão de atalho.

---

## [Stack Tecnológica]

| Camada | Tecnologia | Descrição |
|---|---|---|
| **Framework** | Next.js 15.1 (App Router) | React Server Components & Route Handlers |
| **Linguagem** | TypeScript 5.7 | Tipagem estrita de ponta a ponta sem suppressões |
| **Estilização** | Tailwind CSS v4 & Lucide Icons | Design System dark mode no tom Warm Graphite & Signal Orange |
| **Animações** | Framer Motion | Malha topográfica a 60fps via `useMotionTemplate` |
| **IA / LLM** | Google Gen AI & OpenRouter API | Chamadas assíncronas ao Gemini 3.6 Flash e modelos grátis OpenRouter |
| **Harness Engine** | TypeScript & Evals | Verificador de Grounding e Suíte de Avaliação de Qualidade |
| **Validação** | Zod | Runtime schema validation no servidor |
| **Markdown** | ReactMarkdown & Remark-GFM | Compilação e renderização de tabelas e sintaxe GFM |

---

## [Execução Local]

### Pré-requisitos
- Node.js 20+ ou 24+ instalado
- Gerenciador de pacotes `npm` ou `yarn`

### 1. Clonar e Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto (utilizando `.env.local.example` como base):

```env
GEMINI_API_KEY=sua_chave_do_google_ai_studio
OPENROUTER_API_KEY=sua_chave_do_openrouter
```

> [!NOTE]
> Se você não fornecer as chaves de API, a aplicação utilizará automaticamente o **Redirecionamento Defensivo e Fallback**, garantindo funcionamento ininterrupto com dados de demonstração.

### 3. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```

Acessee a aplicação em `http://localhost:3000`.

---

## [Estrutura de Arquivos]

```
SpecFlow/
├── src/
│   ├── app/
│   │   ├── api/generate-spec/   # Route Handler POST com Gemini, OpenRouter, Zod & Harness
│   │   ├── globals.css          # Tokens do Design System Warm Graphite
│   │   └── page.tsx             # Aplicação principal (App Shell Fixo)
│   ├── components/
│   │   ├── Header.tsx           # Barra superior responsiva edge-aligned
│   │   ├── Sidebar.tsx          # Barra lateral colapsável com histórico
│   │   ├── DiscoveryForm.tsx    # Formulário com seletor de Provedor e CTA
│   │   ├── GenerationStepsLoader.tsx # Loader em 5 etapas com pipeline de pensamento
│   │   ├── InteractiveBackground.tsx # Fundo de elevação topográfica 3D a 60fps
│   │   ├── SpecificationTabs.tsx# Visualizador em 5 abas com acionadores de Evals
│   │   ├── HarnessEvalModal.tsx # [NEW] Modal dedicado de Harness Evals & Grounding Check
│   │   ├── GenerationDetailsModal.tsx # Modal de detalhes técnicos da geração IA
│   │   ├── MarkdownViewer.tsx   # Renderizador compilado de Markdown
│   │   ├── TechStackModal.tsx   # Modal de Arquitetura Técnica em grid 2x2
│   │   └── LoginPage.tsx        # Tela de acesso split-screen com cards interativos
│   ├── data/
│   │   ├── discovery-presets.ts # Modelos pré-configurados de discovery
│   │   └── fallback-spec.json   # Especificação estática para fallback
│   ├── lib/
│   │   ├── harness/             # [NEW] Módulos de Harness Engineering & Evals
│   │   │   ├── quote-verifier.ts# Verificador determinístico de citação literal
│   │   │   └── eval-suite.ts    # Suíte de avaliação de qualidade (0-100 pts)
│   │   ├── gemini.ts            # Cliente GoogleGenAI e System Prompt
│   │   └── openrouter.ts        # Cliente OpenRouter REST API (Modelos Free)
│   └── types/
│       └── spec.ts              # Schemas Zod, Harness interfaces e tipos TS
├── vercel.json                  # Configuração de build para Vercel
```

---

## [Arquitetura de Validação & Fallback]

```
[ Entrada de Discovery ] ── (Escolha de Provedor: Gemini / OpenRouter)
          │
          ▼
 [ POST /api/generate-spec ] ── (Timeout de 20s via AbortController)
          │
          ├──► [ Provedor: OpenRouter (Free) ] ── (Se falhar/sem chave) ──┐
          │                                                              │
          ├──► [ Provedor: Google Gemini ] ◄─────────────────────────────┘
          │             │
          │             ▼
          │    [ Parsing Zod safeParse() ]
          │             │
          │             ├── (Sucesso) ──► [ Retorno Live ]
          │             │
          │             └── (Erro/Timeout) ──┐
          │                                  │
          └──────────────────────────────────┴──► [ Retorno Fallback Cache Local ]
```

---

## [Licença]

Este projeto foi desenvolvido como um estúdio de engenharia de produto e demonstração técnica de integração resiliente com IA.
