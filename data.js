// ==========================================================================
// TOBIAS MAGAZINE — Base de Dados Editorial Local (Edição Quinzenal #14)
// ==========================================================================

window.TOBIAS_DATA = {
  // Aumente este número sempre que adicionar itens novos aqui no data.js:
  // assim quem já visitou o site (dados guardados no navegador) também recebe.
  dataVersion: 8,
  // ids removidos do conteúdo padrão (limpos também para quem já tinha o site salvo no navegador)
  removedIds: ["biz-1", "biz-2", "biz-3", "biz-4", "biz-5", "biz-6", "biz-7", "biz-8"],

  edition: {
    number: "Edição #14 • Ano I",
    periodicity: "Quinzenal (1ª Quinzena do Mês)",
    pagesCount: 10,
    neighborhood: "Bairro & Região",
    // Cidade/estado acrescentados às buscas do Google Maps ("Como chegar"). Editável no CMS.
    mapsRegion: "",
    tagline: "O jornal e revista digital da nossa vizinhança — pensado para ler no celular",
    urgentTicker: "ALERTA DE UTILIDADE PÚBLICA: Manutenção preventiva na rede de água da Rua Principal nesta quinta-feira (08h às 14h). Posto de Saúde com vacinação estendida até 19h.",
    coverStory: {
      kicker: "Reportagem de Capa • Gente do Bairro",
      readingTime: "2 min de leitura",
      title: "40 Anos de Pão Quente e Prosa: Como Seu Tobias Transformou a Esquina no Coração do Bairro",
      lead: "Da primeira fornada a lenha em 1986 até os pedidos pelo WhatsApp hoje: conheça a história da padaria que viu três gerações de vizinhos crescerem.",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
      author: "Redação Tobias Magazine",
      fullText: `
        <p>Quem passa pela Praça Central às 5h30 da manhã já conhece o perfume inconfundível. Há exatos 40 anos, Seu Antônio Tobias abria as portas da primeira padaria artesanal do bairro, quando muitas ruas ainda eram de terra batida.</p>
        <p style="margin-top:12px;"><strong>"Aqui nunca foi só vender pão. A gente guardava a chave do vizinho, anotava recado no caderno de fiado e comemorava cada aprovação de vestibular dos meninos da rua"</strong>, conta Seu Tobias, hoje trabalhando ao lado da neta Mariana, responsável por modernizar o atendimento via WhatsApp.</p>
        <p style="margin-top:12px;">Nesta edição especial da <em>Tobias Magazine</em>, celebramos os comércios e profissionais que mantêm nossa comunidade viva, segura e conectada — unindo a tradição do olho no olho com a praticidade do celular.</p>
      `
    }
  },

  // Stories Rápidos (Vídeos/Reels Curtos do Bairro)
  stories: [
    {
      id: "st-1",
      icon: "🥖",
      label: "Capa: Seu Tobias",
      title: "40 Anos da Padaria",
      duration: "0:45",
      summary: "Bastidores da primeira fornada das 5h30 da manhã e o segredo do pão francês crocante.",
      ctaText: "Ler Matéria de Capa",
      ctaTarget: "#gente-do-bairro"
    },
    {
      id: "st-2",
      icon: "🚨",
      label: "Água & Obras",
      title: "Aviso de Manutenção",
      duration: "0:30",
      summary: "Quinta-feira (08h às 14h) haverá interrupção temporária na Rua das Acácias e Avenida Central.",
      ctaText: "Ver Utilidade Pública",
      ctaTarget: "#utilidade-publica"
    },
    {
      id: "st-3",
      icon: "🥬",
      label: "Feira Livre",
      title: "Sábado na Praça",
      duration: "0:50",
      summary: "Frutas frescas direto do produtor, pastel de feira e música ao vivo a partir das 06h.",
      ctaText: "Ver Agenda do Fim de Semana",
      ctaTarget: "#agenda-eventos"
    },
    {
      id: "st-4",
      icon: "🏷️",
      label: "Ofertas -30%",
      title: "Cupons da Semana",
      duration: "0:35",
      summary: "Mostre a tela da Tobias Magazine nas lojas parceiras e ganhe descontos exclusivos.",
      ctaText: "Pegar Cupons",
      ctaTarget: "#achados-promocoes"
    },
    {
      id: "st-5",
      icon: "🐶",
      label: "Adoção Pet",
      title: "Feirinha de Filhotes",
      duration: "0:40",
      summary: "6 cãezinhos e 4 gatinhos vacinados esperando um lar amoroso no nosso bairro.",
      ctaText: "Ver Classificados",
      ctaTarget: "#classificados"
    },
    {
      id: "st-6",
      icon: "📲",
      label: "Anuncie Aqui",
      title: "Divulgue seu Negócio",
      duration: "0:30",
      summary: "Apareça para milhares de moradores nos grupos de WhatsApp dos condomínios e ruas.",
      ctaText: "Ver Planos e QR Code",
      ctaTarget: "#anuncie-midia"
    }
  ],

  // 1. Guia do Comércio e Serviços
  directory: [
    // ----------------------------------------------------------------------
    // HOSPEDAGEM EM TOBIAS BARRETO - SE (dados públicos levantados em 28/10/2026:
    // pousadas.vip, ferias.tur.br, lemeshotel.com.br, Kayak, Booking e perfis
    // oficiais no Instagram/Facebook). Confirme com cada estabelecimento.
    // phone = WhatsApp (botão verde) | landline = telefone fixo (botão "Ligar")
    // ----------------------------------------------------------------------
    {
      id: "hosp-millennio",
      name: "Hotel Millennio",
      category: "Hospedagem",
      catSlug: "hospedagem",
      avatar: "🏨",
      sponsored: false,
      description: "Hotel no centro de Tobias Barreto, na Avenida 7 de Junho — perto do comércio e dos principais serviços da cidade.",
      address: "Av. 7 de Junho, 490 — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Hotel%20Millennio%2C%20Av.%207%20de%20Junho%2C%20490%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte disponibilidade por telefone",
      phone: "",
      landline: "557935414834",
      status: "Hotel • Centro"
    },
    {
      id: "hosp-trindade",
      name: "Hotel e Pousada Trindade",
      category: "Hospedagem",
      catSlug: "hospedagem",
      avatar: "🏨",
      sponsored: false,
      description: "Hospedagem com restaurante próprio de comida regional sergipana, com opções vegetarianas e veganas.",
      address: "Rod. João Valeriano dos Santos, s/n — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Hotel%20Trindade%2C%20Rodovia%20Jo%C3%A3o%20Valeriano%20dos%20Santos%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte disponibilidade pelo WhatsApp",
      phone: "5579996333737",
      status: "Hotel • Restaurante"
    },
    {
      id: "hosp-moura",
      name: "Pousada Moura",
      category: "Hospedagem",
      catSlug: "hospedagem",
      avatar: "🛏️",
      sponsored: false,
      description: "Quartos com ar-condicionado, frigobar, TV e internet, no centro da cidade. Café da manhã incluído e aceita pets.",
      address: "Av. 7 de Junho, 535 — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Pousada%20Moura%2C%20Av.%207%20de%20Junho%2C%20535%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte disponibilidade por telefone",
      phone: "",
      landline: "557935411939",
      status: "Café incluso • Aceita pets"
    },
    {
      id: "hosp-rainha",
      name: "Pousada Rainha",
      category: "Hospedagem",
      catSlug: "hospedagem",
      avatar: "🛏️",
      sponsored: false,
      description: "Pousada do Grupo Reis dos Tecidos, ao lado do Posto Rainha, com atendimento 24 horas.",
      address: "Av. Dr. Airton de Andrade — ao lado do Posto Rainha",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Pousada%20Rainha%2C%20Av.%20Dr.%20Airton%20de%20Andrade%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Atendimento 24 horas",
      phone: "5579996045880",
      landline: "557935413115",
      status: "Atendimento 24h"
    },
    {
      id: "hosp-paraiso",
      name: "Pousada Paraíso",
      category: "Hospedagem",
      catSlug: "hospedagem",
      avatar: "🛏️",
      sponsored: false,
      description: "Pousada na área do comércio local de Tobias Barreto. Informações e reservas pelo WhatsApp.",
      address: "Centro — área comercial de Tobias Barreto",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Pousada%20Para%C3%ADso%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Reservas pelo WhatsApp",
      phone: "5579999378891",
      status: "Perto do comércio"
    },
    {
      id: "hosp-bela-vista",
      name: "Pousada Bela Vista",
      category: "Hospedagem",
      catSlug: "hospedagem",
      avatar: "🛏️",
      sponsored: false,
      description: "Pousada tradicional da cidade, na Praça Dom José Thomaz — uma das localizações mais centrais de Tobias Barreto.",
      address: "Praça Dom José Thomaz, 275 — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Pousada%20Bela%20Vista%2C%20Pra%C3%A7a%20Dom%20Jos%C3%A9%20Thomaz%2C%20275%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte disponibilidade no local",
      phone: "",
      status: "Praça central"
    },
    {
      id: "hosp-oliveiras",
      name: "Pousada Oliveira's",
      category: "Hospedagem",
      catSlug: "hospedagem",
      avatar: "🛏️",
      sponsored: false,
      description: "Hospedagem confortável e acessível, com Wi-Fi, ar-condicionado e estacionamento. Aceita pets.",
      address: "Rua Severiano Cardoso — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Pousada%20Oliveira%27s%2C%20Rua%20Severiano%20Cardoso%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Reservas pelo Instagram @pousadaoliveirass",
      phone: "",
      status: "Estacionamento • Aceita pets"
    },
    {
      id: "hosp-bem-estar",
      name: "Pousada Bem Estar",
      category: "Hospedagem",
      catSlug: "hospedagem",
      avatar: "🛏️",
      sponsored: false,
      description: "Pousada no bairro Lagoinha, conhecida pelo bom atendimento. Reservas direto pelo WhatsApp.",
      address: "Rua Porongaba, 34 — Lagoinha",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Pousada%20Bem%20Estar%2C%20Rua%20Porongaba%2C%2034%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Reservas pelo WhatsApp",
      phone: "5579997133883",
      status: "Bairro Lagoinha"
    },
    {
      id: "hosp-uniao-gabriel",
      name: "Pousada União Gabriel",
      category: "Hospedagem",
      catSlug: "hospedagem",
      avatar: "🛏️",
      sponsored: false,
      description: "Casa de hóspedes com quartos para famílias, café da manhã incluído, Wi-Fi grátis e estacionamento.",
      address: "Tobias Barreto - SE (veja no mapa)",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Pousada%20Uni%C3%A3o%20Gabriel%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Reservas pelo Booking.com",
      phone: "",
      status: "Café incluso • Família"
    },
    // ----------------------------------------------------------------------
    // MERCADOS, FARMÁCIAS E RESTAURANTES DE TOBIAS BARRETO - SE
    // (lista enviada pela redação em 28/10/2026 — telefones e horários a confirmar)
    // ----------------------------------------------------------------------
    {
      id: "merc-superlar",
      name: "Supermercado Superlar",
      category: "Padarias & Mercados",
      catSlug: "alimentacao",
      avatar: "🛒",
      sponsored: false,
      description: "Supermercado conhecido pelos preços acessíveis, com serviço de entrega de compras.",
      address: "Av. Luís Alves de Oliveira Filho, 289",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Supermercado%20Superlar%2C%20Av.%20Lu%C3%ADs%20Alves%20de%20Oliveira%20Filho%2C%20289%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Entrega de compras"
    },
    {
      id: "merc-gbarbosa",
      rev: 2,
      name: "GBarbosa Tobias Barreto",
      category: "Padarias & Mercados",
      catSlug: "alimentacao",
      avatar: "🛒",
      sponsored: false,
      description: "Uma das redes mais tradicionais, bem no centro, com grande estrutura de supermercado e padaria.",
      address: "Av. 7 de Junho, 380 — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=GBarbosa%2C%20Av.%207%20de%20Junho%2C%20380%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Supermercado • Padaria"
    },
    {
      id: "merc-fasouto",
      name: "Lojão Fasouto",
      category: "Padarias & Mercados",
      catSlug: "alimentacao",
      avatar: "🛒",
      sponsored: false,
      description: "Atacarejo ideal tanto para compras do dia a dia quanto para compras em maior quantidade.",
      address: "Av. Dr. José Airton de Andrade, 1507",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Loj%C3%A3o%20Fasouto%2C%20Av.%20Dr.%20Jos%C3%A9%20Airton%20de%20Andrade%2C%201507%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Atacarejo"
    },
    {
      id: "merc-santa-rita",
      name: "Supermercado Santa Rita",
      category: "Padarias & Mercados",
      catSlug: "alimentacao",
      avatar: "🛒",
      sponsored: false,
      description: "Supermercado completo e tradicional na cidade.",
      address: "Av. José David dos Santos",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Supermercado%20Santa%20Rita%2C%20Av.%20Jos%C3%A9%20David%20dos%20Santos%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Tradicional na cidade"
    },
    {
      id: "farm-mais-saude",
      name: "Farmácia Mais Saúde",
      category: "Farmácias & Saúde",
      catSlug: "saude",
      avatar: "💊",
      sponsored: false,
      description: "Atendimento presencial bem avaliado e serviço de delivery pelo WhatsApp.",
      address: "Av. 7 de Junho, 503 — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Farm%C3%A1cia%20Mais%20Sa%C3%BAde%2C%20Av.%207%20de%20Junho%2C%20503%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Delivery via WhatsApp"
    },
    {
      id: "farm-costa",
      name: "Farmácia Costa",
      category: "Farmácias & Saúde",
      catSlug: "saude",
      avatar: "💊",
      sponsored: false,
      description: "Ambiente climatizado, com variedade em medicamentos e cosméticos.",
      address: "Av. Dr. José Airton de Andrade, 1280",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Farm%C3%A1cia%20Costa%2C%20Av.%20Dr.%20Jos%C3%A9%20Airton%20de%20Andrade%2C%201280%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Climatizada • Cosméticos"
    },
    {
      id: "farm-mais-barato",
      name: "Rede de Farmácias Mais Barato",
      category: "Farmácias & Saúde",
      catSlug: "saude",
      avatar: "💊",
      sponsored: false,
      description: "Rede com mais de uma unidade na cidade, conhecida pelas ofertas e pelo bom atendimento.",
      address: "Av. 7 de Junho, 421 • SE-170, 908",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Farm%C3%A1cia%20Mais%20Barato%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "2 unidades na cidade"
    },
    {
      id: "farm-atacadao-remedios",
      name: "Atacadão dos Remédios",
      category: "Farmácias & Saúde",
      catSlug: "saude",
      avatar: "💊",
      sponsored: false,
      description: "Preços competitivos e variedade de produtos de cuidados pessoais.",
      address: "R. Antônio Muniz, 77",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Atacad%C3%A3o%20dos%20Rem%C3%A9dios%2C%20Rua%20Ant%C3%B4nio%20Muniz%2C%2077%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Preço baixo"
    },
    {
      id: "rest-barreto",
      name: "Restaurante e Churrascaria do Barreto",
      category: "Restaurantes & Lanchonetes",
      catSlug: "restaurantes",
      avatar: "🍽️",
      sponsored: false,
      description: "Restaurante bem avaliado na cidade, com ambiente climatizado, comida de ótima qualidade e churrasco.",
      address: "Tobias Barreto - SE (veja no mapa)",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Restaurante%20e%20Churrascaria%20do%20Barreto%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Churrasco • Climatizado"
    },
    {
      id: "rest-bichinho",
      rev: 2,
      name: "Restaurante Do Bichinho",
      category: "Restaurantes & Lanchonetes",
      catSlug: "restaurantes",
      avatar: "🍽️",
      sponsored: false,
      description: "Churrasco e culinária regional: churrascaria e self-service de dia, clima de boteco à noite.",
      address: "Av. Luís Alves de Oliveira Filho",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Restaurante%20Do%20Bichinho%2C%20Av.%20Lu%C3%ADs%20Alves%20de%20Oliveira%20Filho%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Self-service • Boteco à noite"
    },
    {
      id: "rest-tempero-bom",
      name: "Restaurante Tempero Bom",
      category: "Restaurantes & Lanchonetes",
      catSlug: "restaurantes",
      avatar: "🍽️",
      sponsored: false,
      description: "Almoço casual em self-service ou prato feito, com bom churrasco.",
      address: "Av. 7 de Junho, 513 — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Restaurante%20Tempero%20Bom%2C%20Av.%207%20de%20Junho%2C%20513%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Self-service • PF"
    },
    {
      id: "rest-tia-lili",
      name: "Restaurante e Churrascaria Tia Lili",
      category: "Restaurantes & Lanchonetes",
      catSlug: "restaurantes",
      avatar: "🍽️",
      sponsored: false,
      description: "Ambiente limpo e climatizado, com cardápio variado para o almoço.",
      address: "SE-170, 2180",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Restaurante%20e%20Churrascaria%20Tia%20Lili%2C%20SE-170%2C%202180%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Almoço • Climatizado"
    },
    {
      id: "rest-cantinho-gostoso",
      rev: 2,
      name: "Cantinho Gostoso Pizzaria e Lanchonete",
      category: "Restaurantes & Lanchonetes",
      catSlug: "restaurantes",
      avatar: "🍕",
      sponsored: false,
      description: "Famosa pelas pizzas, calzones e combos — uma das favoritas da cidade à noite.",
      address: "Av. Manoel Joaquim Neto — Centenário",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Cantinho%20Gostoso%20Pizzaria%20e%20Lanchonete%2C%20Av.%20Manoel%20Joaquim%20Neto%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Pizza à noite"
    },
    // ---- Lista enviada pela redação em 28/10/2026 (2ª leva): padarias, lanches,
    // ---- pizzarias, bancos, escolas, lojas e veículos. Telefones e horários a confirmar.
    {
      id: "pad-sao-jose",
      rev: 2,
      name: "Panificadora São José",
      category: "Mercados & Padarias",
      catSlug: "alimentacao",
      avatar: "🥖",
      sponsored: false,
      description: "Opção tradicional para pães do dia a dia, pastéis e salgados.",
      address: "R. Antônio Silvino Filho, 331 — Vicentino",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Panificadora%20S%C3%A3o%20Jos%C3%A9%2C%20R.%20Ant%C3%B4nio%20Silvino%20Filho%2C%20331%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Pães frescos • Pastéis"
    },
    {
      id: "pad-imperatriz",
      name: "Panificação Imperatriz",
      category: "Mercados & Padarias",
      catSlug: "alimentacao",
      avatar: "🥖",
      sponsored: false,
      description: "Panificação na Avenida 7 de Junho, no Centro da cidade.",
      address: "Av. 7 de Junho, 852 — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Panifica%C3%A7%C3%A3o%20Imperatriz%2C%20Av.%207%20de%20Junho%2C%20852%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Padaria • Centro"
    },
    {
      id: "pad-pao-nosso",
      name: "Panificação Pão Nosso",
      category: "Mercados & Padarias",
      catSlug: "alimentacao",
      avatar: "🥖",
      sponsored: false,
      description: "Panificação no bairro Santa Rita.",
      address: "R. Gracho Cardoso, 441 — Santa Rita",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Panifica%C3%A7%C3%A3o%20P%C3%A3o%20Nosso%2C%20R.%20Gracho%20Cardoso%2C%20441%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Padaria • Santa Rita"
    },
    {
      id: "pad-teodoro",
      rev: 2,
      name: "Panificação Teodoro",
      category: "Mercados & Padarias",
      catSlug: "alimentacao",
      avatar: "🥖",
      sponsored: false,
      description: "Pães tradicionais, bolachas e café da manhã.",
      address: "Av. João Alves Filho — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Panifica%C3%A7%C3%A3o%20Teodoro%2C%20Av.%20Jo%C3%A3o%20Alves%20Filho%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      instagram: "panificacao_teodoro",
      status: "Padaria • Centro"
    },
    {
      id: "pad-ribeiro",
      name: "Panificação Ribeiro",
      category: "Mercados & Padarias",
      catSlug: "alimentacao",
      avatar: "🥖",
      sponsored: false,
      description: "Panificação na Avenida Samambaia.",
      address: "Av. Samambaia",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Panifica%C3%A7%C3%A3o%20Ribeiro%2C%20Av.%20Samambaia%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Padaria"
    },
    {
      id: "conf-cake-house",
      name: "Cake House",
      category: "Mercados & Padarias",
      catSlug: "alimentacao",
      avatar: "🧁",
      sponsored: false,
      description: "Confeitaria com grande variedade de tortas, em ambiente climatizado.",
      address: "R. Pedro Alves de Menezes, 265",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Cake%20House%2C%20R.%20Pedro%20Alves%20de%20Menezes%2C%20265%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Tortas • Climatizado"
    },
    {
      id: "conf-bombocado",
      name: "Bombocado Doces e Salgados",
      category: "Mercados & Padarias",
      catSlug: "alimentacao",
      avatar: "🧁",
      sponsored: false,
      description: "Doces e salgados no Centro da cidade.",
      address: "R. Riachão, 1046 — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bombocado%20Doces%20e%20Salgados%2C%20R.%20Riach%C3%A3o%2C%201046%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Doces & salgados"
    },
    {
      id: "lanch-disneylandia",
      name: "Lanchonete Disneylândia",
      category: "Restaurantes & Lanches",
      catSlug: "restaurantes",
      avatar: "🍔",
      sponsored: false,
      description: "Tradição e destaque local em lanches, no Centro.",
      address: "Tv. Enéas Amado, 412 — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Lanchonete%20Disneyl%C3%A2ndia%2C%20Tv.%20En%C3%A9as%20Amado%2C%20412%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Tradição em lanches"
    },
    {
      id: "lanch-big-delicias",
      rev: 2,
      name: "Big Delícias",
      category: "Restaurantes & Lanches",
      catSlug: "restaurantes",
      avatar: "🍔",
      sponsored: false,
      description: "Bastante frequentada para lanches em família, tortas e doces.",
      address: "Av. 7 de Junho, 639 — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Big%20Del%C3%ADcias%2C%20Av.%207%20de%20Junho%2C%20639%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Ambiente familiar"
    },
    {
      id: "acai-top-no-ponto",
      name: "Açaí Top no Ponto",
      category: "Restaurantes & Lanches",
      catSlug: "restaurantes",
      avatar: "🍦",
      sponsored: false,
      description: "Especializado em açaí e sorvetes.",
      address: "Tv. Efrem Menezes, 36 — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=A%C3%A7a%C3%AD%20Top%20no%20Ponto%2C%20Tv.%20Efrem%20Menezes%2C%2036%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Açaí • Sorvetes"
    },
    {
      id: "acai-mr-shake",
      name: "Mr. Shake",
      category: "Restaurantes & Lanches",
      catSlug: "restaurantes",
      avatar: "🍦",
      sponsored: false,
      description: "Açaí, milkshakes e sobremesas.",
      address: "Av. 7 de Junho — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Mr.%20Shake%2C%20Av.%207%20de%20Junho%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Açaí • Milkshake"
    },
    {
      id: "lanch-jean",
      name: "Jean Lanches",
      category: "Restaurantes & Lanches",
      catSlug: "restaurantes",
      avatar: "🍔",
      sponsored: false,
      description: "Lanches rápidos e mini pizzas.",
      address: "Av. Dr. José Airton de Andrade",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Jean%20Lanches%2C%20Av.%20Dr.%20Jos%C3%A9%20Airton%20de%20Andrade%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Lanches • Mini pizzas"
    },
    {
      id: "lanch-mix",
      name: "Mix Lanches Tobias",
      category: "Restaurantes & Lanches",
      catSlug: "restaurantes",
      avatar: "🍔",
      sponsored: false,
      description: "Lanchonete no bairro Santa Rita.",
      address: "R. Tiago de Góis — Santa Rita",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Mix%20Lanches%20Tobias%2C%20R.%20Tiago%20de%20G%C3%B3is%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Lanches"
    },
    {
      id: "pizza-rei",
      name: "O Rei da Pizza",
      category: "Restaurantes & Lanches",
      catSlug: "restaurantes",
      avatar: "🍕",
      sponsored: false,
      description: "Pizzas de massa fina e crocante.",
      address: "R. Severiano Cardoso, 932 — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=O%20Rei%20da%20Pizza%2C%20R.%20Severiano%20Cardoso%2C%20932%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Massa fina"
    },
    {
      id: "pizza-dallas",
      name: "Dallas Pizza",
      category: "Restaurantes & Lanches",
      catSlug: "restaurantes",
      avatar: "🍕",
      sponsored: false,
      description: "Pizzas artesanais no Centro.",
      address: "R. João Hermenegildo Ramos, 514 — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Dallas%20Pizza%2C%20R.%20Jo%C3%A3o%20Hermenegildo%20Ramos%2C%20514%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Pizza artesanal"
    },
    {
      id: "pub-richards",
      name: "Richard's Pub & Pizza",
      category: "Restaurantes & Lanches",
      catSlug: "restaurantes",
      avatar: "🍕",
      sponsored: false,
      description: "Pizzaria e massas, com música ao vivo.",
      address: "Av. Aloísio C. Neves — Campos",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Richard%27s%20Pub%20%26%20Pizza%2C%20Av.%20Alo%C3%ADsio%20C.%20Neves%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Música ao vivo"
    },
    {
      id: "banco-bb",
      name: "Banco do Brasil",
      category: "Bancos",
      catSlug: "bancos",
      avatar: "🏦",
      sponsored: false,
      description: "Agência 775, na praça central da cidade.",
      address: "Praça Dom José Tomaz, 222 — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Banco%20do%20Brasil%2C%20Pra%C3%A7a%20Dom%20Jos%C3%A9%20Tomaz%2C%20222%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de atendimento",
      phone: "",
      status: "Agência 775"
    },
    {
      id: "banco-caixa",
      name: "Caixa Econômica Federal",
      category: "Bancos",
      catSlug: "bancos",
      avatar: "🏦",
      sponsored: false,
      description: "Agência da Caixa no Centro de Tobias Barreto.",
      address: "Av. 7 de Junho, 595 — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Caixa%20Econ%C3%B4mica%20Federal%2C%20Av.%207%20de%20Junho%2C%20595%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de atendimento",
      phone: "",
      status: "Agência • Centro"
    },
    {
      id: "banco-bnb",
      name: "Banco do Nordeste",
      category: "Bancos",
      catSlug: "bancos",
      avatar: "🏦",
      sponsored: false,
      description: "Agência no Edifício Epifânio da Fonseca, no Centro.",
      address: "Av. 7 de Junho, 618 — Centro (Ed. Epifânio da Fonseca)",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Banco%20do%20Nordeste%2C%20Av.%207%20de%20Junho%2C%20618%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de atendimento",
      phone: "",
      status: "Agência • Centro"
    },
    {
      id: "banco-bradesco",
      name: "Banco Bradesco",
      category: "Bancos",
      catSlug: "bancos",
      avatar: "🏦",
      sponsored: false,
      description: "Agência do Bradesco no Centro.",
      address: "Largo João de Andrade Garcez, 1028 — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Banco%20Bradesco%2C%20Largo%20Jo%C3%A3o%20de%20Andrade%20Garcez%2C%201028%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de atendimento",
      phone: "",
      status: "Agência • Centro"
    },
    {
      id: "edu-ensc",
      name: "ENSC",
      category: "Educação",
      catSlug: "educacao",
      avatar: "🎓",
      sponsored: false,
      description: "Escola com proposta pedagógica humanizada e ensino ativo.",
      address: "R. Manoel O. César",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=ENSC%2C%20R.%20Manoel%20O.%20C%C3%A9sar%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Ensino ativo"
    },
    {
      id: "edu-senac",
      name: "Senac Tobias Barreto",
      category: "Educação",
      catSlug: "educacao",
      avatar: "🎓",
      sponsored: false,
      description: "Cursos profissionalizantes voltados ao comércio local.",
      address: "Praça Abelardo Barreto do Rosário — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Senac%20Tobias%20Barreto%2C%20Pra%C3%A7a%20Abelardo%20Barreto%20do%20Ros%C3%A1rio%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Cursos profissionalizantes"
    },
    {
      id: "loja-magalu",
      name: "Magazine Luiza",
      category: "Lojas & Varejo",
      catSlug: "lojas",
      avatar: "🛍️",
      sponsored: false,
      description: "Loja de departamentos: eletrodomésticos, móveis e utilidades.",
      address: "Av. 7 de Junho, 647 — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Magazine%20Luiza%2C%20Av.%207%20de%20Junho%2C%20647%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Eletro • Móveis"
    },
    {
      id: "loja-mamasom",
      name: "Mamasom",
      category: "Lojas & Varejo",
      catSlug: "lojas",
      avatar: "📺",
      sponsored: false,
      description: "Som automotivo e eletrônicos.",
      address: "Av. Getúlio Vargas, 171 — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Mamasom%2C%20Av.%20Get%C3%BAlio%20Vargas%2C%20171%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Som automotivo"
    },
    {
      id: "veic-total-motos",
      name: "Total Motos",
      category: "Veículos & Oficinas",
      catSlug: "veiculos",
      avatar: "🏍️",
      sponsored: false,
      description: "Peças e acessórios para motos, no atacado e no varejo.",
      address: "BR-349 — Bela Vista",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Total%20Motos%2C%20BR-349%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Peças • Atacado e varejo"
    },
    {
      id: "veic-honda-nordeste",
      name: "Honda Nordeste Motos",
      category: "Veículos & Oficinas",
      catSlug: "veiculos",
      avatar: "🏍️",
      sponsored: false,
      description: "Concessionária oficial Honda.",
      address: "Av. Pref. Dr. José Airton de Andrade, 1351 — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Honda%20Nordeste%20Motos%2C%20Av.%20Pref.%20Dr.%20Jos%C3%A9%20Airton%20de%20Andrade%2C%201351%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Concessionária Honda"
    },
    {
      id: "veic-js-motos",
      name: "JS Automóveis - Motos",
      category: "Veículos & Oficinas",
      catSlug: "veiculos",
      avatar: "🏍️",
      sponsored: false,
      description: "Motos Honda novas e seminovas: compra, venda e financiamento.",
      address: "Av. Dr. Airton de Andrade, 1319 — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=JS%20Autom%C3%B3veis%20-%20Motos%2C%20Av.%20Dr.%20Airton%20de%20Andrade%2C%201319%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Novas e seminovas"
    },
    {
      id: "veic-circuito-motos",
      name: "Circuito Motos",
      category: "Veículos & Oficinas",
      catSlug: "veiculos",
      avatar: "🏍️",
      sponsored: false,
      description: "Revenda de motos no Centro.",
      address: "R. Riachão, 1089 — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Circuito%20Motos%2C%20R.%20Riach%C3%A3o%2C%201089%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Revenda de motos"
    },
    {
      id: "veic-jr-multimarcas",
      name: "Jr Multimarcas",
      category: "Veículos & Oficinas",
      catSlug: "veiculos",
      avatar: "🚗",
      sponsored: false,
      description: "Revenda multimarcas de carros.",
      address: "Rod. Dep. João Valeriano dos Santos",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Jr%20Multimarcas%2C%20Rod.%20Dep.%20Jo%C3%A3o%20Valeriano%20dos%20Santos%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Multimarcas"
    },
    {
      id: "veic-nsa",
      name: "NSA Automóveis",
      category: "Veículos & Oficinas",
      catSlug: "veiculos",
      avatar: "🚗",
      sponsored: false,
      description: "Revenda de veículos novos e usados.",
      address: "R. Cuba — Agripino 1",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=NSA%20Autom%C3%B3veis%2C%20R.%20Cuba%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Novos e usados"
    },
    {
      id: "veic-file",
      name: "File Veículos",
      category: "Veículos & Oficinas",
      catSlug: "veiculos",
      avatar: "🚗",
      sponsored: false,
      description: "Revenda de veículos no Centro.",
      address: "R. Riachão, 1047 — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=File%20Ve%C3%ADculos%2C%20R.%20Riach%C3%A3o%2C%201047%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Revenda de veículos"
    },
    {
      id: "veic-mega-tron",
      name: "Mega Tron Auto Center Car",
      category: "Veículos & Oficinas",
      catSlug: "veiculos",
      avatar: "🔧",
      sponsored: false,
      description: "Autocenter e mecânica.",
      address: "BR-349, 1293 — Vicentino",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Mega%20Tron%20Auto%20Center%20Car%2C%20BR-349%2C%201293%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Autocenter"
    },
    {
      id: "veic-ze-mago",
      name: "Oficina Zé Mago",
      category: "Veículos & Oficinas",
      catSlug: "veiculos",
      avatar: "🔧",
      sponsored: false,
      description: "Oficina de autoelétrica.",
      address: "R. Venâncio Ramos, 1287 — Castelo Branco",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Oficina%20Z%C3%A9%20Mago%2C%20R.%20Ven%C3%A2ncio%20Ramos%2C%201287%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "Autoelétrica"
    },
    // ---- 3ª leva (28/10/2026): saúde, odontologia, confeitaria e OAB (lista da redação;
    // ---- fontes: perfis oficiais, saude.se.gov.br, agendarconsulta.com e sites próprios).
    {
      id: "saude-upa-sao-vicente",
      priority: 10,
      name: "UPA São Vicente de Paulo",
      category: "Saúde & Farmácias",
      catSlug: "saude",
      avatar: "🏥",
      sponsored: false,
      description: "Unidade de Pronto Atendimento: principal porta de entrada para urgência e emergência na região. Em transição para Hospital de Pequeno Porte (HPP), com reativação do centro cirúrgico e novos leitos.",
      address: "Av. João Alves Filho, s/n (ou R. Francisco Barreto de Menezes) — Vicentino/Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=UPA%20S%C3%A3o%20Vicente%20de%20Paulo%2C%20Av.%20Jo%C3%A3o%20Alves%20Filho%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Aberta 24 horas • Urgência e emergência",
      phone: "",
      landline: "557932266389",
      status: "Urgência 24h"
    },
    {
      id: "saude-neoclin",
      name: "Neoclin Centro Médico",
      category: "Saúde & Farmácias",
      catSlug: "saude",
      avatar: "🩺",
      sponsored: false,
      description: "Consultas em pediatria especializada (NeoClin Kids), exames de imagem — raio-X, tomografia, mamografia e ultrassom — e laboratório.",
      address: "Av. Gumercindo Bessa, 369",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Neoclin%20Centro%20M%C3%A9dico%2C%20Av.%20Gumercindo%20Bessa%2C%20369%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de atendimento",
      phone: "5579999150080",
      instagram: "clinica_neoclin",
      status: "Exames de imagem • Laboratório"
    },
    {
      id: "saude-imperatriz-campos",
      name: "Centro Médico Imperatriz dos Campos",
      category: "Saúde & Farmácias",
      catSlug: "saude",
      avatar: "🩺",
      sponsored: false,
      description: "Atendimento em diversas especialidades, como gastroenterologia, além de exames clínicos.",
      address: "Tobias Barreto - SE (veja no mapa)",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Centro%20M%C3%A9dico%20Imperatriz%20dos%20Campos%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de atendimento",
      phone: "5579999808002",
      instagram: "centroimperatriz",
      status: "Especialidades • Exames"
    },
    {
      id: "saude-lucia-freire",
      name: "Clínica Lúcia Freire",
      category: "Saúde & Farmácias",
      catSlug: "saude",
      avatar: "🩺",
      sponsored: false,
      description: "Consultas com clínico geral, pediatra, ginecologista, psiquiatra e cardiologista.",
      address: "Av. Duque de Caxias, 514 — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Cl%C3%ADnica%20L%C3%BAcia%20Freire%2C%20Av.%20Duque%20de%20Caxias%2C%20514%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de atendimento",
      phone: "",
      landline: "557935411717",
      status: "Clínico geral • Especialistas"
    },
    {
      id: "odonto-odontobias",
      name: "Odontobias Clínica Odontológica",
      category: "Saúde & Farmácias",
      catSlug: "saude",
      avatar: "🦷",
      sponsored: false,
      description: "Clínica geral, implantes, próteses, canal, ortodontia e estética facial.",
      address: "Av. 7 de Junho, 428 — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Odontobias%2C%20Av.%207%20de%20Junho%2C%20428%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de atendimento",
      phone: "5579999675286",
      instagram: "odontobias",
      status: "Implantes • Ortodontia"
    },
    {
      id: "odonto-oral-saude",
      name: "Oral Saúde Odontologia",
      category: "Saúde & Farmácias",
      catSlug: "saude",
      avatar: "🦷",
      sponsored: false,
      description: "Implantes sem cortes, lentes de contato em resina, harmonização orofacial e estética dental.",
      address: "Tobias Barreto - SE (veja no mapa)",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Oral%20Sa%C3%BAde%20Odontologia%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de atendimento",
      phone: "",
      instagram: "clinicaoralsaude_",
      status: "Estética dental"
    },
    {
      id: "odonto-idb",
      name: "IDB Odontologia",
      category: "Saúde & Farmácias",
      catSlug: "saude",
      avatar: "🦷",
      sponsored: false,
      description: "Clínica tradicional, há mais de 20 anos na cidade, com foco em reabilitação oral e ortodontia.",
      address: "Tobias Barreto - SE (veja no mapa)",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=IDB%20Odontologia%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de atendimento",
      phone: "",
      website: "https://idbodontologia.com.br/",
      status: "+20 anos na cidade"
    },
    {
      id: "odonto-clean",
      name: "Consultório Clean Odonto",
      category: "Saúde & Farmácias",
      catSlug: "saude",
      avatar: "🦷",
      sponsored: false,
      description: "Atendimento clínico odontológico geral.",
      address: "Praça Cel. Luiz Antônio, 69 — Centro",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Clean%20Odonto%2C%20Pra%C3%A7a%20Coronel%20Luiz%20Ant%C3%B4nio%2C%2069%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de atendimento",
      phone: "",
      status: "Clínica geral"
    },
    {
      id: "conf-caseria",
      name: "Caseria Confeitaria Artesanal",
      category: "Mercados & Padarias",
      catSlug: "alimentacao",
      avatar: "🧁",
      sponsored: false,
      description: "Doces artesanais, tortas em fatias e sanduíches gourmet.",
      address: "R. Filadelfo Santos Lima, 145 — Castelo Branco",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Caseria%20Confeitaria%2C%20R.%20Filadelfo%20Santos%20Lima%2C%20145%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de atendimento",
      phone: "",
      instagram: "caseria.confeitaria",
      status: "Doces artesanais"
    },
    {
      id: "prof-oab-sudoeste",
      name: "OAB-SE • Subseção Regional Sudoeste",
      category: "Profissionais Liberais",
      catSlug: "profissionais",
      avatar: "⚖️",
      sponsored: false,
      description: "Representação institucional da advocacia de Tobias Barreto e região, presidida pela Dra. Keitiane Barbosa. Para encontrar advogados com inscrição ativa (previdenciário, trabalhista, civil e família), consulte a OAB-SE ou o Jusbrasil.",
      address: "Tobias Barreto - SE (veja no mapa)",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=OAB%20Subse%C3%A7%C3%A3o%20Tobias%20Barreto%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de atendimento",
      phone: "",
      website: "https://www.jusbrasil.com.br/advogados/se-tobias-barreto/",
      status: "Advocacia regional"
    },
    // ---- 4ª leva (28/10/2026): salões de beleza e estética (lista da redação; telefones
    // ---- e horários conforme Google Maps em 28/10/2026 — confirmar com cada salão).
    {
      id: "bel-thalia-souza",
      name: "Thalia Souza Beauty Center",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💇",
      sponsored: false,
      description: "Salão de beleza em Tobias Barreto, há mais de 7 anos no mercado.",
      address: "Tobias Barreto - SE (veja no mapa)",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Thalia%20Souza%20Beauty%20Center%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Abre às 09h",
      phone: "5579998049963",
      status: "+7 anos no mercado"
    },
    {
      id: "bel-joana-barbosa",
      name: "Studio Hair Joana Barbosa",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💇",
      sponsored: false,
      description: "Salão de beleza em Tobias Barreto.",
      address: "Tobias Barreto - SE (veja no mapa)",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Studio%20Hair%20Joana%20Barbosa%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Atende até as 19h",
      phone: "5579999958788",
      status: "Salão"
    },
    {
      id: "bel-tay-santana",
      name: "Salão Tay Santana",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💇",
      sponsored: false,
      description: "Cabeleireiro em Tobias Barreto, há mais de 10 anos no mercado. Atendimento no local.",
      address: "Tobias Barreto - SE (veja no mapa)",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sal%C3%A3o%20Tay%20Santana%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Atende até as 20h",
      phone: "5579999906975",
      status: "Atendimento no local • +10 anos"
    },
    {
      id: "bel-cassia-santos",
      name: "Salão de Beleza Cassia Santos",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💇",
      sponsored: false,
      description: "Salão de beleza em Tobias Barreto, há mais de 3 anos no mercado.",
      address: "Tobias Barreto - SE (veja no mapa)",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sal%C3%A3o%20de%20Beleza%20Cassia%20Santos%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Atende até as 20h",
      phone: "5579998411230",
      status: "+3 anos no mercado"
    },
    {
      id: "bel-beleza-pura",
      name: "Espaço Beleza Pura (Salão de Guilma)",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💇",
      sponsored: false,
      description: "Cabeleireiro em Tobias Barreto, há mais de 10 anos no mercado.",
      address: "Tobias Barreto - SE (veja no mapa)",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Espa%C3%A7o%20Beleza%20Pura%20%28Sal%C3%A3o%20de%20Guilma%29%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Abre às 08h",
      phone: "5579998259276",
      status: "+10 anos no mercado"
    },
    {
      id: "bel-centro-de-beleza",
      name: "Centro De Beleza",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💇",
      sponsored: false,
      description: "Salão de beleza em Tobias Barreto, há mais de 10 anos no mercado.",
      address: "Tobias Barreto - SE (veja no mapa)",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Centro%20De%20Beleza%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "+10 anos no mercado"
    },
    {
      id: "bel-ithana",
      name: "Salão Ithana Fashion Hair",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💇",
      sponsored: false,
      description: "Salão de beleza em Tobias Barreto, há mais de 10 anos no mercado.",
      address: "Tobias Barreto - SE (veja no mapa)",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sal%C3%A3o%20Ithana%20Fashion%20Hair%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Abre às 09h",
      phone: "5579998998569",
      status: "+10 anos no mercado"
    },
    {
      id: "bel-ane-santana",
      name: "Studio Ane Santana",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💇",
      sponsored: false,
      description: "Salão de beleza em Tobias Barreto, há mais de 7 anos no mercado.",
      address: "Tobias Barreto - SE (veja no mapa)",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Studio%20Ane%20Santana%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "",
      status: "+7 anos no mercado"
    },
    {
      id: "bel-sos-hair",
      name: "Salão de Beleza SOS Hair",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💇",
      sponsored: false,
      description: "Salão de beleza em Tobias Barreto, há mais de 7 anos no mercado.",
      address: "Tobias Barreto - SE (veja no mapa)",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sal%C3%A3o%20de%20Beleza%20SOS%20Hair%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Consulte horário de funcionamento",
      phone: "5579999389296",
      status: "+7 anos no mercado"
    },
    {
      id: "bel-wilson",
      name: "Wilson Cabeleireiro",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💇",
      sponsored: false,
      description: "Salão de beleza em Tobias Barreto, há mais de 7 anos no mercado.",
      address: "Tobias Barreto - SE (veja no mapa)",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Wilson%20Cabeleireiro%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Aberto 24 horas",
      phone: "5579998036530",
      status: "+7 anos no mercado"
    },
    {
      id: "bel-bendita-beleza",
      name: "Bendita Beleza",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💇",
      sponsored: false,
      description: "Salão de beleza em Tobias Barreto, há mais de 7 anos no mercado.",
      address: "Tobias Barreto - SE (veja no mapa)",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bendita%20Beleza%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Abre às 10h",
      phone: "5579999395130",
      status: "+7 anos no mercado"
    },
    {
      id: "bel-dercy",
      name: "Dercy Cabeleireira",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💇",
      sponsored: false,
      description: "Salão de beleza em Tobias Barreto, há mais de 7 anos no mercado.",
      address: "Tobias Barreto - SE (veja no mapa)",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Dercy%20Cabeleireira%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Abre às 09h",
      phone: "5579999629387",
      status: "+7 anos no mercado"
    },
    {
      id: "bel-cabelos-ao-vento",
      name: "Centro de Beleza Cabelos ao Vento",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💇",
      sponsored: false,
      description: "Salão de beleza em Tobias Barreto.",
      address: "Tobias Barreto - SE (veja no mapa)",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Centro%20de%20Beleza%20Cabelos%20ao%20Vento%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Abre às 08h",
      phone: "5579998359097",
      status: "Salão"
    },
    {
      id: "bel-odoro-afro",
      name: "Odoro Afro Hair",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💇",
      sponsored: false,
      description: "Cabeleireiro especializado em cabelos afro em Tobias Barreto, há mais de 5 anos no mercado.",
      address: "Tobias Barreto - SE (veja no mapa)",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Odoro%20Afro%20Hair%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Atende até as 20h",
      phone: "5579988139410",
      status: "+5 anos no mercado"
    },
    {
      id: "bel-daysiane-dantas",
      name: "Daysiane Dantas Studio Beauty",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💇",
      sponsored: false,
      description: "Cabeleireiro em Tobias Barreto.",
      address: "Tobias Barreto - SE (veja no mapa)",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Daysiane%20Dantas%20Studio%20Beauty%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Abre às 08h",
      phone: "5579999746159",
      status: "Cabeleireiro"
    },
    {
      id: "bel-ousadia-da-lu",
      name: "Ousadia da LU",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💇",
      sponsored: false,
      description: "Cabeleireiro em Tobias Barreto. Coloração de cabelo.",
      address: "Tobias Barreto - SE (veja no mapa)",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Ousadia%20da%20LU%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Abre às 08h",
      phone: "5579999255649",
      status: "Coloração de cabelo"
    },
    {
      id: "bel-quezia-rodrigues",
      name: "Quézia Rodrigues - Salão de Beleza",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💇",
      sponsored: false,
      description: "Salão de beleza em Tobias Barreto.",
      address: "Tobias Barreto - SE (veja no mapa)",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Qu%C3%A9zia%20Rodrigues%20-%20Sal%C3%A3o%20de%20Beleza%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Atende até as 19h",
      phone: "5579996499751",
      status: "Salão"
    },
    {
      id: "bel-thay-santos",
      name: "Espaço De Beleza Thay Santos",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💇",
      sponsored: false,
      description: "Salão de beleza em Tobias Barreto, há mais de 7 anos no mercado.",
      address: "Tobias Barreto - SE (veja no mapa)",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Espa%C3%A7o%20De%20Beleza%20Thay%20Santos%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Atende até as 19h",
      phone: "5579998663691",
      status: "+7 anos no mercado"
    },
    {
      id: "bel-renilson",
      name: "Renilson Cabeleireiro",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💇",
      sponsored: false,
      description: "Salão de beleza em Tobias Barreto, há mais de 25 anos no mercado.",
      address: "Tobias Barreto - SE (veja no mapa)",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Renilson%20Cabeleireiro%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Abre às 08h",
      phone: "5579999617643",
      status: "+25 anos no mercado"
    },
    {
      id: "bel-aryadna-gois",
      name: "Aryadna Gois Micropigmentação",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "✨",
      sponsored: false,
      description: "Design de sobrancelhas e micropigmentação em Tobias Barreto.",
      address: "Tobias Barreto - SE (veja no mapa)",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Aryadna%20Gois%20Micropigmenta%C3%A7%C3%A3o%2C%20Tobias%20Barreto%20-%20SE",
      hours: "Atende até as 22h",
      phone: "5579988163038",
      status: "Sobrancelhas"
    },

    // ----------------------------------------------------------------------
    // BARBEARIAS E CHAVEIROS (lista do Google colada em 28/10/2026).
    // Sem notas/comentários do Google. Confirme telefones e horários com cada local.
    // ----------------------------------------------------------------------
    {
      id: "bar-marcio",
      name: "Márcio Cabeleireiro",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💈",
      sponsored: false,
      description: "Barbearia em Tobias Barreto — Praça da Bandeira, 496 — Centro.",
      address: "Praça da Bandeira, 496 — Centro",
      mapsUrl: "https://www.google.com/maps/dir//M%C3%A1rcio+cabeleireiro+-+Pra%C3%A7a+da+bandeira,+496+-+Centro,+Tobias+Barreto+-+SE,+49300-000/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x711b2985a7fb56b:0x91312d42c9cd59cb?sa=X&ved=1t:57443&ictx=111",
      hours: "Abre às 08h30",
      phone: "5579999394597",
      website: "https://marciocabeleireiro.borabarber.com/",
      status: "+7 anos no mercado"
    },
    {
      id: "bar-porao",
      name: "Barbearia Porão",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💈",
      sponsored: false,
      description: "Barbearia em Tobias Barreto — Rua Valeriano Monteiro de Carvalho, nº 185 — Centro.",
      address: "Rua Valeriano Monteiro de Carvalho, nº 185 — Centro",
      mapsUrl: "https://www.google.com/maps/dir//Barbearia+POR%C3%83O+-+Rua+Valeriano+Monteiro+De+Carvalho,+N%C2%BA+185+-+Centro,+Tobias+Barreto+-+SE,+49300-000/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x711b34aa990499f:0xc037dee0702a46d7?sa=X&ved=1t:57443&ictx=111",
      hours: "Abre às 14h",
      status: "+7 anos no mercado"
    },
    {
      id: "bar-joao-hiano",
      name: "João Hiano Barbearia",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💈",
      sponsored: false,
      description: "Barbearia em Tobias Barreto — Av. José David dos Santos, nº 2156 — Centro.",
      address: "Av. José David dos Santos, nº 2156 — Centro",
      mapsUrl: "https://www.google.com/maps/dir//Jo%C3%A3o+Hiano+Barbearia,+do+Santos+-+Av.+Jos%C3%A9+David+dos+Santos,+n%C2%B0+2156+-+Centro,+Tobias+Barreto+-+SE,+49300-000/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x711b38266227b27:0xb6d2211767cc36d8?sa=X&ved=1t:57443&ictx=111",
      hours: "Abre às 08h",
      phone: "5579996313026",
      status: "+5 anos no mercado"
    },
    {
      id: "bar-santana",
      name: "Barbearia Santana",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💈",
      sponsored: false,
      description: "Barbearia em Tobias Barreto — R. Severiano Cardoso, 1079.",
      address: "R. Severiano Cardoso, 1079",
      mapsUrl: "https://www.google.com/maps/dir//Barbearia+Santana+-+R.+Severiano+Cardoso,+1079+-+Tobias+Barreto,+SE,+49300-000/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x711b3003644b6af:0xb158aff1c143e749?sa=X&ved=1t:57443&ictx=111",
      hours: "Abre às 08h30",
      phone: "5579999380071",
      status: "Atendimento no local"
    },
    {
      id: "bar-paulo",
      name: "Barbearia do Paulo",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💈",
      sponsored: false,
      description: "Barbearia em Tobias Barreto — Av. João Alves Filho, 419 — Centro.",
      address: "Av. João Alves Filho, 419 — Centro",
      mapsUrl: "https://www.google.com/maps/dir//BARBEARIA+DO+PAULO+-+Av.+Jo%C3%A3o+Alves+Filho,+419+-+Centro,+Tobias+Barreto+-+SE,+49300-000/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x711b35bb9c08b31:0xc7608b27a84ce198?sa=X&ved=1t:57443&ictx=111",
      hours: "Abre às 09h",
      phone: "5579996822882",
      status: "+10 anos no mercado"
    },
    {
      id: "bar-naminha",
      name: "Naminha Barbearia",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💈",
      sponsored: false,
      description: "Barbearia em Tobias Barreto - SE.",
      address: "Tobias Barreto - SE (veja no mapa)",
      mapsUrl: "https://www.google.com/maps/dir//Naminha+barbearia+-+Tobias+Barreto,+SE,+49300-000/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x711b300223c520f:0x4b56bbf28f46b619?sa=X&ved=1t:57443&ictx=111",
      hours: "Abre às 08h30",
      phone: "5579998565278",
      status: "Barbearia"
    },
    {
      id: "bar-leo",
      name: "Barbearia do Léo",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💈",
      sponsored: false,
      description: "Barbearia em Tobias Barreto — Av. João Alves Filho, 785 — Centro.",
      address: "Av. João Alves Filho, 785 — Centro",
      mapsUrl: "https://www.google.com/maps/dir//Barbearia+Do+L%C3%A9o+-+Av.+Jo%C3%A3o+Alves+Filho,+785+-+Centro,+Tobias+Barreto+-+SE,+49300-000/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x711b38bac17a12d:0xfbbd77b87ef7cf3d?sa=X&ved=1t:57443&ictx=111",
      hours: "Abre às 09h",
      phone: "5579998914401",
      website: "http://www.facebook.com/barbeariadoleo",
      status: "+7 anos no mercado"
    },
    {
      id: "bar-ds",
      name: "DS Barbearia",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💈",
      sponsored: false,
      description: "Barbearia em Tobias Barreto — Tv. J M do Nascimento, 44 — Centro.",
      address: "Tv. J M do Nascimento, 44 — Centro",
      mapsUrl: "https://www.google.com/maps/dir//DS+Barbearia+%F0%9F%92%88+-+Tv.+J+M+do+Nascimento,+44+-+Centro,+Tobias+Barreto+-+SE,+49300-000/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x711b3002cd3e9c9:0x199170d2b6aa4ec3?sa=X&ved=1t:57443&ictx=111",
      hours: "Abre às 08h",
      phone: "5579996627079",
      status: "+5 anos no mercado"
    },
    {
      id: "bar-nego",
      name: "Barbearia Nego",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💈",
      sponsored: false,
      description: "Barbearia em Tobias Barreto — Tv. Maria Rosa, 257 — Vicentino.",
      address: "Tv. Maria Rosa, 257 — Vicentino",
      mapsUrl: "https://www.google.com/maps/dir//Barbearia+Nego+-+Tv.+Maria+Rosa,+257+-+Vicentino,+Tobias+Barreto+-+SE,+49300-000/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x711b32fbef3c93f:0x598482e9f1a81985?sa=X&ved=1t:57443&ictx=111",
      hours: "Aberto 24 horas",
      status: "+3 anos no mercado"
    },
    {
      id: "bar-estilo-urbano",
      name: "Barbearia Estilo Urbano",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💈",
      sponsored: false,
      description: "Barbearia em Tobias Barreto — R. Heitor Câmara Martins, 109.",
      address: "R. Heitor Câmara Martins, 109",
      mapsUrl: "https://www.google.com/maps/dir//BARBEARIA+ESTILO+URBANO+-+R.+Heitor+C%C3%A2mara+Martins,+109+-+Tobias+Barreto,+SE,+49300-000/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x711b300547fe529:0x59b5deb4b2b6bdda?sa=X&ved=1t:57443&ictx=111",
      phone: "5579988084420",
      status: "Barbearia"
    },
    {
      id: "bar-do-si",
      name: "Barbearia do Si",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💈",
      sponsored: false,
      description: "Barbearia em Tobias Barreto — R. Geni Cardoso dos Santos, 739 — Pinheiro.",
      address: "R. Geni Cardoso dos Santos, 739 — Pinheiro",
      mapsUrl: "https://www.google.com/maps/dir//Barbearia+do+Si+-+R.+Geni+Cardoso+Dos+Santos,+739+-+Pinheiro,+Tobias+Barreto+-+SE,+49300-000/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x711b3a884af97f9:0x3818a4879ec43e0c?sa=X&ved=1t:57443&ictx=111",
      status: "+3 anos no mercado"
    },
    {
      id: "bar-paulo-2",
      name: "Barbearia do Paulo (Santa Rita)",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💈",
      sponsored: false,
      description: "Barbearia em Tobias Barreto — Av. João Alves Filho, 419 — Santa Rita.",
      address: "Av. João Alves Filho, 419 — Santa Rita",
      mapsUrl: "https://www.google.com/maps/dir//BARBEARIA+DO+PAULO+-+Av.+Jo%C3%A3o+Alves+Filho,+419+-+Santa+Rita,+Tobias+Barreto+-+SE,+49300-000/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x711b2975d5c60c3:0x47cb4b852a7688dc?sa=X&ved=1t:57443&ictx=111",
      hours: "Abre às 09h",
      phone: "5579998340832",
      status: "+7 anos no mercado"
    },
    {
      id: "bar-bahia-do-corte",
      name: "Bahia do Corte",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💈",
      sponsored: false,
      description: "Barbearia em Tobias Barreto — R. José Jeremias — Centro.",
      address: "R. José Jeremias — Centro",
      mapsUrl: "https://www.google.com/maps/dir//Bahia+Do+Corte+-+R.+Jos%C3%A9+Jeremias+-+Centro,+Tobias+Barreto+-+SE,+49300-000/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x711b360b680ec09:0x7a9465bac0736a0c?sa=X&ved=1t:57443&ictx=111",
      hours: "Abre às 09h30",
      phone: "5579996099415",
      website: "http://wa.me/5579999184362",
      status: "Barbearia"
    },
    {
      id: "bar-seven",
      name: "Barbearia Seven",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💈",
      sponsored: false,
      description: "Barbearia em Tobias Barreto — Tv. José Alves de Souza.",
      address: "Tv. José Alves de Souza",
      mapsUrl: "https://www.google.com/maps/dir//Barbearia+Seven+-+Tv.+Jos%C3%A9+Alves+de+Souza+-+Tobias+Barreto,+SE,+49300-000/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x711b3521b089e0d:0x6747e5bdbd260974?sa=X&ved=1t:57443&ictx=111",
      hours: "Abre às 09h",
      phone: "5579996815122",
      status: "Barbearia"
    },
    {
      id: "bar-garcia",
      name: "Garcia Barber",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💈",
      sponsored: false,
      description: "Barbearia em Tobias Barreto — Av. Leandro Maciel.",
      address: "Av. Leandro Maciel",
      mapsUrl: "https://www.google.com/maps/dir//Garcia+barber+-+Av.+Leandro+Maciel+-+Tobias+Barreto,+SE,+49300-000/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x711b3007b1aa2c1:0xb2c92be4ad50a6d7?sa=X&ved=1t:57443&ictx=111",
      hours: "Abre às 09h",
      instagram: "garciabarber.tobiasbarreto",
      status: "Barbearia"
    },
    {
      id: "bar-los-primos",
      name: "Barbearia Los Primos",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💈",
      sponsored: false,
      description: "Barbearia em Tobias Barreto — R. Carlos Lemos, 469 — Santa Rita.",
      address: "R. Carlos Lemos, 469 — Santa Rita",
      mapsUrl: "https://www.google.com/maps/dir//BARBEARIA+LOS+PRIMOS+-+R.+Carlos+Lemos,+469+-+Santa+Rita,+Tobias+Barreto+-+SE,+49300-000/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x711b2976a54f16b:0x692e22931915e8e7?sa=X&ved=1t:57443&ictx=111",
      status: "Barbearia"
    },
    {
      id: "bar-imperio",
      name: "Barbearia Império",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💈",
      sponsored: false,
      description: "Barbearia em Tobias Barreto — Av. José David dos Santos.",
      address: "Av. José David dos Santos",
      mapsUrl: "https://www.google.com/maps/dir//Barbearia+imp%C3%A9rio+-+Av.+Jos%C3%A9+David+dos+Santos+-+Tobias+Barreto,+SE,+49300-000/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x711b3d52b977adb:0xbe08e2aafec0037e?sa=X&ved=1t:57443&ictx=111",
      hours: "Abre às 08h20",
      status: "+3 anos no mercado"
    },
    {
      id: "bar-the-moises",
      name: "Barbearia The Moises",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💈",
      sponsored: false,
      description: "Barbearia em Tobias Barreto — R. Epifânio Dora, 479 — Centro.",
      address: "R. Epifânio Dora, 479 — Centro",
      mapsUrl: "https://www.google.com/maps/dir//BARBEARIA+THE+MOISES+-+R.+Epif%C3%A2nio+Dora,+479+-+Centro,+Tobias+Barreto+-+SE,+49300-000/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x711b2977c4d54cb:0x9692fee48a99e9?sa=X&ved=1t:57443&ictx=111",
      status: "Barbearia"
    },
    {
      id: "bar-merican",
      name: "Merican Barber",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💈",
      sponsored: false,
      description: "Barbearia em Tobias Barreto — R. João Olegário de Matos.",
      address: "R. João Olegário de Matos",
      mapsUrl: "https://www.google.com/maps/dir//Merican+barber+-+R.+Jo%C3%A3o+Oleg%C3%A1rio+de+Matos+-+Tobias+Barreto,+SE,+49300-000/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x711b3005be9b1a3:0x4ddaa246ce1d733?sa=X&ved=1t:57443&ictx=111",
      status: "Barbearia"
    },
    {
      id: "bar-cleves",
      name: "Cleves Barbearia",
      category: "Beleza & Estética",
      catSlug: "beleza",
      avatar: "💈",
      sponsored: false,
      description: "Barbearia em Tobias Barreto - SE.",
      address: "Tobias Barreto - SE (veja no mapa)",
      status: "Barbearia"
    },
    {
      id: "chav-andrade",
      name: "Chaveiro Andrade 24 horas",
      category: "Chaveiros & Reparos",
      catSlug: "reparos",
      avatar: "🔑",
      sponsored: false,
      description: "Chaveiro 24 horas com atendimento a domicílio.",
      address: "Atendimento a domicílio",
      hours: "Aberto 24 horas",
      phone: "5571996605340",
      website: "https://wa.link/lwkdzi",
      status: "+3 anos no mercado"
    },
    {
      id: "chav-x-chaveiro",
      name: "X Chaveiro 24 horas",
      category: "Chaveiros & Reparos",
      catSlug: "reparos",
      avatar: "🔑",
      sponsored: false,
      description: "Chaveiro 24 horas com atendimento a domicílio.",
      address: "Atendimento a domicílio",
      hours: "Aberto 24 horas",
      phone: "5571991797082",
      website: "https://wa.me/message/IEFTJNQ2T3FTC1",
      status: "+7 anos no mercado"
    },
    {
      id: "chav-santana-lagarto",
      name: "Chaveiro Santana",
      category: "Chaveiros & Reparos",
      catSlug: "reparos",
      avatar: "🔑",
      sponsored: false,
      description: "Chaveiro de Lagarto - SE.",
      address: "Lagarto - SE",
      hours: "Abre às 08h",
      phone: "5579996769576",
      status: "Chaveiro em Lagarto - SE"
    }
  ],

  // 2. Notícias e Utilidade Pública
  utilityNews: [
    {
      id: "ut-1",
      level: "urgent",
      badge: "⚠️ Aviso de Água e Obras",
      date: "Quinta-feira • 08h às 14h",
      title: "Manutenção na Rede Hidráulica e Recapeamento na Rua das Acácias",
      summary: "A companhia de saneamento substituirá registros antigos entre os números 100 e 450. Recomenda-se reservar água e evitar estacionar na via durante a manhã.",
      source: "Associação de Moradores & Defesa Civil"
    },
    {
      id: "ut-2",
      level: "info",
      badge: "🏥 Saúde da Família",
      date: "Segunda a Sexta • 07h às 19h",
      title: "UBS do Bairro amplia horário para vacinação e entrega de exames",
      summary: "Moradores que trabalham fora agora contam com atendimento estendido entre 17h e 19h para atualização da caderneta infantil, vacina da gripe e retirada de medicamentos.",
      source: "Posto de Saúde Local"
    },
    {
      id: "ut-3",
      level: "warning",
      badge: "🛡️ Segurança Solidária",
      date: "Reunião Mensal • Terça às 19h30",
      title: "Novas câmeras comunitárias entram em operação nas 4 entradas do bairro",
      summary: "O projeto Vizinhança Colaborativa instalou 8 pontos de leitura de placas. Para aderir ao grupo de alerta rápido da sua rua, procure o síndico ou a Associação.",
      source: "Conselho de Segurança do Bairro"
    }
  ],

  essentialSchedules: [
    { id: "tel-upa", service: "🏥 UPA São Vicente de Paulo (24h)", schedule: "(79) 3226-6389" },
    { service: "🚛 Coleta de Lixo Comum", schedule: "Seg, Qua e Sex (a partir das 18h)" },
    { service: "♻️ Coleta Seletiva (Recicláveis)", schedule: "Terças e Quintas (09h às 12h)" },
    { service: "🏥 Posto de Saúde (UBS)", schedule: "Seg a Sex • 07h às 19h" },
    { service: "💡 Iluminação Pública (Troca LED)", schedule: "0800-079-0196 (Protocolo 48h)" },
    { service: "🚓 Ronda Comunitária / Guarda", schedule: "Base Praça Central • 24h" },
    { service: "🏛️ Associação de Moradores", schedule: "Ter e Qui • 18h às 21h" }
  ],

  // 3. Histórias de Moradores (Gente do Bairro + Publieditorial)
  peopleStories: [
    {
      id: "ps-1",
      type: "Tradição do Bairro",
      name: "Dona Lurdes & a Horta Comunitária",
      role: "Professora aposentada • Moradora há 34 anos",
      quote: "“Onde antes tinha entulho, hoje colhemos alface, chás medicinais e amizades.”",
      image: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&w=800&q=80",
      story: "Com a ajuda de 15 voluntários e alunos da escola estadual, Dona Lurdes transformou um terreno baldio na Rua São Pedro em uma horta orgânica aberta a todas as famílias da vizinhança."
    },
    {
      id: "ps-2",
      type: "Talento Local",
      name: "Lucas “Relâmpago” — Da Escolinha da Praça para o Estadual Sub-17",
      role: "Atleta de Futsal • 16 anos",
      quote: "“Cada treino na quadra do bairro me ensinou disciplina e espírito de equipe.”",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
      story: "Artilheiro do campeonato interbairros com 19 gols, Lucas acaba de ganhar bolsa integral de estudos e treina todos os sábados com as crianças do projeto social da praça."
    },
    {
      id: "ps-3",
      type: "✨ Publieditorial • Nova Loja no Bairro",
      name: "Ótica Visão Clara inaugura com laboratório digital em 1 hora",
      role: "Dr. Rafael Mendes & Equipe • Av. Principal, 302",
      quote: "“Trouxemos tecnologia de shopping com preço justo e atendimento de vizinho.”",
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
      story: "Recém-inaugurada no coração do bairro, a Ótica Visão Clara oferece teste de acuidade visual gratuito para estudantes da rede pública e 25% de desconto na primeira armação para leitores da Tobias Magazine."
    }
  ],

  // 4. Achados e Promoções (Cupons Exclusivos)
  promotions: [
    {
      id: "pr-1",
      store: "Padaria Seu Tobias",
      discount: "GANHE +2 PÃES",
      title: "Combo Café da Tarde: Na compra de 1 Bolo de Milho, leve 6 pães de queijo quentinhos",
      code: "TOBIAS14",
      validUntil: "Válido até Domingo",
      phone: "5579999990001"
    },
    {
      id: "pr-2",
      store: "Amigo Fiel Pet Shop",
      discount: "20% OFF + HIDRATAÇÃO",
      title: "Pacote Mensal de Banho & Tosa com hidratação de aveia e busca em casa grátis",
      code: "PETVIZINHO",
      validUntil: "Para novos pacotes nesta quinzena",
      phone: "5579999990004"
    },
    {
      id: "pr-3",
      store: "Pizzaria Forno da Praça",
      discount: "BORDA RECHEADA + REFRI",
      title: "Em qualquer Pizza Família (Terça a Quinta), ganhe borda de catupiry + Guaraná 1,5L",
      code: "PIZZABAIRRO",
      validUntil: "Pedidos diretos no WhatsApp",
      phone: "5579999990009"
    },
    {
      id: "pr-4",
      store: "Ótica Visão Clara",
      discount: "R$ 120 DE BÔNUS",
      title: "Desconto direto em lentes antirreflexo com filtro de luz azul para computador/celular",
      code: "VISAOTOBIAS",
      validUntil: "Apresente este print na loja",
      phone: "5579999990010"
    }
  ],

  // 5. Agenda de Eventos e Lazer
  events: [
    {
      id: "ev-1",
      day: "02",
      month: "SÁB",
      title: "Feira Livre de Orgânicos & Pastel da Praça",
      time: "06h00 às 13h00",
      location: "Praça Central",
      category: "Feira & Gastronomia",
      description: "Mais de 25 bancas de produtores familiares, caldo de cana, tapioca feita na hora e roda de chorinho às 10h."
    },
    {
      id: "ev-2",
      day: "03",
      month: "DOM",
      title: "Quermesse & Bingo Beneficente da Paróquia",
      time: "18h00 às 22h30",
      location: "Pátio da Igreja Matriz",
      category: "Comunidade & Fé",
      description: "Comidas típicas, barraca do milho, pescaria para as crianças e show acústico. Renda revertida para as obras sociais."
    },
    {
      id: "ev-3",
      day: "09",
      month: "SÁB",
      title: "Grande Final da Copa Amadora: Unidos da Vila x Real Tobias FC",
      time: "15h30 (Entrada Franca)",
      location: "Campo da Associação",
      category: "Esporte Amador",
      description: "Preliminar das categorias de base às 14h e transmissão ao vivo pelo Instagram da Tobias Magazine."
    },
    {
      id: "ev-4",
      day: "10",
      month: "DOM",
      title: "Cinema na Praça + Feirinha de Troca de Livros",
      time: "17h30 às 20h30",
      location: "Anfiteatro da Praça",
      category: "Cultura & Família",
      description: "Traga sua cadeira de praia! Exibição de animação nacional ao ar livre com pipoca gratuita para a criançada."
    }
  ],

  // 6. Classificados Locais
  classifieds: [
    {
      id: "cl-1",
      category: "Imóveis • Aluguel Direto",
      badgeColor: "#1f3a60",
      title: "Aluga-se Casa Térrea 2 Quartos com Quintal e Garagem",
      price: "R$ 1.150 / mês",
      details: "Rua tranquila a 200m da padaria. Sem taxa de condomínio, aceita pet. Direto com o proprietário (Sr. Roberto).",
      phone: "5579999990011"
    },
    {
      id: "cl-2",
      category: "Empregos no Bairro",
      badgeColor: "#1b6b53",
      title: "Vaga: Atendente de Balcão e Caixa (Período Tarde/Noite)",
      price: "Salário + Comissão + VT",
      details: "Padaria Seu Tobias contrata morador(a) da região com simpatia e agilidade. Não exige experiência prévia.",
      phone: "5579999990001"
    },
    {
      id: "cl-3",
      category: "Doação Responsável Pet",
      badgeColor: "#d94e1f",
      title: "Doam-se 3 Filhotes de Porte Pequeno/Médio (Já Vermifugados)",
      price: "Adoção Gratuita ❤️",
      details: "Resgatados pela protetora Dona Sônia. Muito dóceis com crianças. Entregamos na sua casa no bairro.",
      phone: "5579999990012"
    },
    {
      id: "cl-4",
      category: "Compra & Venda",
      badgeColor: "#d99b1f",
      title: "Bicicleta Aro 29 Alumínio 21 Marchas Seminova + Capacete",
      price: "R$ 680 (Aceita Pix)",
      details: "Pouco uso, pneus novos, revisada na bicicletaria da avenida. Retirada no Condomínio Jardim das Flores.",
      phone: "5579999990013"
    },
    {
      id: "cl-5",
      category: "Serviços & Aulas",
      badgeColor: "#5b3ea8",
      title: "Reforço Escolar (Matemática, Português e Redação — 1º ao 9º ano)",
      price: "R$ 40 / hora-aula",
      details: "Profª. Mariana (Licenciada pelo IFS). Atendimento individual ou pequenos grupos no bairro.",
      phone: "5579999990014"
    },
    {
      id: "cl-6",
      category: "Imóveis • Venda",
      badgeColor: "#1f3a60",
      title: "Apartamento 3/4 Nascente no Condomínio Solar do Bairro",
      price: "R$ 235.000 (Financia)",
      details: "2º andar, varanda ventilada, área de lazer com piscina e portaria 24h. Documentação 100% pronta.",
      phone: "5579999990015"
    }
  ],

  // 10 Páginas Enxutas da Edição Flipbook (8 a 12 páginas ideais para leitura mobile)
  flipbookPages: [
    {
      pageNumber: 1,
      section: "CAPA • EDIÇÃO QUINZENAL #14",
      title: "TOBIAS MAGAZINE",
      subtitle: "40 Anos de Pão Quente & União no Nosso Bairro",
      highlight: "Nesta edição de 10 páginas: Guia completo de serviços no WhatsApp, alerta de manutenção de água, 4 cupons de desconto e os classificados da quinzena.",
      visualType: "cover"
    },
    {
      pageNumber: 2,
      section: "EDITORIAL & EXPEDIENTE",
      title: "Palavra da Redação: O Bairro na Palma da Mão",
      subtitle: "Por que criamos uma revista enxuta (10 páginas) feita para o seu celular",
      highlight: "Sem textos longos ou cansativos: aqui você encontra o telefone do eletricista de confiança, o horário do posto de saúde e as ofertas dos vizinhos em menos de 3 minutos.",
      visualType: "editorial"
    },
    {
      pageNumber: 3,
      section: "UTILIDADE PÚBLICA & NOTÍCIAS",
      title: "Fique Atento: Água, Saúde e Segurança",
      subtitle: "Avisos oficiais da Associação de Moradores para esta quinzena",
      highlight: "Quinta-feira tem manutenção na Rua das Acácias (08h-14h). Posto de Saúde com vacinação noturna até 19h e 8 novas câmeras comunitárias ativas.",
      visualType: "utility"
    },
    {
      pageNumber: 4,
      section: "GENTE DO BAIRRO • REPORTAGEM DE CAPA",
      title: "Seu Tobias: 4 Décadas Alimentando Gerações",
      subtitle: "Do caderno de fiado ao pedido por WhatsApp em 1 clique",
      highlight: "Entrevista emocionante com Seu Antônio Tobias e sua neta Mariana sobre como o comércio local mantém a identidade e o acolhimento da nossa região.",
      visualType: "coverStory"
    },
    {
      pageNumber: 5,
      section: "GUIA DO COMÉRCIO (PARTE 1)",
      title: "Alimentação, Saúde & Pets Perto de Você",
      subtitle: "Clique no botão do WhatsApp e receba em casa",
      highlight: "Padaria Seu Tobias, Farmácia Vida & Saúde 24h, Mercadinho Bom Vizinho e Amigo Fiel Pet Shop.",
      visualType: "directory1"
    },
    {
      pageNumber: 6,
      section: "GUIA DE PROFISSIONAIS (PARTE 2)",
      title: "Precisou de Reparo ou Serviço de Confiança?",
      subtitle: "Profissionais recomendados pelos próprios moradores",
      highlight: "Chaveiro 24h Mestre Jorge, Carlos Eletricista & Encanador, Camila Manicure e Dra. Helena Advocacia.",
      visualType: "directory2"
    },
    {
      pageNumber: 7,
      section: "PUBLIEDITORIAL & TALENTOS",
      title: "Quem Faz Acontecer na Nossa Vizinhança",
      subtitle: "Horta Comunitária da Dona Lurdes + Nova Ótica Visão Clara",
      highlight: "Conheça a iniciativa verde que revitalizou a Rua São Pedro e a nova ótica com laboratório digital de 1 hora na Avenida Principal.",
      visualType: "people"
    },
    {
      pageNumber: 8,
      section: "AGENDA CULTURAL & ESPORTE AMADOR",
      title: "O Que Fazer Neste Fim de Semana",
      subtitle: "Feira livre, Quermesse da Paróquia, Final de Futebol e Cinema na Praça",
      highlight: "Programação gratuita para toda a família sem precisar sair do bairro.",
      visualType: "events"
    },
    {
      pageNumber: 9,
      section: "ACHADOS & PROMOÇÕES DA QUINZENA",
      title: "Cupons Exclusivos Tobias Magazine",
      subtitle: "Apresente o código no celular e economize no comércio local",
      highlight: "4 ofertas ativas: Pão de queijo em dobro, 20% no Pet Shop, Borda + Refri na Pizzaria e R$ 120 de bônus na Ótica.",
      visualType: "coupons"
    },
    {
      pageNumber: 10,
      section: "CLASSIFICADOS & ANUNCIE CONOSCO",
      title: "Mural do Morador & Kit Vitrine QR Code",
      subtitle: "Imóveis, vagas de emprego, adoção pet e como anunciar na próxima edição",
      highlight: "Quer ver sua loja na Edição #15? Planos a partir de R$ 49/quinzena com distribuição direta nos grupos de WhatsApp e cartaz QR Code.",
      visualType: "backcover"
    }
  ]
};


// ==========================================================================
// ACERVO COMPLETO DE EDIÇÕES (BANCA DIGITAL — 6 EDIÇÕES QUINZENAIS #14 A #19)
// ==========================================================================
window.TOBIAS_DATA.editionsCatalog = [
  {
    id: "ed-14",
    number: "Edição #14 • Ano I",
    shortLabel: "Ed. #14 • 40 Anos Padaria",
    periodicity: "1ª Quinzena • Outubro",
    badge: "Edição Histórica",
    urgentTicker: "ALERTA DE UTILIDADE PÚBLICA: Manutenção preventiva na rede de água da Rua Principal nesta quinta-feira (08h às 14h). Posto de Saúde com vacinação estendida até 19h.",
    quickPulse: [
      { icon: "🚰", meta: "Quinta • 08h às 14h", title: "Manutenção preventiva de água na Rua das Acácias" },
      { icon: "🏥", meta: "Posto de Saúde (UBS)", title: "Vacinação e retirada de exames estendida até as 19h" },
      { icon: "⚽", meta: "Sábado • 15h30", title: "Final da Copa Amadora no Campo da Associação" },
      { icon: "🏷️", meta: "Economia Local", title: "4 Cupons ativos na Padaria, Pet Shop, Pizzaria e Ótica" }
    ],
    coverStory: {
      kicker: "Reportagem de Capa • Gente do Bairro",
      readingTime: "2 min de leitura",
      title: "40 Anos de Pão Quente e Prosa: Como Seu Tobias Transformou a Esquina no Coração do Bairro",
      lead: "Da primeira fornada a lenha em 1986 até os pedidos pelo WhatsApp hoje: conheça a história da padaria que viu três gerações de vizinhos crescerem.",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
      fullText: `
        <p>Quem passa pela Praça Central às 5h30 da manhã já conhece o perfume inconfundível. Há exatos 40 anos, Seu Antônio Tobias abria as portas da primeira padaria artesanal do bairro, quando muitas ruas ainda eram de terra batida.</p>
        <p style="margin-top:12px;"><strong>"Aqui nunca foi só vender pão. A gente guardava a chave do vizinho, anotava recado no caderno de fiado e comemorava cada aprovação de vestibular dos meninos da rua"</strong>, conta Seu Tobias, hoje trabalhando ao lado da neta Mariana, responsável por modernizar o atendimento via WhatsApp.</p>
      `
    }
  },
  {
    id: "ed-15",
    number: "Edição #15 • Ano I",
    shortLabel: "Ed. #15 • Nova Praça & LED",
    periodicity: "2ª Quinzena • Outubro",
    badge: "Obras & Lazer",
    urgentTicker: "UTILIDADE PÚBLICA: Nova iluminação 100% LED concluída em 12 ruas do bairro! Quadra Poliesportiva e Parquinho Infantil serão reinaugurados neste sábado às 16h.",
    quickPulse: [
      { icon: "💡", meta: "Segurança Noturna", title: "140 novas luminárias de LED instaladas nas vias principais" },
      { icon: "🛝", meta: "Sábado • 16h00", title: "Inauguração do Parquinho de Madeira Ecológica na Praça" },
      { icon: "🐕", meta: "Domingo • 09h às 13h", title: "Mutirão de Vacinação Antirrábica Gratuita ao lado da Igreja" },
      { icon: "🥖", meta: "Festival Gastronômico", title: "Rota do Pastel & Caldo de Cana com 8 barracas premiadas" }
    ],
    coverStory: {
      kicker: "Capa • Conquista dos Moradores",
      readingTime: "3 min de leitura",
      title: "Praça Central Renovada: Iluminação em LED, Pista de Caminhada e Novo Espaço para as Famílias",
      lead: "Após abaixo-assinado organizado pela Associação de Moradores, praça ganha academia ao ar livre, área pet cercada e Wi-Fi público gratuito.",
      image: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1200&q=80",
      fullText: `
        <p>A antiga praça escura ficou no passado. Graças à mobilização comunitária e às reuniões mensais da Associação de Moradores, a Praça Central recebeu 32 refletores de LED, piso tátil, bancos novos e uma área exclusiva para cães.</p>
        <p style="margin-top:12px;"><strong>"Antes as famílias voltavam para casa às 18h. Agora temos idosos caminhando às 21h, crianças de patins e as barracas de lanche vendendo o dobro"</strong>, comemora Dona Lurdes, presidente da comissão de obras do bairro.</p>
      `
    }
  },
  {
    id: "ed-16",
    number: "Edição #16 • Ano I",
    shortLabel: "Ed. #16 • Gastronomia Local",
    periodicity: "1ª Quinzena • Novembro",
    badge: "Especial Sabores",
    urgentTicker: "AGENDA DO BAIRRO: 1º Circuito Gastronômico de Rua acontece sexta e sábado na Avenida Principal! Trânsito desviado entre 18h e 23h.",
    quickPulse: [
      { icon: "🍕", meta: "Sexta e Sábado", title: "12 restaurantes e lanchonetes do bairro com pratos a R$ 19,90" },
      { icon: "🎸", meta: "Palco da Praça • 20h", title: "Show acústico com bandas formadas por jovens do bairro" },
      { icon: "♻️", meta: "Coleta Seletiva", title: "Novo ecoponto de óleo de cozinha usado no Mercadinho Bom Vizinho" },
      { icon: "💼", meta: "Emprego Local", title: "Comércio do bairro abre 18 vagas temporárias para o fim de ano" }
    ],
    coverStory: {
      kicker: "Especial Gastronomia • Orgulho da Terra",
      readingTime: "2 min de leitura",
      title: "Do Acarajé da Dona Neide à Pizza Artesanal: Os Sabores que Fazem Nosso Bairro Famoso na Cidade",
      lead: "Mapeamos os 10 quitutes mais pedidos no delivery local e a história das famílias que transformaram receitas de vó em negócios de sucesso.",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
      fullText: `
        <p>Você não precisa atravessar a cidade para comer bem. Nosso bairro reúne desde o tradicional bolinho de feira frito na hora até hambúrguer artesanal na brasa e confeitaria fina para festas.</p>
        <p style="margin-top:12px;">Nesta edição especial da <em>Tobias Magazine</em>, conversamos com Dona Neide (há 22 anos no mesmo ponto da avenida) e com os jovens chefs que criaram o <strong>1º Circuito Gastronômico do Bairro</strong>, movimentando a economia local e gerando empregos para os próprios vizinhos.</p>
      `
    }
  },
  {
    id: "ed-17",
    number: "Edição #17 • Ano I",
    shortLabel: "Ed. #17 • Saúde & Bem-Estar",
    periodicity: "2ª Quinzena • Novembro",
    badge: "Guia da Saúde",
    urgentTicker: "SAÚDE NA COMUNIDADE: Carreta da Saúde estaciona na Praça Central de terça a sexta (08h às 17h) com exames gratuitos de vista, mamografia e odontologia.",
    quickPulse: [
      { icon: "🩺", meta: "Terça a Sexta", title: "150 fichas diárias para check-up gratuito na Carreta da Saúde" },
      { icon: "🏃", meta: "Terças e Quintas • 06h", title: "Grupo de Corrida e Funcional gratuito com Prof. Henrique na Praça" },
      { icon: "🦟", meta: "Combate à Dengue", title: "Agentes de endemias visitam as quadras 04 a 12 nesta semana" },
      { icon: "💊", meta: "Farmácia Popular", title: "Lista atualizada de medicamentos gratuitos com receita do SUS" }
    ],
    coverStory: {
      kicker: "Qualidade de Vida • Terceira Idade Ativa",
      readingTime: "3 min de leitura",
      title: "Grupo “Manhã Feliz” Reúne 80 Moradores para Alongamento, Dança e Café Comunitário na Praça",
      lead: "Criado por profissionais de educação física e enfermeiros moradores do bairro, projeto reduziu casos de hipertensão e solidão entre os idosos.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80",
      fullText: `
        <p>Toda terça e quinta-feira, pontualmente às 06h15 da manhã, a Praça Central se transforma em uma grande roda de energia positiva. O projeto voluntário <strong>Manhã Feliz</strong> começou com apenas 6 vizinhas e hoje atende mais de 80 moradores de todas as idades.</p>
        <p style="margin-top:12px;"><strong>"Meu médico diminuiu metade dos meus remédios de pressão depois que comecei a caminhar e rir com as amigas aqui na praça"</strong>, relata Seu Oswaldo, de 74 anos.</p>
      `
    }
  },
  {
    id: "ed-18",
    number: "Edição #18 • Ano I",
    shortLabel: "Ed. #18 • Natal no Comércio",
    periodicity: "1ª Quinzena • Dezembro",
    badge: "Especial Natal",
    urgentTicker: "NATAL NO BAIRRO: Comércio local funciona em horário ampliado até as 21h a partir desta semana! Compre no bairro e concorra a 5 vales-compra de R$ 500.",
    quickPulse: [
      { icon: "🎄", meta: "Sábado • 18h30", title: "Chegada do Papai Noel e acendimento das luzes da Paróquia" },
      { icon: "🎁", meta: "Campanha Compre Aqui", title: "A cada R$ 30 nas lojas parceiras, ganhe 1 cupom para o sorteio" },
      { icon: "🍲", meta: "Natal Solidário", title: "Arrecadação de alimentos na Padaria Seu Tobias e Mercadinho" },
      { icon: "🛡️", meta: "Operação Fim de Ano", title: "Reforço no patrulhamento comercial das 14h às 22h" }
    ],
    coverStory: {
      kicker: "Economia Criativa • Natal Iluminado",
      readingTime: "2 min de leitura",
      title: "Por Que Comprar os Presentes de Natal no Nosso Bairro Faz Toda a Região Crescer?",
      lead: "Mais de 40 lojas e artesãos locais prepararam kits de presentes a partir de R$ 25, entrega grátis no mesmo dia e sorteio de prêmios na praça.",
      image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=1200&q=80",
      fullText: `
        <p>Sem enfrentar trânsito pesado ou filas de estacionamento de shopping: neste fim de ano, os comerciantes do nosso bairro se uniram na campanha <strong>Natal Vizinho Premiado</strong>.</p>
        <p style="margin-top:12px;">Cada real gasto na padaria, na loja de roupas, no salão de beleza ou no pet shop da nossa rua permanece circulando na comunidade, mantendo empregos dos jovens do bairro e patrocinando a decoração natalina da nossa praça.</p>
      `
    }
  },
  {
    id: "ed-19",
    number: "Edição #19 • Ano II",
    shortLabel: "Ed. #19 • Retrospectiva & Metas",
    periodicity: "2ª Quinzena • Dezembro / Janeiro",
    badge: "Edição de Aniversário",
    urgentTicker: "ESPECIAL FIM DE ANO: Confira os horários especiais das padarias, mercados e farmácias no feriado e as 10 maiores conquistas do nosso bairro neste ano!",
    quickPulse: [
      { icon: "🏆", meta: "Retrospectiva Comunitária", title: "Recapeamento de 8 ruas, Praça em LED e Horta Comunitária" },
      { icon: "📚", meta: "Volta às Aulas", title: "Feirão de Troca de Livros Didáticos e Uniformes no Salão Paroquial" },
      { icon: "🌧️", meta: "Defesa Civil • Verão", title: "Limpeza preventiva de bueiros e poda de árvores concluída" },
      { icon: "🚀", meta: "Ano II da Revista", title: "Tobias Magazine ultrapassa 12 mil leitores no WhatsApp do bairro" }
    ],
    coverStory: {
      kicker: "Edição Especial • Balanço & Futuro",
      readingTime: "3 min de leitura",
      title: "As 10 Grandes Vitórias do Nosso Bairro e os Projetos que Vêm por Aí no Novo Ano",
      lead: "União entre moradores, comerciantes e associação provou que um bairro organizado conquista segurança, lazer e valorização para todos.",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80",
      fullText: `
        <p>Fechamos o ciclo com motivos de sobra para celebrar. Em apenas um ano de mobilização e comunicação direta pela <em>Tobias Magazine</em>, vimos nossa praça ganhar vida nova, mais de 90 pequenos negócios locais aumentarem suas vendas pelo WhatsApp e dezenas de animais resgatados encontrarem um lar nos nossos Classificados.</p>
        <p style="margin-top:12px;">Para o próximo ano, a meta já está traçada: implantar a <strong>Biblioteca Comunitária Digital</strong>, ampliar a feira de orgânicos para duas vezes por semana e continuar contando a história de cada morador que faz o nosso bairro único.</p>
      `
    }
  }
];
