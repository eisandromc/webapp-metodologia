/* =========================================================
   MetodologIA — Motor de IA SIMULADO (Matemática · Ensino Médio)
   Interpreta o pedido (regras + palavras-chave), relaciona com a
   BNCC do EM e monta a entrega a partir de modelos pedagógicos.
   Para usar uma IA real, substitua AI.respond() mantendo o
   mesmo formato de retorno.
   ========================================================= */

(function (global) {
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  const low1 = (s) => s ? s.charAt(0).toLowerCase() + s.slice(1) : s;
  const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const hash = (s) => { let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) | 0; return Math.abs(h); };

  const CTX = {
    recursos: ['Calculadora científica (ou do celular)', 'Papel quadriculado, régua e transferidor', 'Projetor ou TV para o GeoGebra'],
    pratica: 'modelar e resolver problemas, analisando a plausibilidade dos resultados',
    produto: 'um relatório-vídeo explicando a solução matemática',
    verbo: 'modelar e resolver'
  };

  // Metodologia recomendada por conteúdo
  const REC = {
    funcao_afim: 'invertida', funcao_quadratica: 'problemas', funcao_exponencial: 'gamificacao', logaritmo: 'gamificacao',
    funcao_partes: 'caso', progressoes: 'gamificacao', financeira: 'caso', porcentagem: 'pares', trig_triangulo: 'maker',
    leis_seno_cosseno: 'problemas', funcoes_trig: 'estacoes', areas_planas: 'abp', semelhanca: 'maker', geometria_espacial: 'jigsaw',
    transformacoes: 'design', combinatoria: 'pares', probabilidade: 'pares', estatistica: 'abp', graficos: 'caso',
    sistemas: 'problemas', grandezas: 'design', algoritmos: 'maker', correlacao: 'abp', cartografia: 'jigsaw'
  };

  /* ---------- Interpretação ---------- */
  function detectMetodologia(text) {
    const t = text.toLowerCase();
    let best = null, bestScore = 0;
    for (const [key, m] of Object.entries(METODOLOGIAS)) {
      let score = 0;
      for (const k of m.kw) if (t.includes(k)) score += k.length > 6 ? 2 : 1;
      if (t.includes(m.nome.toLowerCase())) score += 5;
      if (score > bestScore) { best = key; bestScore = score; }
    }
    return best;
  }

  function detectTopico(text) {
    const t = norm(text);
    const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const has = (k) => {
      const nk = norm(k).trim();
      // palavras curtas exigem palavra inteira; as longas casam pelo início da palavra
      const re = nk.length <= 4 ? new RegExp(`(^|[^a-z0-9])${reEsc(nk)}($|[^a-z0-9])`) : new RegExp(`(^|[^a-z0-9])${reEsc(nk)}`);
      return re.test(t);
    };
    let best = null, bestScore = 0;
    for (const [key, tp] of Object.entries(TOPICOS)) {
      let score = t.includes(norm(tp.nome)) ? 10 : 0;
      for (const k of tp.kw) if (has(k)) score += norm(k).trim().length > 5 ? 2 : 1;
      if (score > bestScore) { best = key; bestScore = score; }
    }
    return best;
  }

  function detectSerie(text) {
    const t = norm(text);
    let m = t.match(/\b([123])\s*(?:a|o|ª|º|°)?\s*(?:serie|ano)\b/);
    if (m) return parseInt(m[1], 10);
    if (/primeira serie|primeiro ano/.test(t)) return 1;
    if (/segunda serie|segundo ano/.test(t)) return 2;
    if (/terceira serie|terceiro ano/.test(t)) return 3;
    return null;
  }

  function detectDuracao(text) {
    const t = norm(text);
    let m;
    if ((m = t.match(/(\d+)\s*aulas?/))) return { aulas: +m[1], minutos: +m[1] * 50 };
    if ((m = t.match(/(\d+)\s*(?:min|minutos)\b/))) return { aulas: Math.max(1, Math.round(+m[1] / 50)), minutos: +m[1] };
    if ((m = t.match(/(\d+)\s*(?:h|horas?)\b/))) return { aulas: Math.max(1, Math.round(+m[1] * 60 / 50)), minutos: +m[1] * 60 };
    if ((m = t.match(/(\d+)\s*semanas?/))) return { aulas: +m[1] * 2, minutos: +m[1] * 100 };
    if (/uma aula\b/.test(t)) return { aulas: 1, minutos: 50 };
    return null;
  }

  function detectTema(text) {
    const re = /(?:sobre|tema[:\s]+|conte[uú]do[:\s]+|abordando|abordar|trabalhar|ensinar|explicar|envolvendo)\s+(?:o |a |os |as |um |uma )?(.+?)(?=[,.;!?\n(]| para | com | usando | utilizando | atrav[eé]s | por meio | no \d| na turma| em \d| de \d+| em grupo| e que | que |$)/i;
    const m = text.match(re);
    if (!m) return null;
    let tema = m[1].trim().replace(/\s+/g, ' ');
    if (/^(metodologia|uma atividade|atividade|aula|plano|isso|ela|ele)\b/i.test(tema) || tema.length < 3) return null;
    if (tema.length > 70) tema = tema.slice(0, 70).replace(/\s\S*$/, '');
    return tema;
  }

  function parse(text) {
    const out = {};
    const met = detectMetodologia(text); if (met) out.metodologia = met;
    const codes = [...new Set((text.toUpperCase().match(/EM13MAT\d{3}/g) || []).filter((c) => BNCC_HABILIDADES[c]))];
    if (codes.length) out.habCodes = codes;
    let tema = detectTema(text);
    if (tema && /EM13MAT\d{3}/i.test(tema)) tema = null;
    // remove termos da metodologia antes de procurar o conteúdo (ex.: "rotação por estações")
    let tTop = text;
    if (met) for (const k of [METODOLOGIAS[met].nome, ...METODOLOGIAS[met].kw]) tTop = tTop.replace(new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig'), ' ');
    let topico = detectTopico(tTop);
    if (!topico && codes.length) topico = habTopicos(codes[0])[0];
    if (topico) out.topico = topico;
    if (tema) out.tema = tema;
    else if (topico) out.tema = low1(TOPICOS[topico].nome);
    const serie = detectSerie(text); if (serie) out.serie = serie;
    const du = detectDuracao(text); if (du) Object.assign(out, du);
    const al = text.match(/(\d+)\s*(?:alunos|estudantes)/i); if (al) out.alunos = +al[1];
    if (/inclus|\btea\b|autis|tdah|deficien|dislexia|discalculia|neurodiverg/i.test(text)) out.inclusao = true;
    return out;
  }

  /* ---------- Sugestões enquanto digita ---------- */
  const VOCAB = () => {
    const v = [];
    for (const [, t] of Object.entries(TOPICOS)) v.push({ tipo: 'Conteúdo BNCC', label: low1(t.nome), match: [t.nome, ...t.kw.map((k) => k.trim())], extra: `${t.serie}º ano · ${t.hab.slice(0, 2).join(', ')}` });
    for (const [, m] of Object.entries(METODOLOGIAS)) v.push({ tipo: 'Metodologia', label: m.nome, match: [m.nome, ...m.kw], extra: m.icone });
    for (const n of [1, 2, 3]) v.push({ tipo: 'Série', label: `${n}º ano`, match: [`${n}º ano`, `${n}a serie`, `${n} serie`, `${n}º ano`, 'série', 'serie'], extra: 'Ensino Médio' });
    for (const n of [1, 2, 3, 4, 6]) v.push({ tipo: 'Duração', label: `${n} aula${n > 1 ? 's' : ''}`, match: [`${n} aula`], extra: `${n * 50} min` });
    v.push({ tipo: 'Inclusão', label: 'com adaptações para alunos com TEA', match: ['inclusão', 'inclusao', 'tea', 'autismo', 'adaptações'], extra: '♿' });
    v.push({ tipo: 'Inclusão', label: 'com adaptações para discalculia', match: ['discalculia', 'dificuldade'], extra: '♿' });
    return v;
  };

  function suggest(text, max = 6) {
    const raw = text.replace(/\s+$/, (m) => (m ? ' ' : ''));
    if (!raw.trim()) return [
      { tipo: 'Exemplo', label: 'Aula gamificada sobre função quadrática para a 1º ano em 2 aulas', value: 'Aula gamificada sobre função quadrática para a 1º ano em 2 aulas' },
      { tipo: 'Exemplo', label: 'Sala de aula invertida sobre juros compostos para a 1º ano', value: 'Sala de aula invertida sobre juros compostos para a 1º ano' },
      { tipo: 'Exemplo', label: 'Projeto sobre estatística para a 3º ano em 6 aulas', value: 'Projeto sobre estatística para a 3º ano em 6 aulas' },
      { tipo: 'BNCC', label: 'Quais conhecimentos da BNCC posso trabalhar na 2º ano?', value: 'Quais conhecimentos da BNCC posso trabalhar na 2º ano?' }
    ];
    const out = [];
    const endsSpace = /\s$/.test(text);
    const vocab = VOCAB();
    if (!endsSpace) {
      const words = raw.split(/\s+/);
      for (let k = Math.min(3, words.length); k >= 1 && !out.length; k--) {
        const frag = words.slice(-k).join(' ');
        const nf = norm(frag);
        if (nf.length < 2 && !/^[1-6]$/.test(nf)) continue;
        const prefix = raw.slice(0, raw.length - frag.length);
        const seen = new Set();
        for (const v of vocab) {
          if (/^[1-6]$/.test(nf) && !['Série', 'Duração'].includes(v.tipo)) continue;
          const hit = v.match.some((m) => { const nm = norm(m); return nm.startsWith(nf) || (nf.length >= 3 && nm.split(/\s+/).some((w) => w.startsWith(nf))); });
          if (hit && !seen.has(v.label)) { seen.add(v.label); out.push({ tipo: v.tipo, label: v.label, extra: v.extra, value: prefix + v.label + ' ' }); }
          if (out.length >= max) break;
        }
      }
    }
    if (out.length < max && raw.trim().length >= 6 && (endsSpace || !out.length)) {
      const p = parse(raw);
      const base = raw.trim() + ' ';
      const add = (label, tipo, extra) => out.length < max && out.push({ tipo, label: '+ ' + label, extra, value: base + label + ' ' });
      if (!p.topico && !p.tema) ['função quadrática (2º grau)', 'matemática financeira: juros simples e compostos', 'probabilidade'].forEach((t) => add((/\b(sobre|de)\s*$/i.test(raw) ? '' : 'sobre ') + t, 'Conteúdo BNCC'));
      if (!p.metodologia) { const r = REC[p.topico] || 'gamificacao'; add('usando ' + METODOLOGIAS[r].nome, 'Metodologia', 'recomendada'); add('usando ' + METODOLOGIAS[r === 'invertida' ? 'gamificacao' : 'invertida'].nome, 'Metodologia'); }
      if (!p.serie) add(`para a ${p.topico ? TOPICOS[p.topico].serie : 1}º ano`, 'Série');
      if (!p.aulas) add('em 2 aulas', 'Duração');
      if (!p.inclusao) add('com adaptações para alunos com TEA', 'Inclusão');
    }
    return out.slice(0, max);
  }

  /* ---------- Conversa ---------- */
  function newState() { return { spec: {}, awaiting: null, deliverableId: null, seed: 1 }; }

  function bnccOverview(serie) {
    const list = Object.entries(TOPICOS).filter(([, t]) => !serie || t.serie === serie);
    let txt = serie ? `Conhecimentos de Matemática sugeridos para a **${serie}º ano** do Ensino Médio, com as habilidades da BNCC:\n\n` : 'Estes são os conhecimentos de **Matemática e suas Tecnologias** do Ensino Médio, organizados pela série em que costumam ser trabalhados:\n\n';
    for (const s of serie ? [serie] : [1, 2, 3]) {
      const items = list.filter(([, t]) => t.serie === s);
      if (!serie) txt += `**${s}º ano**\n`;
      txt += items.map(([, t]) => `• ${t.nome} — *${t.hab.join(', ')}*`).join('\n') + '\n\n';
    }
    txt += 'A BNCC não divide o Ensino Médio por série: essa distribuição é uma sugestão e varia conforme o currículo da sua rede. Na aba **BNCC** você vê as 5 competências específicas e todas as habilidades. Toque em um conteúdo abaixo para eu criar uma atividade.';
    const chips = list.slice(0, 8).map(([, t]) => `Atividade sobre ${low1(t.nome)} para a ${t.serie}º ano`);
    return { text: txt, chips };
  }

  function respond(text, state, ctx) {
    state = state ? JSON.parse(JSON.stringify(state)) : newState();
    const t = text.trim();
    const replies = [];
    const nome = (ctx.user?.nome || 'professora').split(' ')[0];

    if (/^(oi|ol[aá]|bom dia|boa tarde|boa noite|e a[ií]|hello|hey)\b/i.test(t) && t.length < 25) {
      replies.push({ text: `Olá, ${esc(nome)}! 👋 Sou a **MetodologIA**, sua parceira para planejar aulas de **Matemática do Ensino Médio** com metodologias ativas e alinhadas à **BNCC**.\n\nMe diga o **conteúdo**, a **série** e, se quiser, a **metodologia** e a **duração**. Exemplo: *"Aula gamificada sobre função quadrática para a 1º ano em 2 aulas."*`, chips: ['Aula gamificada sobre função quadrática para a 1º ano', 'Quais conhecimentos da BNCC posso trabalhar?', 'Quais metodologias você conhece?'] });
      return { replies, state };
    }
    if (/^(ajuda|help|o que voc[eê] faz|como funciona)/i.test(t)) { replies.push({ text: helpText() }); return { replies, state }; }
    if (/(quais|que|liste|listar|me fale).*(metodologias)/i.test(t)) {
      const lista = Object.values(METODOLOGIAS).map((m) => `${m.icone} **${m.nome}** — ${m.resumo.split('.')[0]}.`).join('\n');
      replies.push({ text: `Estas são as metodologias que domino:\n\n${lista}\n\nÉ só pedir uma atividade usando qualquer uma delas!` });
      return { replies, state };
    }
    if (/^(obrigad|valeu|perfeito|show|[oó]timo|excelente|top)/i.test(t) && t.length < 40) {
      replies.push({ text: 'Que bom que ajudou! 😊 Você pode **salvar**, **baixar**, **imprimir** ou **compartilhar com a rede**. Quer ajustar algo ou criar outra atividade?', chips: ['Deixe mais desafiador', 'Adapte para inclusão', 'Nova atividade'] });
      return { replies, state };
    }

    const parsedPeek = parse(t);
    const askBncc = /(bncc|habilidades?|compet[eê]ncias?|conhecimentos|conte[uú]dos|o que (posso|devo) (trabalhar|ensinar)|sugir[ae] (conte|conhec|tema))/i.test(t);
    if (askBncc && !parsedPeek.topico && !parsedPeek.habCodes && !/sobre /i.test(t)) {
      const r = bnccOverview(parsedPeek.serie);
      replies.push(r);
      return { replies, state };
    }

    if (/nova atividade|come[cç]ar de novo|recome[cç]ar|novo plano|outra atividade/i.test(t)) {
      state = newState();
      if (!Object.keys(parsedPeek).length) {
        replies.push({ text: 'Certo, vamos começar uma nova atividade! ✨ Qual **conteúdo** e qual **série**?', chips: ['Função exponencial para a 1º ano', 'Probabilidade para a 2º ano', 'Estatística para a 3º ano', 'Ver conhecimentos da BNCC'] });
        return { replies, state };
      }
    }

    let parsed = parsedPeek;
    if (state.deliverableId && parsed.topico && parsed.topico !== state.spec.topico && (parsed.metodologia || parsed.serie) && t.length > 30) {
      state = { ...newState(), seed: state.seed };
    }
    const hadDeliverable = !!state.deliverableId;
    const changes = [];

    if (hadDeliverable) {
      if (/mais f[aá]cil|mais simples|simplifi|n[ií]vel b[aá]sico/i.test(t)) { state.spec.dificuldade = 'basica'; changes.push('ajustei o nível para **mais acessível**'); }
      if (/mais dif[ií]cil|mais desafiador|avan[cç]ad|aprofund|enem|vestibular/i.test(t)) { state.spec.dificuldade = 'avancada'; changes.push('aumentei o **nível de desafio**'); }
      if (/outra vers[aã]o|refa[zç]|gerar novamente|varia[cç][aã]o|diferente/i.test(t)) { state.seed++; changes.push('criei uma **nova versão**'); }
      if (parsed.inclusao && !state.spec.inclusao) changes.push('incluí **adaptações para inclusão**');
      if (parsed.metodologia && parsed.metodologia !== state.spec.metodologia) changes.push(`troquei a metodologia para **${METODOLOGIAS[parsed.metodologia].nome}**`);
      if (parsed.tema && parsed.tema !== state.spec.tema) changes.push(`mudei o conteúdo para **${esc(parsed.tema)}**`);
      if (parsed.serie && parsed.serie !== state.spec.serie) changes.push(`adaptei para a **${parsed.serie}º ano**`);
      if (parsed.aulas && parsed.aulas !== state.spec.aulas) changes.push(`reorganizei para **${parsed.aulas} aula(s)**`);
    }

    if (state.awaiting === 'tema' && !parsed.tema) {
      const cand = t.replace(/^(o |a |os |as |sobre )/i, '').replace(/[.!?]$/, '');
      if (cand.length <= 70) { parsed.tema = cand; const tp = detectTopico(cand); if (tp) parsed.topico = tp; }
    }
    if (parsed.tema && !parsed.topico) { const tp = detectTopico(parsed.tema); if (tp) parsed.topico = tp; }
    if (parsed.topico && parsed.topico !== state.spec.topico && !parsed.habCodes) delete state.spec.habCodes;

    for (const [k, v] of Object.entries(parsed)) state.spec[k] = v;
    const s = state.spec;
    s.area = 'matematica'; s.nivel = 'medio';

    if (hadDeliverable && changes.length === 0 && Object.keys(parsed).length === 0) {
      replies.push({ text: 'Posso ajustar a entrega atual. Experimente pedir:\n\n• **"deixe mais fácil"** ou **"mais desafiador (nível ENEM)"**\n• **"adapte para alunos com TEA"**\n• **"use rotação por estações"**\n• **"gere outra versão"**\n• **"nova atividade"** para começar outra', chips: ['Deixe mais desafiador (nível ENEM)', 'Adapte para inclusão', 'Gere outra versão', 'Nova atividade'] });
      return { replies, state };
    }

    if (!s.tema) {
      state.awaiting = 'tema';
      const pool = Object.values(TOPICOS).filter((tp) => !s.serie || tp.serie === s.serie).slice(0, 6);
      replies.push({ text: `Vamos criar juntas! 😊 Qual **conteúdo de Matemática** você quer trabalhar${s.serie ? ` com a **${s.serie}º ano**` : ''}? Abaixo estão algumas sugestões alinhadas à BNCC.`, chips: pool.map((tp) => cap(tp.nome)).concat(['Ver conhecimentos da BNCC']) });
      return { replies, state };
    }
    state.awaiting = null;

    const topic = s.topico ? TOPICOS[s.topico] : null;
    const assumptions = [];
    if (!s.serie) { s.serie = topic ? topic.serie : 1; assumptions.push(`considerei a **${s.serie}º ano** (série em que esse conteúdo costuma ser trabalhado)`); }
    s.turma = SERIES[s.serie];
    let recomendacao = null;
    if (!s.metodologia) {
      s.metodologia = REC[s.topico] || 'gamificacao';
      const m = METODOLOGIAS[s.metodologia];
      recomendacao = `Como você não indicou uma metodologia, recomendo **${m.icone} ${m.nome}** para ${esc(topic ? low1(topic.nome) : s.tema)}: ${low1(m.vantagens[0])}; ${low1(m.vantagens[1])}.`;
    }
    if (!s.aulas) { const def = { abp: 6, design: 4, maker: 3 }[s.metodologia] || 2; s.aulas = def; s.minutos = def * 50; assumptions.push(`planejei **${def} aulas de 50 minutos**`); }
    if (!s.alunos) s.alunos = 35;
    if (!s.habCodes) s.habCodes = topic ? topic.hab.slice() : [];

    const materiais = ctx.materiais || [];
    const refs = findRefs(s, materiais);
    const thinking = [
      'Interpretando seu pedido…',
      `Conteúdo: ${topic ? topic.nome : s.tema} · ${s.serie}º ano`,
      s.habCodes.length ? `Alinhando à BNCC: ${s.habCodes.slice(0, 3).join(', ')}${s.habCodes.length > 3 ? '…' : ''}` : 'Buscando habilidades da BNCC relacionadas…',
      `Consultando ${materiais.length} materiais da rede… ${refs.length} relevantes`,
      `Montando a aula com ${METODOLOGIAS[s.metodologia].nome}…`
    ];

    const deliverable = generate(s, ctx, refs, state.seed);
    state.deliverableId = deliverable.id;

    let msg;
    if (hadDeliverable && changes.length) msg = `Pronto! ${cap(changes.join(', '))}. Aqui está a nova versão: 👇`;
    else {
      msg = `Pronto! Criei a atividade **"${esc(deliverable.titulo)}"** 🎉`;
      if (recomendacao) msg += `\n\n${recomendacao}`;
      if (assumptions.length) msg += `\n\nPara agilizar, ${assumptions.join(' e ')}.`;
      if (s.habCodes.length) msg += `\n\n📐 Habilidades da BNCC: **${s.habCodes.join(', ')}**.`;
      else msg += '\n\n📐 Não encontrei uma habilidade da BNCC específica para esse tema; incluí as competências gerais. Veja a aba **BNCC** para escolher.';
      if (refs.length) msg += `\n\nUsei como referência ${refs.length} material(is) da rede de professores.`;
    }
    replies.push({ text: msg, deliverable, chips: ['Deixe mais desafiador (nível ENEM)', 'Adapte para inclusão', 'Gere outra versão', 'Nova atividade'] });
    return { replies, state, thinking };
  }

  function helpText() {
    return 'Eu crio atividades completas de **Matemática do Ensino Médio** a partir da sua descrição. Cada entrega traz:\n\n📘 **Explicação da metodologia**\n🗓️ **Planejamento da aula**: objetivos, habilidades da BNCC (EM13MAT…), sequência com tempos\n📝 **Material do aluno**: fichas, missões e um problema contextualizado, prontos para imprimir\n✅ **Avaliação**: rubrica, autoavaliação e gabarito\n\nPergunte também *"quais conhecimentos da BNCC posso trabalhar na 2º ano?"*. Enquanto você digita, eu sugiro conteúdos, metodologias e séries.';
  }

  function findRefs(s, materiais) {
    return materiais
      .map((m) => ({ m, score: (m.metodologia === s.metodologia ? 3 : 0) + (m.topico && m.topico === s.topico ? 4 : 0) + (m.serie === s.serie ? 1 : 0) }))
      .filter((x) => x.score >= 3)
      .sort((a, b) => b.score - a.score || (b.m.curtidas || 0) - (a.m.curtidas || 0))
      .slice(0, 3).map((x) => x.m);
  }

  /* ---------- Geração ---------- */
  function generate(s, ctx, refs, seed) {
    const r = rng(hash(s.tema + s.metodologia + s.serie) + seed * 7919);
    const pick = (arr) => arr[Math.floor(r() * arr.length)];
    const met = METODOLOGIAS[s.metodologia];
    const topic = s.topico ? TOPICOS[s.topico] : null;
    const T = s.tema || (topic ? low1(topic.nome) : 'o conteúdo');
    const g = { s, met, topic, T, Tc: cap(T), pick, r, user: ctx.user || {}, refs, area: { nome: 'Matemática' } };
    return {
      id: 'ent_' + Date.now().toString(36) + Math.floor(r() * 1e4),
      titulo: `${cap(T)} — ${met.nome}`,
      spec: { ...s },
      createdAt: new Date().toISOString(),
      refs: refs.map((m) => ({ id: m.id, titulo: m.titulo, autor: m.autor })),
      secoes: { metodologia: secMetodologia(g), plano: secPlano(g), material: secMaterial(g), avaliacao: secAvaliacao(g) }
    };
  }

  const ul = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
  const lines = (n) => `<div class="doc-lines">${'<span></span>'.repeat(n)}</div>`;
  const nivelTxt = (s) => s.dificuldade === 'basica' ? ' (nível acessível)' : s.dificuldade === 'avancada' ? ' (nível desafiador)' : '';
  const contexto = (g) => g.topic ? g.topic.contexto : 'situações do cotidiano dos estudantes';
  const digital = (g) => g.topic ? g.topic.digital : 'GeoGebra';

  function secMetodologia(g) {
    const { met, T, s } = g;
    return `
      <div class="doc-hero"><span class="doc-hero-icon">${met.icone}</span><div><h2>${esc(met.nome)}</h2><p class="muted">${esc(met.original)} · ${esc(met.autores)}</p></div></div>
      <h3>O que é</h3><p>${esc(met.resumo)}</p>
      <h3>Fundamentos</h3><p>${esc(met.fundamentos)}</p>
      <div class="doc-grid2">
        <div class="doc-box"><h4>👩‍🏫 Papel do professor</h4><p>${esc(met.papelProf)}</p></div>
        <div class="doc-box"><h4>🧑‍🎓 Papel do estudante</h4><p>${esc(met.papelAluno)}</p></div>
      </div>
      <h3>Etapas da metodologia</h3>
      <ol class="doc-steps">${met.fases.map((f) => `<li><strong>${esc(f.nome)}</strong> — ${esc(f.desc)}</li>`).join('')}</ol>
      <div class="doc-grid2">
        <div class="doc-box ok"><h4>✅ Por que usar</h4>${ul(met.vantagens.map(esc))}</div>
        <div class="doc-box warn"><h4>⚠️ Cuidados na aplicação</h4>${ul(met.cuidados.map(esc))}</div>
      </div>
      <h3>Como ela se aplica a esta aula de Matemática</h3>
      <p>Na <strong>${esc(s.turma)}</strong>, a ${esc(met.nome)} coloca os estudantes para ${esc(CTX.pratica)} envolvendo <strong>${esc(T)}</strong>. O ponto de partida são ${esc(contexto(g))}, o que aproxima o conteúdo da realidade da turma e do que a BNCC pede para o Ensino Médio: mobilizar a Matemática para interpretar e intervir no mundo.</p>`;
  }

  function objetivos(g) {
    const { T, topic, met, s, pick } = g;
    const c = topic ? topic.conceitos : ['os conceitos centrais', 'as representações'];
    const o = [
      `Compreender ${c[0]} e ${c[1]} no estudo de ${T}.`,
      `Resolver problemas contextualizados de ${T} a partir de ${contexto(g)}, analisando a plausibilidade dos resultados.`,
      `Representar e comunicar soluções em diferentes registros (algébrico, gráfico, tabular ou computacional).`,
      `Desenvolver ${pick(['a colaboração e a argumentação matemática', 'a autonomia e a organização do raciocínio', 'o pensamento crítico ao validar resultados'])} por meio da ${met.nome}.`
    ];
    if (s.dificuldade === 'avancada') o.push(`Generalizar resultados sobre ${T} e resolver questões no nível do ENEM e de vestibulares.`);
    if (s.dificuldade === 'basica') o[1] = `Identificar ${T} em situações do cotidiano, com apoio de materiais concretos, tabelas e calculadora.`;
    return o;
  }

  function sequencia(g) {
    const { met, s } = g;
    const total = s.minutos || s.aulas * 50;
    const fases = met.fases.filter((f) => f.pct > 0);
    const sum = fases.reduce((a, f) => a + f.pct, 0);
    let start = 0;
    const rows = fases.map((f) => {
      const dur = Math.max(5, Math.round((total * f.pct) / sum / 5) * 5);
      const a1 = Math.floor(start / 50) + 1, a2 = Math.floor(Math.max(start, start + dur - 1) / 50) + 1;
      start += dur;
      return { ...f, dur, aula: a1 === a2 ? `Aula ${a1}` : `Aulas ${a1}–${a2}` };
    });
    return { rows, pre: met.fases.find((f) => f.pct === 0) };
  }

  function bnccBlock(g) {
    const codes = g.s.habCodes || [];
    if (!codes.length) return `<h3>📐 BNCC — Matemática e suas Tecnologias</h3><p class="muted small">Nenhuma habilidade específica identificada para "${esc(g.T)}". Consulte a aba BNCC da plataforma para associar a(s) habilidade(s) adequada(s).</p>`;
    const comps = [...new Set(codes.map(competenciaDe))].sort();
    return `<h3>📐 BNCC — Matemática e suas Tecnologias (Ensino Médio)</h3>
      <p><strong>Competências específicas:</strong></p>
      <ul>${comps.map((c) => `<li><strong>Competência ${c}</strong> — ${esc(BNCC_COMPETENCIAS[c])}</li>`).join('')}</ul>
      <p><strong>Habilidades:</strong></p>
      <table class="doc-table"><tbody>${codes.map((c) => `<tr><td class="nowrap"><strong>${c}</strong></td><td>${esc(BNCC_HABILIDADES[c])}</td></tr>`).join('')}</tbody></table>`;
  }

  function secPlano(g) {
    const { s, met, T, user } = g;
    const { rows, pre } = sequencia(g);
    return `
      <table class="doc-table doc-info">
        <tr><th>Escola</th><td>${esc(user.escola?.nome || '—')}</td><th>Professor(a)</th><td>${esc(user.nome || '—')}</td></tr>
        <tr><th>Área</th><td>Matemática e suas Tecnologias</td><th>Turma</th><td>${esc(s.turma)} · ${s.alunos} estudantes</td></tr>
        <tr><th>Conteúdo</th><td>${esc(g.Tc)}${nivelTxt(s)}</td><th>Duração</th><td>${s.aulas} aula(s) · ${s.minutos} min</td></tr>
        <tr><th>Metodologia</th><td colspan="3">${met.icone} ${esc(met.nome)}</td></tr>
      </table>
      <h3>🎯 Objetivos de aprendizagem</h3>
      ${ul(objetivos(g).map(esc))}
      ${bnccBlock(g)}
      <p class="small muted">Competências gerais mobilizadas: ${met.competencias.map((c) => `CG ${c} (${esc(COMPETENCIAS_BNCC[c].split(' —')[0])})`).join(' · ')}.</p>
      ${g.topic ? `<h3>🧠 Conhecimentos-chave</h3>${ul(g.topic.conceitos.map((c) => esc(cap(c))))}` : ''}
      <h3>🧰 Recursos</h3>
      ${ul([...CTX.recursos, `Recurso digital: ${digital(g)}`, 'Material do aluno (aba "Material do aluno")'].map(esc))}
      <h3>🗓️ Sequência didática</h3>
      ${pre ? `<div class="doc-box"><strong>Antes da aula — ${esc(pre.nome)}:</strong> ${esc(pre.desc)} Envie o roteiro com 2 a 3 dias de antecedência.</div>` : ''}
      <div class="doc-table-wrap"><table class="doc-table">
        <thead><tr><th>Quando</th><th>Etapa</th><th>Tempo</th><th>O que acontece</th></tr></thead>
        <tbody>${rows.map((f) => `<tr><td class="nowrap">${f.aula}</td><td><strong>${esc(f.nome)}</strong></td><td class="nowrap">${f.dur} min</td><td>${esc(detalheFase(g, f))}</td></tr>`).join('')}</tbody>
      </table></div>
      <h3>♿ Adaptações e inclusão</h3>
      ${ul(adaptacoes(g).map(esc))}
      ${g.refs.length ? `<h3>🌐 Inspirado na rede de professores</h3>${ul(g.refs.map((m) => `<strong>${esc(m.titulo)}</strong> — ${esc(m.autor)}`))}` : ''}`;
  }

  function detalheFase(g, f) {
    const { T } = g;
    const extra = {
      'Atividade de aplicação': ` Os grupos resolvem o problema contextualizado sobre ${T}.`,
      'Lançamento e pergunta motriz': ` Evento disparador: ${contexto(g)}.`,
      'Apresentação do problema': ` Situação-problema sobre ${T} (material do aluno).`,
      'Narrativa e regras do jogo': ` Narrativa temática ligada a ${T}.`,
      'Missões nível 2 — Desafio': ' Inclui o problema contextualizado.',
      'Rotação pelas estações': ` Quatro estações sobre ${T}, com tempos iguais.`,
      'Ciclo de questões conceituais': ` Questões conceituais sobre ${T}.`,
      'Construção': ` Artefato que represente ou explique ${T}.`,
      'Grupos de especialistas': ` Cada grupo aprofunda um conhecimento-chave de ${T}.`,
      'Leitura do caso': ` Caso envolvendo ${T}.`,
      'Empatia': ` Entrevistas sobre como ${T} aparece na vida das pessoas da escola.`
    }[f.nome] || '';
    return f.desc + extra;
  }

  function adaptacoes(g) {
    const { s, T } = g;
    const base = ['Formar grupos heterogêneos com papéis definidos.', 'Apresentar instruções por escrito e oralmente, com um exemplo resolvido.', `Disponibilizar um formulário-resumo de ${T} e liberar o uso de calculadora.`];
    if (s.inclusao) base.push(
      'Antecipar a rotina da aula com um quadro visual de etapas (favorece estudantes com TEA).',
      'Permitir respostas em formatos alternativos: oral, desenho, esquema ou com escriba.',
      'Reduzir a quantidade de itens mantendo os objetivos essenciais; tempo adicional quando necessário.',
      'Usar material concreto e representações visuais (malha quadriculada, tabelas preenchidas parcialmente) — favorece estudantes com discalculia.',
      'Fonte ampliada, sem serifa e com espaçamento maior (favorece estudantes com dislexia).',
      'Dividir tarefas longas em passos curtos com checklist (favorece estudantes com TDAH).'
    );
    return base;
  }

  /* ---------- Material do aluno ---------- */
  function cabecalhoAluno(g, titulo) {
    const e = g.user.escola || {};
    return `<div class="doc-student-head">
      ${e.logo ? `<img src="${e.logo}" alt="" class="doc-logo">` : ''}
      <div><strong>${esc(e.nome || 'Escola')}</strong><br><span class="muted small">Matemática · ${esc(g.s.turma)} · Prof(a). ${esc(g.user.nome || '')}</span></div>
      <div class="doc-name">Nome: ______________________ Data: ___/___</div>
    </div><h2 class="doc-student-title">${titulo}</h2>`;
  }

  function problemaBox(g) {
    if (!g.topic) return '';
    const extra = g.s.dificuldade === 'avancada' ? '<p><strong>Desafio extra:</strong> generalize o resultado (escreva uma expressão geral) e crie uma variação do problema com novos números.</p>' : '';
    const apoio = g.s.dificuldade === 'basica' ? '<p class="small"><strong>Dica:</strong> organize os dados em uma tabela antes de escrever a expressão.</p>' : '';
    return `<div class="doc-box highlight"><h4>🧮 Problema contextualizado — ${esc(g.topic.contexto)}</h4><p>${esc(g.topic.problema)}</p>${apoio}${extra}${lines(4)}</div>`;
  }

  function secMaterial(g) {
    const fn = { invertida: matInvertida, abp: matABP, problemas: matProblemas, gamificacao: matGamificacao, estacoes: matEstacoes, pares: matPares, design: matDesign, maker: matMaker, jigsaw: matJigsaw, caso: matCaso }[g.s.metodologia];
    return fn(g);
  }

  function questoesAbertas(g, n) {
    const { T, s, pick } = g;
    let pool = [
      `Explique, com suas palavras, o que é ${T} e onde esse conhecimento aparece no dia a dia.`,
      `Dê dois exemplos de ${T} presentes em ${contexto(g)}.`,
      `Represente uma situação de ${T} de duas formas diferentes (ex.: tabela e gráfico, ou expressão algébrica e desenho).`,
      `Qual erro comum alguém pode cometer ao resolver problemas de ${T}? Como evitá-lo?`,
      `Crie um problema sobre ${T} para um colega resolver e escreva a resolução.`,
      `Como você verificaria se a resposta de um problema de ${T} faz sentido?`
    ];
    if (s.dificuldade === 'avancada') pool = pool.concat([`Compare duas estratégias de resolução para um problema de ${T}. Qual é mais eficiente e por quê?`, `Elabore uma questão de ${T} no estilo ENEM, com cinco alternativas e distratores plausíveis.`]);
    const out = []; const used = new Set();
    while (out.length < n && used.size < pool.length) { const i = Math.floor(g.r() * pool.length); if (!used.has(i)) { used.add(i); out.push(pool[i]); } }
    return out;
  }

  function matInvertida(g) {
    const { T } = g;
    return cabecalhoAluno(g, `Roteiro de estudo: ${esc(g.Tc)}`) + `
      <div class="doc-box"><h4>🏠 Parte 1 — Antes da aula (até 15 min)</h4>
      <ol><li>Assista ao vídeo ou leia o material indicado sobre <strong>${esc(T)}</strong>.</li><li>Anote as <strong>3 ideias principais</strong>:</li></ol>${lines(3)}
      <p><strong>O que ficou confuso para mim?</strong></p>${lines(2)}</div>
      <div class="doc-box"><h4>✔️ Parte 2 — Verificação rápida (início da aula)</h4>
      <ol>${questoesAbertas(g, 3).map((x) => `<li>${esc(x)}${lines(2)}</li>`).join('')}</ol>
      <p class="small">Como me sinto: 😟 ainda não entendi &nbsp; 😐 entendi em parte &nbsp; 😀 entendi bem</p></div>
      <h3>👥 Parte 3 — Em sala, em grupo</h3>
      ${problemaBox(g)}
      <div class="doc-box"><h4>🔁 Desafio de explicação</h4><p>Gravem um áudio ou façam um esquema de até 1 minuto explicando a resolução para quem faltou. Usem ${esc(digital(g))} se quiserem.</p></div>`;
  }

  function matABP(g) {
    const { T, s, pick } = g;
    const pergunta = pick([
      `Como podemos usar ${T} para ajudar a nossa comunidade a tomar uma decisão melhor?`,
      `Como explicar ${T} para a comunidade escolar de forma útil e criativa?`,
      `De que forma ${T} está presente em ${contexto(g)} e o que podemos propor a partir disso?`
    ]);
    const n = Math.min(s.aulas, 8);
    const etapas = ['Lançamento e formação das equipes', 'Coleta de dados', 'Modelagem matemática', 'Produção (versão 1)', 'Revisão com feedback', 'Apresentação pública'];
    const entregas = ['Equipes e papéis', 'Dados organizados em tabela', 'Modelo/expressão matemática', 'Versão 1 do produto', 'Versão final', 'Apresentação'];
    const cron = Array.from({ length: n }, (_, i) => Math.min(etapas.length - 1, Math.floor((i * etapas.length) / n)));
    return cabecalhoAluno(g, `Ficha do Projeto: ${esc(g.Tc)}`) + `
      <div class="doc-box highlight"><h4>❓ Pergunta motriz</h4><p class="big">${esc(pergunta)}</p></div>
      <div class="doc-box"><h4>🎁 Produto final</h4><p>Nossa equipe vai produzir <strong>${esc(CTX.produto)}</strong>, com dados reais, cálculos e gráficos, apresentado para ${pick(['outras turmas', 'as famílias', 'a comunidade escolar'])}.</p></div>
      ${problemaBox(g)}
      <h3>👥 Papéis na equipe</h3>
      <table class="doc-table"><thead><tr><th>Papel</th><th>Responsabilidade</th><th>Nome</th></tr></thead><tbody>
      <tr><td>Coordenador(a)</td><td>Organiza tarefas e cronograma</td><td></td></tr><tr><td>Analista de dados</td><td>Coleta e confere os dados e cálculos</td><td></td></tr>
      <tr><td>Designer</td><td>Gráficos e parte visual</td><td></td></tr><tr><td>Comunicador(a)</td><td>Prepara a apresentação</td><td></td></tr></tbody></table>
      <h3>🗓️ Cronograma</h3>
      <table class="doc-table"><thead><tr><th>Aula</th><th>Etapa</th><th>Entrega</th><th>✓</th></tr></thead><tbody>
      ${cron.map((e, i) => `<tr><td>${i + 1}</td><td>${etapas[e]}</td><td>${entregas[e]}</td><td>☐</td></tr>`).join('')}</tbody></table>
      <h3>📓 Diário de bordo</h3><p><strong>O que fizemos hoje?</strong></p>${lines(2)}<p><strong>Que Matemática usamos?</strong></p>${lines(2)}`;
  }

  function matProblemas(g) {
    const { T, pick, user } = g;
    const quem = pick(['A direção da escola', 'A associação de moradores', 'Uma pequena empresa do bairro']);
    return cabecalhoAluno(g, `Situação-problema: ${esc(g.Tc)}`) + `
      <div class="doc-box"><h4>📰 A situação</h4>
      <p>${quem} pediu ajuda à turma da ${esc(g.s.turma)}${user.escola?.nome ? ` da ${esc(user.escola.nome)}` : ''}: <em>"Precisamos de uma análise matemática confiável para tomar uma decisão."</em> O tema envolve <strong>${esc(T)}</strong> em ${esc(contexto(g))}.</p>
      <p><strong>Missão do grupo:</strong> resolver o problema abaixo, justificar a solução e entregar um parecer de uma página.</p></div>
      ${problemaBox(g)}
      <h3>🔎 Quadro de análise</h3>
      <table class="doc-table doc-tall"><thead><tr><th>O que já sabemos</th><th>O que precisamos descobrir</th><th>Hipóteses / estratégias</th></tr></thead><tbody><tr><td></td><td></td><td></td></tr></tbody></table>
      <h3>🧭 Questões orientadoras</h3>
      <ol><li>Quais grandezas variam? Como elas se relacionam?</li><li>Que modelo matemático (expressão, tabela, gráfico) representa a situação?</li><li>A resposta faz sentido no contexto? Como verificar?</li><li>Que recomendação vocês fazem e quais são os limites dela?</li></ol>`;
  }

  function matGamificacao(g) {
    const { T, pick, s } = g;
    const nome = pick([`Os Guardiões de ${g.Tc}`, `Expedição ${g.Tc}`, `Escape Room: ${g.Tc}`, `A Liga de ${g.Tc}`]);
    const k = s.dificuldade === 'avancada' ? 1.5 : 1;
    const missoes = [
      ['🌱', 'Aquecimento', `Responder 5 perguntas rápidas sobre o que já sabem de ${T}.`, 50],
      ['🗺️', 'Exploração', g.topic ? `Explicar com exemplos: ${g.topic.conceitos.slice(0, 2).join(' e ')}.` : `Encontrar 3 exemplos de ${T} no cotidiano.`, 100],
      ['⚔️', 'Desafio', 'Resolver o problema contextualizado (fim da ficha).', 150],
      ['🤝', 'Aliança', 'Ajudar outra equipe a completar uma missão (bônus de cooperação).', 100],
      ['🐉', 'Chefão final', `Criar um problema novo de ${T}, com resolução, para outra equipe resolver.`, 250]
    ];
    return cabecalhoAluno(g, `🎮 ${esc(nome)}`) + `
      <div class="doc-box highlight"><h4>📜 A história</h4><p>O conhecimento sobre <strong>${esc(T)}</strong> foi trancado em um cofre com cinco cadeados. Cada missão cumprida abre um cadeado e vale XP. A equipe que abrir o cofre libera o portal!</p></div>
      <h3>🎯 Missões</h3>
      <div class="doc-table-wrap"><table class="doc-table"><thead><tr><th></th><th>Missão</th><th>Desafio</th><th>XP</th><th>✓</th></tr></thead><tbody>
      ${missoes.map((m) => `<tr><td>${m[0]}</td><td><strong>${m[1]}</strong></td><td>${esc(m[2])}</td><td class="nowrap">${Math.round(m[3] * k)} XP</td><td>☐</td></tr>`).join('')}</tbody></table></div>
      <h3>🏅 Conquistas</h3>
      <div class="doc-badges"><div class="doc-badge">🧠<strong>Mente brilhante</strong><span>Explicou um conceito para outra equipe</span></div><div class="doc-badge">🤝<strong>Espírito de equipe</strong><span>Todos participaram</span></div><div class="doc-badge">⚡<strong>Relâmpago</strong><span>Missão antes do tempo</span></div><div class="doc-badge">🔍<strong>Detetive</strong><span>Encontrou e corrigiu um erro</span></div></div>
      <h3>📏 Regras</h3>${ul(['Equipes de 4 ou 5: líder, escriba, guardião do tempo e porta-voz.', 'Missões são validadas pelo mestre do jogo (professor).', 'Errar não tira pontos: tente de novo com uma dica.', 'Ajudar outras equipes também gera XP!'])}
      ${problemaBox(g)}`;
  }

  function matEstacoes(g) {
    const { T, s } = g;
    const rot = Math.round((s.minutos * 0.75) / 4 / 5) * 5;
    const est = [
      ['📖', 'Estação Conceito', g.topic ? `Leiam o texto de apoio e expliquem: ${g.topic.conceitos.slice(0, 2).join(' e ')}.` : `Leiam o texto de apoio sobre ${T} e destaquem 3 ideias.`],
      ['💻', 'Estação Digital', `Explorem ${T} em ${digital(g)}. Registrem uma descoberta e uma dúvida.`],
      ['✋', 'Estação Aplicação', 'Resolvam o problema contextualizado (abaixo), organizando os dados em tabela.'],
      ['👩‍🏫', 'Estação com a Professora', `Conversa guiada sobre dúvidas de ${T} e correção coletiva.`]
    ];
    return cabecalhoAluno(g, `Rotação por Estações: ${esc(g.Tc)}`) + `
      <p>Seu grupo vai passar por <strong>4 estações</strong>, cerca de <strong>${rot} minutos</strong> em cada. Ao sinal, troquem.</p>
      <div class="doc-stations">${est.map((e, i) => `<div class="doc-station"><div class="doc-station-n">${i + 1}</div><h4>${e[0]} ${e[1]}</h4><p>${esc(e[2])}</p>${lines(3)}</div>`).join('')}</div>
      ${problemaBox(g)}
      <h3>🧩 Síntese</h3><p>O que cada estação me ensinou sobre ${esc(T)}?</p>${lines(3)}`;
  }

  function matPares(g) {
    const { T, topic } = g;
    const outros = Object.entries(TOPICOS).filter(([k]) => k !== g.s.topico).map(([, t]) => t.conceitos[0]);
    const qs = [];
    if (topic) {
      const alts = [topic.conceitos[0], outros[Math.floor(g.r() * outros.length)], outros[Math.floor(g.r() * outros.length)], 'Nenhum conceito matemático é necessário'];
      qs.push({ q: `Qual conhecimento é essencial para resolver o problema contextualizado desta aula (${topic.contexto})?`, a: alts });
    }
    qs.push({ q: `Um colega afirmou: "Para resolver problemas de ${T}, basta decorar a fórmula". Você concorda?`, a: ['Sim, decorar é suficiente', 'Não: é preciso entender as grandezas envolvidas e verificar se o resultado faz sentido', 'Depende apenas do tipo de prova', 'Não, porque a fórmula nunca funciona'] });
    qs.push({ q: `Ao resolver um problema de ${T}, você encontrou um resultado negativo para uma medida de comprimento. O que isso indica?`, a: ['Que o resultado está certo', 'Que é preciso revisar o modelo ou os cálculos, pois não faz sentido no contexto', 'Que basta trocar o sinal', 'Que o problema não tem solução'] });
    return cabecalhoAluno(g, `Instrução por Pares: ${esc(g.Tc)}`) + `
      <div class="doc-box"><h4>🔁 Como funciona</h4><ol><li>Leia e vote <strong>sozinho(a)</strong> (1 min).</li><li>Encontre alguém que votou diferente e <strong>argumente</strong> (2–3 min).</li><li>Vote <strong>novamente</strong>.</li></ol></div>
      ${qs.map((x, i) => `<div class="doc-box"><h4>Questão ${i + 1}</h4><p>${esc(x.q)}</p><ol type="A">${x.a.map((a) => `<li>${esc(cap(a))}</li>`).join('')}</ol><p class="small">1º voto: ( A ) ( B ) ( C ) ( D ) · 2º voto: ( A ) ( B ) ( C ) ( D )</p></div>`).join('')}
      ${problemaBox(g)}
      <div class="doc-box warn"><h4>👩‍🏫 Nota à professora</h4><p>Gabarito: Q1 ${topic ? 'A; Q2 B; Q3 B' : 'B; Q2 B'}. Acrescente questões conceituais com distratores baseados nos erros mais comuns da turma. Meta: 30% a 70% de acerto no 1º voto.</p></div>
      <div class="doc-cards">${['A', 'B', 'C', 'D'].map((l) => `<div class="doc-card c${l}">${l}</div>`).join('')}</div><p class="small muted center">Recorte os cartões de votação.</p>`;
  }

  function matDesign(g) {
    const { T } = g;
    return cabecalhoAluno(g, `Design Thinking: ${esc(g.Tc)}`) + `
      <div class="doc-box highlight"><h4>🎯 Desafio</h4><p>Como podemos usar <strong>${esc(T)}</strong> para melhorar algo real na nossa escola, a partir de ${esc(contexto(g))}?</p></div>
      <h3>1. Empatia — mapa de empatia</h3>
      <table class="doc-table doc-tall"><tr><th>💬 Diz</th><th>💭 Pensa</th></tr><tr><td></td><td></td></tr><tr><th>🏃 Faz</th><th>❤️ Sente</th></tr><tr><td></td><td></td></tr></table>
      <h3>2. Definição</h3><p><strong>Como podemos</strong> ___________________ <strong>para</strong> ___________________?</p>
      <h3>3. Ideação — 8 ideias</h3><div class="doc-ideas">${Array.from({ length: 8 }, (_, i) => `<div>${i + 1}</div>`).join('')}</div>
      <h3>4. Protótipo (com os cálculos)</h3><div class="doc-draw"></div>
      ${problemaBox(g)}
      <h3>5. Teste</h3><table class="doc-table"><thead><tr><th>👍 Funcionou</th><th>🔧 Melhorar</th><th>❓ Perguntas</th></tr></thead><tbody><tr class="doc-tall"><td></td><td></td><td></td></tr></tbody></table>`;
  }

  function matMaker(g) {
    const { T, pick } = g;
    const artefato = pick(['um instrumento de medição', 'um modelo físico', 'uma maquete interativa', 'um jogo de tabuleiro']);
    return cabecalhoAluno(g, `Desafio Maker: ${esc(g.Tc)}`) + `
      <div class="doc-box highlight"><h4>🔧 O desafio</h4><p>Construam <strong>${artefato}</strong> que demonstre ou permita investigar <strong>${esc(T)}</strong>. Ele deve funcionar e ser explicado matematicamente!</p></div>
      <div class="doc-grid2"><div class="doc-box"><h4>📦 Materiais</h4>${ul(['Papelão, canudos, barbante, transferidor', 'Fita, cola e tesoura', 'Régua, trena e celular', 'Papel quadriculado'])}</div>
      <div class="doc-box warn"><h4>🦺 Segurança</h4>${ul(['Estilete só com supervisão', 'Cola quente apenas na estação da professora', 'Bancada organizada'])}</div></div>
      <h3>✏️ Esboço com medidas</h3><div class="doc-draw"></div>
      ${problemaBox(g)}
      <h3>🔄 Ciclo de criação</h3><table class="doc-table"><tbody><tr><td>Planejei</td><td>&nbsp;</td></tr><tr><td>Construí</td><td></td></tr><tr><td>Testei — o que medi?</td><td></td></tr><tr><td>Melhorei</td><td></td></tr></tbody></table>`;
  }

  function matJigsaw(g) {
    const { T, topic } = g;
    const partes = topic ? topic.conceitos.map(cap) : [`Conceitos de ${T}`, `${g.Tc} no cotidiano`, `Representações de ${T}`, `Aplicações de ${T}`];
    return cabecalhoAluno(g, `Jigsaw: ${esc(g.Tc)}`) + `
      <div class="doc-box"><h4>🧩 Como funciona</h4><ol><li>No <strong>grupo de origem</strong>, cada um recebe uma parte (A, B, C ou D).</li><li>No <strong>grupo de especialistas</strong>, estude sua parte e prepare um exemplo resolvido.</li><li>Volte e <strong>ensine</strong> sua parte.</li></ol></div>
      <div class="doc-stations">${partes.map((p, i) => `<div class="doc-station"><div class="doc-station-n">${'ABCD'[i]}</div><h4>${esc(p)}</h4><p class="small">O que preciso explicar + exemplo resolvido:</p>${lines(3)}</div>`).join('')}</div>
      <h3>📝 Síntese do grupo de origem</h3>
      ${problemaBox(g) || `<p>Como as 4 partes se conectam?</p>${lines(3)}`}`;
  }

  function matCaso(g) {
    const { T, pick } = g;
    const p1 = pick(['Ana', 'Joana', 'Luíza', 'Marta']), p2 = pick(['Pedro', 'Rafael', 'Carlos', 'João']);
    return cabecalhoAluno(g, `Estudo de Caso: ${esc(g.Tc)}`) + `
      <div class="doc-box"><h4>📂 O caso</h4>
      <p>${p1} e ${p2} precisam tomar uma decisão importante envolvendo <strong>${esc(T)}</strong> (${esc(contexto(g))}). ${p1} confia ${pick(['nos números de uma propaganda', 'na experiência de amigos', 'na primeira conta que fez'])}; ${p2} acha que é preciso ${pick(['modelar a situação e comparar cenários', 'analisar os dados com cuidado', 'considerar o longo prazo'])}.</p></div>
      ${problemaBox(g)}
      <h3>🔍 Análise</h3><ol><li>Qual é o problema central?</li>${lines(1)}<li>Que modelo matemático representa a situação?</li>${lines(2)}<li>Quem tem razão: ${p1} ou ${p2}? Justifique com cálculos.</li>${lines(2)}</ol>
      <h3>⚖️ Decisão</h3><table class="doc-table"><thead><tr><th>Opção</th><th>Resultado (cálculo)</th><th>Prós e contras</th></tr></thead><tbody><tr><td>1</td><td></td><td></td></tr><tr><td>2</td><td></td><td></td></tr></tbody></table>`;
  }

  /* ---------- Avaliação ---------- */
  function secAvaliacao(g) {
    const { met, T, s, topic } = g;
    const crit = { invertida: 'Preparação prévia', abp: 'Qualidade do produto final', problemas: 'Fundamentação da solução', gamificacao: 'Cumprimento das missões', estacoes: 'Autonomia nas estações', pares: 'Qualidade da argumentação', design: 'Empatia e iteração', maker: 'Funcionamento e explicação', jigsaw: 'Clareza ao ensinar', caso: 'Argumentação e decisão' }[s.metodologia];
    const criterios = [
      ['Compreensão conceitual', `Confunde conceitos de ${T}`, 'Reconhece conceitos com apoio', 'Explica os conceitos com clareza', 'Relaciona conceitos e generaliza'],
      ['Resolução e modelagem', 'Não identifica o modelo', 'Modela parcialmente', 'Modela e resolve corretamente', 'Resolve e analisa a plausibilidade'],
      ['Representações', 'Usa um registro com erros', 'Usa um registro corretamente', 'Usa e converte dois registros', 'Escolhe o registro mais eficiente'],
      [crit, 'Ainda não demonstra', 'Demonstra parcialmente', 'Demonstra de forma consistente', 'Demonstra com excelência']
    ];
    return `
      <h3>🧭 Estratégia de avaliação</h3>
      <div class="doc-grid3">
        <div class="doc-box"><h4>Diagnóstica</h4><p>Perguntas rápidas sobre ${esc(T)} no início.</p></div>
        <div class="doc-box"><h4>Formativa</h4><p>Observação com a rubrica e feedback nas etapas da ${esc(met.nome)}.</p></div>
        <div class="doc-box"><h4>Somativa</h4><p>${s.metodologia === 'abp' ? 'Produto final e apresentação.' : 'Resolução do problema contextualizado + questão individual.'}</p></div>
      </div>
      ${(s.habCodes || []).length ? `<p class="small muted">Habilidades avaliadas: ${s.habCodes.join(', ')}.</p>` : ''}
      <h3>📊 Rubrica</h3>
      <div class="doc-table-wrap"><table class="doc-table rubric"><thead><tr><th>Critério</th><th>1 · Iniciante</th><th>2 · Em desenvolvimento</th><th>3 · Proficiente</th><th>4 · Avançado</th></tr></thead>
      <tbody>${criterios.map((c) => `<tr><td><strong>${esc(c[0])}</strong></td>${c.slice(1).map((x) => `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
      <h3>🪞 Autoavaliação</h3>
      <table class="doc-table"><thead><tr><th>Afirmação</th><th>😟</th><th>😐</th><th>😀</th></tr></thead><tbody>
      ${[`Consigo explicar ${T} com minhas palavras.`, 'Sei verificar se minha resposta faz sentido.', 'Participei ativamente do grupo.', 'Sei onde buscar ajuda quando tenho dúvidas.'].map((a) => `<tr><td>${esc(a)}</td><td>☐</td><td>☐</td><td>☐</td></tr>`).join('')}</tbody></table>
      ${topic ? `<div class="doc-box ok"><h4>🔑 Gabarito do problema contextualizado (professora)</h4><p>${esc(topic.resposta)}</p></div>` : ''}
      <p class="muted small">Pontuação sugerida: soma da rubrica (4 a 16 pontos), convertida para a escala da escola.</p>`;
  }

  global.AI = { respond, parse, suggest, generate, newState, helpText, esc, cap, bnccOverview };
})(typeof window !== 'undefined' ? window : globalThis);
