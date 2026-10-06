import type { Tema } from "@/lib/tipos";

const CAMPOS = "Magnetismo: de onde vem o campo";
const FORCAS = "Magnetismo: o que o campo faz";

export const temas: Tema[] = [
  {
    id: "imas",
    disciplina: "fisica",
    grupo: CAMPOS,
    titulo: "Ímãs e o campo magnético da Terra",
    periodo: "Polos, linhas de campo e bússola",
    carta: { titulo: "Bússola Humana", golpe: "Polo que não se separa" },
    resumo:
      "Todo ímã tem dois polos que não se separam: iguais se repelem, opostos se atraem. A Terra também é um ímã, e a bússola só funciona porque o polo norte geográfico fica perto de um polo sul magnético.",
    guia: [
      {
        pergunta: "O que significa dizer que os polos de um ímã são inseparáveis?",
        resposta:
          "Significa que não existe polo norte ou polo sul isolado. Ao partir um ímã, cada pedaço volta a ter os dois polos, por menor que seja: no corte aparecem um novo norte de um lado e um novo sul do outro. Isso acontece porque o magnetismo do material vem de minúsculos ímãs elementares (os domínios, formados por átomos alinhados), e cortar a barra não separa as extremidades de nenhum deles. Em linguagem de campo: as linhas de campo magnético são sempre fechadas, sem ponto de início ou de fim.",
      },
      {
        pergunta: "Por que o polo norte da bússola aponta para o norte geográfico, se polos iguais se repelem?",
        resposta:
          "Porque o nome é uma convenção: chamou-se de polo norte do ímã a extremidade que aponta para o norte geográfico. Como polos opostos se atraem, o que existe perto do norte geográfico é um polo sul magnético da Terra, e perto do sul geográfico, um polo norte magnético. As linhas do campo terrestre saem do hemisfério sul geográfico e entram no hemisfério norte. Os polos magnéticos não coincidem exatamente com os geográficos: o ângulo entre o norte verdadeiro e o norte indicado pela bússola é a declinação magnética, que varia de lugar para lugar e ao longo do tempo.",
      },
      {
        pergunta: "Como identificar, sem bússola, qual de duas barras de ferro idênticas é um ímã?",
        resposta:
          "A atração não serve como prova, porque um ímã atrai ferro comum por qualquer um dos polos e o ferro comum também parece atrair o ímã. Há dois testes seguros. O primeiro é a repulsão: só dois ímãs se repelem. O segundo é o teste em T: encosta-se a ponta de uma barra no meio da outra. O meio de um ímã quase não atrai (a força se concentra nos polos), enquanto a ponta atrai bem. Se houver atração forte, a barra que encosta com a ponta é o ímã; se quase não houver, o ímã é a que está deitada.",
      },
    ],
  },
  {
    id: "campo-corrente",
    disciplina: "fisica",
    grupo: CAMPOS,
    titulo: "Campo magnético das correntes elétricas",
    periodo: "Oersted, fio, espira e solenoide",
    carta: { titulo: "Mão Direita de Oersted", golpe: "Polegar na corrente" },
    resumo:
      "Corrente elétrica cria campo magnético: foi o que Oersted viu quando a agulha da bússola girou perto de um fio. A regra da mão direita dá o sentido; fio reto, espira e solenoide têm cada um a sua fórmula.",
    guia: [
      {
        pergunta: "O que a experiência de Oersted mostrou e por que ela foi tão importante?",
        resposta:
          "Em 1820, Hans Christian Oersted percebeu que a agulha de uma bússola colocada perto de um fio se desviava quando passava corrente pelo fio e voltava à posição inicial quando a corrente era desligada. Invertendo a corrente, o desvio se invertia. A conclusão é que cargas elétricas em movimento criam campo magnético ao seu redor. Até então, eletricidade e magnetismo eram estudados como fenômenos independentes; a experiência uniu os dois e abriu caminho para o eletromagnetismo, o eletroímã e o motor elétrico.",
      },
      {
        pergunta: "Como usar a regra da mão direita no fio retilíneo, na espira e no solenoide?",
        resposta:
          "No fio retilíneo, aponta-se o polegar da mão direita no sentido convencional da corrente; os outros dedos, ao envolver o fio, mostram o sentido das linhas de campo, que são circunferências centradas no fio. Na espira e no solenoide é mais prático inverter os papéis: curvam-se os dedos no sentido em que a corrente circula e o polegar aponta o sentido do campo no interior, ou seja, a face por onde as linhas saem, que funciona como polo norte. Vista de frente, a face em que a corrente gira no sentido anti-horário é o polo norte; a face em que gira no sentido horário é o polo sul.",
      },
      {
        pergunta: "Do que depende a intensidade do campo em cada caso (fio, espira e solenoide)?",
        resposta:
          "Em todos, o campo é proporcional à corrente. No fio retilíneo longo, B = µ₀·i/(2π·d): cai com a distância d ao fio. No centro de uma espira circular, B = µ₀·i/(2R): quanto maior o raio, menor o campo; com N espiras juntas, multiplica-se por N. No interior de um solenoide longo, B = µ₀·(N/L)·i: depende do número de espiras por unidade de comprimento, e não do raio nem da posição dentro dele, porque o campo interno é praticamente uniforme. Colocar um núcleo de ferro no solenoide aumenta muito o campo: é o eletroímã.",
      },
    ],
  },
  {
    id: "forca-carga",
    disciplina: "fisica",
    grupo: FORCAS,
    titulo: "Força magnética sobre cargas em movimento",
    periodo: "F = |q|·v·B·sen θ e as trajetórias",
    carta: { titulo: "Domador de Órbitas", golpe: "Tapa de mão direita" },
    resumo:
      "O campo magnético só age sobre carga em movimento, e sempre de lado: a força é perpendicular à velocidade e ao campo. Por isso ela curva a trajetória sem mudar a rapidez, e o resultado pode ser reta, circunferência ou hélice.",
    guia: [
      {
        pergunta: "Em que condições uma carga elétrica sofre força magnética?",
        resposta:
          "São necessárias três coisas ao mesmo tempo: a partícula precisa ter carga, precisa estar em movimento em relação ao campo e a velocidade não pode ser paralela ao campo. A intensidade é F = |q|·v·B·sen θ, em que θ é o ângulo entre a velocidade e o campo. Assim, a força é nula para carga em repouso (v = 0) e para carga lançada na direção do campo (θ = 0° ou 180°), e é máxima quando a velocidade é perpendicular ao campo (θ = 90°). Partículas neutras, como o nêutron, não são desviadas.",
      },
      {
        pergunta: "Como determinar o sentido da força com a regra do tapa?",
        resposta:
          "Com a mão direita espalmada, aponta-se o polegar no sentido da velocidade e os outros quatro dedos no sentido do campo magnético. A força sobre uma carga positiva sai da palma, no sentido em que a mão daria um tapa. Para uma carga negativa, a força tem sentido oposto: sai das costas da mão. O mesmo resultado se obtém com a regra da mão esquerda de Fleming (indicador no campo, dedo médio na velocidade da carga positiva, polegar na força). Em qualquer caso, a força é perpendicular ao plano formado pela velocidade e pelo campo.",
      },
      {
        pergunta: "Quais trajetórias uma carga pode descrever em um campo magnético uniforme?",
        resposta:
          "Depende do ângulo de lançamento. Paralelamente ao campo, não há força e o movimento é retilíneo uniforme. Perpendicularmente ao campo, a força tem módulo constante e é sempre perpendicular à velocidade: faz o papel de resultante centrípeta e o movimento é circular uniforme, com raio R = m·v/(|q|·B) e período T = 2π·m/(|q|·B), que não depende da velocidade. Obliquamente, a componente da velocidade paralela ao campo se mantém (MRU) enquanto a perpendicular produz um MCU: a soma dos dois é um movimento helicoidal. Em todos os casos a força magnética não realiza trabalho, e o módulo da velocidade não muda.",
      },
    ],
  },
  {
    id: "forca-fio",
    disciplina: "fisica",
    grupo: FORCAS,
    titulo: "Força magnética em fios com corrente",
    periodo: "F = B·i·L·sen θ e fios paralelos",
    carta: { titulo: "Maestro dos Fios", golpe: "Atração paralela" },
    resumo:
      "Um fio com corrente é uma fila de cargas em movimento, então também leva o tapa do campo magnético. É essa força que gira o motor elétrico e que faz dois fios paralelos se atraírem ou se repelirem.",
    guia: [
      {
        pergunta: "Como se calcula a força magnética sobre um fio retilíneo com corrente?",
        resposta:
          "Para um trecho retilíneo de comprimento L, percorrido por corrente i e imerso em campo magnético uniforme B, a intensidade da força é F = B·i·L·sen θ, em que θ é o ângulo entre o fio (no sentido da corrente) e o campo. A força é máxima com o fio perpendicular ao campo e nula com o fio paralelo a ele. Ela nada mais é do que a soma das forças magnéticas sobre cada portador de carga que se move dentro do condutor. O sentido vem da regra do tapa, com o polegar apontando no sentido convencional da corrente no lugar da velocidade.",
      },
      {
        pergunta: "Por que dois fios paralelos com corrente exercem força um sobre o outro?",
        resposta:
          "Porque cada fio está mergulhado no campo magnético criado pelo outro. O fio 1 produz, na posição do fio 2, um campo B₁ = µ₀·i₁/(2π·d), perpendicular ao fio 2. Esse campo age sobre a corrente i₂ com força F = B₁·i₂·L, o que dá F = µ₀·i₁·i₂·L/(2π·d). Pela terceira lei de Newton, o fio 1 sofre força de mesma intensidade e sentido oposto, mesmo que as correntes sejam diferentes. Aplicando a regra da mão direita e depois a do tapa, conclui-se que correntes de mesmo sentido se atraem e correntes de sentidos opostos se repelem.",
      },
      {
        pergunta: "Como a força sobre fios explica o funcionamento de um motor elétrico?",
        resposta:
          "No motor, uma espira (ou bobina) percorrida por corrente fica entre os polos de um ímã. Os dois lados da espira perpendiculares ao campo conduzem correntes em sentidos opostos e, por isso, sofrem forças de mesma intensidade e sentidos opostos. Em um campo uniforme a força resultante sobre a espira é nula, mas essas duas forças atuam em linhas diferentes e formam um binário, que faz a espira girar. O comutador inverte o sentido da corrente a cada meia volta para que o giro continue sempre no mesmo sentido. Assim, energia elétrica é transformada em energia mecânica.",
      },
    ],
  },
];
