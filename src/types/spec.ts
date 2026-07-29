import { z } from "zod";

export const UserStorySchema = z.object({
  id: z.string().describe("Identificador único ex: US-001"),
  titulo: z.string().describe("Título sucinto e claro da história"),
  descricao: z.string().describe("Descrição no formato: Como [persona], quero [ação], para que [benefício]"),
  trechoRastreabilidade: z.string().describe("Trecho literal exato do texto fornecido que justifica a criação desta história"),
  criteriosAceite: z.array(z.string()).min(1).describe("Critérios de aceite objetivos e verificáveis"),
});

export const BacklogItemSchema = z.object({
  item: z.string().describe("Nome da tarefa ou funcionalidade do backlog"),
  prioridade: z.enum(["Alta", "Média", "Baixa"]).describe("Nível de prioridade inicial"),
});

export const ProductSpecificationSchema = z.object({
  titulo: z.string().describe("Nome claro e profissional do produto / solução"),
  problema: z.string().describe("Descrição precisa do problema principal identificado no discovery"),
  hipotese: z.string().describe("Hipótese de solução a ser validada pelo produto"),
  escopoIncluido: z.array(z.string()).min(1).describe("Funcionalidades e requisitos que FAZEM parte do MVP"),
  escopoExcluido: z.array(z.string()).min(1).describe("Funcionalidades e limites explicitamente FORA do escopo do MVP"),
  historiasUsuario: z.array(UserStorySchema).min(3).describe("Pelo menos 3 histórias de usuário completas com rastreabilidade"),
  backlog: z.array(BacklogItemSchema).min(1).describe("Lista organizada de itens prioritários para desenvolvimento"),
  metricasSugeridas: z.array(z.string()).min(1).describe("Métricas-chave de sucesso e KPIs de produto"),
  riscos: z.array(z.string()).min(1).describe("Riscos técnicos ou de negócio mapeados"),
  duvidasEmAberto: z.array(z.string()).describe("Dúvidas, premissas ou informações pendentes de confirmação"),
});

export type UserStory = z.infer<typeof UserStorySchema>;
export type BacklogItem = z.infer<typeof BacklogItemSchema>;
export type ProductSpecification = z.infer<typeof ProductSpecificationSchema>;

export type GenerationSource = "live" | "fallback";
export type ProviderOption = "gemini" | "openrouter";

export interface GenerateSpecResponse {
  id?: string;
  source: GenerationSource;
  specification: ProductSpecification;
  metadata: {
    provider?: string;
    model?: string;
    durationMs?: number;
    generatedAt: string;
    fallbackReason?: string;
    harness?: {
      evalScore: number;
      quoteExactnessRate: number;
      isPassing: boolean;
      selfCorrectionAttempts: number;
      warnings?: string[];
    };
  };
}

