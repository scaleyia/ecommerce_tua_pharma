// Configuração central da Tua Pharma — fonte única de verdade para os dados
// da empresa, contato, endereço e redes sociais. Alterar aqui reflete em todo
// o site (rodapé, botão de WhatsApp, metadados, páginas institucionais).

export const siteConfig = {
  name: "Tua Pharma",
  legalName: "TUA PHARMA LTDA",
  cnpj: "66.640.577/0001-76",
  domain: "www.tuapharma.com.br",

  // Farmacêutico(a) responsável técnico(a)
  pharmacist: {
    name: "Bruno Henrique Vieira",
    crf: "CRF-MG 29.653",
  },

  // Registro do estabelecimento no CRF-MG (Certidão de Regularidade Técnica) — EMITIDO.
  crfRegistration: {
    number: "48.633",
    validUntil: "08/06/2027",
  },

  // Registros sanitários — AFE/ANVISA e Alvará/Licença Sanitária.
  // Situação atual: AMBOS EM PROCESSO (só há protocolos, ainda sem número emitido).
  // Assim que os números saírem, basta preenchê-los aqui que o rodapé passa a exibi-los.
  //   • AFE/ANVISA — protocolada em 24/06/2026 · Processo nº 25351.111636/2026-74
  //   • Alvará Sanitário — Prefeitura de Nova Lima · Protocolo MGP2600432692
  sanitary: {
    afe: "", // nº da AFE/ANVISA (aguardando concessão)
    license: "", // nº do Alvará/Licença Sanitária (aguardando emissão)
  },

  address: {
    street: "Rua Katarina, 155",
    district: "Jardim Canadá",
    city: "Nova Lima",
    state: "MG",
    zip: "34.007-674",
    zipDigits: "34007674", // CEP de origem dos envios (base do cálculo de frete)
    full: "Rua Katarina, 155 — Jardim Canadá, Nova Lima/MG · CEP 34.007-674",
  },

  contact: {
    whatsapp: "+55 31 98341-1788",
    whatsappDigits: "5531983411788",
    email: "tuapharma@tuapharma.com.br",
    hours: "Atendimento das 8h às 18h",
  },

  social: {
    instagram: "https://www.instagram.com/tuapharma.oficial",
  },

  // Prazo máximo de entrega. Varia por localização — há regiões com entrega
  // no mesmo dia e o prazo máximo é de 10 dias úteis.
  delivery: {
    maxDays: 10,
    note: "Prazo de até 10 dias úteis, variando conforme a localidade. Algumas regiões contam com entrega no mesmo dia.",
  },
} as const;

// Texto institucional oficial da farmácia (fornecido pelo cliente).
export const aboutText = {
  short:
    "Farmácia de manipulação comprometida com a excelência, oferecendo medicamentos personalizados com qualidade, segurança e precisão.",
  full:
    "A Tua Pharma é uma farmácia de manipulação comprometida com a excelência, oferecendo medicamentos personalizados com qualidade, segurança e precisão. Contamos com uma infraestrutura moderna, equipamentos de alta tecnologia e uma equipe altamente qualificada, garantindo processos rigorosos em todas as etapas da manipulação. Acreditamos que o cuidado é compartilhado: ao lado do médico prescritor, acompanhamos cada etapa do tratamento, do pré ao pós-prescrição, oferecendo suporte, confiança e soluções personalizadas para contribuir com os melhores resultados aos nossos pacientes.",
};

// Link direto para conversa no WhatsApp, com mensagem opcional pré-preenchida.
export const whatsappLink = (message?: string): string => {
  const base = `https://wa.me/${siteConfig.contact.whatsappDigits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};
