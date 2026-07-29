/**
 * Eval Suite Harness
 * Sistema de avaliação contínua (Evals) para especificações geradas por IA.
 * Calcula métricas objetivas de Grounding, Qualidade, Completude e Ambiguidade.
 */

import { ProductSpecification } from "@/types/spec";
import { verifyQuoteGrounding, QuoteVerificationResult } from "./quote-verifier";

export interface HarnessEvaluationResult {
  score: number; // Nota final de 0 a 100
  isPassing: boolean;
  metrics: {
    quoteExactnessRate: number; // 0.0 - 1.0
    completenessScore: number;  // 0.0 - 1.0
    ambiguityPenalty: number;   // 0.0 - 1.0
    zodConformity: boolean;
  };
  groundingDetails: QuoteVerificationResult;
  warnings: string[];
}

const VAGUE_TERMS = [
  "rápido",
  "facil",
  "amigável",
  "amigavel",
  "simples",
  "intuitivo",
  "eficiente",
  "em breve",
  "se possível",
  "se possivel",
  "melhorar UX",
];

/**
 * Avalia uma especificação de produto contra o texto de discovery original.
 */
export function evaluateSpecification(
  spec: ProductSpecification,
  rawInput: string
): HarnessEvaluationResult {
  const warnings: string[] = [];

  // 1. Verificação de Grounding de Citações Literais
  const groundingDetails = verifyQuoteGrounding(spec, rawInput);
  if (!groundingDetails.isFullyGrounded) {
    warnings.push(
      `${groundingDetails.unmatchedQuotes.length} citação(ões) de User Stories não foram encontradas no texto original.`
    );
  }

  // 2. Score de Completude
  let completenessPoints = 0;
  const maxCompletenessPoints = 5;

  if (spec.problema?.length > 20) completenessPoints++;
  if (spec.hipotese?.length > 20) completenessPoints++;
  if ((spec.escopoIncluido?.length || 0) >= 1) completenessPoints++;
  if ((spec.escopoExcluido?.length || 0) >= 1) completenessPoints++;
  if ((spec.historiasUsuario?.length || 0) >= 3) completenessPoints++;

  const completenessScore = completenessPoints / maxCompletenessPoints;

  // 3. Penalidade por Termos Vagos e Ambíguos
  let vagueTermsCount = 0;
  const allCriteriaText = (spec.historiasUsuario || [])
    .flatMap((s) => s.criteriosAceite || [])
    .join(" ")
    .toLowerCase();

  for (const term of VAGUE_TERMS) {
    if (allCriteriaText.includes(term)) {
      vagueTermsCount++;
    }
  }

  const ambiguityPenalty = Math.min(1.0, vagueTermsCount * 0.15);
  if (vagueTermsCount > 0) {
    warnings.push(
      `Identificados ${vagueTermsCount} termo(s) potencialmente ambíguo(s) nos critérios de aceite (ex: "fácil", "rápido").`
    );
  }

  // 4. Cálculo do Score Final (0 a 100)
  // Pesos: Grounding (50%), Completude (35%), Ambiguidade (15%)
  const rawScore =
    groundingDetails.quoteExactnessRate * 50 +
    completenessScore * 35 +
    (1 - ambiguityPenalty) * 15;

  const finalScore = Math.min(100, Math.max(0, Math.round(rawScore)));
  const isPassing = finalScore >= 75 && groundingDetails.quoteExactnessRate >= 0.6;

  return {
    score: finalScore,
    isPassing,
    metrics: {
      quoteExactnessRate: groundingDetails.quoteExactnessRate,
      completenessScore: Math.round(completenessScore * 100) / 100,
      ambiguityPenalty: Math.round(ambiguityPenalty * 100) / 100,
      zodConformity: true,
    },
    groundingDetails,
    warnings,
  };
}
