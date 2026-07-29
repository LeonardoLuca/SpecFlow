import { NextResponse } from "next/server";
import { getGeminiClient, SYSTEM_INSTRUCTION, GEMINI_RESPONSE_SCHEMA } from "@/lib/gemini";
import { callOpenRouterSpec } from "@/lib/openrouter";
import { ProductSpecificationSchema, GenerateSpecResponse, ProviderOption } from "@/types/spec";
import fallbackSpecRaw from "@/data/fallback-spec.json";

const TIMEOUT_MS = 20000; // 20 segundos

// Lista de modelos Gemini suportados em ordem de preferência
const CANDIDATE_GEMINI_MODELS = ["gemini-3.6-flash", "gemini-flash-latest"];

export async function POST(request: Request) {
  const startTime = Date.now();
  const generatedAt = new Date().toISOString();

  let body: { input?: string; provider?: ProviderOption } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido. Envie um JSON com { input: string }." },
      { status: 400 }
    );
  }

  const userInput = body.input?.trim();
  const requestedProvider = body.provider || "gemini";

  if (!userInput) {
    return NextResponse.json(
      { error: "O campo 'input' é obrigatório para gerar a especificação." },
      { status: 400 }
    );
  }

  // 1. Executar isoladamente se o provedor OpenRouter for selecionado
  if (requestedProvider === "openrouter") {
    try {
      const openRouterResult = await callOpenRouterSpec(userInput);
      const parsedJson = JSON.parse(openRouterResult.text);
      const zodResult = ProductSpecificationSchema.safeParse(parsedJson);

      if (!zodResult.success) {
        console.warn("[SpecFlow OpenRouter Zod Warning]", zodResult.error.format());
        throw new Error("A resposta do OpenRouter não atendeu ao Schema Zod esperado.");
      }


      const durationMs = Date.now() - startTime;
      const liveResponse: GenerateSpecResponse = {
        source: "live",
        specification: zodResult.data,
        metadata: {
          provider: "OpenRouter (Free)",
          model: openRouterResult.model,
          durationMs,
          generatedAt,
        },
      };
      return NextResponse.json(liveResponse);

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[SpecFlow OpenRouter Activator] OpenRouter falhou: ${msg}. Carregando fallback estático direto...`);

      const parsedFallback = ProductSpecificationSchema.parse(fallbackSpecRaw);
      const fallbackResponse: GenerateSpecResponse = {
        source: "fallback",
        specification: parsedFallback,
        metadata: {
          provider: "OpenRouter (Free) / Cache Estático",
          generatedAt,
          fallbackReason: `OpenRouter: ${msg}`,
        },
      };

      return NextResponse.json(fallbackResponse);
    }
  }

  // 2. Executar isoladamente se o provedor Gemini for selecionado
  try {
    const ai = getGeminiClient();

    let lastError: Error | null = null;
    let successfulResult: { text: string; usedModel: string } | null = null;

    for (const modelName of CANDIDATE_GEMINI_MODELS) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(
            () => reject(new Error(`Timeout de 20 segundos atingido para o modelo ${modelName}`)),
            TIMEOUT_MS
          );
        });

        const aiCallPromise = ai.models.generateContent({
          model: modelName,
          contents: userInput,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.2,
            responseMimeType: "application/json",
            responseSchema: GEMINI_RESPONSE_SCHEMA,
          },
        });

        const response = await Promise.race([aiCallPromise, timeoutPromise]);
        const responseText = response.text;

        if (responseText) {
          successfulResult = { text: responseText, usedModel: modelName };
          break;
        }
      } catch (err: unknown) {
        lastError = err instanceof Error ? err : new Error(String(err));
        console.warn(`[SpecFlow API] Modelo ${modelName} falhou, tentando o próximo... Motivo: ${lastError.message}`);
      }
    }

    if (!successfulResult) {
      throw lastError || new Error("Nenhum modelo Gemini respondeu com sucesso.");
    }

    const parsedJson = JSON.parse(successfulResult.text);

    // Validação Estreita no Nível da Aplicação com Zod
    const zodResult = ProductSpecificationSchema.safeParse(parsedJson);

    if (!zodResult.success) {
      console.warn("Validação Zod falhou na resposta do Gemini:", zodResult.error.format());
      throw new Error("A resposta da IA não atendeu estritamente ao Schema Zod esperado.");
    }

    const durationMs = Date.now() - startTime;

    const liveResponse: GenerateSpecResponse = {
      source: "live",
      specification: zodResult.data,
      metadata: {
        provider: "Google Gemini",
        model: successfulResult.usedModel,
        durationMs,
        generatedAt,
      },
    };

    return NextResponse.json(liveResponse);

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido durante a geração";
    console.log(`[SpecFlow Fallback Activator] Acionando fallback estático devido a: ${errorMessage}`);

    // Validação do Fallback estático contra Zod para garantir contrato idêntico
    const parsedFallback = ProductSpecificationSchema.parse(fallbackSpecRaw);

    const fallbackResponse: GenerateSpecResponse = {
      source: "fallback",
      specification: parsedFallback,
      metadata: {
        provider: "Google Gemini / Cache Estático",
        generatedAt,
        fallbackReason: errorMessage,
      },
    };

    return NextResponse.json(fallbackResponse);
  }
}
