/* =========================================================
   MetodologIA — Base de conhecimento simulada
   ========================================================= */

const COMPETENCIAS_BNCC = {
  1: 'Conhecimento — valorizar e utilizar conhecimentos historicamente construídos',
  2: 'Pensamento científico, crítico e criativo',
  3: 'Repertório cultural',
  4: 'Comunicação',
  5: 'Cultura digital',
  6: 'Trabalho e projeto de vida',
  7: 'Argumentação',
  8: 'Autoconhecimento e autocuidado',
  9: 'Empatia e cooperação',
  10: 'Responsabilidade e cidadania'
};

const METODOLOGIAS = {
  invertida: {
    nome: 'Sala de Aula Invertida',
    original: 'Flipped Classroom',
    icone: '🔄',
    kw: ['invertida', 'flipped', 'inverter a aula', 'aula invertida'],
    autores: 'Jonathan Bergmann e Aaron Sams (2012)',
    resumo: 'O estudante tem o primeiro contato com o conteúdo antes da aula (vídeos, leituras, podcasts) e o tempo em sala é usado para aplicar, discutir e aprofundar com mediação do professor.',
    fundamentos: 'Inverte a lógica tradicional: a transmissão de informação — que exige menos interação — acontece fora da sala, enquanto as atividades de maior nível cognitivo (aplicar, analisar, criar) ocorrem em sala, quando o professor está presente para apoiar.',
    papelProf: 'Curador de conteúdo prévio, diagnosticador de dúvidas e mediador das atividades práticas.',
    papelAluno: 'Protagonista do próprio estudo, chega preparado e participa ativamente da aplicação.',
    vantagens: ['Respeita o ritmo individual de estudo', 'Libera tempo de aula para prática e interação', 'Permite diagnóstico prévio das dificuldades'],
    cuidados: ['Garanta acesso ao material prévio (impresso ou offline para quem não tem internet)', 'Tenha um plano para quem não fez a preparação', 'Material prévio curto: 8 a 12 minutos'],
    competencias: [1, 5, 8],
    fases: [
      { nome: 'Pré-aula (em casa)', pct: 0, desc: 'Estudo do material prévio e registro de dúvidas no roteiro.' },
      { nome: 'Verificação e acolhida', pct: 15, desc: 'Quiz rápido para diagnosticar a compreensão do material prévio e levantar dúvidas.' },
      { nome: 'Esclarecimento direcionado', pct: 15, desc: 'Mini explanação focada apenas nos pontos em que a turma teve mais dificuldade.' },
      { nome: 'Atividade de aplicação', pct: 50, desc: 'Resolução em grupos de desafios que exigem aplicar o conteúdo estudado.' },
      { nome: 'Socialização e fechamento', pct: 20, desc: 'Grupos apresentam soluções; professor sistematiza e indica o próximo material prévio.' }
    ]
  },
  abp: {
    nome: 'Aprendizagem Baseada em Projetos',
    original: 'Project-Based Learning (PBL)',
    icone: '🛠️',
    kw: ['projeto', 'abp', 'pbl', 'project based', 'baseada em projeto'],
    autores: 'John Dewey; William Kilpatrick; Buck Institute for Education',
    resumo: 'Os estudantes aprendem ao desenvolver, ao longo de um período, um projeto que responde a uma pergunta motriz real e resulta em um produto final apresentado a um público.',
    fundamentos: 'Parte de uma questão autêntica e significativa. A aprendizagem acontece pela investigação, colaboração e construção de um produto concreto, com etapas de planejamento, pesquisa, desenvolvimento, revisão e apresentação pública.',
    papelProf: 'Orientador do processo, gestor do cronograma e provocador de reflexões.',
    papelAluno: 'Pesquisador e produtor, toma decisões em equipe e responde pelo produto final.',
    vantagens: ['Conecta o conteúdo a problemas reais', 'Desenvolve autonomia, colaboração e comunicação', 'Gera produtos que podem ser compartilhados com a comunidade'],
    cuidados: ['Defina marcos intermediários com entregas parciais', 'Distribua papéis claros nas equipes', 'Avalie processo e produto, não só o resultado final'],
    competencias: [2, 6, 9, 10],
    fases: [
      { nome: 'Lançamento e pergunta motriz', pct: 15, desc: 'Apresentação de um evento disparador e da pergunta motriz que guiará o projeto.' },
      { nome: 'Planejamento das equipes', pct: 15, desc: 'Formação de equipes, divisão de papéis e elaboração do cronograma.' },
      { nome: 'Investigação', pct: 25, desc: 'Pesquisa orientada em fontes diversas e registro no diário de bordo.' },
      { nome: 'Desenvolvimento do produto', pct: 25, desc: 'Construção do produto final com checkpoints do professor.' },
      { nome: 'Apresentação e reflexão', pct: 20, desc: 'Apresentação pública do produto e autoavaliação do processo.' }
    ]
  },
  problemas: {
    nome: 'Aprendizagem Baseada em Problemas',
    original: 'Problem-Based Learning',
    icone: '🧩',
    kw: ['baseada em problema', 'situação-problema', 'situacao-problema', 'situação problema', 'resolução de problemas', 'abprob'],
    autores: 'Howard Barrows — Universidade McMaster (década de 1960)',
    resumo: 'Os estudantes partem de uma situação-problema aberta e, em pequenos grupos, identificam o que sabem, o que precisam aprender e constroem soluções fundamentadas.',
    fundamentos: 'O problema vem antes da teoria. Ele ativa conhecimentos prévios e cria a necessidade de aprender. O ciclo envolve: analisar o problema, levantar hipóteses, definir objetivos de aprendizagem, estudar e retornar ao problema com a solução.',
    papelProf: 'Tutor que faz perguntas, não entrega respostas, e garante o foco nos objetivos de aprendizagem.',
    papelAluno: 'Investigador que formula hipóteses, busca informações e argumenta soluções.',
    vantagens: ['Desenvolve pensamento crítico e investigativo', 'Aumenta a retenção do conteúdo', 'Simula desafios do mundo real'],
    cuidados: ['O problema deve ser aberto, mas com escopo controlado', 'Ofereça fontes confiáveis para pesquisa', 'Use papéis no grupo: coordenador, relator, pesquisador'],
    competencias: [2, 7, 9],
    fases: [
      { nome: 'Apresentação do problema', pct: 15, desc: 'Leitura da situação-problema e esclarecimento de termos desconhecidos.' },
      { nome: 'Análise e hipóteses', pct: 20, desc: 'Grupos preenchem o quadro "Sabemos / Precisamos saber / Hipóteses".' },
      { nome: 'Estudo orientado', pct: 30, desc: 'Pesquisa em fontes indicadas para validar ou refutar hipóteses.' },
      { nome: 'Construção da solução', pct: 20, desc: 'Elaboração da solução fundamentada com base no estudo.' },
      { nome: 'Apresentação e avaliação', pct: 15, desc: 'Grupos apresentam soluções e avaliam o processo.' }
    ]
  },
  gamificacao: {
    nome: 'Gamificação',
    original: 'Gamification',
    icone: '🎮',
    kw: ['gamifica', 'game', 'jogo', 'jogos', 'missão', 'missões', 'pontuação', 'ranking', 'xp', 'badge', 'quest'],
    autores: 'Karl Kapp (2012); Yu-kai Chou — Octalysis',
    resumo: 'Aplica elementos de jogos — missões, pontos, níveis, conquistas e narrativa — a atividades de aprendizagem para aumentar o engajamento e a motivação.',
    fundamentos: 'Não é apenas "jogar em aula": é desenhar a experiência de aprendizagem com mecânicas de jogo (regras, feedback imediato, progressão, desafio crescente) e uma narrativa que dê sentido às tarefas.',
    papelProf: 'Game designer da experiência e mestre do jogo, que dá feedback e mantém o equilíbrio.',
    papelAluno: 'Jogador que avança por missões, colabora e compete de forma saudável.',
    vantagens: ['Alto engajamento e motivação', 'Feedback imediato e visível do progresso', 'Permite desafios em diferentes níveis'],
    cuidados: ['Valorize a colaboração, não só a competição individual', 'Evite rankings que exponham quem tem dificuldade', 'A mecânica deve servir ao objetivo de aprendizagem'],
    competencias: [2, 4, 9],
    fases: [
      { nome: 'Narrativa e regras do jogo', pct: 10, desc: 'Apresentação da história, das equipes, do sistema de XP e das conquistas.' },
      { nome: 'Missões nível 1 — Exploração', pct: 25, desc: 'Desafios introdutórios para ativar conhecimentos prévios.' },
      { nome: 'Missões nível 2 — Desafio', pct: 30, desc: 'Desafios de aplicação com dificuldade crescente.' },
      { nome: 'Chefão final', pct: 20, desc: 'Desafio integrador que exige usar tudo o que foi aprendido.' },
      { nome: 'Placar e reflexão', pct: 15, desc: 'Entrega de conquistas e reflexão sobre o que foi aprendido.' }
    ]
  },
  estacoes: {
    nome: 'Rotação por Estações',
    original: 'Station Rotation (Ensino Híbrido)',
    icone: '🔁',
    kw: ['estação', 'estações', 'estacoes', 'estacao', 'rotação por', 'rotacao por', 'ensino híbrido', 'ensino hibrido'],
    autores: 'Clayton Christensen Institute; Bacich, Tanzi Neto e Trevisani (2015)',
    resumo: 'A turma é dividida em grupos que circulam por estações com atividades diferentes e complementares sobre o mesmo tema, incluindo ao menos uma estação digital e uma com o professor.',
    fundamentos: 'Modelo do Ensino Híbrido. Cada estação é independente (pode ser feita em qualquer ordem) e trabalha o tema por uma linguagem diferente: leitura, prática, tecnologia, mediação direta.',
    papelProf: 'Planejador das estações e mediador direto em uma delas, atendendo pequenos grupos.',
    papelAluno: 'Autônomo nas estações, colaborando com o grupo e gerenciando o tempo.',
    vantagens: ['Atendimento personalizado em pequenos grupos', 'Diversifica linguagens e estratégias', 'Desenvolve autonomia e gestão do tempo'],
    cuidados: ['Estações independentes entre si', 'Instruções claras e visíveis em cada estação', 'Use um sinal sonoro para a troca'],
    competencias: [1, 4, 5],
    fases: [
      { nome: 'Organização e instruções', pct: 10, desc: 'Divisão da turma em grupos e explicação das estações e do tempo.' },
      { nome: 'Rotação pelas estações', pct: 75, desc: 'Grupos circulam por todas as estações em tempos iguais.' },
      { nome: 'Sistematização', pct: 15, desc: 'Roda de conversa para integrar o que foi aprendido em cada estação.' }
    ]
  },
  pares: {
    nome: 'Instrução por Pares',
    original: 'Peer Instruction',
    icone: '👥',
    kw: ['em pares', 'peer', 'instrução por pares', 'instrucao por pares', 'mazur'],
    autores: 'Eric Mazur — Universidade Harvard (1991)',
    resumo: 'O professor propõe questões conceituais; os estudantes votam individualmente, discutem com colegas que pensaram diferente e votam novamente.',
    fundamentos: 'Explora o fato de que colegas que acabaram de entender um conceito conseguem explicá-lo de forma acessível. Se 30% a 70% acertam na primeira votação, a discussão em pares é o momento ideal de aprendizagem.',
    papelProf: 'Elaborador de boas questões conceituais e leitor dos dados da votação.',
    papelAluno: 'Argumentador que defende sua resposta e revisa ideias a partir do diálogo.',
    vantagens: ['Feedback imediato sobre a compreensão da turma', 'Toda a turma participa', 'Corrige concepções equivocadas'],
    cuidados: ['Questões conceituais, não de memorização', 'Alternativas incorretas devem refletir erros comuns', 'Use cartões coloridos ou QR codes para votar'],
    competencias: [2, 4, 7],
    fases: [
      { nome: 'Exposição curta', pct: 15, desc: 'Mini aula de 7 a 10 minutos sobre o conceito central.' },
      { nome: 'Ciclo de questões conceituais', pct: 60, desc: 'Para cada questão: voto individual → discussão em pares → novo voto.' },
      { nome: 'Explicação das respostas', pct: 15, desc: 'Professor comenta as alternativas e os erros mais comuns.' },
      { nome: 'Fechamento', pct: 10, desc: 'Registro individual do que foi aprendido.' }
    ]
  },
  design: {
    nome: 'Design Thinking',
    original: 'Design Thinking para Educadores',
    icone: '💡',
    kw: ['design thinking', 'empatia', 'ideação', 'ideacao'],
    autores: 'IDEO e d.school de Stanford; Instituto Educadigital (versão para educadores)',
    resumo: 'Abordagem centrada no ser humano para resolver problemas complexos, passando pelas fases de empatia, definição, ideação, prototipagem e teste.',
    fundamentos: 'Os estudantes partem das necessidades reais de pessoas, definem um desafio no formato "Como podemos...?", geram muitas ideias sem julgamento, constroem protótipos rápidos e testam com usuários.',
    papelProf: 'Facilitador das dinâmicas e guardião do tempo de cada fase.',
    papelAluno: 'Designer que escuta, cria, prototipa e itera.',
    vantagens: ['Desenvolve empatia e criatividade', 'Ensina a lidar com o erro como parte do processo', 'Gera soluções para a comunidade escolar'],
    cuidados: ['Respeite a fase de ideação sem julgamentos', 'Protótipos devem ser rápidos e baratos', 'Garanta contato real com usuários na empatia'],
    competencias: [2, 6, 9],
    fases: [
      { nome: 'Empatia', pct: 20, desc: 'Entrevistas e observação para entender as pessoas envolvidas.' },
      { nome: 'Definição', pct: 15, desc: 'Síntese das descobertas e formulação do desafio "Como podemos...?".' },
      { nome: 'Ideação', pct: 20, desc: 'Brainstorming e seleção das melhores ideias.' },
      { nome: 'Prototipagem', pct: 25, desc: 'Construção de um protótipo rápido da solução.' },
      { nome: 'Teste e iteração', pct: 20, desc: 'Teste com usuários, coleta de feedback e melhoria.' }
    ]
  },
  maker: {
    nome: 'Cultura Maker',
    original: 'Maker Education / Mão na Massa',
    icone: '🔧',
    kw: ['maker', 'mão na massa', 'mao na massa', 'robótica', 'robotica', 'construção de', 'protótipo', 'prototipo', 'sucata'],
    autores: 'Seymour Papert — Construcionismo; Paulo Blikstein',
    resumo: 'Os estudantes aprendem construindo artefatos concretos com materiais diversos (sucata, papelão, eletrônica, impressão 3D), testando e aprimorando suas criações.',
    fundamentos: 'Baseada no construcionismo: aprende-se melhor quando se constrói algo significativo e compartilhável. Valoriza o erro, a experimentação e a documentação do processo.',
    papelProf: 'Propositor de desafios e parceiro de investigação.',
    papelAluno: 'Criador que planeja, constrói, testa e documenta.',
    vantagens: ['Torna conceitos abstratos concretos', 'Estimula criatividade e resolução de problemas', 'Pode ser feita com materiais de baixo custo'],
    cuidados: ['Oriente sobre segurança com ferramentas', 'Tenha materiais separados por grupo antes da aula', 'Reserve tempo para a documentação'],
    competencias: [2, 5, 6],
    fases: [
      { nome: 'Desafio e inspiração', pct: 10, desc: 'Apresentação do desafio maker e de exemplos inspiradores.' },
      { nome: 'Planejamento (esboço)', pct: 20, desc: 'Grupos desenham o projeto e listam os materiais.' },
      { nome: 'Construção', pct: 40, desc: 'Construção do artefato com apoio do professor.' },
      { nome: 'Teste e ajustes', pct: 15, desc: 'Teste do artefato e melhorias.' },
      { nome: 'Mostra e documentação', pct: 15, desc: 'Apresentação das criações e registro do processo.' }
    ]
  },
  jigsaw: {
    nome: 'Aprendizagem Cooperativa — Jigsaw',
    original: 'Jigsaw Classroom (Quebra-cabeça)',
    icone: '🧠',
    kw: ['jigsaw', 'quebra-cabeça', 'quebra cabeça', 'cooperativ', 'especialistas'],
    autores: 'Elliot Aronson (1971)',
    resumo: 'Cada membro do grupo estuda uma parte do conteúdo em um "grupo de especialistas" e depois retorna ao grupo de origem para ensinar sua parte aos colegas.',
    fundamentos: 'Cria interdependência positiva: ninguém consegue o todo sem a contribuição de cada um. Cada estudante é, ao mesmo tempo, aprendiz e professor.',
    papelProf: 'Organizador dos grupos e materiais, monitor da qualidade das explicações.',
    papelAluno: 'Especialista responsável por ensinar sua parte aos colegas.',
    vantagens: ['Todos são responsáveis pela aprendizagem do grupo', 'Desenvolve comunicação e escuta', 'Reduz a competição e favorece a inclusão'],
    cuidados: ['Textos de especialista com tamanho e dificuldade equivalentes', 'Dê um roteiro para a explicação', 'Faça uma verificação individual no final'],
    competencias: [4, 9, 1],
    fases: [
      { nome: 'Grupos de origem', pct: 10, desc: 'Formação dos grupos e distribuição das partes do conteúdo.' },
      { nome: 'Grupos de especialistas', pct: 35, desc: 'Estudantes com a mesma parte estudam juntos e preparam a explicação.' },
      { nome: 'Retorno e ensino', pct: 35, desc: 'Cada especialista ensina sua parte ao grupo de origem.' },
      { nome: 'Verificação e síntese', pct: 20, desc: 'Atividade individual que integra todas as partes.' }
    ]
  },
  caso: {
    nome: 'Estudo de Caso',
    original: 'Case Method',
    icone: '📂',
    kw: ['estudo de caso', 'caso real', 'case method'],
    autores: 'Harvard Business School (1920); adaptado para a educação básica',
    resumo: 'Os estudantes analisam uma situação real ou realista, com dilemas e informações, e precisam tomar decisões fundamentadas no conteúdo estudado.',
    fundamentos: 'O caso apresenta contexto, personagens, dados e um dilema. A análise exige identificar o problema central, considerar perspectivas diferentes e justificar uma decisão.',
    papelProf: 'Moderador do debate e provocador de diferentes pontos de vista.',
    papelAluno: 'Analista que interpreta informações e defende decisões com argumentos.',
    vantagens: ['Aproxima o conteúdo da realidade', 'Desenvolve argumentação e tomada de decisão', 'Permite múltiplas respostas válidas'],
    cuidados: ['O caso deve ter dilema real, sem resposta óbvia', 'Forneça dados suficientes para a análise', 'Valorize a qualidade do argumento'],
    competencias: [2, 7, 10],
    fases: [
      { nome: 'Leitura do caso', pct: 20, desc: 'Leitura individual do caso e marcação de informações-chave.' },
      { nome: 'Análise em grupo', pct: 35, desc: 'Grupos respondem às questões de análise.' },
      { nome: 'Debate e decisão', pct: 30, desc: 'Debate entre grupos e tomada de decisão justificada.' },
      { nome: 'Síntese', pct: 15, desc: 'Professor relaciona o caso aos conceitos estudados.' }
    ]
  }
};

const AREAS = {
  matematica: { nome: 'Matemática', kw: ['matemátic', 'matematic', 'álgebra', 'algebra', 'geometria', 'fração', 'frações', 'fracoes', 'equaç', 'equac', 'porcentagem', 'estatística', 'estatistica', 'probabilidade', 'função', 'funções', 'números', 'multiplicação', 'divisão', 'áreas e perímetros', 'perímetro'], rec: 'gamificacao' },
  portugues: { nome: 'Língua Portuguesa', kw: ['português', 'portugues', 'língua portuguesa', 'redação', 'redacao', 'leitura', 'gramática', 'gramatica', 'literatura', 'gênero textual', 'genero textual', 'crônica', 'cronica', 'poesia', 'poema', 'conto', 'interpretação de texto', 'ortografia', 'argumentativo'], rec: 'estacoes' },
  ciencias: { nome: 'Ciências', kw: ['ciências', 'ciencias', 'sistema solar', 'ecossistema', 'meio ambiente', 'corpo humano', 'água', 'reciclagem', 'sustentabilidade', 'animais', 'plantas', 'fotossíntese', 'fotossintese'], rec: 'problemas' },
  biologia: { nome: 'Biologia', kw: ['biologia', 'célula', 'celula', 'genética', 'genetica', 'evolução', 'evolucao', 'dna', 'ecologia', 'botânica'], rec: 'problemas' },
  fisica: { nome: 'Física', kw: ['física', 'fisica', 'energia', 'força', 'forca', 'movimento', 'eletricidade', 'óptica', 'optica', 'ondas', 'cinemática', 'cinematica', 'newton'], rec: 'pares' },
  quimica: { nome: 'Química', kw: ['química', 'quimica', 'reações', 'reacoes', 'tabela periódica', 'átomo', 'atomo', 'ligações químicas', 'soluções', 'misturas'], rec: 'maker' },
  historia: { nome: 'História', kw: ['história', 'historia', 'revolução', 'revolucao', 'guerra', 'brasil colônia', 'brasil colonia', 'império', 'imperio', 'idade média', 'ditadura', 'escravidão', 'escravidao', 'grécia', 'roma antiga', 'independência'], rec: 'caso' },
  geografia: { nome: 'Geografia', kw: ['geografia', 'clima', 'relevo', 'mapa', 'cartografia', 'urbanização', 'urbanizacao', 'população', 'globalização', 'bioma', 'biomas', 'hidrografia'], rec: 'abp' },
  ingles: { nome: 'Língua Inglesa', kw: ['inglês', 'ingles', 'english', 'língua inglesa', 'vocabulary', 'verb to be'], rec: 'gamificacao' },
  artes: { nome: 'Arte', kw: ['arte', 'artes', 'pintura', 'música', 'musica', 'teatro', 'dança', 'danca', 'artes visuais'], rec: 'maker' },
  edfisica: { nome: 'Educação Física', kw: ['educação física', 'educacao fisica', 'esporte', 'esportes', 'atletismo', 'brincadeiras', 'ginástica'], rec: 'gamificacao' },
  filosofia: { nome: 'Filosofia', kw: ['filosofia', 'ética', 'etica', 'sócrates', 'platão', 'filósof'], rec: 'caso' },
  sociologia: { nome: 'Sociologia', kw: ['sociologia', 'cidadania', 'desigualdade', 'cultura e sociedade', 'movimentos sociais'], rec: 'caso' },
  tecnologia: { nome: 'Tecnologia e Computação', kw: ['programação', 'programacao', 'computação', 'computacao', 'pensamento computacional', 'scratch', 'algoritmo'], rec: 'maker' }
};

const NIVEIS = {
  infantil: 'Educação Infantil',
  fund1: 'Ensino Fundamental — Anos Iniciais',
  fund2: 'Ensino Fundamental — Anos Finais',
  medio: 'Ensino Médio'
};

