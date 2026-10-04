import type { Tema } from "@/lib/tipos";

const BRASIL = "Brasil: de Dutra a Jango";
const MUNDO = "Mundo: Guerra Fria";

export const temas: Tema[] = [
  {
    id: "dutra",
    disciplina: "historia",
    grupo: BRASIL,
    titulo: "Governo Dutra",
    periodo: "1946–1951",
    resumo:
      "O primeiro governo depois do Estado Novo: uma democracia nova no papel, alinhada aos Estados Unidos e com pouca tolerância aos comunistas e aos sindicatos.",
    guia: [
      {
        pergunta: "Como foi a política externa do presidente Dutra?",
        resposta:
          "Foi de alinhamento automático aos Estados Unidos, já no clima da Guerra Fria. O Brasil rompeu relações diplomáticas com a União Soviética em 1947, assinou no mesmo ano o TIAR (Tratado Interamericano de Assistência Recíproca, o Tratado do Rio), recebeu o presidente Truman e criou a Escola Superior de Guerra (1949) inspirada no modelo norte-americano. Na economia, o alinhamento apareceu na abertura às importações e ao capital estrangeiro.",
      },
      {
        pergunta: "Principais características da Constituição de 1946",
        resposta:
          "Era liberal e democrática. Restabeleceu a divisão e a independência dos três poderes, o federalismo (autonomia de estados e municípios), as eleições diretas com voto secreto e obrigatório para maiores de 18 anos alfabetizados, o mandato presidencial de cinco anos, o pluripartidarismo e as liberdades de expressão e de organização. Reconheceu o direito de greve, mas manteve a estrutura sindical ligada ao Estado, herdada de Vargas. Os analfabetos continuaram sem votar.",
      },
      {
        pergunta: "Algum fato caracterizou algo não democrático no governo Dutra?",
        resposta:
          "Sim. Em 1947 o registro do Partido Comunista (PCB) foi cassado e, em 1948, os parlamentares eleitos pelo partido perderam os mandatos. O governo também interveio em centenas de sindicatos, restringiu o direito de greve por decreto e fechou a Confederação dos Trabalhadores do Brasil. Ou seja: havia democracia formal, mas com perseguição política justificada pelo anticomunismo.",
      },
    ],
  },
  {
    id: "vargas",
    disciplina: "historia",
    grupo: BRASIL,
    titulo: "Vargas, populismo e a oposição",
    periodo: "1951–1954",
    resumo:
      "Vargas volta eleito pelo voto, cria a Petrobras e enfrenta a UDN de Carlos Lacerda numa disputa sobre o rumo da economia que termina com o suicídio de 1954.",
    guia: [
      {
        pergunta: "Explique o conflito entre nacionalistas e entreguistas",
        resposta:
          "Era a disputa sobre como desenvolver o país. Os nacionalistas defendiam a industrialização comandada pelo Estado, o controle nacional de setores estratégicos (petróleo, energia) e limites ao capital estrangeiro; a campanha \"O petróleo é nosso\" e a criação da Petrobras (1953) são o símbolo. Os chamados \"entreguistas\" (apelido dado pelos adversários) defendiam a abertura ao capital estrangeiro, menos intervenção do Estado e alinhamento aos Estados Unidos; estavam sobretudo na UDN, em parte da imprensa e em setores das Forças Armadas.",
      },
      {
        pergunta: "Que partido e que liderança representavam a oposição ao varguismo?",
        resposta:
          "A UDN (União Democrática Nacional), partido liberal e antigetulista de classe média urbana e setores das elites. Sua principal voz era o jornalista Carlos Lacerda, dono do jornal Tribuna da Imprensa. O atentado contra Lacerda na Rua Tonelero (agosto de 1954), em que morreu o major Rubens Vaz, abriu a crise que levou ao suicídio de Vargas.",
      },
      {
        pergunta: "O que significa o termo populismo?",
        resposta:
          "É o nome dado ao estilo político em que um líder carismático se relaciona diretamente com as massas urbanas, apresentando-se como protetor do povo. Ele concede direitos (principalmente trabalhistas) e, em troca, mantém os trabalhadores sob controle, por exemplo com sindicatos atrelados ao Estado. Busca conciliar classes sociais em nome da nação e do desenvolvimento. No Brasil, o termo descreve o período de 1945 a 1964, com Vargas, JK, Jânio e Jango.",
      },
    ],
  },
  {
    id: "jk",
    disciplina: "historia",
    grupo: BRASIL,
    titulo: "Governo JK",
    periodo: "1956–1961",
    resumo: "\"Cinquenta anos em cinco\": Plano de Metas, indústria de automóveis, Brasília e uma conta alta de inflação e dívida.",
    guia: [
      {
        pergunta: "O que caracterizou o governo JK?",
        resposta:
          "O nacional-desenvolvimentismo, resumido no lema \"50 anos em 5\". O Plano de Metas concentrou investimentos em energia, transportes, indústria de base, alimentação e educação. JK atraiu capital estrangeiro e multinacionais (sobretudo a indústria automobilística), priorizou as rodovias e construiu Brasília, a \"meta-síntese\", inaugurada em 1960. Criou a Sudene (1959) para o Nordeste. Foi um período de estabilidade política e otimismo cultural (bossa nova, Copa de 1958), mas deixou inflação alta, dívida externa maior e concentração de renda; em 1959 rompeu com o FMI.",
      },
    ],
  },
  {
    id: "janio",
    disciplina: "historia",
    grupo: BRASIL,
    titulo: "Jânio e a Legalidade",
    periodo: "1961",
    resumo: "Sete meses de governo, uma renúncia mal explicada e um país à beira da guerra civil até a saída parlamentarista.",
    guia: [
      {
        pergunta: "Explique a crise que sucedeu a renúncia de Jânio Quadros (questão da Legalidade)",
        resposta:
          "Jânio renunciou em 25 de agosto de 1961. O vice, João Goulart (Jango), estava em visita oficial à China comunista, e os três ministros militares tentaram vetar sua posse, acusando-o de ligação com a esquerda. O governador do Rio Grande do Sul, Leonel Brizola, reagiu com a Campanha da Legalidade: pelo rádio (a \"Rede da Legalidade\") exigiu o cumprimento da Constituição e ganhou o apoio do III Exército. Para evitar a guerra civil, o Congresso aprovou uma emenda que implantou o parlamentarismo: Jango tomou posse em 7 de setembro de 1961, mas com poderes reduzidos, tendo Tancredo Neves como primeiro-ministro. Em janeiro de 1963, um plebiscito devolveu o presidencialismo.",
      },
    ],
  },
  {
    id: "jango",
    disciplina: "historia",
    grupo: BRASIL,
    titulo: "Governo Jango e o golpe de 1964",
    periodo: "1961–1964",
    resumo: "Reformas de Base, radicalização política à esquerda e à direita e a derrubada do presidente pelos militares.",
    guia: [
      {
        pergunta: "Como terminou o governo Jango (João Goulart)?",
        resposta:
          "Terminou com um golpe civil-militar. Jango defendia as Reformas de Base (agrária, urbana, bancária, educacional, eleitoral) e, no Comício da Central do Brasil (13 de março de 1964), anunciou medidas como a desapropriação de terras. A reação veio com a Marcha da Família com Deus pela Liberdade e com a conspiração de militares, empresários, parte da Igreja, da imprensa e da classe média, com apoio dos Estados Unidos. Em 31 de março de 1964, tropas saíram de Minas Gerais; Jango não resistiu e se exilou no Uruguai. O Congresso declarou a presidência vaga e teve início a ditadura militar, que durou até 1985.",
      },
    ],
  },
  {
    id: "guerra-fria",
    disciplina: "historia",
    grupo: MUNDO,
    titulo: "Guerra Fria e mundo bipolar",
    periodo: "1947–1991",
    resumo: "Duas superpotências, dois sistemas e uma disputa travada com planos econômicos, alianças militares e guerras por procuração.",
    guia: [
      {
        pergunta: "Conceitue Guerra Fria e mundo bipolar",
        resposta:
          "Guerra Fria foi a disputa política, ideológica, econômica e militar entre Estados Unidos (capitalismo) e União Soviética (socialismo), de 1947 a 1991. É \"fria\" porque as duas potências nunca se enfrentaram diretamente: como ambas tinham armas nucleares, o confronto se dava por corrida armamentista, propaganda, espionagem e guerras em outros países (Coreia, Vietnã). Mundo bipolar é a ordem internacional resultante: o planeta dividido em dois polos de poder, o bloco capitalista liderado pelos EUA e o bloco socialista liderado pela URSS.",
      },
      {
        pergunta: "Quais os planos ou programas para a reconstrução da Europa no pós-guerra?",
        resposta:
          "Do lado capitalista, o Plano Marshall (1947): ajuda financeira dos Estados Unidos para reconstruir a Europa Ocidental e, ao mesmo tempo, conter o avanço do comunismo e garantir mercado para os produtos americanos. Ele era a face econômica da Doutrina Truman. Do lado socialista, a URSS respondeu com o Comecon (1949), o conselho de ajuda econômica mútua entre os países do Leste Europeu.",
      },
      {
        pergunta: "Quais as alianças militares que surgiram na Guerra Fria?",
        resposta:
          "A OTAN (Organização do Tratado do Atlântico Norte), criada em 1949 e liderada pelos Estados Unidos, reunindo o bloco capitalista; e o Pacto de Varsóvia, criado em 1955 e liderado pela União Soviética, reunindo os países socialistas do Leste Europeu. Nas Américas havia ainda o TIAR (1947).",
      },
      {
        pergunta: "Contextualize a chamada coexistência pacífica (URSS e EUA)",
        resposta:
          "Depois da morte de Stalin (1953), Nikita Kruschev assumiu a liderança soviética, denunciou os crimes de Stalin (1956) e passou a defender que capitalismo e socialismo podiam conviver sem guerra, competindo na economia, na ciência e na tecnologia. O medo de uma destruição nuclear mútua empurrava os dois lados para o diálogo; Kruschev chegou a visitar os EUA em 1959. A coexistência, porém, não acabou com as tensões: no mesmo período houve a invasão da Hungria (1956), o Muro de Berlim (1961) e a Crise dos Mísseis em Cuba (1962).",
      },
    ],
  },
  {
    id: "vietna",
    disciplina: "historia",
    grupo: MUNDO,
    titulo: "Guerra do Vietnã",
    periodo: "1955–1975",
    resumo: "Da derrota francesa em Dien Bien Phu à queda de Saigon: como a maior potência do mundo perdeu uma guerra para um país de camponeses.",
    guia: [
      {
        pergunta: "Como a guerra começou?",
        resposta:
          "O Vietnã era colônia francesa (Indochina). Liderado por Ho Chi Minh, o Viet Minh derrotou a França na batalha de Dien Bien Phu (1954). Os Acordos de Genebra dividiram o país no paralelo 17: Norte socialista (capital Hanói) e Sul capitalista (capital Saigon), com eleições de reunificação marcadas para 1956. O governo do Sul, apoiado pelos EUA, recusou as eleições, pois Ho Chi Minh venceria. Surgiu então no Sul a guerrilha vietcongue, apoiada pelo Norte.",
      },
      {
        pergunta: "Por que os Estados Unidos entraram e por que perderam?",
        resposta:
          "Entraram pela \"teoria do dominó\": se o Vietnã virasse comunista, os vizinhos cairiam em seguida. Usaram o incidente do Golfo de Tonkin (1964) como justificativa para a intervenção direta. Perderam porque enfrentaram uma guerrilha que conhecia a selva, tinha apoio da população, túneis e a Trilha Ho Chi Minh para abastecimento; porque apoiavam um governo impopular no Sul; e porque a opinião pública americana se voltou contra a guerra, principalmente depois da Ofensiva do Tet (1968), das imagens na televisão e do massacre de My Lai. Os EUA se retiraram pelos Acordos de Paris (1973), e Saigon caiu em 30 de abril de 1975.",
      },
    ],
  },
  {
    id: "descolonizacao",
    disciplina: "historia",
    grupo: MUNDO,
    titulo: "Descolonização da África e da Ásia",
    periodo: "1945–1975",
    resumo: "O fim dos impérios coloniais europeus: da não violência na Índia à guerra na Argélia e ao apartheid na África do Sul.",
    guia: [
      {
        pergunta: "Quais os fatores externos e internos que influenciaram a descolonização da África e da Ásia?",
        resposta:
          "Externos: o enfraquecimento econômico e militar das metrópoles europeias depois da Segunda Guerra; a pressão das duas superpotências, EUA e URSS, que eram contra o velho colonialismo e queriam novas áreas de influência; a Carta da ONU, que defendia a autodeterminação dos povos; e a contradição de ter combatido o nazismo em nome da liberdade mantendo colônias. Internos: o crescimento dos movimentos nacionalistas, liderados por elites locais muitas vezes formadas na Europa; a participação de soldados coloniais nas guerras mundiais; a exploração e o racismo do sistema colonial; e ideias como o pan-africanismo. A Conferência de Bandung (1955) reuniu os novos países e lançou a ideia de Terceiro Mundo e de não alinhamento.",
      },
    ],
  },
  {
    id: "maio68",
    disciplina: "historia",
    grupo: MUNDO,
    titulo: "Maio de 1968",
    periodo: "1968",
    resumo: "Estudantes nas barricadas de Paris, dez milhões de trabalhadores em greve e uma revolução que mudou mais os costumes do que os governos.",
    guia: [
      {
        pergunta: "O que foi e quais as consequências do movimento estudantil conhecido como Maio de 1968?",
        resposta:
          "Foi uma onda de protestos iniciada por estudantes franceses, na Universidade de Nanterre e depois na Sorbonne, em Paris. Eles contestavam a estrutura autoritária da universidade, o conservadorismo dos costumes, a sociedade de consumo, o governo de Charles de Gaulle e a Guerra do Vietnã. Após a repressão policial e as barricadas no Quartier Latin, os operários aderiram com uma greve geral de cerca de dez milhões de trabalhadores. Consequências: politicamente, o movimento não tomou o poder (De Gaulle venceu as eleições de junho, mas saiu em 1969); os trabalhadores conquistaram aumentos salariais; e, principalmente, houve uma transformação cultural duradoura, com reforma universitária, fortalecimento do feminismo, da liberdade sexual, do ambientalismo e da contracultura. O movimento inspirou protestos no mundo todo, inclusive no Brasil (Passeata dos Cem Mil).",
      },
    ],
  },
  {
    id: "figuras",
    disciplina: "historia",
    grupo: MUNDO,
    titulo: "Quem foi quem",
    periodo: "século XX",
    resumo: "Os dez nomes que caem na prova. Veja as fichas na aba Figuras e treine até não confundir mais ninguém.",
    guia: [
      {
        pergunta: "Quem foram Ho Chi Minh, Kruschev, Allende, Pinochet, Gandhi, Mandela, Mao, Rosa Parks, Luther King e Malcolm X?",
        resposta:
          "Cada um tem uma ficha completa na aba Figuras, com um gancho para memorizar. Em uma linha: Ho Chi Minh liderou a independência e o lado comunista do Vietnã; Kruschev sucedeu Stalin e defendeu a coexistência pacífica; Allende foi o socialista eleito no Chile e derrubado em 1973; Pinochet foi o general que o derrubou e virou ditador; Gandhi conduziu a independência da Índia pela não violência; Mandela combateu o apartheid e presidiu a África do Sul; Mao liderou a Revolução Chinesa de 1949; Rosa Parks recusou-se a ceder o lugar no ônibus; Luther King liderou a luta pacífica pelos direitos civis; Malcolm X defendeu o orgulho negro e a autodefesa.",
      },
    ],
  },
];
