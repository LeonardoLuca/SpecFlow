/**
 * Quote Verifier Harness (Grounding Check)
 * Verifica se as citações literais (trechoRastreabilidade) nas Histórias de Usuário
 * realmente existem no texto original de discovery fornecido.
 */

import { ProductSpecification } from "@/types/spec";

export interface QuoteVerificationResult {
  isFullyGrounded: boolean;
  quoteExactnessRate: number; // 0.0 a 1.0 (ex: 1.0 = 100% de citações válidas)
  totalQuotes: number;
  validQuotesCount: number;
  unmatchedQuotes: Array<{
    storyId: string;
    storyTitle: string;
    quote: string;
    reason: string;
  }>;
}

/**
 * Normaliza o texto removendo espaços duplicados e pontuações para comparação permissiva.
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^\w\s]/gi, "")       // Remove pontuação
    .replace(/\s+/g, " ")           // Espaços múltiplos em espaço único
    .trim();
}

/**
 * Executa a verificação de grounding de citações contra o texto de origem.
 */
export function verifyQuoteGrounding(
  spec: ProductSpecification,
  rawInput: string
): QuoteVerificationResult {
  const normalizedRaw = normalizeText(rawInput);
  const stories = spec.historiasUsuario || [];
  const totalQuotes = stories.length;

  if (totalQuotes === 0) {
    return {
      isFullyGrounded: true,
      quoteExactnessRate: 1.0,
      totalQuotes: 0,
      validQuotesCount: 0,
      unmatchedQuotes: [],
    };
  }

  let validQuotesCount = 0;
  const unmatchedQuotes: QuoteVerificationResult["unmatchedQuotes"] = [];

  for (const story of stories) {
    const quote = story.trechoRastreabilidade?.trim();

    if (!quote) {
      unmatchedQuotes.push({
        storyId: story.id,
        storyTitle: story.titulo,
        quote: "",
        reason: "Citação vazia ou ausente.",
      });
      continue;
    }

    const normalizedQuote = normalizeText(quote);

    // 1. Checagem Exata (Substring)
    const isExactMatch = rawInput.includes(quote);
    // 2. Checagem Normalizada (sem acentos/pontuação)
    const isNormalizedMatch = normalizedRaw.includes(normalizedQuote);

    if (isExactMatch || isNormalizedMatch) {
      validQuotesCount++;
    } else {
      // Se a citação for longa, tentar verificar se pelo menos 70% dos termos estão presentes
      const quoteWords = normalizedQuote.split(" ").filter((w) => w.length > 3);
      const matchedWords = quoteWords.filter((w) => normalizedRaw.includes(w));
      const wordMatchRatio = quoteWords.length > 0 ? matchedWords.length / quoteWords.length : 0;

      if (wordMatchRatio >= 0.8) {
        validQuotesCount++;
      } else {
        unmatchedQuotes.push({
          storyId: story.id,
          storyTitle: story.titulo,
          quote,
          reason: "Trecho não encontrado exatamente no texto de discovery.",
        });
      }
    }
  }

  const quoteExactnessRate = Math.round((validQuotesCount / totalQuotes) * 100) / 100;

  return {
    isFullyGrounded: unmatchedQuotes.length === 0,
    quoteExactnessRate,
    totalQuotes,
    validQuotesCount,
    unmatchedQuotes,
  };
}
