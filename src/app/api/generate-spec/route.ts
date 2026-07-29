import { NextResponse } from "next/server";
import { getGeminiClient, SYSTEM_INSTRUCTION, GEMINI_RESPONSE_SCHEMA } from "@/lib/gemini";
import { ProductSpecificationSchema, GenerateSpecResponse } from "@/types/spec";
import fallbackSpecRaw from "@/data/fallback-spec.json";

const TIMEOUT_MS = 20000; // 20 segundos

// Lista de modelos suportados em ordem de preferência
const CANDIDATE_MODELS = ["gemini-3.6-flash", "gemini-flash-latest"];

export async function POST(request: Request) {
  const startTime = Date.now();
  const generatedAt = new Date().toISOString();

  let body: { input?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido. Envie um JSON com { input: string }." },
      { status: 400 }
    );
  }

  const userInput = body.input?.trim();
  if (!userInput) {
    return NextResponse.json(
      { error: "O campo 'input' é obrigatório para gerar a especificação." },
      { status: 400 }
    );
  }

  // Tentar chamada real com os modelos ativos (gemini-3.6-flash / gemini-flash-latest)
  try {
    const ai = getGeminiClient();

    let lastError: Error | null = null;
    let successfulResult: { text: string; usedModel: string } | null = null;

    for (const modelName of CANDIDATE_MODELS) {
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
        model: successfulResult.usedModel,
        durationMs,
        generatedAt,
      },
    };

    return NextResponse.json(liveResponse);

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido durante a geração";
    console.log(`[SpecFlow Fallback Activator] Acionando fallback devido a: ${errorMessage}`);

    // Validação do Fallback estático contra Zod para garantir contrato idêntico
    const parsedFallback = ProductSpecificationSchema.parse(fallbackSpecRaw);

    const fallbackResponse: GenerateSpecResponse = {
      source: "fallback",
      specification: parsedFallback,
      metadata: {
        generatedAt,
        fallbackReason: errorMessage,
      },
    };

    return NextResponse.json(fallbackResponse);
  }
}
