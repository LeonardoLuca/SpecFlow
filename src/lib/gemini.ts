import { GoogleGenAI, Type } from "@google/genai";

export const SYSTEM_INSTRUCTION = `Você atua como Product Builder responsável por transformar informações iniciais de discovery em uma primeira especificação de produto.
Analise exclusivamente o conteúdo fornecido pelo usuário.
Organize o problema, a hipótese de solução, o escopo mínimo, as histórias de usuário, os critérios de aceite, o backlog, os riscos, as métricas sugeridas e as dúvidas em aberto.
Não invente evidências, números, integrações ou regras de negócio que não estejam presentes na entrada.
Quando uma informação necessária não estiver disponível, registre-a como dúvida em aberto.
Mantenha o escopo do MVP pequeno e executável.
Os critérios de aceite devem ser objetivos e verificáveis.
Para cada história de usuário, preserve um pequeno trecho literal da entrada que justifique sua criação.
Retorne uma resposta compatível com o schema fornecido.
Escreva em português brasileiro.`;

// Schema JSON em formato aceito pelo SDK do Gemini (ResponseSchema)
export const GEMINI_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    titulo: { type: Type.STRING, description: "Nome do produto / solução" },
    problema: { type: Type.STRING, description: "Descrição clara e concisa do problema principal" },
    hipotese: { type: Type.STRING, description: "Hipótese de solução do produto" },
    escopoIncluido: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Funcionalidades que FAZEM parte do MVP"
    },
    escopoExcluido: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Funcionalidades explicitamente FORA do MVP"
    },
    historiasUsuario: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "Identificador ex: US-001" },
          titulo: { type: Type.STRING, description: "Título da história" },
          descricao: { type: Type.STRING, description: "Como... quero... para que..." },
          trechoRastreabilidade: { type: Type.STRING, description: "Trecho literal da entrada que justifica esta história" },
          criteriosAceite: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Lista de critérios de aceite"
          }
        },
        required: ["id", "titulo", "descricao", "trechoRastreabilidade", "criteriosAceite"]
      },
      description: "Pelo menos 3 histórias de usuário com rastreabilidade"
    },
    backlog: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING },
          prioridade: { type: Type.STRING, enum: ["Alta", "Média", "Baixa"] }
        },
        required: ["item", "prioridade"]
      },
      description: "Itens organizados para o backlog inicial"
    },
    metricasSugeridas: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Métricas chaves de sucesso"
    },
    riscos: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Riscos identificados"
    },
    duvidasEmAberto: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Dúvidas ou informações pendentes no discovery"
    }
  },
  required: [
    "titulo",
    "problema",
    "hipotese",
    "escopoIncluido",
    "escopoExcluido",
    "historiasUsuario",
    "backlog",
    "metricasSugeridas",
    "riscos",
    "duvidasEmAberto"
  ]
};

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY não configurada no servidor.");
  }
  return new GoogleGenAI({ apiKey });
}
