import { SYSTEM_INSTRUCTION } from "./gemini";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Modelos gratuitos no OpenRouter em ordem de preferência
export const OPENROUTER_FREE_MODELS = [
  "openrouter/free",                         // Router dinâmico de alta disponibilidade
  "google/gemma-4-31b-it:free",              // Google Gemma 4 31B
  "google/gemma-4-26b-a4b-it:free",          // Google Gemma 4 26B
  "openai/gpt-oss-20b:free",                 // OpenAI GPT OSS 20B
  "nvidia/nemotron-3-ultra-550b-a55b:free",  // NVIDIA Nemotron 3 Ultra
  "cohere/north-mini-code:free",             // Cohere North Mini Code
  "inclusionai/ling-3.0-flash:free",         // Ling 3.0 Flash
];

// Instrução com contrato JSON Schema detalhado para garantir geração de hipótese, escopo incluído e escopo excluído
const OPENROUTER_PROMPT_OPTIMIZED_INSTRUCTION = `${SYSTEM_INSTRUCTION}

REGRA CRÍTICA - ESTRUTURA JSON OBRIGATÓRIA:
Você DEVE gerar obrigatoriamente um objeto JSON com TODOS os seguintes 10 campos preenchidos com base no discovery:

1. "titulo": Nome claro do produto/solução.
2. "problema": Descrição da dor principal do usuário.
3. "hipotese": Hipótese de solução do produto a ser validada. (OBRIGATÓRIO)
4. "escopoIncluido": Lista de 3 a 5 requisitos/funcionalidades do MVP. (OBRIGATÓRIO)
5. "escopoExcluido": Lista de 2 a 4 funcionalidades explicitamente FORA do MVP. (OBRIGATÓRIO)
6. "historiasUsuario": Lista de 3 objetos completos no formato {"id": "US-001", "titulo": "...", "descricao": "Como...", "trechoRastreabilidade": "...", "criteriosAceite": ["..."]}.
7. "backlog": Lista de objetos no formato {"item": "...", "prioridade": "Alta" | "Média" | "Baixa"}.
8. "metricasSugeridas": Lista de KPIs de sucesso.
9. "riscos": Lista de riscos mapeados.
10. "duvidasEmAberto": Lista de dúvidas pendentes.

Exemplo de formato estruturado obrigatório:
{
  "titulo": "Nome do Produto",
  "problema": "Descrição do problema",
  "hipotese": "Hipótese de solução do MVP a ser validada",
  "escopoIncluido": ["Funcionalidade A do MVP", "Funcionalidade B do MVP"],
  "escopoExcluido": ["Funcionalidade X fora do MVP", "Funcionalidade Y fora do MVP"],
  "historiasUsuario": [
    {
      "id": "US-001",
      "titulo": "História 1",
      "descricao": "Como persona, quero ação, para benefício",
      "trechoRastreabilidade": "Trecho literal da entrada",
      "criteriosAceite": ["Critério 1"]
    }
  ],
  "backlog": [{"item": "Tarefa 1", "prioridade": "Alta"}],
  "metricasSugeridas": ["Métrica 1"],
  "riscos": ["Risco 1"],
  "duvidasEmAberto": ["Dúvida 1"]
}

Retorne EXCLUSIVAMENTE o objeto JSON correspondente a este formato sem qualquer texto extra antes ou depois.`;

/**
 * Função utilitária para higienização e reparo defensivo de JSON gerado por LLM
 */
function sanitizeJsonResponse(rawContent: string): string {
  let text = rawContent.trim();

  // 1. Remover cercas de código markdown caso presentes (ex: ```json ... ```)
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  // 2. Isolar o objeto JSON entre a primeira chave '{' e a última '}'
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start !== -1 && end !== -1 && end > start) {
    text = text.slice(start, end + 1);
  }

  // 3. Remover vírgulas sobressalentes antes de fechamento de objetos e arrays
  text = text.replace(/,\s*([}\]])/g, "$1");

  return text;
}

/**
 * Normaliza objetos JSON retornados por LLMs abertas para se adequarem estritamente ao contrato Zod
 */
export function normalizeSpecObject(rawObj: any): any {
  if (!rawObj || typeof rawObj !== "object") return rawObj;

  const obj = { ...rawObj };

  // Mapear chaves alternativas (com acentos, snake_case ou inglês) para camelCase esperado pelo Zod
  const keyMap: Record<string, string> = {
    titulo: "titulo", title: "titulo",
    problema: "problema", problem: "problema",
    hipotese: "hipotese", hipótese: "hipotese", hypothesis: "hipotese", solucao: "hipotese", solução: "hipotese",
    escopoIncluido: "escopoIncluido", escopo_incluido: "escopoIncluido", escopo_incluído: "escopoIncluido", included_scope: "escopoIncluido", includedScope: "escopoIncluido",
    escopoExcluido: "escopoExcluido", escopo_excluido: "escopoExcluido", escopo_excluído: "escopoExcluido", excluded_scope: "escopoExcluido", excludedScope: "escopoExcluido",
    historiasUsuario: "historiasUsuario", historias_usuario: "historiasUsuario", histórias_usuário: "historiasUsuario", user_stories: "historiasUsuario", userStories: "historiasUsuario",
    backlog: "backlog",
    metricasSugeridas: "metricasSugeridas", metricas_sugeridas: "metricasSugeridas", métricas_sugeridas: "metricasSugeridas", suggested_metrics: "metricasSugeridas", suggestedMetrics: "metricasSugeridas",
    riscos: "riscos", risks: "riscos",
    duvidasEmAberto: "duvidasEmAberto", duvidas_em_aberto: "duvidasEmAberto", dúvidas_em_aberto: "duvidasEmAberto", open_questions: "duvidasEmAberto", openQuestions: "duvidasEmAberto",
  };

  const normalized: any = {};
  for (const key of Object.keys(obj)) {
    const targetKey = keyMap[key] || key;
    normalized[targetKey] = obj[key];
  }

  // Capturar variações aninhadas ou com acento
  if (!normalized.hipotese) {
    normalized.hipotese = obj.hipótese || obj.hypothesis || obj.solucao || obj.solução || obj.tese;
  }

  if (!normalized.escopoIncluido) {
    normalized.escopoIncluido =
      obj.escopo_incluído ||
      obj.escopo_incluido ||
      obj.included_scope ||
      obj.includedScope ||
      (obj.escopo && (obj.escopo.incluido || obj.escopo.incluído || obj.escopo.in)) ||
      (obj.scope && (obj.scope.included || obj.scope.in));
  }

  if (!normalized.escopoExcluido) {
    normalized.escopoExcluido =
      obj.escopo_excluído ||
      obj.escopo_excluido ||
      obj.excluded_scope ||
      obj.excludedScope ||
      (obj.escopo && (obj.escopo.excluido || obj.escopo.excluído || obj.escopo.out)) ||
      (obj.scope && (obj.scope.excluded || obj.scope.out));
  }

  // Garantir campos texto obrigatórios
  normalized.titulo = normalized.titulo || "Especificação de Produto";
  normalized.problema = normalized.problema || "Problema identificado no discovery.";
  normalized.hipotese = normalized.hipotese || "Hipótese de solução do MVP a ser validada.";

  // Garantir arrays não vazios
  const ensureArray = (val: any, fallbackStr: string): string[] => {
    if (Array.isArray(val) && val.length > 0) {
      return val.map((v) => (typeof v === "string" ? v : JSON.stringify(v)));
    }
    return [fallbackStr];
  };

  normalized.escopoIncluido = ensureArray(normalized.escopoIncluido, "Requisito principal do MVP.");
  normalized.escopoExcluido = ensureArray(normalized.escopoExcluido, "Funcionalidades avançadas fora do MVP.");
  normalized.metricasSugeridas = ensureArray(normalized.metricasSugeridas, "Taxa de retenção e uso ativo.");
  normalized.riscos = ensureArray(normalized.riscos, "Risco de adoção inicial pelos usuários.");
  normalized.duvidasEmAberto = Array.isArray(normalized.duvidasEmAberto)
    ? normalized.duvidasEmAberto.map((v: any) => String(v))
    : [];

  // Normalizar Histórias de Usuário
  if (Array.isArray(normalized.historiasUsuario)) {
    normalized.historiasUsuario = normalized.historiasUsuario.map((us: any, idx: number) => {
      const u = typeof us === "object" && us !== null ? us : {};
      const criterios = ensureArray(
        u.criteriosAceite || u.criterios_aceite || u.critérios_aceite || u.acceptanceCriteria || u.acceptance_criteria,
        "Critério de aceite objetivo."
      );
      return {
        id: u.id || `US-00${idx + 1}`,
        titulo: u.titulo || u.title || `História de Usuário ${idx + 1}`,
        descricao: u.descricao || u.description || "Como usuário, quero acessar o recurso para obter o benefício.",
        trechoRastreabilidade: u.trechoRastreabilidade || u.trecho_rastreabilidade || u.traceability || "Extraído do discovery.",
        criteriosAceite: criterios,
      };
    });
  }

  // Garantir contrato Zod de pelo menos 3 Histórias de Usuário
  if (!Array.isArray(normalized.historiasUsuario) || normalized.historiasUsuario.length < 3) {
    const list = Array.isArray(normalized.historiasUsuario) ? [...normalized.historiasUsuario] : [];
    while (list.length < 3) {
      const idx = list.length + 1;
      list.push({
        id: `US-00${idx}`,
        titulo: `História de Usuário ${idx}`,
        descricao: `Como usuário do produto, quero utilizar a funcionalidade principal para resolver a dor do discovery.`,
        trechoRastreabilidade: "Trecho do discovery fornecido pelo usuário.",
        criteriosAceite: ["Critério de aceite objetivo e verificável."],
      });
    }
    normalized.historiasUsuario = list;
  }

  // Normalizar itens do Backlog e enums de prioridade
  if (Array.isArray(normalized.backlog)) {
    normalized.backlog = normalized.backlog.map((item: any, idx: number) => {
      const b = typeof item === "object" && item !== null ? item : {};
      let prio = String(b.prioridade || b.priority || "Média").trim();

      if (/^alt/i.test(prio) || /^high/i.test(prio)) prio = "Alta";
      else if (/^bai/i.test(prio) || /^low/i.test(prio)) prio = "Baixa";
      else prio = "Média";

      return {
        item: b.item || b.task || b.title || `Item de backlog ${idx + 1}`,
        prioridade: prio,
      };
    });
  }

  if (!Array.isArray(normalized.backlog) || normalized.backlog.length === 0) {
    normalized.backlog = [
      { item: "Implementação da funcionalidade core do MVP", prioridade: "Alta" },
    ];
  }

  return normalized;
}

export async function callOpenRouterSpec(userInput: string): Promise<{ text: string; model: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY não configurada no servidor (.env.local).");
  }

  let lastError: Error | null = null;

  for (const modelName of OPENROUTER_FREE_MODELS) {
    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://github.com/specflow-ai",
          "X-Title": "SpecFlow AI Studio",
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            {
              role: "system",
              content: OPENROUTER_PROMPT_OPTIMIZED_INSTRUCTION,
            },
            {
              role: "user",
              content: userInput,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.2,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("Resposta vazia retornada pelo OpenRouter.");
      }

      // Higienizar e extrair o JSON de forma defensiva
      const cleanedJson = sanitizeJsonResponse(content);
      const parsedObj = JSON.parse(cleanedJson);

      // Normalizar chaves e valores antes de retornar para o contrato Zod
      const normalizedObj = normalizeSpecObject(parsedObj);

      return {
        text: JSON.stringify(normalizedObj),
        model: modelName,
      };
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[SpecFlow OpenRouter] Modelo ${modelName} falhou. Motivo: ${lastError.message}`);
    }
  }

  throw lastError || new Error("Nenhum modelo gratuito do OpenRouter respondeu com sucesso.");
}
