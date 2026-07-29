export interface DiscoveryPreset {
  id: string;
  title: string;
  category: string;
  iconName: "clinic" | "cart" | "card" | "saas";
  shortDesc: string;
  discoveryText: string;
}

export const DISCOVERY_PRESETS: DiscoveryPreset[] = [
  {
    id: "preset-clinic",
    title: "Clínica Médica — Fila de Espera",
    category: "Saúde & Operações",
    iconName: "clinic",
    shortDesc: "Reagendamento rápido para horários vagos por cancelamento",
    discoveryText:
      "Uma clínica possui uma fila de espera, mas continua perdendo horários quando pacientes cancelam consultas em cima da hora. A equipe entra em contato manualmente com várias pessoas e nem sempre consegue preencher a vaga. Precisamos de uma forma simples de identificar o cancelamento, encontrar pessoas elegíveis na fila e registrar quem aceitou o novo horário.",
  },
  {
    id: "preset-cart",
    title: "E-Commerce — Checkout One-Click",
    category: "Varejo & Pagamentos",
    iconName: "cart",
    shortDesc: "Redução de abandono de carrinho com preenchimento preditivo",
    discoveryText:
      "Nosso e-commerce B2C possui uma taxa de abandono de carrinho de 68% na etapa final. Descobrimos que o formulário de cadastro de endereço e frete exige 9 etapas e causa desistência em dispositivos móveis. Precisamos de um fluxo de checkout express em 1 clique para usuários retornantes, calculando frete estimado automaticamente e salvando cartões tokenizados com suporte a Pix instantâneo.",
  },
  {
    id: "preset-fintech",
    title: "Fintech — Análise de Crédito P2P",
    category: "Serviços Financeiros",
    iconName: "card",
    shortDesc: "Pré-aprovação automática de microcrédito pré-pago",
    discoveryText:
      "Nossa fintech de crédito pessoal leva 48 horas para aprovar solicitações de microcrédito para pequenos empreendedores, pois a análise de comprovantes de renda é manual. Queremos criar um fluxo onde o usuário conecta seu extrato Open Finance e recebe uma pré-aprovação de limite em menos de 2 minutos com score de risco preditivo e aceite digital do contrato via biometria facial.",
  },
  {
    id: "preset-saas",
    title: "SaaS B2B — Onboarding Autoguiado",
    category: "Software & Produtividade",
    iconName: "saas",
    shortDesc: "Gamificação e convite inteligente de membros da equipe",
    discoveryText:
      "Nosso SaaS de gestão de projetos B2B sofre com um churn de 55% na primeira semana. Os novos administradores criam a conta mas não sabem por onde começar e não convidam os membros da equipe. Precisamos de um assistente de onboarding autoguiado interativo que cria um projeto-modelo em 3 passos e gera links mágicos de convite em massa para os colaboradores.",
  },
];
