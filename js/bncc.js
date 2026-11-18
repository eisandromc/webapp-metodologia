/* =========================================================
   BNCC — Matemática e suas Tecnologias (Ensino Médio)
   Competências específicas e habilidades (BNCC, Brasil, 2018).
   Textos reproduzidos de forma fiel/condensada para o protótipo:
   confira sempre o documento oficial em basenacionalcomum.mec.gov.br
   ========================================================= */

const BNCC_COMPETENCIAS = {
  1: 'Utilizar estratégias, conceitos e procedimentos matemáticos para interpretar situações em diversos contextos, sejam atividades cotidianas, sejam fatos das Ciências da Natureza e Humanas, das questões socioeconômicas ou tecnológicas, divulgados por diferentes meios, de modo a contribuir para uma formação geral.',
  2: 'Propor ou participar de ações para investigar desafios do mundo contemporâneo e tomar decisões éticas e socialmente responsáveis, com base na análise de problemas sociais, como os voltados a situações de saúde, sustentabilidade, das implicações da tecnologia no mundo do trabalho, entre outros, mobilizando e articulando conceitos, procedimentos e linguagens próprios da Matemática.',
  3: 'Utilizar estratégias, conceitos, definições e procedimentos matemáticos para interpretar, construir modelos e resolver problemas em diversos contextos, analisando a plausibilidade dos resultados e a adequação das soluções propostas, de modo a construir argumentação consistente.',
  4: 'Compreender e utilizar, com flexibilidade e precisão, diferentes registros de representação matemáticos (algébrico, geométrico, estatístico, computacional etc.), na busca de solução e comunicação de resultados de problemas.',
  5: 'Investigar e estabelecer conjecturas a respeito de diferentes conceitos e propriedades matemáticas, empregando estratégias e recursos, como observação de padrões, experimentações e diferentes tecnologias, identificando a necessidade, ou não, de uma demonstração cada vez mais formal na validação das referidas conjecturas.'
};
const BNCC_COMP_TITULO = { 1: 'Interpretar situações', 2: 'Investigar desafios e agir', 3: 'Modelar e resolver problemas', 4: 'Registros de representação', 5: 'Investigar e conjecturar' };

const BNCC_HABILIDADES = {
  EM13MAT101: 'Interpretar criticamente situações econômicas, sociais e fatos relativos às Ciências da Natureza que envolvam a variação de grandezas, pela análise dos gráficos das funções representadas e das taxas de variação, com ou sem apoio de tecnologias digitais.',
  EM13MAT102: 'Analisar tabelas, gráficos e amostras de pesquisas estatísticas apresentadas em relatórios divulgados por diferentes meios de comunicação, identificando, quando for o caso, inadequações que possam induzir a erros de interpretação, como escalas e amostras não apropriadas.',
  EM13MAT103: 'Interpretar e compreender textos científicos ou divulgados pelas mídias, que empregam unidades de medida de diferentes grandezas e as conversões possíveis entre elas, adotadas ou não pelo Sistema Internacional (SI), como as de armazenamento e velocidade de transferência de dados, ligadas aos avanços tecnológicos.',
  EM13MAT104: 'Interpretar taxas e índices de natureza socioeconômica (índice de desenvolvimento humano, taxas de inflação, entre outros), investigando os processos de cálculo desses números, para analisar criticamente a realidade e produzir argumentos.',
  EM13MAT105: 'Utilizar as noções de transformações isométricas (translação, reflexão, rotação e composições destas) e transformações homotéticas para construir figuras e analisar elementos da natureza e diferentes produções humanas (fractais, construções civis, obras de arte, entre outras).',
  EM13MAT106: 'Identificar situações da vida cotidiana nas quais seja necessário fazer escolhas levando-se em conta os riscos probabilísticos (usar este ou aquele método contraceptivo, optar por um tratamento médico em detrimento de outro etc.).',
  EM13MAT201: 'Propor ou participar de ações adequadas às demandas da região, preferencialmente para sua comunidade, envolvendo medições e cálculos de perímetro, de área, de volume, de capacidade ou de massa.',
  EM13MAT202: 'Planejar e executar pesquisa amostral sobre questões relevantes, usando dados coletados diretamente ou em diferentes fontes, e comunicar os resultados por meio de relatório contendo gráficos e interpretação das medidas de tendência central e das medidas de dispersão (amplitude e desvio padrão), utilizando ou não recursos tecnológicos.',
  EM13MAT203: 'Aplicar conceitos matemáticos no planejamento, na execução e na análise de ações envolvendo a utilização de aplicativos e a criação de planilhas (para o controle de orçamento familiar, simuladores de cálculos de juros simples e compostos, entre outros), para tomar decisões.',
  EM13MAT301: 'Resolver e elaborar problemas do cotidiano, da Matemática e de outras áreas do conhecimento, que envolvem equações lineares simultâneas, usando técnicas algébricas e gráficas, com ou sem apoio de tecnologias digitais.',
  EM13MAT302: 'Construir modelos empregando as funções polinomiais de 1º ou 2º graus, para resolver problemas em contextos diversos, com ou sem apoio de tecnologias digitais.',
  EM13MAT303: 'Interpretar e comparar situações que envolvam juros simples com as que envolvem juros compostos, por meio de representações gráficas ou análise de planilhas, destacando o crescimento linear ou exponencial de cada caso.',
  EM13MAT304: 'Resolver e elaborar problemas com funções exponenciais nos quais seja necessário compreender e interpretar a variação das grandezas envolvidas, em contextos como o da Matemática Financeira, entre outros.',
  EM13MAT305: 'Resolver e elaborar problemas com funções logarítmicas nos quais seja necessário compreender e interpretar a variação das grandezas envolvidas, em contextos como os de abalos sísmicos, pH, radioatividade, Matemática Financeira, entre outros.',
  EM13MAT306: 'Resolver e elaborar problemas em contextos que envolvem fenômenos periódicos reais (ondas sonoras, fases da lua, movimentos cíclicos, entre outros) e comparar suas representações com as funções seno e cosseno, no plano cartesiano, com ou sem apoio de aplicativos de álgebra e geometria.',
  EM13MAT307: 'Empregar diferentes métodos para a obtenção da medida da área de uma superfície (reconfigurações, aproximação por cortes etc.) e deduzir expressões de cálculo para aplicá-las em situações reais (como o remanejamento e a distribuição de plantações, entre outros), com ou sem apoio de tecnologias digitais.',
  EM13MAT308: 'Aplicar as relações métricas, incluindo as leis do seno e do cosseno ou as noções de congruência e semelhança, para resolver e elaborar problemas que envolvem triângulos, em variados contextos.',
  EM13MAT309: 'Resolver e elaborar problemas que envolvem o cálculo de áreas totais e de volumes de prismas, pirâmides e corpos redondos em situações reais (como o cálculo do gasto de material para revestimento ou pinturas de objetos cujos formatos sejam composições dos sólidos estudados), com ou sem apoio de tecnologias digitais.',
  EM13MAT310: 'Resolver e elaborar problemas de contagem envolvendo agrupamentos ordenáveis ou não de elementos, por meio dos princípios multiplicativo e aditivo, recorrendo a estratégias diversas, como o diagrama de árvore.',
  EM13MAT311: 'Identificar e descrever o espaço amostral de eventos aleatórios, realizando contagem das possibilidades, para resolver e elaborar problemas que envolvem o cálculo da probabilidade.',
  EM13MAT312: 'Resolver e elaborar problemas que envolvem o cálculo de probabilidade de eventos em experimentos aleatórios sucessivos.',
  EM13MAT313: 'Utilizar, quando necessário, a notação científica para expressar uma medida, compreendendo as noções de algarismos significativos e algarismos duvidosos, e reconhecendo que toda medida é inevitavelmente acompanhada de erro.',
  EM13MAT314: 'Resolver e elaborar problemas que envolvem grandezas determinadas pela razão ou pelo produto de outras (velocidade, densidade demográfica, energia elétrica etc.).',
  EM13MAT315: 'Investigar e registrar, por meio de um fluxograma, quando possível, um algoritmo que resolve um problema.',
  EM13MAT316: 'Resolver e elaborar problemas, em diferentes contextos, que envolvem cálculo e interpretação das medidas de tendência central (média, moda, mediana) e das de dispersão (amplitude, variância e desvio padrão).',
  EM13MAT401: 'Converter representações algébricas de funções polinomiais de 1º grau em representações geométricas no plano cartesiano, distinguindo os casos nos quais o comportamento é proporcional, recorrendo ou não a softwares ou aplicativos de álgebra e geometria dinâmica.',
  EM13MAT402: 'Converter representações algébricas de funções polinomiais de 2º grau em representações geométricas no plano cartesiano, distinguindo os casos nos quais uma variável for diretamente proporcional ao quadrado da outra, recorrendo ou não a softwares ou aplicativos de álgebra e geometria dinâmica, entre outros materiais.',
  EM13MAT403: 'Analisar e estabelecer relações, com ou sem apoio de tecnologias digitais, entre as representações de funções exponencial e logarítmica expressas em tabelas e em plano cartesiano, para identificar as características fundamentais (domínio, imagem, crescimento) de cada função.',
  EM13MAT404: 'Analisar funções definidas por uma ou mais sentenças (tabela do Imposto de Renda, contas de luz, água, gás etc.), em suas representações algébrica e gráfica, identificando domínios de validade, imagem, crescimento e decrescimento, e convertendo essas representações de uma para outra, com ou sem apoio de tecnologias digitais.',
  EM13MAT405: 'Utilizar conceitos iniciais de uma linguagem de programação na implementação de algoritmos escritos em linguagem corrente e/ou matemática.',
  EM13MAT406: 'Construir e interpretar tabelas e gráficos de frequências com base em dados obtidos em pesquisas por amostras estatísticas, incluindo ou não o uso de softwares que inter-relacionem estatística, geometria e álgebra.',
  EM13MAT407: 'Interpretar e comparar conjuntos de dados estatísticos por meio de diferentes diagramas e gráficos (histograma, de caixa (box-plot), de ramos e folhas, entre outros), reconhecendo os mais eficientes para sua análise.',
  EM13MAT501: 'Investigar relações entre números expressos em tabelas para representá-los no plano cartesiano, identificando padrões e criando conjecturas para generalizar e expressar algebricamente essa generalização, reconhecendo quando essa representação é de função polinomial de 1º grau.',
  EM13MAT502: 'Investigar relações entre números expressos em tabelas para representá-los no plano cartesiano, identificando padrões e criando conjecturas para generalizar e expressar algebricamente essa generalização, reconhecendo quando essa representação é de função polinomial de 2º grau do tipo y = ax².',
  EM13MAT503: 'Investigar pontos de máximo ou de mínimo de funções quadráticas em contextos envolvendo superfícies, Matemática Financeira ou Cinemática, entre outros, com apoio de tecnologias digitais.',
  EM13MAT504: 'Investigar processos de obtenção da medida do volume de prismas, pirâmides, cilindros e cones, incluindo o princípio de Cavalieri, para a obtenção das fórmulas de cálculo da medida do volume dessas figuras.',
  EM13MAT505: 'Resolver problemas sobre ladrilhamento do plano, com ou sem apoio de aplicativos de geometria dinâmica, para conjecturar a respeito dos tipos ou composição de polígonos que podem ser utilizados em ladrilhamento, generalizando padrões observados.',
  EM13MAT506: 'Representar graficamente a variação da área e do perímetro de um polígono regular quando os comprimentos de seus lados variam, analisando e classificando as funções envolvidas.',
  EM13MAT507: 'Identificar e associar progressões aritméticas (PA) a funções afins de domínios discretos, para análise de propriedades, dedução de algumas fórmulas e resolução de problemas.',
  EM13MAT508: 'Identificar e associar progressões geométricas (PG) a funções exponenciais de domínios discretos, para análise de propriedades, dedução de algumas fórmulas e resolução de problemas.',
  EM13MAT509: 'Investigar a deformação de ângulos e áreas provocada pelas diferentes projeções usadas em cartografia (como a cilíndrica e a cônica), com ou sem suporte de tecnologia digital.',
  EM13MAT510: 'Investigar conjuntos de dados relativos ao comportamento de duas variáveis numéricas, usando ou não tecnologias da informação, e, quando apropriado, levar em conta a variação e utilizar uma reta para descrever a relação observada.',
  EM13MAT511: 'Reconhecer a existência de diferentes tipos de espaços amostrais, discretos ou não, e de eventos, equiprováveis ou não, e investigar implicações no cálculo de probabilidades.'
};
const competenciaDe = (code) => parseInt(code.charAt(7), 10); // EM13MAT3xx → competência 3

/* Conteúdos (objetos de conhecimento) do EM, ligados às habilidades.
   A série é uma sugestão: a BNCC não divide o EM por série, isso varia conforme o currículo da rede. */
const TOPICOS = {
  funcao_afim: {
    nome: 'Função afim (1º grau)', serie: 1, kw: ['função afim', 'funcao afim', '1º grau', 'primeiro grau', 'função linear', 'reta', 'taxa de variação'],
    hab: ['EM13MAT302', 'EM13MAT401', 'EM13MAT501', 'EM13MAT101'],
    conceitos: ['taxa de variação', 'coeficiente linear', 'gráfico (reta)', 'zero da função'],
    contexto: 'tarifas de transporte por aplicativo e planos de celular',
    problema: 'Uma corrida de aplicativo custa R$ 5,00 de tarifa fixa mais R$ 2,40 por km rodado. (a) Escreva a função P(x) do preço em relação aos km rodados. (b) Quanto custa uma corrida de 12 km? (c) Quantos km é possível percorrer com R$ 50,00?',
    resposta: '(a) P(x) = 5 + 2,4x. (b) P(12) = 5 + 28,80 = R$ 33,80. (c) 5 + 2,4x = 50 → x = 18,75 km.',
    digital: 'GeoGebra (controle deslizante para os coeficientes)'
  },
  funcao_quadratica: {
    nome: 'Função quadrática (2º grau)', serie: 1, kw: ['quadrática', 'quadratica', '2º grau', 'segundo grau', 'parábola', 'parabola', 'bhaskara', 'vértice', 'máximo e mínimo'],
    hab: ['EM13MAT302', 'EM13MAT402', 'EM13MAT502', 'EM13MAT503'],
    conceitos: ['parábola e concavidade', 'raízes (zeros)', 'vértice: ponto de máximo ou mínimo', 'forma fatorada e canônica'],
    contexto: 'lançamento de objetos e otimização de áreas',
    problema: 'Um agricultor tem 80 m de tela para cercar uma horta retangular encostada em um muro (o lado do muro não precisa de tela). Que dimensões dão a maior área possível? Qual é essa área?',
    resposta: 'Sendo x os lados perpendiculares ao muro: A(x) = x(80 − 2x) = −2x² + 80x. Vértice em x = 20 m; o outro lado mede 40 m. Área máxima = 800 m².',
    digital: 'GeoGebra (parábola e vértice)'
  },
  funcao_exponencial: {
    nome: 'Função exponencial', serie: 1, kw: ['exponencial', 'crescimento exponencial', 'decaimento', 'meia-vida', 'potência'],
    hab: ['EM13MAT304', 'EM13MAT403', 'EM13MAT508'],
    conceitos: ['base e expoente', 'crescimento e decrescimento', 'comparação com crescimento linear', 'meia-vida'],
    contexto: 'crescimento de bactérias, viralização nas redes e meia-vida de medicamentos',
    problema: 'Uma cultura com 500 bactérias dobra a cada 3 horas. (a) Escreva a função N(t) que dá a quantidade após t horas. (b) Quantas bactérias haverá após 1 dia?',
    resposta: '(a) N(t) = 500 · 2^(t/3). (b) Em 24 h há 8 duplicações: N(24) = 500 · 2⁸ = 500 · 256 = 128 000 bactérias.',
    digital: 'Planilha eletrônica ou GeoGebra'
  },
  logaritmo: {
    nome: 'Logaritmos e função logarítmica', serie: 1, kw: ['logaritmo', 'logarítmica', 'logaritmica', 'log ', 'escala richter', 'ph'],
    hab: ['EM13MAT305', 'EM13MAT403'],
    conceitos: ['definição de logaritmo', 'propriedades operatórias', 'função logarítmica como inversa da exponencial', 'escalas logarítmicas'],
    contexto: 'escala de pH, abalos sísmicos e intensidade sonora (decibéis)',
    problema: 'O pH de uma solução é dado por pH = −log[H⁺]. Um suco de limão tem [H⁺] = 10⁻² mol/L e a água pura tem [H⁺] = 10⁻⁷ mol/L. (a) Calcule o pH de cada um. (b) Quantas vezes o suco é mais ácido que a água?',
    resposta: '(a) Suco: pH = 2; água: pH = 7. (b) 10⁻² ÷ 10⁻⁷ = 10⁵ → 100 000 vezes mais ácido.',
    digital: 'GeoGebra (comparar 10^x e log x)'
  },
  funcao_partes: {
    nome: 'Funções definidas por mais de uma sentença', serie: 1, kw: ['por partes', 'mais de uma sentença', 'conta de luz', 'conta de água', 'imposto de renda', 'faixas'],
    hab: ['EM13MAT404', 'EM13MAT101'],
    conceitos: ['domínio de validade de cada sentença', 'leitura de tabelas de tarifas', 'gráfico por partes', 'crescimento e decrescimento'],
    contexto: 'contas de água, luz e tabela do Imposto de Renda',
    problema: 'Uma conta de água cobra R$ 30,00 fixos para consumo de até 10 m³ e R$ 6,00 por m³ que exceder 10 m³. (a) Escreva a função V(x). (b) Quanto paga quem consome 7 m³? E 18 m³?',
    resposta: '(a) V(x) = 30, se 0 ≤ x ≤ 10; V(x) = 30 + 6(x − 10), se x > 10. (b) 7 m³ → R$ 30,00; 18 m³ → 30 + 48 = R$ 78,00.',
    digital: 'Planilha eletrônica com a conta real da família'
  },
  progressoes: {
    nome: 'Progressões aritméticas e geométricas (PA e PG)', serie: 1, kw: ['progressão', 'progressao', 'progressões', ' pa ', ' pg ', 'sequência', 'sequencias', 'aritmética', 'geométrica'],
    hab: ['EM13MAT507', 'EM13MAT508'],
    conceitos: ['razão da PA e da PG', 'termo geral', 'soma dos termos', 'relação PA–função afim e PG–função exponencial'],
    contexto: 'planos de treino, economias mensais e crescimento populacional',
    problema: 'Uma estudante começa a correr 2 km na primeira semana e aumenta 0,5 km a cada semana. (a) Quantos km correrá na 10ª semana? (b) Quantos km terá corrido no total das 10 semanas?',
    resposta: '(a) a₁₀ = 2 + 9 · 0,5 = 6,5 km. (b) S₁₀ = (2 + 6,5) · 10 ÷ 2 = 42,5 km.',
    digital: 'Planilha eletrônica'
  },
  financeira: {
    nome: 'Matemática financeira: juros simples e compostos', serie: 1, kw: ['juros', 'financeira', 'financeiro', 'investimento', 'empréstimo', 'emprestimo', 'orçamento', 'orcamento', 'parcelamento'],
    hab: ['EM13MAT303', 'EM13MAT203', 'EM13MAT304', 'EM13MAT104'],
    conceitos: ['capital, taxa, tempo e montante', 'juros simples (crescimento linear)', 'juros compostos (crescimento exponencial)', 'orçamento e tomada de decisão'],
    contexto: 'compras parceladas, cartão de crédito e orçamento familiar',
    problema: 'Compare aplicar R$ 1.000,00 a uma taxa de 1% ao mês durante 12 meses em regime de juros simples e em regime de juros compostos. Qual a diferença entre os montantes? Represente as duas situações em uma planilha e em um gráfico.',
    resposta: 'Simples: M = 1000(1 + 0,01 · 12) = R$ 1.120,00. Compostos: M = 1000 · 1,01¹² ≈ R$ 1.126,83. Diferença ≈ R$ 6,83 (cresce com o tempo: linear × exponencial).',
    digital: 'Planilha eletrônica (simulador de juros)'
  },
  porcentagem: {
    nome: 'Porcentagem, taxas e índices', serie: 1, kw: ['porcentagem', 'percentual', 'inflação', 'inflacao', 'idh', 'índice', 'indice', 'desconto', 'aumento'],
    hab: ['EM13MAT104', 'EM13MAT101'],
    conceitos: ['fator de aumento e de desconto', 'aumentos e descontos sucessivos', 'taxas e índices socioeconômicos', 'leitura crítica de notícias'],
    contexto: 'promoções, inflação e indicadores sociais',
    problema: 'Um tênis custava R$ 200,00. Teve aumento de 10% e, no mês seguinte, desconto de 10%. (a) Qual o preço final? (b) Por que o preço não voltou ao valor original?',
    resposta: '(a) 200 · 1,10 · 0,90 = R$ 198,00. (b) O desconto de 10% incide sobre um valor maior (R$ 220,00); o fator total é 1,1 · 0,9 = 0,99 (−1%).',
    digital: 'Calculadora e planilha'
  },
  trig_triangulo: {
    nome: 'Trigonometria no triângulo retângulo', serie: 1, kw: ['trigonometria', 'seno', 'cosseno', 'tangente', 'triângulo retângulo', 'triangulo retangulo', 'inclinação', 'rampa'],
    hab: ['EM13MAT308'],
    conceitos: ['razões seno, cosseno e tangente', 'ângulos notáveis', 'inclinação e ângulo', 'medidas inacessíveis'],
    contexto: 'rampas de acessibilidade e medição de alturas',
    problema: 'Uma rampa de acessibilidade deve ter inclinação de no máximo 8,33% (desnível ÷ comprimento horizontal). (a) Para vencer um desnível de 0,5 m, qual o comprimento horizontal mínimo da rampa? (b) Qual é, aproximadamente, o ângulo de inclinação?',
    resposta: '(a) 0,5 ÷ 0,0833 ≈ 6 m. (b) tg α = 0,0833 → α ≈ 4,8°.',
    digital: 'App de clinômetro no celular + GeoGebra'
  },
  leis_seno_cosseno: {
    nome: 'Lei dos senos e lei dos cossenos', serie: 2, kw: ['lei dos senos', 'lei dos cossenos', 'triângulos quaisquer', 'triangulos quaisquer'],
    hab: ['EM13MAT308'],
    conceitos: ['lei dos senos', 'lei dos cossenos', 'triângulos não retângulos', 'cálculo de distâncias'],
    contexto: 'navegação, topografia e distâncias em trilhas',
    problema: 'Dois amigos partem do mesmo ponto por trilhas que formam um ângulo de 60° entre si. Um caminha 3 km e o outro 5 km. Qual é a distância entre eles ao final?',
    resposta: 'd² = 3² + 5² − 2 · 3 · 5 · cos 60° = 9 + 25 − 15 = 19 → d = √19 ≈ 4,36 km.',
    digital: 'GeoGebra (construção do triângulo)'
  },
  funcoes_trig: {
    nome: 'Funções trigonométricas e fenômenos periódicos', serie: 2, kw: ['função seno', 'função cosseno', 'funções trigonométricas', 'periódic', 'periodic', 'ciclo trigonométrico', 'marés', 'ondas'],
    hab: ['EM13MAT306'],
    conceitos: ['ciclo trigonométrico e radianos', 'período, amplitude e imagem', 'gráficos de seno e cosseno', 'modelagem de fenômenos periódicos'],
    contexto: 'roda-gigante, marés e ondas sonoras',
    problema: 'A altura (em metros) de uma cadeira de roda-gigante é h(t) = 12 − 10 · cos(πt/15), com t em minutos. (a) Qual a altura mínima e a máxima? (b) Quanto tempo dura uma volta completa?',
    resposta: '(a) Mínima: 12 − 10 = 2 m; máxima: 12 + 10 = 22 m. (b) Período = 2π ÷ (π/15) = 30 minutos.',
    digital: 'GeoGebra ou Desmos (controles deslizantes)'
  },
  areas_planas: {
    nome: 'Áreas e perímetros de figuras planas', serie: 1, kw: ['área', 'areas', 'perímetro', 'perimetro', 'figuras planas', 'piso', 'terreno'],
    hab: ['EM13MAT307', 'EM13MAT201', 'EM13MAT506'],
    conceitos: ['decomposição e reconfiguração de figuras', 'fórmulas de área', 'estimativa e aproximação', 'áreas em situações reais'],
    contexto: 'reforma de espaços da escola e planejamento de hortas',
    problema: 'A escola vai revestir um pátio retangular de 18 m × 12 m com placas de 0,6 m × 0,6 m. Considerando 10% a mais por perdas no corte, quantas placas devem ser compradas?',
    resposta: 'Área = 216 m²; cada placa = 0,36 m² → 600 placas. Com 10% de perda: 660 placas.',
    digital: 'GeoGebra ou planta baixa no papel quadriculado'
  },
  semelhanca: {
    nome: 'Semelhança e congruência de triângulos', serie: 1, kw: ['semelhança', 'semelhanca', 'congruência', 'congruencia', 'tales', 'sombra'],
    hab: ['EM13MAT308'],
    conceitos: ['casos de semelhança', 'razão de semelhança', 'teorema de Tales', 'medidas indiretas'],
    contexto: 'medição de alturas pela sombra e ampliação de imagens',
    problema: 'Em um mesmo horário, um poste projeta uma sombra de 4 m e um estudante de 1,60 m projeta uma sombra de 0,80 m. Qual é a altura do poste?',
    resposta: 'Triângulos semelhantes: h ÷ 4 = 1,60 ÷ 0,80 → h = 8 m.',
    digital: 'Trena e celular (fotos para medição)'
  },
  geometria_espacial: {
    nome: 'Geometria espacial: áreas e volumes', serie: 2, kw: ['geometria espacial', 'volume', 'volumes', 'prisma', 'pirâmide', 'piramide', 'cilindro', 'cone', 'esfera', 'sólidos', 'cavalieri'],
    hab: ['EM13MAT309', 'EM13MAT504', 'EM13MAT201'],
    conceitos: ['prismas, pirâmides e corpos redondos', 'área total (planificação)', 'volume e capacidade', 'princípio de Cavalieri'],
    contexto: 'embalagens, caixas-d’água e construção civil',
    problema: 'Uma caixa-d’água cilíndrica tem 1,2 m de diâmetro e 1,5 m de altura. Qual a sua capacidade em litros? (use π ≈ 3,14)',
    resposta: 'V = π · r² · h = 3,14 · 0,6² · 1,5 ≈ 1,696 m³ ≈ 1 696 litros.',
    digital: 'GeoGebra 3D e embalagens recicladas'
  },
  transformacoes: {
    nome: 'Transformações geométricas e ladrilhamentos', serie: 1, kw: ['transformações', 'transformacoes', 'isometria', 'simetria', 'translação', 'reflexão', 'rotação', 'homotetia', 'ladrilhamento', 'mosaico', 'fractal'],
    hab: ['EM13MAT105', 'EM13MAT505'],
    conceitos: ['translação, reflexão e rotação', 'homotetia (ampliação e redução)', 'ladrilhamento do plano', 'padrões na arte e na natureza'],
    contexto: 'azulejos, arte urbana, grafismos indígenas e fractais',
    problema: 'Quais polígonos regulares, sozinhos, conseguem ladrilhar o plano sem sobras nem sobreposições? Justifique usando a medida dos ângulos internos.',
    resposta: 'Apenas o triângulo equilátero (60° · 6 = 360°), o quadrado (90° · 4 = 360°) e o hexágono regular (120° · 3 = 360°): somente eles têm ângulo interno que divide 360°.',
    digital: 'GeoGebra (ferramentas de transformação)'
  },
  combinatoria: {
    nome: 'Análise combinatória', serie: 2, kw: ['combinatória', 'combinatoria', 'contagem', 'princípio multiplicativo', 'permutação', 'permutacao', 'arranjo', 'combinação', 'combinacao', 'senha'],
    hab: ['EM13MAT310'],
    conceitos: ['princípio multiplicativo e aditivo', 'diagrama de árvore', 'agrupamentos em que a ordem importa', 'agrupamentos em que a ordem não importa'],
    contexto: 'senhas, placas de veículos e montagem de times',
    problema: 'Uma senha tem 4 algarismos. (a) Quantas senhas são possíveis se os algarismos forem distintos? (b) E se puderem se repetir?',
    resposta: '(a) 10 · 9 · 8 · 7 = 5 040 senhas. (b) 10⁴ = 10 000 senhas.',
    digital: 'Python ou planilha para listar casos'
  },
  probabilidade: {
    nome: 'Probabilidade', serie: 2, kw: ['probabilidade', 'chance', 'espaço amostral', 'espaco amostral', 'evento', 'aleatório', 'aleatorio', 'sorteio', 'dados e moedas'],
    hab: ['EM13MAT311', 'EM13MAT312', 'EM13MAT106', 'EM13MAT511'],
    conceitos: ['espaço amostral e eventos', 'probabilidade da união', 'eventos sucessivos e independentes', 'decisões considerando riscos'],
    contexto: 'jogos, sorteios, previsão do tempo e decisões de saúde',
    problema: 'Em uma turma de 40 estudantes, 25 praticam esporte, 18 gostam de leitura e 10 fazem as duas coisas. Sorteando um estudante, qual a probabilidade de ele praticar esporte ou gostar de leitura?',
    resposta: 'P = (25 + 18 − 10) ÷ 40 = 33 ÷ 40 = 82,5%.',
    digital: 'Simulação com dados/moedas e planilha'
  },
  estatistica: {
    nome: 'Estatística: medidas de tendência central e dispersão', serie: 3, kw: ['estatística', 'estatistica', 'média', 'mediana', 'moda', 'desvio padrão', 'desvio padrao', 'variância', 'dispersão', 'pesquisa amostral'],
    hab: ['EM13MAT316', 'EM13MAT202', 'EM13MAT406'],
    conceitos: ['média, moda e mediana', 'amplitude, variância e desvio padrão', 'amostra e população', 'pesquisa amostral e relatório'],
    contexto: 'notas, tempo de tela e pesquisas na comunidade escolar',
    problema: 'As notas de dois grupos foram: A = 6, 7, 7, 8, 7 e B = 3, 10, 5, 10, 7. Calcule a média, a mediana e a amplitude de cada grupo. Qual grupo tem desempenho mais homogêneo?',
    resposta: 'A: média 7, mediana 7, amplitude 2. B: média 7, mediana 7, amplitude 7. Mesma média, mas o grupo A é mais homogêneo (menor dispersão).',
    digital: 'Planilha eletrônica ou Google Forms'
  },
  graficos: {
    nome: 'Gráficos estatísticos e leitura crítica de dados', serie: 3, kw: ['gráfico', 'grafico', 'gráficos', 'histograma', 'box-plot', 'boxplot', 'tabela de frequência', 'fake news', 'leitura de dados'],
    hab: ['EM13MAT102', 'EM13MAT406', 'EM13MAT407'],
    conceitos: ['tabelas de frequência', 'histograma e box-plot', 'escolha do gráfico adequado', 'gráficos enganosos (escalas e amostras)'],
    contexto: 'gráficos de notícias e redes sociais',
    problema: 'Uma notícia mostra um gráfico de barras com vendas de 980 e 1 000 unidades, mas o eixo vertical começa em 970. (a) Visualmente, quantas vezes uma barra parece maior que a outra? (b) Qual é a diferença percentual real? (c) Refaça o gráfico corretamente.',
    resposta: '(a) As barras têm alturas 10 e 30 → parece 3 vezes maior. (b) (1000 − 980) ÷ 980 ≈ 2%. (c) O eixo deve começar em zero.',
    digital: 'Planilha eletrônica'
  },
  sistemas: {
    nome: 'Sistemas de equações lineares', serie: 2, kw: ['sistema', 'sistemas lineares', 'equações lineares', 'matriz', 'matrizes', 'escalonamento'],
    hab: ['EM13MAT301'],
    conceitos: ['modelagem com duas ou mais incógnitas', 'métodos algébricos (substituição e adição)', 'interpretação gráfica', 'sistemas possíveis e impossíveis'],
    contexto: 'bilheterias, misturas e orçamento',
    problema: 'Em um show foram vendidos 300 ingressos, arrecadando R$ 10.800,00. A inteira custava R$ 50,00 e a meia-entrada R$ 25,00. Quantas inteiras e quantas meias foram vendidas?',
    resposta: 'x + y = 300 e 50x + 25y = 10 800 → 25x = 3 300 → x = 132 inteiras e y = 168 meias.',
    digital: 'GeoGebra (interseção de retas)'
  },
  grandezas: {
    nome: 'Grandezas, medidas e notação científica', serie: 1, kw: ['grandezas', 'notação científica', 'notacao cientifica', 'unidades de medida', 'energia elétrica', 'kwh', 'velocidade', 'densidade', 'bytes', 'conversão'],
    hab: ['EM13MAT314', 'EM13MAT313', 'EM13MAT103'],
    conceitos: ['grandezas formadas por razão ou produto', 'conversão de unidades', 'notação científica e algarismos significativos', 'consumo de energia'],
    contexto: 'conta de luz, velocidade de internet e armazenamento de dados',
    problema: 'Um chuveiro de 5 500 W fica ligado 20 minutos por dia. (a) Quantos kWh consome em 30 dias? (b) Com tarifa de R$ 0,80 por kWh, quanto custa por mês?',
    resposta: '(a) 5,5 kW · (1/3) h · 30 = 55 kWh. (b) 55 · 0,80 = R$ 44,00.',
    digital: 'Conta de luz real + calculadora'
  },
  algoritmos: {
    nome: 'Algoritmos, fluxogramas e programação', serie: 1, kw: ['algoritmo', 'fluxograma', 'programação', 'programacao', 'python', 'scratch', 'pensamento computacional'],
    hab: ['EM13MAT315', 'EM13MAT405'],
    conceitos: ['sequência, decisão e repetição', 'fluxogramas', 'variáveis', 'implementação em linguagem de programação'],
    contexto: 'automatização de cálculos do dia a dia',
    problema: 'Elabore um fluxograma e depois um programa que receba três notas, calcule a média e informe "Aprovado" se a média for maior ou igual a 6 e "Recuperação" caso contrário.',
    resposta: 'Ler n1, n2, n3 → media = (n1 + n2 + n3) / 3 → se media ≥ 6 escrever "Aprovado", senão "Recuperação". Ex. em Python: m = (n1+n2+n3)/3; print("Aprovado" if m >= 6 else "Recuperação").',
    digital: 'Python (Google Colab) ou Scratch'
  },
  correlacao: {
    nome: 'Duas variáveis: dispersão e reta de ajuste', serie: 3, kw: ['correlação', 'correlacao', 'dispersão', 'regressão', 'regressao', 'duas variáveis', 'reta de ajuste'],
    hab: ['EM13MAT510', 'EM13MAT406'],
    conceitos: ['gráfico de dispersão', 'tendência e correlação', 'reta que descreve a relação', 'previsões e seus limites'],
    contexto: 'medidas do corpo, horas de estudo e desempenho',
    problema: 'Meçam a altura e a envergadura (braços abertos) de 10 colegas. Construam o gráfico de dispersão e tracem uma reta que descreva a relação. A envergadura é aproximadamente igual à altura?',
    resposta: 'Espera-se pontos próximos da reta y = x (envergadura ≈ altura), com pequenas variações individuais. Discuta correlação × causalidade.',
    digital: 'Planilha (linha de tendência) ou GeoGebra'
  },
  cartografia: {
    nome: 'Projeções cartográficas', serie: 3, kw: ['projeção', 'projecao', 'cartografia', 'mercator', 'mapa'],
    hab: ['EM13MAT509'],
    conceitos: ['projeção cilíndrica e cônica', 'deformação de áreas e ângulos', 'escala', 'comparação mapa × globo'],
    contexto: 'mapas-múndi e aplicativos de navegação',
    problema: 'No mapa de Mercator, a Groenlândia parece ter tamanho parecido com o do Brasil. Pesquise as áreas reais (Brasil ≈ 8,5 milhões de km²; Groenlândia ≈ 2,2 milhões de km²). Quantas vezes o Brasil é maior? Por que o mapa engana?',
    resposta: '8,5 ÷ 2,2 ≈ 3,9 vezes. A projeção cilíndrica de Mercator preserva ângulos, mas amplia áreas próximas aos polos.',
    digital: 'Site The True Size Of e Google Earth'
  }
};

const SERIES = { 1: '1º ano do Ensino Médio', 2: '2º ano do Ensino Médio', 3: '3º ano do Ensino Médio' };
const habTopicos = (code) => Object.entries(TOPICOS).filter(([, t]) => t.hab.includes(code)).map(([k]) => k);

/* Materiais iniciais da rede — Matemática do Ensino Médio (contribuições fictícias) */
const SEED_MATERIAIS = [
  { id: 'seed1', autor: 'Prof. Ricardo Alves', escola: 'Colégio Horizonte', titulo: 'Parábolas no basquete: função quadrática com vídeos', metodologia: 'problemas', area: 'matematica', nivel: 'medio', serie: 1, topico: 'funcao_quadratica', tipo: 'Atividade', descricao: 'Os estudantes filmam arremessos, marcam pontos da trajetória no GeoGebra e ajustam uma parábola. Depois investigam altura máxima e alcance. Engajamento altíssimo na 1ª série.', tags: ['parábola', 'GeoGebra', 'esporte'], curtidas: 64, data: '2026-10-28' },
  { id: 'seed2', autor: 'Profa. Helena Duarte', escola: 'E.E. Monteiro Lobato', titulo: 'Simulador de juros: o cartão de crédito vale a pena?', metodologia: 'caso', area: 'matematica', nivel: 'medio', serie: 1, topico: 'financeira', tipo: 'Atividade', descricao: 'Estudo de caso de uma família que entrou no rotativo do cartão. Os grupos montam uma planilha comparando juros simples e compostos e propõem um plano de quitação.', tags: ['planilha', 'educação financeira'], curtidas: 71, data: '2026-10-15' },
  { id: 'seed3', autor: 'Profa. Camila Torres', escola: 'E.M. Paulo Freire', titulo: 'Guia rápido: sala de aula invertida em Matemática', metodologia: 'invertida', area: 'matematica', nivel: 'medio', serie: 1, topico: 'funcao_afim', tipo: 'Guia de metodologia', descricao: 'Passo a passo para inverter a aula de funções: vídeos de até 8 minutos, roteiro de estudo, quiz de entrada e o que fazer com quem não estudou antes.', tags: ['guia', 'formação'], curtidas: 82, data: '2026-09-30' },
  { id: 'seed4', autor: 'Prof. André Lima', escola: 'IFSP Campus Norte', titulo: 'Banco de questões conceituais de probabilidade (Peer Instruction)', metodologia: 'pares', area: 'matematica', nivel: 'medio', serie: 2, topico: 'probabilidade', tipo: 'Banco de questões', descricao: '18 questões conceituais com distratores baseados em erros comuns (ex.: "falácia do apostador"). A taxa de acerto subiu de 42% para 78% após a discussão em pares.', tags: ['probabilidade', 'votação'], curtidas: 49, data: '2026-10-11' },
  { id: 'seed5', autor: 'Profa. Juliana Rocha', escola: 'Escola Viva', titulo: 'Projeto: pesquisa estatística sobre tempo de tela', metodologia: 'abp', area: 'matematica', nivel: 'medio', serie: 3, topico: 'estatistica', tipo: 'Projeto', descricao: 'Projeto de 5 semanas: os estudantes planejam a amostra, aplicam questionário, calculam média, mediana e desvio padrão e apresentam um relatório para as famílias.', tags: ['pesquisa amostral', 'desvio padrão'], curtidas: 58, data: '2026-09-22' },
  { id: 'seed6', autor: 'Prof. Carlos Mendes', escola: 'Colégio Estadual Anísio Teixeira', titulo: 'Roda-gigante trigonométrica — rotação por estações', metodologia: 'estacoes', area: 'matematica', nivel: 'medio', serie: 2, topico: 'funcoes_trig', tipo: 'Sequência didática', descricao: 'Quatro estações: modelo físico com prato giratório, simulação no Desmos, leitura de gráficos de marés e mesa com o professor para período e amplitude.', tags: ['seno', 'cosseno', 'Desmos'], curtidas: 45, data: '2026-09-05' },
  { id: 'seed7', autor: 'Profa. Beatriz Nogueira', escola: 'E.E. Cecília Meireles', titulo: 'Jigsaw de geometria espacial: cada grupo, um sólido', metodologia: 'jigsaw', area: 'matematica', nivel: 'medio', serie: 2, topico: 'geometria_espacial', tipo: 'Atividade', descricao: 'Especialistas em prismas, pirâmides, cilindros e cones. Cada especialista ensina planificação e volume; ao final, o grupo calcula o material de uma embalagem real.', tags: ['sólidos', 'embalagens'], curtidas: 37, data: '2026-10-20' },
  { id: 'seed8', autor: 'Prof. Tiago Ferreira', escola: 'Escola Técnica Santos Dumont', titulo: 'Desafio maker: clinômetro de transferidor para medir alturas', metodologia: 'maker', area: 'matematica', nivel: 'medio', serie: 1, topico: 'trig_triangulo', tipo: 'Atividade', descricao: 'Construção de clinômetro com transferidor, canudo e barbante. Os estudantes medem a altura de prédios da escola com tangente e comparam com o app do celular.', tags: ['tangente', 'medidas inacessíveis'], curtidas: 53, data: '2026-08-14' },
  { id: 'seed9', autor: 'Profa. Lúcia Prado', escola: 'E.M. Rubem Alves', titulo: 'Gamificação: Escape room de logaritmos', metodologia: 'gamificacao', area: 'matematica', nivel: 'medio', serie: 1, topico: 'logaritmo', tipo: 'Atividade', descricao: 'Cinco cadeados, cada um aberto com um desafio de logaritmo (pH, Richter, decibéis). As equipes ganham pistas extras ao explicar a propriedade usada.', tags: ['escape room', 'pH', 'Richter'], curtidas: 67, data: '2026-10-02' },
  { id: 'seed10', autor: 'Prof. Eduardo Santos', escola: 'Colégio Horizonte', titulo: 'Design Thinking: redesenhando a conta de luz da escola', metodologia: 'design', area: 'matematica', nivel: 'medio', serie: 1, topico: 'grandezas', tipo: 'Projeto', descricao: 'Os estudantes entrevistaram funcionários, analisaram o consumo em kWh e prototiparam campanhas de economia de energia. A conta caiu 12% no bimestre.', tags: ['kWh', 'sustentabilidade'], curtidas: 41, data: '2026-07-28' }
];
