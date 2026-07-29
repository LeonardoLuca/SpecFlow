# SpecFlow — AI Spec Studio

> **Studio Inteligente de Especificação de Produto (MVP)**  
> Transforme anotações brutas de discovery e reuniões em especificações estruturadas de produto com rastreabilidade literal, backlog priorizado e matriz de riscos utilizando **Google Gemini 3.6 Flash** e validação defensiva com **Zod**.

---

## 💡 Visão Geral

O **SpecFlow** foi desenvolvido para resolver a desconexão entre anotações não estruturadas de discovery e os entregáveis necessários para times de engenharia. A ferramenta analisa transcrições e anotações brutas para gerar:

- **Problema & Hipótese de Solução:** Diagnóstico claro da dor e tese a ser validada.
- **Limites de Escopo:** Definição objetiva do que entra e do que fica fora do MVP.
- **Histórias de Usuário Rastreáveis:** Cada *User Story* preserva o trecho literal exato do discovery que a justificou.
- **Backlog Priorizado & Matriz de Riscos:** Lista organizada com prioridades e mapeamento de KPIs de sucesso.
- **Exportação & Leitor de Markdown:** Transforma a especificação em um documento `.md` compilado e exportável em 1 clique.

---

## 🛠️ Destaques de Engenharia & Resiliência

### 🤖 Geração Estruturada com IA & Validação Dupla
A aplicação utiliza a biblioteca oficial `@google/genai` (v2.13) configurada com o modelo **`gemini-3.6-flash`**. A chamada envia um contrato JSON Schema nativo (`responseSchema`) e o resultado recebido passa por uma segunda camada de validação estrita no servidor com **Zod** (`ProductSpecificationSchema.safeParse()`).

### 🛡️ Sistema Defensivo com Dual Fallback
Para garantir disponibilidade ininterrupta durante falhas de rede, excedente de cota da API ou indisponibilidade do serviço:
1. **Timeout Controller (20s):** Cancela requisições pendentes via `AbortController` / `Promise.race()`.
2. **Fallback Automático:** Em caso de exceção ou timeout, o sistema carrega um modelo estático de cache validado pelo mesmo contrato Zod.
3. **Fallback Manual:** Permite ao usuário carregar o modelo de demonstração offline via botão de atalho.

### 🎨 Design System Modern-Minimal
Construído com **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS** e **Framer Motion**:
- **Autenticação Split-Screen:** Interface inspirada nos padrões do Stripe e Vercel com exibição interativa do produto.
- **Navegação Fluida:** Barra lateral minimizável, presets de discovery (Clínica, E-Commerce, Fintech, SaaS B2B) e histórico de sessão com realce do item ativo.
- **Visualizador Dual de Markdown:** Alternância dinâmica entre o documento `.md` compilado (HTML via `react-markdown` + `remark-gfm`) e código bruto.

---

## 📦 Stack Tecnológica

| Camada | Tecnologia | Descrição |
|---|---|---|
| **Framework** | Next.js 15.1 (App Router) | React Server Components & Route Handlers |
| **Linguagem** | TypeScript 5.7 | Tipagem estrita de ponta a ponta sem suppressões |
| **Estilização** | Tailwind CSS v4 & Lucide Icons | Design System dark mode com suporte a glassmorphism |
| **Animações** | Framer Motion | Animações físicas e transições de abas via `layoutId` |
| **IA / LLM** | Google Gen AI SDK (`gemini-3.6-flash`) | Chamadas assíncronas com Structured Outputs nativo |
| **Validação** | Zod | Runtime schema validation no servidor |
| **Markdown** | ReactMarkdown & Remark-GFM | Compilação e renderização de tabelas e sintaxe GFM |

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 20+ ou 24+ instalado
- Gerenciador de pacotes `npm` ou `yarn`

### 1. Clonar e Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente (Opcional)
Crie um arquivo `.env.local` na raiz do projeto (utilizando `.env.local.example` como base):

```env
GEMINI_API_KEY=sua_chave_do_google_ai_studio
```

> [!NOTE]
> Se você não fornecer a chave `GEMINI_API_KEY`, a aplicação utilizará automaticamente o **Modo Offline de Fallback**, permitindo testar e navegar por todas as funcionalidades com dados de cache local.

### 3. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```

Acesse a aplicação em `http://localhost:3000`.

---

## 📁 Estrutura de Arquivos Principais

```
SpecFlow/
├── src/
│   ├── app/
│   │   ├── api/generate-spec/   # Route Handler POST com Gemini & Zod
│   │   ├── globals.css          # Tokens do Design System & Tailwind
│   │   └── page.tsx             # Aplicação principal e gestão de estado
│   ├── components/
│   │   ├── Header.tsx           # Barra superior responsiva edge-aligned
│   │   ├── Sidebar.tsx          # Barra lateral colapsável com histórico
│   │   ├── DiscoveryForm.tsx    # Formulário de entrada com CTA e fallback
│   │   ├── SpecificationTabs.tsx# Visualizador em 5 abas da especificação
│   │   ├── MarkdownViewer.tsx   # Renderizador compilado de Markdown
│   │   ├── TechStackModal.tsx   # Modal de Arquitetura Técnica em grid 2x2
│   │   └── LoginPage.tsx        # Tela de acesso split-screen
│   ├── data/
│   │   ├── discovery-presets.ts # Modelos pré-configurados de discovery
│   │   └── fallback-spec.json   # Especificação estática para fallback
│   ├── lib/
│   │   └── gemini.ts            # Cliente GoogleGenAI e System Prompt
│   └── types/
│       └── spec.ts              # Schemas Zod e interfaces TypeScript
```

---

## 🏛️ Arquitetura de Validação & Fallback

```
[ Entrada de Discovery ]
          │
          ▼
 [ POST /api/generate-spec ] ── (Timeout de 20s via AbortController)
          │
          ├──► [ Chamada API Gemini (gemini-3.6-flash) ]
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

## 📄 Licença

Este projeto foi desenvolvido como um estúdio de engenharia de produto e demonstração técnica de integração resiliente com IA.
