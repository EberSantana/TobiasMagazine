// ==========================================================================
// TOBIAS MAGAZINE — Base de Dados Editorial Local (Edição Quinzenal #14)
// ==========================================================================

window.TOBIAS_DATA = {
  edition: {
    number: "Edição #14 • Ano I",
    periodicity: "Quinzenal (1ª Quinzena do Mês)",
    pagesCount: 10,
    neighborhood: "Bairro & Região",
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
    {
      id: "biz-1",
      name: "Padaria & Confeitaria Seu Tobias",
      category: "Padarias & Mercados",
      catSlug: "alimentacao",
      avatar: "🥐",
      sponsored: true,
      description: "Pães artesanais de fermentação natural, bolos caseiros, café colonial e entrega rápida nos condomínios.",
      address: "Praça Central, 142 (Esquina com Rua das Flores)",
      hours: "Seg a Dom • 05h30 às 21h00",
      phone: "5579999990001",
      status: "Aberto Agora • Fornada às 17h"
    },
    {
      id: "biz-2",
      name: "Farmácia Popular Vida & Saúde",
      category: "Farmácias & Saúde",
      catSlug: "saude",
      avatar: "💊",
      sponsored: true,
      description: "Plantão 24h, aferição de pressão e glicemia gratuita, convênio Farmácia Popular e entrega em 20 minutos.",
      address: "Av. Principal, 410",
      hours: "Todos os dias • 24 Horas",
      phone: "5579999990002",
      status: "Plantão 24h • Entrega Grátis"
    },
    {
      id: "biz-3",
      name: "Mercadinho & Hortifruti Bom Vizinho",
      category: "Padarias & Mercados",
      catSlug: "alimentacao",
      avatar: "🛒",
      sponsored: false,
      description: "Frutas e verduras selecionadas diariamente, açougue fresco e pedidos completos pelo WhatsApp.",
      address: "Rua das Palmeiras, 88",
      hours: "Seg a Sáb • 07h às 20h | Dom • 07h às 13h",
      phone: "5579999990003",
      status: "Quarta Verde em Dobro"
    },
    {
      id: "biz-4",
      name: "Amigo Fiel Pet Shop & Clínica",
      category: "Pet Shops",
      catSlug: "pets",
      avatar: "🐾",
      sponsored: false,
      description: "Banho e tosa com câmera ao vivo, consulta veterinária, vacinas importadas e táxi dog no bairro.",
      address: "Rua São José, 215",
      hours: "Seg a Sáb • 08h às 19h",
      phone: "5579999990004",
      status: "Táxi Dog Disponível"
    },
    {
      id: "biz-5",
      name: "Chaveiro Rápido 24h — Mestre Jorge",
      category: "Chaveiros & Reparos",
      catSlug: "reparos",
      avatar: "🔑",
      sponsored: false,
      description: "Abertura residencial e automotiva sem danos, chaves codificadas, troca de segredo e fechaduras digitais.",
      address: "Banca na Praça Central, Box 04",
      hours: "Atendimento de Emergência 24h",
      phone: "5579999990005",
      status: "Chega em 15 min no bairro"
    },
    {
      id: "biz-6",
      name: "Carlos Silva • Eletricista & Encanador",
      category: "Profissionais Liberais",
      catSlug: "profissionais",
      avatar: "⚡",
      sponsored: false,
      description: "Caça-vazamentos, instalação de chuveiros, padrão de energia, quadros disjuntores e reparos de urgência.",
      address: "Atendimento em domicílio (Morador há 18 anos)",
      hours: "Seg a Sáb • 07h às 21h",
      phone: "5579999990006",
      status: "Orçamento sem taxa de visita"
    },
    {
      id: "biz-7",
      name: "Espaço Bela Unha — Camila Manicure",
      category: "Beleza & Bem-Estar",
      catSlug: "profissionais",
      avatar: "💅",
      sponsored: false,
      description: "Manicure e pedicure tradicional, esmaltação em gel, spa dos pés e biossegurança com autoclave.",
      address: "Galeria Central, Sala 12 (ou atendimento em casa)",
      hours: "Ter a Sáb • 08h30 às 19h30",
      phone: "5579999990007",
      status: "Agenda aberta para Sexta/Sábado"
    },
    {
      id: "biz-8",
      name: "Dra. Helena Costa • Advocacia & Mediação",
      category: "Profissionais Liberais",
      catSlug: "profissionais",
      avatar: "⚖️",
      sponsored: false,
      description: "Direito de Família, Inventários, Regularização de Imóveis, Contratos de Aluguel e Direito do Consumidor.",
      address: "Edifício Comercial Tobias, Sala 204",
      hours: "Seg a Sex • 09h às 18h (Hora marcada)",
      phone: "5579999990008",
      status: "1ª Orientação pelo WhatsApp"
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
