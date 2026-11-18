/* =========================================================
   MetodologIA — Domínio da aula (SIMULADO)
   Ícones, contexto do pedido, perguntas de refinamento,
   três propostas de aula e os sete materiais gerados.
   ========================================================= */
(function (global) {
  const { esc, cap } = AI;

  /* ---------- Ícones (traço, 24x24) ---------- */
  const P = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    sparkles: '<path d="M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    book: '<path d="M2 5.5A1.5 1.5 0 0 1 3.5 4H9a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H2z"/><path d="M22 5.5A1.5 1.5 0 0 0 20.5 4H15a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H22z"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7"/><path d="M12 17h.01"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    pencil: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7"/><path d="M18 14a6 6 0 0 1 3.5 6"/>',
    calc: '<rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M8 6.5h8"/><path d="M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 18.5h.01M12 18.5h.01M16 18.5h.01"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    chevron: '<path d="M9 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 21h16"/>',
    save: '<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v5h7V3"/><path d="M8 21v-7h8v7"/>',
    leaf: '<path d="M5 20c0-9 5-15 15-15 0 10-6 15-14 15"/><path d="M5 20c3-4.5 6.5-7 10.5-9"/>',
    ruler: '<path d="M3 17 17 3l4 4L7 21z"/><path d="M7.5 12.5l2 2M10.5 9.5l2 2M13.5 6.5l2 2"/>',
    bridge: '<path d="M2 18h20"/><path d="M4 18v-8h16v8"/><path d="M4 10l4 8 4-8 4 8 4-8"/>',
    file: '<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4"/><path d="M9 13h6M9 17h6"/>',
    slides: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M12 16v4M8 20h8"/><path d="M7 12l3-3 2 2 4-4"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2.5h6V4"/><path d="M9 11l2 2 4-4"/><path d="M9 17h6"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    upload: '<path d="M12 20V8M7 13l5-5 5 5"/><path d="M4 4h16"/>',
    heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    logout: '<path d="M15 4h4v16h-4"/><path d="M10 8l-4 4 4 4M6 12h11"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
    triangle: '<path d="M4 20 12 4l8 16z"/><path d="M8 14h8"/>',
    printer: '<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
    note: '<path d="M4 4h16v12l-4 4H4z"/><path d="M16 20v-4h4"/><path d="M8 9h8M8 13h5"/>',
    flag: '<path d="M5 21V4h11l-2 4 2 4H5"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    dice: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .8-3 2s1.3 1.7 3 2 3 .8 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6v12"/>',
    wave: '<path d="M2 12c2.5-5 5-5 7.5 0s5 5 7.5 0 3.5-3.5 5-2"/>'
  };
  const icon = (name, size = 20, cls = '') => `<svg class="ico ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || P.sparkles}</svg>`;

  const HERO_SVG = `<svg viewBox="0 0 230 150" class="hero-illu" role="img" aria-label="Ilustração de sólidos geométricos: cilindro, cubo e pirâmide">
    <ellipse cx="118" cy="132" rx="96" ry="10" fill="#e9e6ff"/>
    <g stroke="#0F5968" stroke-width="1.5"><path d="M38 70v42c0 5 10 9 22 9s22-4 22-9V70" fill="#d6eee8"/><ellipse cx="60" cy="70" rx="22" ry="8" fill="#e8f6f2"/></g>
    <g stroke="#5b43e0" stroke-width="1.5" stroke-linejoin="round"><path d="M86 42l40-20 40 20-40 20z" fill="#d9d1ff"/><path d="M86 42v50l40 22V62z" fill="#b4a5ff"/><path d="M166 42v50l-40 22V62z" fill="#9580ff"/><path d="M86 92l40-20 40 20M126 22v50" stroke-dasharray="3 3" fill="none" opacity=".5"/></g>
    <g stroke="#b7811a" stroke-width="1.5" stroke-linejoin="round"><path d="M192 50l-22 64h30z" fill="#F4B942"/><path d="M192 50l8 64 22-12z" fill="#f8d27f"/></g>
    <g fill="#F4B942"><path d="M30 30l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/></g><g fill="#6B4EFF"><path d="M200 18l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z"/></g>
    <circle cx="20" cy="60" r="2" fill="#c9c3ef"/><circle cx="214" cy="80" r="2.5" fill="none" stroke="#c9c3ef"/><circle cx="76" cy="18" r="2.5" fill="none" stroke="#c9c3ef"/>
  </svg>`;

  /* ---------- Contexto do pedido ---------- */
  const GRUPO = {
    funcao_afim: 'Funções', funcao_quadratica: 'Funções', funcao_exponencial: 'Funções', logaritmo: 'Funções', funcao_partes: 'Funções', progressoes: 'Sequências',
    financeira: 'Matemática Financeira', porcentagem: 'Matemática Financeira', trig_triangulo: 'Trigonometria', leis_seno_cosseno: 'Trigonometria', funcoes_trig: 'Trigonometria',
    areas_planas: 'Geometria', semelhanca: 'Geometria', geometria_espacial: 'Geometria', transformacoes: 'Geometria', combinatoria: 'Combinatória', probabilidade: 'Probabilidade',
    estatistica: 'Estatística', graficos: 'Estatística', sistemas: 'Álgebra', grandezas: 'Grandezas e Medidas', algoritmos: 'Pensamento Computacional', correlacao: 'Estatística', cartografia: 'Geometria'
  };

  function contexto(texto) {
    const p = AI.parse(texto || '');
    const t = p.topico ? TOPICOS[p.topico] : null;
    return {
      disciplina: 'Matemática',
      serie: p.serie || null,
      turma: p.serie ? `${p.serie}º ano do Ensino Médio` : null,
      minutos: p.minutos || null,
      topico: p.topico || null,
      objetivo: t ? t.nome.split(':')[0].replace(/\s*\(.*\)/, '') : (p.tema ? cap(p.tema) : null),
      metodologia: p.metodologia || null,
      inclusao: !!p.inclusao
    };
  }

  /* ---------- Perguntas de refinamento ---------- */
  function perguntas(ctx) {
    const t = ctx.topico ? TOPICOS[ctx.topico] : null;
    const conteudos = ctx.topico === 'geometria_espacial' ? ['Volumes', 'Áreas de sólidos', 'Planificações', 'Escalas e proporções']
      : t ? t.conceitos.map(cap) : ['Conceitos fundamentais', 'Resolução de problemas', 'Representações gráficas', 'Aplicações no cotidiano'];
    return [
      { id: 'conteudo', titulo: 'Qual conteúdo deve ter prioridade?', ajuda: 'Escolha o que a turma mais precisa aprofundar.', opcoes: conteudos, padrao: conteudos.slice(0, 2) },
      { id: 'recursos', titulo: 'Quais recursos estão disponíveis?', ajuda: 'Vamos considerar o que você já tem à mão.', opcoes: ['Papel e tesoura', 'Laboratório', 'Celulares', 'Materiais recicláveis'], padrao: ['Celulares', 'Materiais recicláveis'] },
      { id: 'produto', titulo: 'Qual produto final você espera?', ajuda: 'O que a turma vai entregar ao final da aula.', opcoes: ['Protótipo', 'Apresentação', 'Resolução de problema', 'Quiz'], padrao: ['Protótipo', 'Apresentação'] }
    ];
  }
  const juntar = (arr) => arr.length <= 1 ? (arr[0] || '') : arr.slice(0, -1).join(', ') + ' e ' + arr[arr.length - 1];

  /* ---------- Propostas ---------- */
  const RUBRICA_PADRAO = [
    { nome: 'Raciocínio matemático', desc: 'Escolhe estratégias, calcula corretamente e verifica se o resultado faz sentido.' },
    { nome: 'Representação gráfica', desc: 'Usa desenhos, planificações, tabelas ou esquemas com medidas e unidades.' },
    { nome: 'Colaboração', desc: 'Participa, cumpre seu papel no grupo e escuta os colegas.' },
    { nome: 'Argumentação', desc: 'Justifica as decisões do grupo com base nos cálculos.' }
  ];

  function geometriaEspacial() {
    return [
      {
        id: 'embalagem', tema: 'Matemática no cotidiano', titulo: 'Embalagem sustentável', metodologia: 'problemas', metodologiaLabel: 'Aprendizagem baseada em problemas',
        foco: 'Área total e volume de prismas e cilindros.', desafio: 'Criar uma embalagem com materiais recicláveis que acomode um produto usando menos material.',
        produto: 'Protótipo físico e cálculo justificado.', icone: 'leaf', cor: 'green', figura: 'embalagem', hab: ['EM13MAT309', 'EM13MAT201', 'EM13MAT504'],
        objetivo: 'Calcular a área total e o volume de prismas e cilindros para decidir qual embalagem acomoda um produto usando menos material.',
        etapas: [
          ['Abertura', 10, 'Situação-problema sobre desperdício de embalagem.'],
          ['Investigação', 20, 'Estimativa de área e volume de embalagens reais.'],
          ['Construção', 40, 'Criação de uma embalagem em grupos com materiais recicláveis.'],
          ['Socialização', 20, 'Apresentação das decisões e dos cálculos de cada grupo.'],
          ['Avaliação', 10, 'Rubrica de raciocínio matemático, representação gráfica, colaboração e argumentação.']
        ],
        situacao: 'Uma marca de chocolates quer reduzir o lixo das embalagens. Cada caixa atual usa muito papelão para guardar 12 bombons. Vocês foram contratados para propor uma embalagem que guarde o mesmo produto gastando menos material.',
        roteiro: ['Meçam com régua ou com o celular duas embalagens reais (uma caixa e uma lata) e registrem as medidas.', 'Calculem a área total e o volume de cada embalagem e comparem: quanto material é gasto por cm³ guardado?', 'Desenhem a planificação da nova embalagem, com as medidas, antes de cortar.', 'Construam o protótipo com materiais recicláveis e conferam se o produto cabe.', 'Calculem a área total do protótipo e comparem com a embalagem original (economia em %).', 'Preparem uma apresentação de 3 minutos com as decisões e os cálculos.'],
        quiz: [
          { q: 'Uma caixa em forma de prisma retangular mede 10 cm × 6 cm × 4 cm. Qual é o seu volume?', a: ['240 cm³', '200 cm³', '120 cm³', '20 cm³'], c: 0, e: 'V = 10 · 6 · 4 = 240 cm³.' },
          { q: 'Qual é a área total da mesma caixa?', a: ['124 cm²', '248 cm²', '240 cm²', '496 cm²'], c: 1, e: 'A = 2(10·6 + 10·4 + 6·4) = 2 · 124 = 248 cm².' },
          { q: 'Uma lata cilíndrica tem raio de 3 cm e altura de 10 cm. Qual é o volume aproximado? (π ≈ 3,14)', a: ['94,2 cm³', '188,4 cm³', '282,6 cm³', '565,2 cm³'], c: 2, e: 'V = π · r² · h = 3,14 · 9 · 10 = 282,6 cm³.' },
          { q: 'Qual é a área lateral dessa lata?', a: ['188,4 cm²', '94,2 cm²', '282,6 cm²', '56,5 cm²'], c: 0, e: 'Aₗ = 2 · π · r · h = 2 · 3,14 · 3 · 10 = 188,4 cm².' },
          { q: 'Duas embalagens guardam o mesmo volume. Qual delas gasta menos material?', a: ['A mais alta', 'A que tem a maior base', 'A que tem a menor área total', 'Sempre a cilíndrica'], c: 2, e: 'O material gasto corresponde à área total. Entre caixas de mesmo volume, as mais próximas do cubo usam menos material.' }
        ]
      },
      {
        id: 'praca', tema: 'Geometria que ocupa espaços', titulo: 'Arquitetura e escala', metodologia: 'abp', metodologiaLabel: 'Aprendizagem por projeto',
        foco: 'Escala, proporção, área e representação espacial.', desafio: 'Criar a planta de uma praça escolar acessível.',
        produto: 'Planta, maquete ou modelo digital.', icone: 'ruler', cor: 'violet', figura: 'praca', hab: ['EM13MAT201', 'EM13MAT307', 'EM13MAT105'],
        objetivo: 'Usar escala, proporção e cálculo de áreas para representar e planejar um espaço escolar acessível.',
        etapas: [
          ['Abertura', 10, 'Fotos do espaço escolar e apresentação do desafio da praça.'],
          ['Medição', 20, 'Medição do terreno com trena ou celular e escolha da escala.'],
          ['Projeto', 40, 'Desenho da planta em escala e cálculo das áreas de cada espaço.'],
          ['Socialização', 20, 'Apresentação das plantas e das escolhas de acessibilidade.'],
          ['Avaliação', 10, 'Rubrica e autoavaliação do grupo.']
        ],
        situacao: 'A escola recebeu um terreno de 20 m × 15 m e quer transformá-lo em uma praça de convivência acessível. A direção pediu à turma uma proposta de planta em escala.',
        roteiro: ['Meçam o terreno (ou usem as medidas 20 m × 15 m) e escolham uma escala que caiba na folha.', 'Listem os espaços da praça: bancos, canteiros, sombra, rampa e circulação.', 'Desenhem a planta em escala no papel quadriculado ou em um app de desenho.', 'Calculem a área real de cada espaço e o percentual do terreno ocupado.', 'Confiram a acessibilidade: rampa com inclinação de até 8,33% e caminhos de pelo menos 1,20 m.', 'Apresentem a planta justificando as escolhas.'],
        quiz: [
          { q: 'Na escala 1:100, um segmento de 5 cm no desenho representa quanto na realidade?', a: ['50 cm', '5 m', '50 m', '500 m'], c: 1, e: '5 cm · 100 = 500 cm = 5 m.' },
          { q: 'Um terreno de 20 m × 15 m desenhado na escala 1:200 mede no papel:', a: ['10 cm × 7,5 cm', '20 cm × 15 cm', '4 cm × 3 cm', '40 cm × 30 cm'], c: 0, e: '2 000 cm ÷ 200 = 10 cm; 1 500 cm ÷ 200 = 7,5 cm.' },
          { q: 'Qual é a área real de um canteiro de 4 m × 3 m?', a: ['7 m²', '12 m²', '14 m²', '24 m²'], c: 1, e: 'A = 4 · 3 = 12 m².' },
          { q: 'Se todas as medidas lineares de uma maquete são reduzidas à metade, a área:', a: ['também cai pela metade', 'fica dividida por 4', 'não muda', 'fica dividida por 8'], c: 1, e: 'Áreas variam com o quadrado da razão: (1/2)² = 1/4.' },
          { q: 'Uma rampa com inclinação de 8,33% vence um desnível de 0,5 m. Qual o comprimento horizontal mínimo?', a: ['0,6 m', '4,2 m', '6 m', '8,3 m'], c: 2, e: '0,5 ÷ 0,0833 ≈ 6 m.' }
        ]
      },
      {
        id: 'ponte', tema: 'Ideias que se sustentam', titulo: 'Desafio da ponte', metodologia: 'jigsaw', metodologiaLabel: 'Aprendizagem colaborativa',
        foco: 'Triângulos, estabilidade e relações geométricas.', desafio: 'Construir uma ponte de palitos que suporte uma carga definida.',
        produto: 'Protótipo e apresentação argumentativa.', icone: 'bridge', cor: 'yellow', figura: 'ponte', hab: ['EM13MAT308', 'EM13MAT201'],
        objetivo: 'Reconhecer a rigidez dos triângulos e aplicar relações métricas para projetar uma estrutura estável.',
        etapas: [
          ['Abertura', 10, 'Imagens de pontes reais: por que há tantos triângulos?'],
          ['Investigação', 20, 'Teste de rigidez: quadrado e triângulo feitos com palitos.'],
          ['Construção', 40, 'Construção da ponte em equipes com papéis definidos.'],
          ['Socialização', 20, 'Teste de carga e apresentação argumentativa.'],
          ['Avaliação', 10, 'Rubrica de raciocínio, representação, colaboração e argumentação.']
        ],
        situacao: 'Uma comunidade ribeirinha precisa de uma passarela leve. Antes da obra, os engenheiros testam modelos em escala. Sua equipe deve construir um modelo de ponte de palitos com vão de 30 cm que suporte 500 g.',
        roteiro: ['Montem um quadrado e um triângulo com palitos e elásticos e empurrem os vértices: qual se deforma?', 'Desenhem o projeto da ponte com as medidas e os ângulos de cada triângulo.', 'Calculem a quantidade de palitos necessária e a altura dos triângulos.', 'Construam a ponte respeitando o vão de 30 cm.', 'Testem a carga, adicionando pesos aos poucos, e registrem o resultado.', 'Apresentem por que a estrutura resistiu (ou não), usando argumentos geométricos.'],
        quiz: [
          { q: 'Por que o triângulo é usado em estruturas como pontes e telhados?', a: ['Porque é mais bonito', 'Porque, fixados os três lados, sua forma não se altera', 'Porque usa menos material que qualquer figura', 'Porque tem ângulos retos'], c: 1, e: 'Três lados determinam um único triângulo (caso LLL): a figura é rígida.' },
          { q: 'Qual é a soma dos ângulos internos de qualquer triângulo?', a: ['90°', '180°', '270°', '360°'], c: 1, e: 'A soma dos ângulos internos de um triângulo é 180°.' },
          { q: 'Um triângulo equilátero da ponte tem lado de 6 cm. Qual é a sua altura aproximada?', a: ['3 cm', '4,2 cm', '5,2 cm', '6 cm'], c: 2, e: 'h = l√3/2 = 6 · 1,73 ÷ 2 ≈ 5,2 cm.' },
          { q: 'Um triângulo isósceles tem lados 5 cm, 5 cm e base 6 cm. Qual a altura relativa à base?', a: ['3 cm', '4 cm', '5 cm', '6 cm'], c: 1, e: 'Pelo teorema de Pitágoras: h² = 5² − 3² = 16 → h = 4 cm.' },
          { q: 'Em uma treliça linear, quantos palitos são necessários para formar 5 triângulos encadeados?', a: ['10', '11', '15', '12'], c: 1, e: 'O primeiro triângulo usa 3 palitos e cada novo usa mais 2: 3 + 4 · 2 = 11.' }
        ]
      }
    ];
  }

  function genericas(ctx, refine) {
    const t = ctx.topico ? TOPICOS[ctx.topico] : null;
    const obj = ctx.objetivo || 'o conteúdo';
    const ctxs = t ? t.contexto.split(/ e |, /) : ['situações do cotidiano', 'a escola'];
    const foco = juntar(refine.conteudo.length ? refine.conteudo : (t ? t.conceitos.slice(0, 2).map(cap) : [obj]));
    const prod = juntar(refine.produto.map((p) => p.toLowerCase())) || 'resolução de problema';
    const hab = t ? t.hab.slice(0, 3) : [];
    const fasesDe = (key) => METODOLOGIAS[key].fases.filter((f) => f.pct > 0).map((f) => [f.nome, f.pct, f.desc]);
    const quizBase = t ? [{ q: t.problema, a: null, e: t.resposta }, ...t.conceitos.map((c) => ({ q: `Explique com suas palavras e dê um exemplo: ${c}.`, a: null, e: `Resposta pessoal. Espera-se que o estudante relacione "${c}" a ${t.contexto}.` }))] : [];
    const mk = (o) => ({ cor: 'green', icone: 'leaf', figura: 'generic', hab, quiz: quizBase, ...o });
    return [
      mk({
        id: 'p1', tema: 'Matemática no cotidiano', titulo: cap(ctxs[0]), metodologia: 'problemas', metodologiaLabel: 'Aprendizagem baseada em problemas',
        foco: foco + '.', desafio: t ? t.problema.split(/\. \(|\? \(/)[0].replace(/[.?]?$/, '.') : `Resolver uma situação real envolvendo ${obj}.`, produto: cap(prod) + ' com cálculo justificado.',
        objetivo: `Resolver problemas contextualizados de ${obj.toLowerCase()} a partir de ${t ? t.contexto : 'situações do cotidiano'}, analisando a plausibilidade dos resultados.`,
        etapas: fasesDe('problemas'), situacao: t ? `A turma foi convidada a analisar ${t.contexto} e propor uma solução fundamentada em Matemática.` : 'A turma foi convidada a analisar uma situação real e propor uma solução fundamentada.',
        roteiro: ['Leiam a situação-problema e listem o que já sabem e o que precisam descobrir.', 'Organizem os dados em uma tabela.', `Escolham um modelo matemático para ${obj.toLowerCase()} (expressão, gráfico ou esquema).`, 'Resolvam e verifiquem se o resultado faz sentido no contexto.', 'Preparem a apresentação da solução.']
      }),
      mk({
        id: 'p2', tema: 'Aprender fazendo', titulo: `Projeto: ${cap(ctxs[1] || ctxs[0])}`, metodologia: 'abp', metodologiaLabel: 'Aprendizagem por projeto', cor: 'violet', icone: 'ruler',
        foco: `${obj}: aplicação em um produto real.`, desafio: `Investigar ${ctxs[1] || ctxs[0]} na comunidade escolar e construir ${refine.produto.includes('Protótipo') ? 'um protótipo' : 'uma apresentação'} que use ${obj.toLowerCase()} para propor melhorias.`,
        produto: cap(prod) + '.', objetivo: `Aplicar ${obj.toLowerCase()} na construção de um produto que responda a uma questão real da comunidade escolar.`,
        etapas: fasesDe('abp'), situacao: `A escola quer entender melhor ${ctxs[1] || ctxs[0]} e pediu ajuda à turma.`,
        roteiro: ['Definam a pergunta do projeto e os papéis no grupo.', 'Coletem dados reais (medições, pesquisa ou fontes confiáveis).', 'Modelem os dados usando o conteúdo estudado.', 'Construam o produto final.', 'Apresentem e recebam feedback.']
      }),
      mk({
        id: 'p3', tema: 'Aprender juntos', titulo: `Missão ${GRUPO[ctx.topico] || obj}`, metodologia: 'gamificacao', metodologiaLabel: 'Gamificação colaborativa', cor: 'yellow', icone: 'star',
        foco: `Conceitos-chave de ${obj.toLowerCase()} com desafios crescentes.`, desafio: `Superar cinco missões em equipe sobre ${obj.toLowerCase()}, terminando com um desafio integrador.`,
        produto: 'Missões resolvidas e explicação do desafio final.', objetivo: `Consolidar ${obj.toLowerCase()} por meio de desafios colaborativos com feedback imediato.`,
        etapas: fasesDe('gamificacao'), situacao: `O conhecimento sobre ${obj.toLowerCase()} foi trancado em um cofre com cinco cadeados. Cada missão cumprida abre um cadeado.`,
        roteiro: ['Formem equipes de 4 com papéis: líder, escriba, guardião do tempo e porta-voz.', 'Resolvam as missões na ordem, validando cada uma com a professora.', 'Ajudem outra equipe para ganhar pontos de cooperação.', 'Resolvam o desafio final.', 'Registrem o que aprenderam.']
      })
    ];
  }

  function propostas(ctx, refine) {
    const lista = ctx.topico === 'geometria_espacial' ? geometriaEspacial() : genericas(ctx, refine);
    return lista.map((p) => ({ ...p, etapas: escalar(p.etapas, ctx.minutos || 100) }));
  }

  function escalar(etapas, minutos) {
    const total = etapas.reduce((a, e) => a + e[1], 0);
    const out = etapas.map((e) => ({ nome: e[0] ?? e.nome, min: Math.max(5, Math.round(((e[1] ?? e.min) * minutos) / total / 5) * 5), desc: e[2] ?? e.desc }));
    const diff = minutos - out.reduce((a, e) => a + e.min, 0);
    const maior = out.reduce((m, e, i) => (e.min > out[m].min ? i : m), 0);
    out[maior].min = Math.max(5, out[maior].min + diff);
    return out;
  }
  const reescalar = (etapas, minutos) => escalar(etapas.map((e) => [e.nome, e.min, e.desc]), minutos);

  /* ---------- Materiais ---------- */
  const MATERIAIS = [
    { id: 'plano', nome: 'Planejamento de aula em PDF', desc: 'Objetivos, etapas e organização do tempo', fmt: 'PDF', icone: 'file', tom: 'violet' },
    { id: 'apresentacao', nome: 'Apresentação da aula', desc: 'Uma sequência visual para conduzir a aula', fmt: 'PPTX', icone: 'slides', tom: 'orange' },
    { id: 'roteiro', nome: 'Roteiro da atividade prática', desc: 'Passo a passo, recursos e orientações', fmt: 'PDF', icone: 'clipboard', tom: 'green' },
    { id: 'rubrica', nome: 'Rubrica de avaliação', desc: 'Critérios claros para acompanhar a aprendizagem', fmt: 'PDF', icone: 'grid', tom: 'violet' },
    { id: 'quiz', nome: 'Quiz de revisão', desc: '5 questões para retomar os conceitos', fmt: 'PDF', icone: 'help', tom: 'orange' },
    { id: 'imagens', nome: 'Imagens explicativas da construção', desc: 'Referências visuais para apoiar os grupos', fmt: 'PNG', icone: 'image', tom: 'green' },
    { id: 'folha', nome: 'Folha de instruções para estudantes', desc: 'O desafio e os combinados em uma página', fmt: 'PDF', icone: 'book', tom: 'violet' }
  ];

  const ul = (a) => `<ul>${a.map((x) => `<li>${x}</li>`).join('')}</ul>`;
  const lines = (n) => `<div class="doc-lines">${'<span></span>'.repeat(n)}</div>`;

  function cab(aula, titulo) {
    const e = aula.user.escola || {};
    return `<div class="doc-student-head">${e.logo ? `<img src="${e.logo}" alt="" class="doc-logo">` : ''}<div><strong>${esc(e.nome || 'Escola')}</strong><br><span class="muted small">${esc(aula.ctx.disciplina)} · ${esc(aula.ctx.turma || 'Ensino Médio')} · Profa. ${esc(aula.user.nome || '')}</span></div><div class="doc-name">Nome: ______________________ Data: ___/___</div></div><h2 class="doc-student-title">${titulo}</h2>`;
  }
  const obs = (aula) => aula.custom.observacoes ? `<div class="doc-box warn"><h4>📌 Observações para a turma</h4><p style="white-space:pre-line">${esc(aula.custom.observacoes)}</p></div>` : '';

  function figura(tipo) {
    const s = 'stroke="#172033" stroke-width="1.5" fill="none"';
    if (tipo === 'embalagem') return `<svg viewBox="0 0 520 256" class="doc-fig" role="img" aria-label="Planificação de uma caixa e de um cilindro com medidas">
      <g ${s}><rect x="70" y="20" width="60" height="40" fill="#eef4ff"/><rect x="10" y="60" width="60" height="60" fill="#f3f0ff"/><rect x="70" y="60" width="60" height="60" fill="#eef4ff"/><rect x="130" y="60" width="60" height="60" fill="#f3f0ff"/><rect x="190" y="60" width="60" height="60" fill="#eef4ff"/><rect x="70" y="120" width="60" height="40" fill="#eef4ff"/></g>
      <g font-family="Inter,Arial" font-size="12" fill="#172033"><text x="88" y="140">c × l</text><text x="100" y="94">base</text><text x="18" y="94">lateral</text><text x="20" y="190">Área total = 2(cl + ca + la)</text><text x="20" y="210">Volume = c · l · a</text></g>
      <g ${s}><rect x="300" y="70" width="190" height="80" fill="#e8f6f2"/><circle cx="395" cy="40" r="30" fill="#e8f6f2"/><circle cx="395" cy="180" r="30" fill="#e8f6f2"/></g>
      <g font-family="Inter,Arial" font-size="12" fill="#172033"><text x="360" y="114">2πr × h</text><text x="388" y="44">r</text><text x="300" y="228">Área total = 2πr² + 2πrh</text><text x="300" y="246">Volume = πr²h</text></g></svg>`;
    if (tipo === 'praca') return `<svg viewBox="0 0 520 260" class="doc-fig" role="img" aria-label="Planta baixa de praça em escala">
      <defs><pattern id="g" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#e3e5ef"/></pattern></defs>
      <rect x="20" y="20" width="400" height="200" fill="url(#g)" stroke="#172033" stroke-width="2"/>
      <rect x="40" y="40" width="120" height="60" fill="#d6eee8" stroke="#0F5968"/><rect x="260" y="40" width="140" height="80" fill="#f3f0ff" stroke="#6B4EFF"/><rect x="40" y="150" width="200" height="20" fill="#fdf0d5" stroke="#b7811a"/><path d="M300 220v-60h100" fill="none" stroke="#172033" stroke-dasharray="4 4"/>
      <g font-family="Inter,Arial" font-size="12" fill="#172033"><text x="62" y="75">Canteiro 6 × 3 m</text><text x="280" y="85">Área de convivência</text><text x="60" y="164">Rampa (8,33%)</text><text x="310" y="200">Caminho 1,20 m</text><text x="20" y="245">Escala 1:100  ·  1 quadrado = 1 m</text></g>
      <g stroke="#172033"><path d="M440 200h60"/><path d="M440 195v10M500 195v10"/></g><text x="448" y="190" font-family="Inter,Arial" font-size="12">6 m</text></svg>`;
    if (tipo === 'ponte') return `<svg viewBox="0 0 520 220" class="doc-fig" role="img" aria-label="Treliça de ponte formada por triângulos com carga central">
      <path d="M20 160h480" stroke="#172033" stroke-width="3"/><path d="M60 160 100 90 140 160 180 90 220 160 260 90 300 160 340 90 380 160 420 90 460 160" fill="none" stroke="#b7811a" stroke-width="3"/><path d="M100 90h320" stroke="#b7811a" stroke-width="3"/>
      <path d="M260 20v50M250 60l10 12 10-12" stroke="#e5484d" stroke-width="2.5" fill="none"/><text x="272" y="40" font-family="Inter,Arial" font-size="12" fill="#e5484d">carga 500 g</text>
      <g font-family="Inter,Arial" font-size="12" fill="#172033"><text x="125" y="185">lado 6 cm</text><text x="20" y="210">Vão: 30 cm  ·  Triângulos equiláteros: altura ≈ 5,2 cm  ·  Quadrados se deformam; triângulos não.</text></g>
      <path d="M30 160l-10 18h20zM490 160l-10 18h20z" fill="#cfd3e6" stroke="#172033"/></svg>`;
    return `<svg viewBox="0 0 520 160" class="doc-fig" role="img" aria-label="Esquema: situação, modelo matemático, solução e verificação">
      ${['Situação real', 'Modelo matemático', 'Solução', 'Verificação'].map((l, i) => `<rect x="${10 + i * 128}" y="50" width="110" height="56" rx="10" fill="${['#eef4ff', '#f3f0ff', '#e8f6f2', '#fdf0d5'][i]}" stroke="#172033"/><text x="${65 + i * 128}" y="83" text-anchor="middle" font-family="Inter,Arial" font-size="13">${l}</text>${i < 3 ? `<path d="M${122 + i * 128} 78h14M${130 + i * 128} 72l6 6-6 6" stroke="#172033" fill="none"/>` : ''}`).join('')}</svg>`;
  }

  function gerarMaterial(id, aula) {
    const p = aula.proposta, c = aula.custom, ctx = aula.ctx;
    const met = METODOLOGIAS[c.metodologia] || METODOLOGIAS[p.metodologia];
    const metLabel = c.metodologia === p.metodologia ? p.metodologiaLabel : met.nome;
    const desafio = c.desafio || p.desafio;
    const etapas = c.etapas;
    const recursos = aula.refine.recursos;
    const rub = c.rubrica;
    const habs = p.hab.filter((h) => BNCC_HABILIDADES[h]);
    switch (id) {
      case 'plano': return `
        <table class="doc-table doc-info"><tr><th>Escola</th><td>${esc(aula.user.escola?.nome || '—')}</td><th>Professora</th><td>${esc(aula.user.nome)}</td></tr>
        <tr><th>Componente</th><td>${esc(ctx.disciplina)}</td><th>Turma</th><td>${esc(ctx.turma || 'Ensino Médio')}</td></tr>
        <tr><th>Aula</th><td>${esc(p.titulo)}</td><th>Duração</th><td>${c.minutos} minutos</td></tr>
        <tr><th>Metodologia</th><td colspan="3">${esc(metLabel)}</td></tr></table>
        <h3>🎯 Objetivo da aula</h3><p>${esc(c.objetivo)}</p>
        <h3>🧩 O desafio</h3><p>${esc(desafio)}</p><p><strong>Produto final:</strong> ${esc(p.produto)}</p>
        ${habs.length ? `<h3>📐 Habilidades da BNCC</h3><table class="doc-table">${habs.map((h) => `<tr><td class="nowrap"><strong>${h}</strong></td><td>${esc(BNCC_HABILIDADES[h])}</td></tr>`).join('')}</table>` : ''}
        <h3>🧠 Foco de aprendizagem</h3><p>${esc(p.foco)}${aula.refine.conteudo.length ? ` Prioridade definida: ${esc(juntar(aula.refine.conteudo))}.` : ''}</p>
        <h3>🧰 Recursos</h3>${ul([...recursos.map(esc), 'Régua ou trena, calculadora (pode ser a do celular)', 'Folha de instruções e rubrica impressas'])}
        <h3>🗓️ Etapas e organização do tempo</h3>
        <table class="doc-table"><thead><tr><th>Etapa</th><th>Tempo</th><th>O que acontece</th></tr></thead><tbody>${etapas.map((e) => `<tr><td><strong>${esc(e.nome)}</strong></td><td class="nowrap">${e.min} min</td><td>${esc(e.desc)}</td></tr>`).join('')}</tbody></table>
        <h3>📘 Sobre a metodologia</h3><p>${esc(met.resumo)}</p><p class="small muted">Papel da professora: ${esc(met.papelProf)}</p>
        <h3>✅ Avaliação</h3><p>Observação durante a atividade com a rubrica (${rub.map((r) => esc(r.nome.toLowerCase())).join(', ')}) e análise do produto final.</p>
        <h3>♿ Inclusão</h3>${ul(['Grupos heterogêneos com papéis definidos.', 'Instruções por escrito e oralmente, com um exemplo resolvido.', 'Formas alternativas de resposta: oral, desenho ou esquema.'])}
        ${obs(aula)}`;
      case 'apresentacao': {
        const slides = [
          ['Capa', `<h4>${esc(p.titulo)}</h4><p>${esc(ctx.disciplina)} · ${esc(ctx.turma || '')}</p>`],
          ['Situação-problema', `<p>${esc(p.situacao)}</p>`],
          ['Nosso desafio', `<p><strong>${esc(desafio)}</strong></p><p>Produto: ${esc(p.produto)}</p>`],
          ['O que vamos aprender', `<p>${esc(c.objetivo)}</p>`],
          ['Roteiro da aula', `<ol>${etapas.map((e) => `<li>${esc(e.nome)} · ${e.min} min</li>`).join('')}</ol>`],
          ['Como seremos avaliados', `<ul>${rub.map((r) => `<li>${esc(r.nome)}</li>`).join('')}</ul>`],
          ['Encerramento', '<p>O que aprendemos hoje? Que decisão tomaríamos de novo? O que mudaríamos?</p>']
        ];
        return `<p class="muted small">Prévia dos ${slides.length} slides. O arquivo é gerado em PPTX no download (simulado).</p><div class="slides">${slides.map((s, i) => `<div class="slide"><span class="slide-n">${i + 1}</span><span class="slide-k">${s[0]}</span>${s[1]}</div>`).join('')}</div>`;
      }
      case 'roteiro': return cab(aula, `Roteiro da atividade prática: ${esc(p.titulo)}`) + `
        <div class="doc-box highlight"><h4>🧩 Situação</h4><p>${esc(p.situacao)}</p><p><strong>Desafio:</strong> ${esc(desafio)}</p></div>
        <h3>👣 Passo a passo</h3><ol class="doc-steps">${p.roteiro.map((r) => `<li>${esc(r)}</li>`).join('')}</ol>
        <div class="doc-grid2"><div class="doc-box"><h4>🧰 Recursos</h4>${ul(recursos.map(esc).concat(['Régua ou trena', 'Calculadora']))}</div>
        <div class="doc-box warn"><h4>🦺 Cuidados</h4>${ul(['Tesoura e estilete apenas com supervisão.', 'Mantenha a bancada organizada.', 'Celulares só para medir, fotografar e calcular.'])}</div></div>
        <h3>👥 Papéis no grupo</h3><table class="doc-table"><tr><th>Coordenação</th><td>organiza tempo e tarefas</td></tr><tr><th>Cálculos</th><td>registra e confere as contas</td></tr><tr><th>Construção</th><td>lidera a montagem</td></tr><tr><th>Comunicação</th><td>prepara a apresentação</td></tr></table>
        <h3>📝 Registro do grupo</h3>${lines(5)}${obs(aula)}`;
      case 'rubrica': return `<h3 style="margin-top:0">📊 Rubrica de avaliação — ${esc(p.titulo)}</h3>
        <div class="doc-table-wrap"><table class="doc-table rubric"><thead><tr><th>Critério</th><th>1 · Iniciante</th><th>2 · Em desenvolvimento</th><th>3 · Proficiente</th><th>4 · Avançado</th></tr></thead><tbody>
        ${rub.map((r) => `<tr><td><strong>${esc(r.nome)}</strong><br><span class="small muted">${esc(r.desc)}</span></td><td>Ainda não demonstra</td><td>Demonstra com apoio</td><td>Demonstra de forma consistente</td><td>Demonstra com autonomia e vai além</td></tr>`).join('')}</tbody></table></div>
        <h3>🪞 Autoavaliação do grupo</h3><table class="doc-table"><thead><tr><th>Afirmação</th><th>Ainda não</th><th>Em parte</th><th>Sim</th></tr></thead><tbody>
        ${['Todos participaram das decisões.', 'Conseguimos justificar nossas escolhas com cálculos.', 'Verificamos se os resultados faziam sentido.'].map((a) => `<tr><td>${a}</td><td>☐</td><td>☐</td><td>☐</td></tr>`).join('')}</tbody></table>
        <p class="small muted">Pontuação sugerida: soma dos critérios (${rub.length} a ${rub.length * 4} pontos), convertida para a escala da escola.</p>`;
      case 'quiz': return cab(aula, `Quiz de revisão: ${esc(p.titulo)}`) + (p.quiz.length ? `
        <ol class="quiz">${p.quiz.slice(0, 5).map((q) => `<li><p>${esc(q.q)}</p>${q.a ? `<ol type="A">${q.a.map((a) => `<li>${esc(a)}</li>`).join('')}</ol>` : lines(3)}</li>`).join('')}</ol>
        <div class="doc-box ok"><h4>🔑 Gabarito (professora)</h4><ol>${p.quiz.slice(0, 5).map((q) => `<li>${q.a ? `<strong>${'ABCD'[q.c]}</strong> — ` : ''}${esc(q.e)}</li>`).join('')}</ol></div>`
        : '<p>Questões de revisão disponíveis quando o conteúdo é identificado na BNCC.</p>');
      case 'imagens': return `<h3 style="margin-top:0">🖼️ Imagens explicativas da construção</h3><p class="muted small">Referência visual para os grupos (exportada em PNG no download simulado).</p>${figura(p.figura)}
        <div class="doc-box"><h4>Como usar</h4>${ul(['Projete a imagem na abertura da construção.', 'Deixe uma cópia impressa em cada grupo.', 'Peça que os estudantes completem com as medidas do próprio protótipo.'])}</div>`;
      case 'folha': return cab(aula, esc(p.titulo)) + `
        <div class="doc-box highlight"><h4>🎯 O desafio</h4><p class="big">${esc(desafio)}</p><p><strong>Vocês vão entregar:</strong> ${esc(p.produto)}</p></div>
        <div class="doc-grid2"><div class="doc-box"><h4>⏱️ Tempo</h4>${ul(etapas.map((e) => `${esc(e.nome)} — ${e.min} min`))}</div>
        <div class="doc-box"><h4>🤝 Combinados</h4>${ul(['Todos participam e têm um papel.', 'Errar faz parte: testem e ajustem.', 'Toda decisão precisa de um cálculo.', 'Respeitem o tempo de cada etapa.'])}</div></div>
        <h3>✅ Como serão avaliados</h3>${ul(rub.map((r) => `<strong>${esc(r.nome)}:</strong> ${esc(r.desc)}`))}${obs(aula)}`;
    }
    return '';
  }

  global.Aula = { icon, HERO_SVG, contexto, perguntas, propostas, reescalar, MATERIAIS, gerarMaterial, RUBRICA_PADRAO, GRUPO, juntar };
})(window);
