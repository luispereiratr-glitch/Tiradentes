import type { Nivel, Questao } from "@/lib/tipos";

/**
 * Questões oficiais dos vestibulares do ITA e do IME, transcritas dos PDFs dos sites oficiais
 * (vestibular.ita.br/provas e ime.eb.mil.br, provas anteriores do CFG) e conferidas com o gabarito
 * oficial de cada ano. A primeira alternativa é a correta; a explicação é nossa. As figuras são
 * recortes dos mesmos PDFs, guardados em `public/questoes`. No IME, o ano é o de ingresso
 * (o vestibular 2019-2020 aparece como IME 2020).
 */
const oficial =
  (banca: string) =>
  (ano: number, numero: number, tema: string, nivel: Nivel, enunciado: string, alternativas: string[], explicacao: string, lembre?: string): Questao => ({
    id: `${banca.toLowerCase()}-${ano}-${numero}`,
    tema,
    nivel,
    estilo: banca,
    oficial: `${banca} ${ano}`,
    enunciado,
    alternativas,
    explicacao,
    lembre,
  });

/** Figura recortada da prova: o arquivo tem o id da questão. */
const comFigura = (q: Questao, largura: number, altura: number, alt: string): Questao => ({ ...q, figura: { src: `/questoes/${q.id}.png`, alt, largura, altura } });

const ita = oficial("ITA");
const ime = oficial("IME");

export const oficiais: Questao[] = [
  comFigura(
    ita(2008, 7, "campo-corrente", "dificil",
      "Uma corrente elétrica passa por um fio longo, (L), coincidente com o eixo y no sentido negativo. Uma outra corrente de mesma intensidade passa por outro fio longo, (M), coincidente com o eixo x no sentido negativo, conforme mostra a figura. O par de quadrantes nos quais as correntes produzem campos magnéticos em sentidos opostos entre si é",
      ["I e III", "I e II", "II e III", "I e IV", "II e IV"],
      "Pela regra da mão direita, o fio L (corrente para −y) cria campo saindo do plano onde x > 0 e entrando onde x < 0. O fio M (corrente para −x) cria campo entrando onde y > 0 e saindo onde y < 0. No quadrante I (x > 0, y > 0) um sai e o outro entra; no III (x < 0, y < 0) um entra e o outro sai: sentidos opostos nos dois. Nos quadrantes II e IV os dois campos têm o mesmo sentido.",
      "Fios cruzados: em dois quadrantes opostos os campos brigam, nos outros dois se somam."),
    408, 387,
    "Eixos x e y com os quadrantes I (acima à direita), II (acima à esquerda), III (abaixo à esquerda) e IV (abaixo à direita). O fio L está sobre o eixo y, com corrente para baixo; o fio M está sobre o eixo x, com corrente para a esquerda."),
  comFigura(
    ita(2008, 11, "forca-fio", "dificil",
      "A figura mostra um circuito formado por uma barra fixa FGHJ e uma barra móvel MN, imerso num campo magnético perpendicular ao plano desse circuito. Considerando desprezível o atrito entre as barras e também que o circuito seja alimentado por um gerador de corrente constante I, o que deve acontecer com a barra móvel MN?",
      [
        "Move-se para a esquerda com aceleração constante.",
        "Permanece no mesmo lugar.",
        "Move-se para a direita com velocidade constante.",
        "Move-se para a esquerda com velocidade constante.",
        "Move-se para a direita com aceleração constante.",
      ],
      "O gerador faz a corrente subir pelo lado GH, seguir pelo trecho superior até M, descer pela barra MN e voltar por baixo até H. Na barra, portanto, a corrente desce. Com o campo saindo da página, a regra do tapa (polegar para baixo, dedos para o leitor) dá força para a esquerda. Como o gerador mantém a corrente constante, a força B·I·L é constante e, sem atrito, a aceleração também: a barra não atinge velocidade constante.",
      "Corrente constante, força constante, aceleração constante."),
    458, 378,
    "Campo magnético saindo da página em toda a região. Um trilho em forma de U deitado, com vértices G (acima à esquerda), F (acima à direita), H (abaixo à esquerda) e J (abaixo à direita); no lado esquerdo GH há um gerador de corrente I com seta para cima. A barra MN, vertical, cruza os dois trilhos horizontais, com M em cima e N embaixo."),
  ita(2008, 8, "forca-fio", "desafio",
    "Considere uma espira retangular de lados a e b percorrida por uma corrente I, cujo plano da espira é paralelo a um campo magnético B. Sabe-se que o módulo do torque sobre essa espira é dado por τ = I·B·a·b. Supondo que a mesma espira possa assumir qualquer outra forma geométrica, indique o valor máximo possível que se consegue para o torque.",
    ["I·B·(a + b)²/π", "I·B·a·b", "2·I·B·a·b", "I·B·a·b/(2π)", "I·B·a·b/π"],
    "O torque vale I·B·A, com A a área da espira. O fio tem comprimento fixo, igual ao perímetro 2(a + b), e a figura plana de maior área com perímetro dado é o círculo. Seu raio é r = 2(a + b)/(2π) = (a + b)/π, e a área, π·r² = (a + b)²/π. Logo, o torque máximo é I·B·(a + b)²/π.",
    "Torque de espira = I·B·área. Perímetro fixo, área máxima: círculo."),
  ita(2010, 8, "forca-carga", "dificil",
    "Um elétron é acelerado do repouso através de uma diferença de potencial V e entra numa região na qual atua um campo magnético, onde ele inicia um movimento ciclotrônico, movendo-se num círculo de raio RE com período TE. Se um próton fosse acelerado do repouso através de uma diferença de potencial de mesma magnitude e entrasse na mesma região em que atua o campo magnético, poderíamos afirmar sobre seu raio RP e período TP que",
    ["RP > RE e TP > TE.", "RP = RE e TP = TE.", "RP > RE e TP = TE.", "RP < RE e TP = TE.", "RP = RE e TP < TE."],
    "As duas partículas têm carga de mesmo módulo e ganham a mesma energia cinética, e·V. O raio é R = m·v/(e·B) = √(2m·e·V)/(e·B), proporcional a √m: o próton, de massa muito maior, tem raio maior. O período é T = 2π·m/(e·B), proporcional à massa: também é maior para o próton.",
    "Mesma tensão e mesma carga: R cresce com √m e T cresce com m."),
  ita(2011, 17, "forca-carga", "dificil",
    "Prótons (carga e e massa mp), deuterons (carga e e massa md = 2mp) e partículas alfas (carga 2e e massa ma = 4mp) entram em um campo magnético uniforme B perpendicular a suas velocidades, onde se movimentam em órbitas circulares de períodos Tp, Td e Ta, respectivamente. Pode-se afirmar que as razões dos períodos Td/Tp e Ta/Tp são, respectivamente,",
    ["2 e 2.", "1 e 1.", "1 e √2.", "√2 e 2.", "2 e √2."],
    "O período é T = 2π·m/(|q|·B): depende só da razão massa/carga, e não da velocidade. Para o próton, m/q = mp/e. Para o deuteron, 2mp/e, o dobro. Para a partícula alfa, 4mp/(2e) = 2mp/e, também o dobro. As duas razões valem 2.",
    "O período só enxerga m/|q|."),
  ita(2012, 19, "campo-corrente", "medio",
    "Assinale em qual das situações descritas nas opções abaixo as linhas de campo magnético formam circunferências no espaço.",
    [
      "Ao redor de um fio retilíneo percorrido por corrente elétrica.",
      "Na região externa de um toroide.",
      "Na região interna de um solenoide.",
      "Próximo a um ímã com formato esférico.",
      "Na região interna de uma espira circular percorrida por corrente elétrica.",
    ],
    "As linhas de campo de um fio retilíneo longo são circunferências centradas no fio, em planos perpendiculares a ele. Dentro de um solenoide as linhas são retas paralelas ao eixo; fora de um toroide ideal o campo é nulo; no interior de uma espira elas atravessam o plano da espira, sem formar circunferências.",
    "Circunferências em volta do fio reto: é a própria regra da mão direita."),
  comFigura(
    ita(2013, 19, "campo-corrente", "desafio",
      "Uma espira circular de raio R é percorrida por uma corrente elétrica i criando um campo magnético. Em seguida, no mesmo plano da espira, mas em lados opostos, a uma distância 2R do seu centro colocam-se dois fios condutores retilíneos, muito longos e paralelos entre si, percorridos por correntes i₁ e i₂ não nulas, de sentidos opostos, como indicado na figura. O valor de i e o seu sentido para que o módulo do campo de indução resultante no centro da espira não se altere são respectivamente",
      [
        "i = (1/4π)(i₁ + i₂) e antihorário.",
        "i = (1/2π)(i₁ + i₂) e horário.",
        "i = (1/2π)(i₁ + i₂) e antihorário.",
        "i = (1/4π)(i₁ + i₂) e horário.",
        "i = (1/π)(i₁ + i₂) e horário.",
      ],
      "No centro, o fio de cima (corrente para a direita) e o de baixo (corrente para a esquerda) criam campos de mesmo sentido, entrando na página, que se somam: B(fios) = µ₀·(i₁ + i₂)/(2π·2R). Para o módulo não mudar depois de somar um campo não nulo, o resultado tem de ser o campo original invertido: B(fios) = 2·B(espira), com o campo da espira saindo da página, isto é, corrente no sentido anti-horário. Então µ₀·(i₁ + i₂)/(4π·R) = 2·µ₀·i/(2R), e i = (i₁ + i₂)/(4π).",
      "Somar um vetor e manter o módulo: o vetor somado vale o dobro do original, no sentido oposto."),
    479, 240,
    "Dois fios horizontais paralelos; o de cima com corrente i1 para a direita e o de baixo com corrente i2 para a esquerda. Entre eles, a meio caminho, uma espira circular de raio R com corrente i; cada fio está a 2R do centro da espira."),
  comFigura(
    ita(2014, 18, "campo-corrente", "dificil",
      "As figuras mostram três espiras circulares concêntricas e coplanares percorridas por correntes de mesma intensidade I em diferentes sentidos. Assinale a alternativa que ordena corretamente as magnitudes dos respectivos campos magnéticos nos centros B₁, B₂, B₃ e B₄.",
      ["B₂ > B₃ > B₄ > B₁.", "B₂ > B₄ > B₃ > B₁.", "B₁ > B₄ > B₃ > B₂.", "B₃ > B₂ > B₄ > B₁.", "B₄ > B₃ > B₂ > B₁."],
      "Cada espira contribui com µ₀·I/(2r): quanto menor o raio, maior a parcela. Sejam a > b > c as parcelas da espira interna, da média e da externa. Em (2) as três correntes têm o mesmo sentido: a + b + c, o maior campo. Em (3) só a externa é contrária: a + b − c. Em (4) só a média é contrária: a − b + c, menor que o anterior porque b > c. Em (1) a interna é contrária às outras duas: |a − b − c|, o menor de todos.",
      "A espira de dentro pesa mais: inverter a menor parcela muda menos o total."),
    1000, 292,
    "Quatro conjuntos de três espiras concêntricas. Em (1), a espira interna tem corrente horária e as outras duas, anti-horária. Em (2), as três são anti-horárias. Em (3), a interna e a média são anti-horárias e a externa, horária. Em (4), a interna e a externa são anti-horárias e a média, horária."),
  ita(2015, 5, "forca-fio", "dificil",
    "Considere as seguintes proposições sobre campos magnéticos:\nI. Em um ponto P no espaço, a intensidade do campo magnético produzido por uma carga puntiforme q que se movimenta com velocidade constante ao longo de uma reta só depende da distância entre P e a reta.\nII. Ao se aproximar um ímã de uma porção de limalha de ferro, esta se movimenta porque o campo magnético do ímã realiza trabalho sobre ela.\nIII. Dois fios paralelos por onde passam correntes uniformes num mesmo sentido se atraem.\nEntão,",
    ["apenas III é correta.", "apenas I é correta.", "apenas II é correta.", "todas são corretas.", "todas são erradas."],
    "I é falsa: uma única carga em movimento não é uma corrente estacionária, e o campo que ela cria em P depende também de onde a carga está sobre a reta naquele instante. II é falsa, segundo o gabarito oficial: a força magnética sobre cargas em movimento é perpendicular à velocidade e não realiza trabalho. III é verdadeira: correntes paralelas de mesmo sentido se atraem.",
    "Uma carga passando não é um fio com corrente."),
  ita(2016, 11, "forca-carga", "dificil",
    "Um líquido condutor (metal fundido) flui no interior de duas chapas metálicas paralelas, interdistantes de 2,0 cm, formando um capacitor plano. Toda essa região interna está submetida a um campo homogêneo de indução magnética de 0,01 T, paralelo aos planos das chapas, atuando perpendicularmente à direção da velocidade do escoamento. Assinale a opção com o módulo dessa velocidade quando a diferença de potencial medida entre as placas for de 0,40 mV.",
    ["2 m/s", "2 cm/s", "3 cm/s", "1 m/s", "5 m/s"],
    "As cargas do líquido, arrastadas com velocidade v, sofrem força magnética q·v·B e se acumulam nas chapas até que o campo elétrico criado equilibre essa força: q·E = q·v·B, com E = U/d. Então v = U/(B·d) = (0,40 × 10⁻³)/(0,01 × 2,0 × 10⁻²) = 2 m/s. É o princípio do medidor eletromagnético de vazão, o mesmo raciocínio do seletor de velocidades.",
    "Equilíbrio entre força elétrica e magnética: v = E/B = U/(B·d)."),
  ita(2017, 13, "forca-carga", "desafio",
    "Uma carga q de massa m é solta do repouso num campo gravitacional g onde também atua um campo de indução magnética uniforme de intensidade B na horizontal. Assinale a opção que fornece a altura percorrida pela massa desde o repouso até o ponto mais baixo de sua trajetória, onde ela fica sujeita a uma aceleração igual e oposta à que tinha no início.",
    ["2g(m/qB)²", "g(m/qB)²", "g(qB/m)²", "2g(qB/m)²", "g(m/qB)²/2"],
    "No início a carga está em repouso e sua aceleração é g, para baixo. No ponto mais baixo a velocidade v é horizontal e a aceleração é g, para cima: q·v·B − m·g = m·g, de onde v = 2m·g/(q·B). Como a força magnética não realiza trabalho, a energia mecânica se conserva: m·g·h = m·v²/2. Assim, h = v²/(2g) = 2g·(m/qB)². A trajetória é uma cicloide.",
    "Campo magnético não realiza trabalho: a velocidade vem só da queda."),
  ita(2018, 9, "forca-carga", "dificil",
    "Uma massa m de carga q gira em órbita circular de raio R e período T no plano equatorial de um ímã. Nesse plano, a uma distância r do ímã, a intensidade do campo magnético é B(r) = µ/r³, em que µ é uma constante. Se fosse de 4R o raio dessa órbita, o período seria de",
    ["64T.", "T/2.", "2T.", "8T.", "32T."],
    "O período de uma carga em órbita circular é T = 2π·m/(q·B), inversamente proporcional ao campo no local da órbita. Como B = µ/r³, o período é proporcional a r³. Com raio quatro vezes maior, o campo é 64 vezes menor e o período, 64 vezes maior.",
    "T = 2π·m/(q·B): campo 64 vezes menor, período 64 vezes maior."),
  comFigura(
    ime(2019, 21, "forca-carga", "desafio",
      "Duas partículas A e B, ambas com carga positiva +Q e massas 2m e m, respectivamente, viajam, em velocidades constantes v e 2v e nas direções e sentidos mostrados na Figura 1, até se chocarem e ficarem grudadas no instante em que penetram numa região sujeita a um campo magnético constante (0, 0, B), sendo B uma constante positiva. O comprimento da trajetória percorrida pelo conjunto A+B dentro da região sujeita ao campo magnético é:\nObservações: despreze o efeito gravitacional; antes do choque, a partícula B viaja tangenciando a região sujeita ao campo magnético; o sistema de eixo adotado é o mostrado na Figura 2; e despreze a interação elétrica entre as partículas A e B.",
      ["3√2·π·m·v/(2Q·B)", "√2·π·m·v/(Q·B)", "3√2·π·m·v/(Q·B)", "3π·m·v/(2Q·B)", "√2·π·m·v/(2Q·B)"],
      "No choque conserva-se a quantidade de movimento: 2m·v em x e m·2v em y. O conjunto, de massa 3m e carga 2Q, sai com quantidade de movimento 2√2·m·v, a 45° dos eixos, entrando na região. O raio é R = p/(q·B) = 2√2·m·v/(2Q·B) = √2·m·v/(Q·B). Com campo em +z e carga positiva, o giro é horário: o conjunto entra pela fronteira a 45° e volta a ela depois de girar 270°, isto é, três quartos de volta. Comprimento: (3π/2)·R = 3√2·π·m·v/(2Q·B).",
      "Choque: conserve o momento. No campo: R = p/(q·B), e conte o ângulo girado até sair."),
    1000, 518,
    "Figura 1: uma região retangular sujeita ao campo magnético. À esquerda dela, a partícula A (+Q, 2m, v) move-se para a direita, em direção à região; a partícula B (+Q, m, 2v) move-se para cima, rente ao lado esquerdo da região. Figura 2: eixos X para a direita, Y para cima e Z saindo da página."),
  comFigura(
    ime(2020, 29, "forca-carga", "dificil",
      "Uma partícula de massa m e carga elétrica +q percorre a trajetória tracejada na figura em velocidade constante v. No instante em que a partícula alcança o ponto A, surge um campo magnético uniforme com intensidade constante B, emergindo do plano do papel. A intensidade do campo magnético B para que a partícula alcance o ponto D na continuação de sua trajetória é:",
      ["2y·m·v/[(x² + y²)·q]", "(x² + y²)·m·v/(2x·q)", "2x·m·v/[(x² + y²)·q]", "2x·q/[(x² + y²)·m·v]", "(x² + y²)·m·v/(2y·q)"],
      "Com a velocidade para a direita e o campo saindo do papel, a força sobre a carga positiva aponta para baixo: a partícula passa a descrever uma circunferência de raio R cujo centro fica a uma distância R abaixo de A. Para ela passar por D, que está x à esquerda e y abaixo de A, a distância de D ao centro deve ser R: x² + (R − y)² = R², de onde R = (x² + y²)/(2y). Como R = m·v/(q·B), obtém-se B = 2y·m·v/[(x² + y²)·q].",
      "Circunferência tangente em A: o centro fica na perpendicular à velocidade, a um raio de distância."),
    566, 440,
    "Campo magnético B saindo do papel. A partícula move-se para a direita sobre uma linha tracejada horizontal até o ponto A. O ponto D fica abaixo e à esquerda de A: a uma distância y na vertical e x na horizontal."),
  comFigura(
    ime(2026, 16, "forca-carga", "desafio",
      "Num determinado instante, uma partícula de carga negativa está com velocidade horizontal ortogonal a um fio infinito, por onde circula uma corrente elétrica constante, provocando na posição dela nesse instante um campo magnético de módulo B. Sabe-se que a partícula vai passar por um dos 5 pontos indicados na figura.\nObservações: despreze os efeitos gravitacionais; as linhas tracejadas e o fio estão no mesmo plano; as linhas tracejadas desenhadas na figura definem 4 quadrados; caso o fio fosse substituído por um gerador de campo magnético constante de módulo B, ortogonal ao plano, a partícula descreveria uma circunferência de raio igual ao lado de cada quadrado.\nA partícula passará então pelo ponto:",
      ["A", "B", "C", "D", "E"],
      "À esquerda do fio, com a corrente para cima, o campo sai do plano. Para uma carga positiva indo para a direita a força seria para baixo; como a carga é negativa, a força é para cima, o que descarta C, D e E. Em um campo uniforme de módulo B, a partícula subiria por um arco de raio igual ao lado do quadrado e cruzaria a linha de cima exatamente sobre a linha vertical do meio, entre A e B. Mas, ao avançar, ela se aproxima do fio, onde o campo é mais intenso: o raio de curvatura diminui, a curva fecha mais depressa e ela cruza a linha de cima antes, em A.",
      "Campo mais forte, raio menor: perto do fio a curva aperta."),
    642, 494,
    "Uma malha de linhas tracejadas forma quatro quadrados (dois por dois). A partícula −Q está no meio do lado esquerdo da malha, com velocidade v para a direita. Na linha de cima ficam os pontos A (pouco antes da linha vertical do meio) e B (pouco depois dela); na linha de baixo, E (abaixo de A) e D (abaixo de B); C está no meio do lado direito. À direita da malha, um fio vertical com corrente i para cima."),
  ime(2021, 23, "forca-carga", "desafio",
    "Uma partícula de massa m e carga q positiva é lançada obliquamente com velocidade v₀ e ângulo α com a horizontal. Em certo instante t₁, antes de alcançar a altura máxima de sua trajetória, quando está a uma distância horizontal x₁ do ponto de lançamento, a partícula é submetida a um campo magnético de intensidade B, na direção vertical. Considerando g a aceleração da gravidade local, a menor intensidade B do campo magnético para que a partícula atinja o solo na posição (x₁, 0) é:",
    [
      "2π·m/[q·(2v₀·sen(α)/g − t₁)]",
      "π·m/[q·(2v₀·sen(α)/g − t₁)]",
      "2π·m/[q·(v₀·sen(α)/g − t₁)]",
      "4π·m/[q·(2v₀·sen(α)/g − t₁)]",
      "π·m/[q·(v₀·sen(α)/(2g) − t₁)]",
    ],
    "O campo é vertical, então a força magnética é horizontal e não altera o movimento vertical: o tempo total de voo continua sendo 2v₀·sen(α)/g. Na horizontal, a velocidade v₀·cos(α) passa a girar em movimento circular de período T = 2π·m/(q·B). A partícula volta à vertical que passa por x₁ a cada volta completa. Para cair em (x₁, 0), o tempo que resta de voo deve ser um número inteiro de períodos: 2v₀·sen(α)/g − t₁ = n·T. O menor campo corresponde ao maior período, ou seja, a uma única volta (n = 1), o que dá B = 2π·m/[q·(2v₀·sen(α)/g − t₁)].",
    "Campo vertical não mexe na queda: só faz a projeção horizontal dar voltas."),
];
