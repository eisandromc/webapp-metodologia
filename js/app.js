/* =========================================================
   MetodologIA — Aplicação (protótipo navegável, sem backend)
   ========================================================= */
(function () {
  const { esc, cap } = AI;
  const { icon } = Aula;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const uid = (p) => p + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const SEED_VERSION = 'v3-fluxo-aula';
  const DEFAULT_IDEIA = 'Preciso de uma aula prática sobre geometria espacial para o 2º ano do Ensino Médio, com duração de 100 minutos.';
  const MAX_FILE = 1.5 * 1024 * 1024;

  /* ---------- Estilos dos documentos (prévia, impressão e .doc) ---------- */
  const DOC_CSS = `
  .doc{background:#fff;color:#172033;max-width:860px;margin:0 auto;padding:22px 18px;border-radius:10px;box-shadow:0 2px 12px rgba(0,0,0,.06);font-family:Inter,Arial,sans-serif;font-size:15.5px;line-height:1.6;overflow-wrap:anywhere}
  .doc h2{font-size:21px;margin:0 0 6px}.doc h3{font-size:17px;margin:22px 0 8px;color:#0F5968}.doc h4{font-size:15.5px;margin:0 0 6px}
  .doc p{margin:0 0 10px}.doc ul,.doc ol{margin:0 0 10px;padding-left:22px}.doc li{margin-bottom:4px}
  .doc .muted{color:#5A6278}.doc .small{font-size:13.5px}.doc .big{font-size:17px;font-weight:600}.doc .nowrap{white-space:nowrap}
  .doc-box{border:1px solid #E2E5F0;border-radius:12px;padding:12px 14px;margin:12px 0;background:#FAFBFE;break-inside:avoid}
  .doc-box.ok{background:#E8F5EF;border-color:#BFE3D2}.doc-box.warn{background:#FEF6E4;border-color:#F6DFA6}.doc-box.highlight{background:#F0EDFF;border-color:#DCD5FF}
  .doc-grid2{display:grid;grid-template-columns:1fr;gap:10px}.doc-grid2 .doc-box{margin:0}
  .doc-table-wrap{overflow-x:auto}.doc-table{width:100%;border-collapse:collapse;margin:8px 0 14px;font-size:14.5px}
  .doc-table th,.doc-table td{border:1px solid #DCDFEA;padding:8px 10px;text-align:left;vertical-align:top}.doc-table th{background:#F4F5FB}
  .rubric{min-width:600px}.doc-lines span{display:block;height:28px;border-bottom:1px solid #C9CEE0}.doc-lines{margin:4px 0 12px}
  .doc-student-head{display:flex;gap:12px;align-items:center;flex-wrap:wrap;border-bottom:2px solid #172033;padding-bottom:10px}
  .doc-logo{width:46px;height:46px;object-fit:contain}.doc-name{font-size:14px;width:100%}.doc-student-title{text-align:center;margin:14px 0 !important}
  .doc-steps li{margin-bottom:8px}.quiz>li{margin-bottom:14px}.quiz ol{margin-top:6px}
  .doc-fig{width:100%;height:auto;background:#fff;border:1px solid #E2E5F0;border-radius:12px;padding:10px;margin:8px 0}
  .slides{display:grid;grid-template-columns:1fr;gap:12px}.slide{aspect-ratio:16/9;border:1px solid #DCDFEA;border-radius:12px;padding:16px;background:linear-gradient(135deg,#fff,#F3F1FB);position:relative;overflow:hidden;font-size:14px}
  .slide h4{font-size:20px;margin-top:22px}.slide-n{position:absolute;right:12px;top:10px;font-size:12px;color:#5A6278}.slide-k{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6B4EFF;margin-bottom:6px}
  .doc-footer{margin-top:24px;padding-top:10px;border-top:1px solid #E2E5F0;font-size:12.5px;color:#5A6278;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}
  @media(min-width:720px){.doc{padding:40px 44px}.doc-grid2{grid-template-columns:1fr 1fr}.slides{grid-template-columns:1fr 1fr}.doc-name{width:auto;margin-left:auto}}
  @media print{.doc{box-shadow:none;padding:0}.doc-grid2{grid-template-columns:1fr 1fr}.slides{grid-template-columns:1fr 1fr}.rubric{min-width:0}}`;
  document.head.insertAdjacentHTML('beforeend', `<style>${DOC_CSS}</style>`);

  /* ---------- Armazenamento ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('mia_' + k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem('mia_' + k, JSON.stringify(v)); return true; } catch { toast('Armazenamento do navegador cheio. Remova arquivos grandes.', 'x'); return false; } },
    del(k) { try { localStorage.removeItem('mia_' + k); } catch { } }
  };
  const hashPw = (s) => { let h = 5381; for (const c of s) h = ((h << 5) + h + c.charCodeAt(0)) | 0; return 'h' + (h >>> 0).toString(16); };
  const DEMO = [{ id: 'u_marina', nome: 'Marina', email: 'marina@metodologia.app', senha: '123456', papel: 'Professora de Matemática · Ensino Médio' }];

  function seed(force) {
    if (store.get('seedVersion') === SEED_VERSION && !force) return;
    const list = store.get('users', []).filter((u) => !['u_demo', 'u_marina'].includes(u.id));
    const prev = store.get('users', []).find((u) => u.id === 'u_marina');
    list.push({
      id: 'u_marina', email: 'marina@metodologia.app', senha: hashPw('123456'), nome: 'Marina', disciplinas: 'Matemática', formacao: 'Licenciatura em Matemática',
      bio: 'Professora de Matemática do Ensino Médio há 12 anos. Leciona para três turmas com níveis diferentes e busca aulas mais práticas e participativas.',
      foto: force ? null : prev?.foto || null, escola: { nome: 'Escola Estadual Aurora', cidade: 'Campinas', uf: 'SP', rede: 'Pública estadual', segmentos: 'Ensino Médio', logo: force ? null : prev?.escola?.logo || null }
    });
    store.set('users', list);
    const own = store.get('materiais', []).filter((m) => !String(m.id).startsWith('seed'));
    store.set('materiais', [...SEED_MATERIAIS.map((m) => ({ ...m })), ...own]);
    if (store.get('session') === 'u_demo') store.del('session');
    store.set('seedVersion', SEED_VERSION);
  }

  let user = null;
  const users = () => store.get('users', []);
  function saveUser(u) { const l = users(); const i = l.findIndex((x) => x.id === u.id); if (i >= 0) l[i] = u; else l.push(u); if (store.set('users', l)) { user = u; return true; } return false; }
  const k = (n) => `${n}_${user.id}`;
  const getDraft = () => store.get(k('draft'), null);
  const setDraft = (d) => store.set(k('draft'), d);
  const getAulas = () => store.get(k('aulas'), []);
  const setAulas = (a) => store.set(k('aulas'), a);
  const getMats = () => store.get('materiais', []);
  const setMats = (m) => store.set('materiais', m);
  const getLikes = () => store.get(k('likes'), []);

  /* ---------- Helpers de UI ---------- */
  function toast(msg, ic = 'check') { const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = `${icon(ic, 20)}<span>${esc(msg)}</span>`; $('#toasts').append(t); setTimeout(() => t.remove(), 4200); }
  const modalOpen = () => !$('#modal').classList.contains('hidden');
  function openModal(html, cls = '') {
    if (!modalOpen()) history.pushState({ modal: 1 }, '', location.href);
    $('#modalBox').className = 'modal-box ' + cls; $('#modalBox').innerHTML = html;
    $('#modal').classList.remove('hidden'); document.body.style.overflow = 'hidden'; $('#modalBox').scrollTop = 0;
    setTimeout(() => ($('#modalBox [autofocus]') || $('#modalBox .x'))?.focus(), 50);
  }
  function hideModal() { $('#modal').classList.add('hidden'); $('#modalBox').innerHTML = ''; document.body.style.overflow = ''; }
  function closeModal(fromPop) { if (!modalOpen()) return; hideModal(); if (!fromPop && history.state?.modal) history.back(); }
  function go(hash) {
    if (modalOpen()) { hideModal(); if (history.state?.modal) { history.replaceState(null, '', hash); route(); return; } }
    if (location.hash === hash) route(); else location.hash = hash;
  }
  window.addEventListener('popstate', () => { if (modalOpen()) hideModal(); });
  $('#modal').addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modalOpen()) closeModal(); });
  const mHead = (title, sub = '') => `<div class="m-head"><div style="min-width:0"><h2>${title}</h2>${sub ? `<p class="muted small" style="margin-top:2px">${sub}</p>` : ''}</div><button class="x" data-close aria-label="Fechar">${icon('x', 18)}</button></div>`;
  const initials = (n) => { const p = (n || '?').trim().split(/\s+/); return (p.length > 1 ? p[0][0] + p[1][0] : p[0].slice(0, 2)).toUpperCase(); };
  const avatarHTML = (u) => u.foto ? `<img src="${u.foto}" alt="">` : esc(initials(u.nome));
  const firstName = () => user.nome.split(' ')[0];
  const fmtDate = (d) => new Date(d).toLocaleDateString('pt-BR');
  const fmtSize = (b) => b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';
  const readFile = (f) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(f); });
  async function resizeImage(file, max = 320) {
    const data = await readFile(file);
    return new Promise((res) => { const img = new Image(); img.onload = () => { const s = Math.min(1, max / Math.max(img.width, img.height)); const c = document.createElement('canvas'); c.width = img.width * s; c.height = img.height * s; c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); res(c.toDataURL('image/png')); }; img.onerror = () => res(null); img.src = data; });
  }
  const options = (obj, sel, first) => (first ? `<option value="">${first}</option>` : '') + Object.entries(obj).map(([key, v]) => `<option value="${key}" ${String(key) === String(sel) ? 'selected' : ''}>${esc(typeof v === 'string' ? v : v.nome)}</option>`).join('');
  const topicOptions = (sel, first) => (first ? `<option value="">${first}</option>` : '') + [1, 2, 3].map((s) => `<optgroup label="${s}º ano (sugestão)">${Object.entries(TOPICOS).filter(([, t]) => t.serie === s).map(([key, t]) => `<option value="${key}" ${key === sel ? 'selected' : ''}>${esc(t.nome)}</option>`).join('')}</optgroup>`).join('');

  /* ---------- Marca e navegação ---------- */
  $$('.brand-mark').forEach((b) => (b.innerHTML = icon('sparkles', 18)));
  ['pt1', 'pt2', 'pt3'].forEach((id, i) => ($('#' + id).innerHTML = icon(['sparkles', 'layers', 'shield'][i], 18)));
  $('#authIllu').innerHTML = Aula.HERO_SVG;
  const NAV = [['inicio', 'home', 'Início'], ['criar', 'sparkles', 'Criar aula'], ['aulas', 'book', 'Minhas aulas'], ['modelos', 'grid', 'Modelos']];
  $('#sideNav').innerHTML = NAV.map(([r, i, l]) => `<a href="#/${r}" data-route="${r}">${icon(i)}<span>${l}</span>${r === 'criar' ? `<span class="plus">${icon('plus', 16)}</span>` : ''}</a>`).join('');
  $('#sideCard').innerHTML = `${icon('bulb', 22)}<strong>Sua experiência.<br>Novas possibilidades.</strong><p>A IA inspira o planejamento. Você faz a aula acontecer.</p><span class="bar"></span>`;
  $('#sideHelp').innerHTML = `${icon('help')}<span>Central de ajuda</span>${icon('chevron', 16)}`;
  $('#sideHelp').dataset.route = 'ajuda';
  $('#bottomNav').innerHTML = [...NAV, ['ajuda', 'help', 'Ajuda']].map(([r, i, l]) => `<a href="#/${r}" data-route="${r}">${icon(i, 22)}<span>${l === 'Minhas aulas' ? 'Aulas' : l === 'Criar aula' ? 'Criar' : l}</span></a>`).join('');

  $('#userBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    const m = $('#userMenu'); const open = m.classList.toggle('hidden') === false;
    $('#userBtn').setAttribute('aria-expanded', open);
    m.innerHTML = `<a href="#/perfil" role="menuitem">${icon('user')}Perfil e escola</a><a href="#/enviar" role="menuitem">${icon('upload')}Enviar material para a rede</a><button role="menuitem" id="resetBtn">${icon('refresh')}Restaurar demonstração</button><button role="menuitem" id="logoutBtn">${icon('logout')}Sair</button>`;
    $('#resetBtn').onclick = () => { if (!confirm('Restaurar a conta da Marina, o rascunho e os materiais de exemplo?')) return; seed(true); store.del(k('draft')); user = users().find((u) => u.id === user.id); refreshChrome(); go('#/inicio'); toast('Demonstração restaurada.'); };
    $('#logoutBtn').onclick = logout;
  });
  document.addEventListener('click', () => { $('#userMenu').classList.add('hidden'); $('#userBtn').setAttribute('aria-expanded', 'false'); });

  /* ---------- Login ---------- */
  $('#demoList').innerHTML = DEMO.map((d) => `<button type="button" class="demo-user" data-email="${d.email}" data-senha="${d.senha}"><span class="avatar">${esc(initials(d.nome))}</span><span class="who"><strong>${esc(d.nome)}</strong><span>${esc(d.papel)}</span><span>${esc(d.email)}</span></span>${icon('chevron', 18)}</button>`).join('');
  $('#demoList').addEventListener('click', (e) => {
    const b = e.target.closest('.demo-user'); if (!b) return;
    $('#loginEmail').value = b.dataset.email; $('#loginSenha').value = b.dataset.senha;
    [$('#loginEmail'), $('#loginSenha')].forEach((i) => { i.classList.remove('flash'); void i.offsetWidth; i.classList.add('flash'); });
    $$('.demo-user').forEach((x) => x.classList.toggle('filled', x === b));
    $('#authError').textContent = '';
    $('#loginBtn').focus();
  });
  $('#authTabs').addEventListener('click', (e) => {
    const b = e.target.closest('.tab'); if (!b) return;
    $$('#authTabs .tab').forEach((t) => { t.classList.toggle('active', t === b); t.setAttribute('aria-selected', t === b); });
    $('#loginForm').classList.toggle('hidden', b.dataset.tab !== 'login');
    $('#registerForm').classList.toggle('hidden', b.dataset.tab !== 'register');
    $('#authError').textContent = '';
  });
  $('#loginForm').addEventListener('submit', (e) => {
    e.preventDefault(); const f = new FormData(e.target);
    if (!f.get('email') || !f.get('senha')) { $('#authError').textContent = 'Informe e-mail e senha (ou toque na conta de demonstração).'; return; }
    const u = users().find((x) => x.email.toLowerCase() === String(f.get('email')).toLowerCase().trim());
    if (!u || u.senha !== hashPw(f.get('senha'))) { $('#authError').textContent = 'E-mail ou senha inválidos.'; return; }
    store.set('session', u.id); e.target.reset(); location.hash = '#/inicio'; boot();
  });
  $('#registerForm').addEventListener('submit', (e) => {
    e.preventDefault(); const f = new FormData(e.target);
    const email = String(f.get('email')).trim();
    if (!f.get('nome') || !email || String(f.get('senha')).length < 6) { $('#authError').textContent = 'Preencha nome, e-mail e senha com 6+ caracteres.'; return; }
    if (users().some((u) => u.email.toLowerCase() === email.toLowerCase())) { $('#authError').textContent = 'Já existe uma conta com este e-mail.'; return; }
    const u = { id: uid('u'), email, senha: hashPw(f.get('senha')), nome: String(f.get('nome')).trim(), disciplinas: String(f.get('disciplina') || '').trim(), formacao: '', bio: '', foto: null, escola: { nome: String(f.get('escola') || '').trim(), cidade: '', uf: '', rede: '', segmentos: '', logo: null } };
    saveUser(u); store.set('session', u.id); e.target.reset(); location.hash = '#/perfil'; boot(); toast('Conta criada! Complete seu perfil e os dados da escola.');
  });
  function logout() { store.del('session'); user = null; location.hash = ''; boot(); }

  function boot() {
    seed();
    const sid = store.get('session');
    user = sid ? users().find((u) => u.id === sid) : null;
    if (!user) { $('#app').classList.add('hidden'); $('#auth').classList.remove('hidden'); return; }
    $('#auth').classList.add('hidden'); $('#app').classList.remove('hidden');
    refreshChrome();
    if (!location.hash || location.hash === '#') location.hash = '#/inicio'; else route();
  }
  function refreshChrome() {
    $('#topAvatar').innerHTML = avatarHTML(user);
    $('#topName').textContent = user.nome;
    $('#topRole').textContent = user.disciplinas ? `Professora · ${user.disciplinas}` : 'Professor(a)';
  }

  /* ---------- Rotas ---------- */
  let timers = [];
  const ROUTES = { inicio: ['Início', viewInicio], criar: ['Criar aula', viewCriar], aulas: ['Minhas aulas', viewAulas], modelos: ['Modelos', viewModelos], ajuda: ['Central de ajuda', viewAjuda], perfil: ['Perfil e escola', viewPerfil], enviar: ['Enviar material', viewEnviar] };
  function route() {
    if (!user) return;
    timers.forEach(clearTimeout); timers = [];
    const [raw, param] = location.hash.replace(/^#\//, '').split('/');
    const name = ROUTES[raw] ? raw : 'inicio';
    $$('#sideNav a, #bottomNav a, #sideHelp').forEach((a) => a.classList.toggle('active', a.dataset.route === name));
    $('#crumb').innerHTML = `Espaço do professor ${icon('chevron', 14)} <strong>${ROUTES[name][0]}</strong>`;
    document.title = `${ROUTES[name][0]} · MetodologIA`;
    window.scrollTo(0, 0);
    ROUTES[name][1]($('#view'), param ? decodeURIComponent(param) : null);
  }
  window.addEventListener('hashchange', route);

  /* =========================================================
     INÍCIO
     ========================================================= */
  const STEP_LABEL = { ideia: 'Sua ideia', refinar: 'Refinamento', propostas: 'Propostas de aula', materiais: 'Seus materiais' };
  function viewInicio(v) {
    const h = new Date().getHours();
    const saud = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
    const draft = getDraft();
    const aulas = getAulas().slice(0, 3);
    v.innerHTML = `
      <section class="card welcome">
        <div><p class="eyebrow">Espaço do professor</p><h1 style="margin-top:6px">${saud}, ${esc(firstName())}!</h1><p class="muted" style="margin-top:6px">Menos tempo planejando. Mais possibilidades para a sua turma.</p></div>
        <div class="chips"><button class="btn primary" id="newLesson">${icon('sparkles')}Criar nova aula</button><a class="btn" href="#/modelos">${icon('grid')}Ver modelos</a></div>
        ${draft?.step ? `<div class="resume">${icon('pencil')}<div class="t"><strong>Continue de onde parou</strong><p class="muted small">Etapa: ${STEP_LABEL[draft.step] || 'Sua ideia'}${draft.escolhida ? ` · ${esc(draft.escolhida.titulo)}` : ''}</p></div><a class="btn sm" href="#/criar/${draft.step}">Continuar</a></div>` : ''}
      </section>
      <div class="section-title"><h2>Minhas aulas recentes</h2><a href="#/aulas">Ver todas</a></div>
      ${aulas.length ? `<div class="grid g3">${aulas.map(lessonCard).join('')}</div>` : `<div class="card empty"><div class="ib">${icon('book', 26)}</div><strong>Nenhuma aula salva ainda</strong><p>Crie sua primeira aula e salve os materiais em "Minhas aulas".</p></div>`}
      <div class="section-title"><h2>Para começar rápido</h2></div>
      <div class="grid g3">${[['geometria_espacial', 2], ['financeira', 1], ['probabilidade', 2]].map(([t, s]) => `<button class="card tpl" style="text-align:left;cursor:pointer" data-ideia="${esc(`Preciso de uma aula prática sobre ${TOPICOS[t].nome.split(':')[0].toLowerCase()} para o ${s}º ano do Ensino Médio, com duração de 100 minutos.`)}"><span class="tag petrol">${s}º ano · 100 min</span><h3>${esc(TOPICOS[t].nome.split(':')[0])}</h3><p class="muted small">${esc(cap(TOPICOS[t].contexto))}</p></button>`).join('')}</div>`;
    $('#newLesson').onclick = () => { store.del(k('draft')); go('#/criar/ideia'); };
    $$('[data-ideia]', v).forEach((b) => (b.onclick = () => startWith(b.dataset.ideia)));
    bindLessonCards(v, () => viewInicio(v));
  }
  function startWith(texto) { setDraft({ step: 'ideia', texto, rapidas: [] }); go('#/criar/ideia'); }

  /* =========================================================
     CRIAR AULA — fluxo em 5 telas
     ========================================================= */
  function stepper(n) {
    const steps = ['Sua ideia', 'Refinamento', 'Propostas de aula', 'Seus materiais'];
    return `<ol class="stepper" aria-label="Etapas da criação da aula">${steps.map((s, i) => {
      const st = i + 1 < n ? 'done' : i + 1 === n ? 'current' : '';
      return `<li class="${st}" ${st === 'current' ? 'aria-current="step"' : ''}><span class="step-dot">${st === 'done' ? icon('check', 16) : String(i + 1).padStart(2, '0')}</span><span class="step-name">${s}</span>${i < 3 ? '<span class="step-line"></span>' : ''}</li>`;
    }).join('')}</ol>`;
  }

  function viewCriar(v, step) {
    const d = getDraft();
    if (!step) { go('#/criar/' + (d?.step || 'ideia')); return; }
    const need = { refinar: d?.ctx, processando: d?.refine, propostas: d?.propostas, materiais: d?.escolhida };
    if (step !== 'ideia' && !need[step]) { location.replace('#/criar/ideia'); return; }
    ({ ideia: telaIdeia, refinar: telaRefinar, processando: telaProcessando, propostas: telaPropostas, materiais: telaMateriais }[step] || telaIdeia)(v, d || {});
  }

  /* ---------- Tela 1: Sua ideia ---------- */
  function ctxChips(ctx) {
    const c = [['calc', 'Disciplina', ctx.disciplina], ['users', 'Turma', ctx.turma], ['clock', 'Duração', ctx.minutos ? `${ctx.minutos} minutos` : null], ['target', 'Objetivo', ctx.objetivo]];
    return c.map(([ic, lbl, val]) => val ? `<span class="ctx-chip" title="${lbl}">${icon(ic, 18)}<span class="sr">${lbl}: </span>${esc(val)}</span>` : `<span class="ctx-chip missing">${icon(ic, 18)}${lbl} não identificada</span>`).join('');
  }
  const RAPIDAS = { 'Aula investigativa': 'Quero uma aula investigativa.', 'Projeto interdisciplinar': 'Pode ser um projeto interdisciplinar.', 'Revisão para avaliação': 'Também quero revisar para a avaliação.' };

  function telaIdeia(v, d) {
    const texto = d.texto ?? DEFAULT_IDEIA;
    v.innerHTML = `${stepper(1)}
      <div class="page-head with-illu"><div><p class="eyebrow">Menos tempo planejando. Mais possibilidades.</p><h1 style="margin-top:8px">O que você quer construir para sua próxima aula?</h1><p class="sub" style="margin-top:8px">Descreva o contexto da turma e a MetodologIA organizará possibilidades pedagógicas para você revisar.</p></div>${Aula.HERO_SVG}</div>
      <div class="split">
        <section class="card idea-card col-8" aria-labelledby="ideaTitle">
          <div class="card-title"><h2 id="ideaTitle">${icon('pencil')}Conte sua ideia</h2><span class="status" id="draftStatus">Rascunho</span></div>
          <div class="idea-wrap">
            <label class="sr" for="ideia">Descreva a aula que você precisa</label>
            <textarea id="ideia" maxlength="2000" autocomplete="off" aria-describedby="ideaHelp">${esc(texto)}</textarea>
            <div class="suggest hidden" id="sugBox" role="listbox" aria-label="Sugestões"></div>
            <div class="idea-meta"><span id="ideaHelp">Escreva do seu jeito. A gente organiza.</span><span id="count"></span></div>
          </div>
          <hr class="divider">
          <div class="subtle-title">${icon('sparkles', 18)}Contexto da sua aula</div>
          <div class="chips" id="ctxChips" aria-live="polite"></div>
          <div class="subtle-title" style="margin-top:6px">${icon('bulb', 18)}Sugestões rápidas</div>
          <div class="chips" id="rapidas">${Object.keys(RAPIDAS).map((r) => `<button type="button" class="chip" aria-pressed="${(d.rapidas || []).includes(r)}" data-r="${r}"><span class="mark">${icon((d.rapidas || []).includes(r) ? 'check' : 'plus', 16)}</span>${r}</button>`).join('')}</div>
          <p class="hint-err hidden" id="ideaErr">${icon('x', 16)}Descreva um pouco mais a sua aula (pelo menos 15 caracteres).</p>
          <div class="actions"><button class="btn" id="resetIdeia">${icon('refresh')}Começar do zero</button><button class="btn primary" id="gerar">${icon('sparkles')}Gerar sugestões de aula</button></div>
        </section>
        <aside class="aside-card col-4" aria-label="Dicas">
          <span class="aside-icon">${icon('bulb', 22)}</span>
          <p class="eyebrow" style="color:var(--yellow-700)">Um bom ponto de partida</p>
          <h3>Uma boa aula começa com o seu olhar.</h3>
          <p class="muted">Conte o que seus estudantes precisam aprender. Você pode incluir:</p>
          <ul class="checklist"><li>${icon('check', 18)}O conteúdo e os objetivos</li><li>${icon('check', 18)}O perfil da sua turma</li><li>${icon('check', 18)}O tempo e os recursos</li></ul>
          <p class="final-word">${icon('shield', 18)}<span>Você tem a palavra final. <strong>Sempre.</strong></span></p>
        </aside>
      </div>`;
    const ta = $('#ideia');
    let rapidas = [...(d.rapidas || [])];
    const sync = () => {
      const ctx = Aula.contexto(ta.value);
      $('#ctxChips').innerHTML = ctxChips(ctx);
      $('#count').textContent = `${ta.value.length}/2000`;
      $('#ideaErr').classList.add('hidden');
      setDraft({ ...(getDraft() || {}), step: 'ideia', texto: ta.value, rapidas });
      $('#draftStatus').textContent = 'Rascunho salvo'; $('#draftStatus').classList.add('ok');
      return ctx;
    };
    sync(); $('#draftStatus').textContent = 'Rascunho'; $('#draftStatus').classList.remove('ok');
    let t; ta.addEventListener('input', () => { clearTimeout(t); t = setTimeout(sync, 120); });
    setupSuggest(ta, sync);
    $('#rapidas').addEventListener('click', (e) => {
      const b = e.target.closest('.chip'); if (!b) return;
      const r = b.dataset.r, frase = RAPIDAS[r];
      const on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', on); b.querySelector('.mark').innerHTML = icon(on ? 'check' : 'plus', 16);
      if (on) { rapidas.push(r); ta.value = (ta.value.trim() + ' ' + frase).trim(); } else { rapidas = rapidas.filter((x) => x !== r); ta.value = ta.value.replace(' ' + frase, '').replace(frase, '').trim(); }
      sync();
    });
    $('#resetIdeia').onclick = () => { ta.value = ''; rapidas = []; $$('#rapidas .chip').forEach((c) => { c.setAttribute('aria-pressed', 'false'); c.querySelector('.mark').innerHTML = icon('plus', 16); }); store.del(k('draft')); sync(); ta.focus(); };
    $('#gerar').onclick = () => {
      if (ta.value.trim().length < 15) { $('#ideaErr').classList.remove('hidden'); ta.focus(); return; }
      const ctx = Aula.contexto(ta.value);
      if (!ctx.minutos) ctx.minutos = 100;
      if (!ctx.turma) { ctx.serie = ctx.topico ? TOPICOS[ctx.topico].serie : 1; ctx.turma = `${ctx.serie}º ano do Ensino Médio`; }
      const prev = getDraft() || {};
      const mesmoTema = prev.ctx && prev.ctx.topico === ctx.topico;
      setDraft({ step: 'refinar', texto: ta.value.trim(), rapidas, ctx, refine: mesmoTema ? prev.refine : null });
      go('#/criar/refinar');
    };
  }

  /* Caixa de sugestões enquanto digita */
  function setupSuggest(ta, after) {
    const box = $('#sugBox'); let items = [], active = -1, dismissed = false;
    const paint = () => {
      box.innerHTML = `<div class="suggest-head"><span>${icon('bulb', 14)} ${ta.value.trim() ? 'Sugestões para completar' : 'Experimente'}</span><button type="button" data-hide>Fechar</button></div>` +
        items.map((s, i) => `<button type="button" class="sug ${i === active ? 'active' : ''}" data-i="${i}" role="option" aria-selected="${i === active}"><span class="l">${esc(s.label)}${s.extra ? `<em>${esc(s.extra)}</em>` : ''}</span><span class="tag ${s.tipo.startsWith('Conte') ? 'code' : s.tipo === 'Metodologia' ? 'violet' : 'yellow'}">${esc(s.tipo)}</span></button>`).join('');
      box.classList.remove('hidden');
    };
    const update = () => {
      if (dismissed || document.activeElement !== ta) { box.classList.add('hidden'); return; }
      const end = ta.selectionStart === ta.value.length;
      items = end ? AI.suggest(ta.value, 5).map((s) => ({ ...s, label: s.label.replace(/º ano$/, 'º ano do Ensino Médio') })) : [];
      active = -1;
      if (!items.length) { box.classList.add('hidden'); return; }
      paint();
    };
    const accept = (i) => { const s = items[i]; if (!s) return; ta.value = s.value.replace(/(\d)º ano (?!do)/, '$1º ano do Ensino Médio '); ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); after(); update(); };
    ta.addEventListener('input', () => { dismissed = false; update(); });
    ta.addEventListener('focus', update);
    ta.addEventListener('click', update);
    ta.addEventListener('blur', () => setTimeout(() => box.classList.add('hidden'), 150));
    ta.addEventListener('keydown', (e) => {
      if (box.classList.contains('hidden')) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); active = (active + 1) % items.length; paint(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); active = (active - 1 + items.length) % items.length; paint(); }
      else if ((e.key === 'Enter' || e.key === 'Tab') && active >= 0) { e.preventDefault(); accept(active); }
      else if (e.key === 'Escape') { dismissed = true; box.classList.add('hidden'); }
    });
    box.addEventListener('pointerdown', (e) => e.preventDefault());
    box.addEventListener('click', (e) => { if (e.target.closest('[data-hide]')) { dismissed = true; box.classList.add('hidden'); return; } const b = e.target.closest('.sug'); if (b) accept(+b.dataset.i); });
  }

  /* ---------- Tela 2: Refinamento ---------- */
  function telaRefinar(v, d) {
    const qs = Aula.perguntas(d.ctx);
    const refine = d.refine || Object.fromEntries(qs.map((q) => [q.id, [...q.padrao]]));
    qs.forEach((q) => { refine[q.id] = (refine[q.id] || []).filter((x) => q.opcoes.includes(x)); });
    v.innerHTML = `${stepper(2)}
      <div class="page-head"><p class="eyebrow">Vamos entender o que sua turma precisa</p><h1>Alguns detalhes fazem toda a diferença</h1><p class="sub">Refine sua ideia para receber propostas mais conectadas com a sua realidade.</p></div>
      <div class="split">
        <section class="card q-card col-8" aria-labelledby="qTitle">
          <div class="q-head"><span class="ib">${icon('sparkles', 22)}</span><div style="flex:1"><h2 id="qTitle">Vamos construir isso juntos</h2><p class="muted">Selecione uma ou mais opções em cada pergunta.</p></div><span class="tag violet">3 perguntas rápidas</span></div>
          ${qs.map((q, i) => `<fieldset class="q" data-q="${q.id}" style="border:0;margin:0;min-width:0"><legend class="sr">${esc(q.titulo)}</legend>
            <h3 aria-hidden="true"><span class="q-n">${i + 1}</span>${esc(q.titulo)}</h3><p class="sel" aria-live="polite"></p>
            <div class="chips">${q.opcoes.map((o) => `<button type="button" class="chip" data-o="${esc(o)}"><span class="mark"></span>${esc(o)}</button>`).join('')}</div></fieldset>`).join('')}
          <div class="actions"><a class="btn" href="#/criar/ideia">${icon('back')}Voltar e editar pedido</a><button class="btn primary" id="construir">${icon('sparkles')}Construir propostas de aula</button></div>
          <p class="hint-err hidden" id="refErr" style="justify-content:flex-end;margin-top:8px">${icon('x', 16)}Selecione ao menos uma opção em cada pergunta.</p>
        </section>
        <aside class="aside-card tint col-4" aria-label="Seu pedido">
          <div class="mini-user"><span class="avatar">${avatarHTML(user)}</span><div><strong>Sua ideia, ${esc(firstName())}</strong><p class="muted small">O ponto de partida</p></div></div>
          <p class="quote">“${esc(d.texto)}”</p>
          <ul class="ctx-list">
            <li>${icon('calc', 18)}${esc(d.ctx.disciplina)}</li><li>${icon('users', 18)}${esc(d.ctx.turma)}</li><li>${icon('clock', 18)}${d.ctx.minutos} minutos</li>${d.ctx.objetivo ? `<li>${icon('target', 18)}${esc(d.ctx.objetivo)}</li>` : ''}
          </ul>
          <a class="btn sm" href="#/criar/ideia">${icon('pencil', 16)}Editar pedido</a>
        </aside>
      </div>`;
    const paint = () => {
      let ok = true;
      $$('.q', v).forEach((f) => {
        const sel = refine[f.dataset.q];
        $$('.chip', f).forEach((c) => { const on = sel.includes(c.dataset.o); c.setAttribute('aria-pressed', on); c.querySelector('.mark').innerHTML = icon(on ? 'check' : 'plus', 16); });
        $('.sel', f).innerHTML = sel.length ? `Selecionado: ${esc(Aula.juntar(sel))}` : `<span class="hint-err">${icon('x', 14)}Nenhuma opção selecionada</span>`;
        if (!sel.length) ok = false;
      });
      $('#construir').disabled = !ok;
      $('#refErr').classList.toggle('hidden', ok);
      setDraft({ ...getDraft(), step: 'refinar', refine });
    };
    $('.q-card', v).addEventListener('click', (e) => {
      const c = e.target.closest('.q .chip'); if (!c) return;
      const id = c.closest('.q').dataset.q, o = c.dataset.o;
      refine[id] = refine[id].includes(o) ? refine[id].filter((x) => x !== o) : [...refine[id], o];
      paint();
    });
    $('#construir').onclick = () => { setDraft({ ...getDraft(), refine, propostas: null }); go('#/criar/processando'); };
    paint();
  }

  /* ---------- Tela 3: Processamento ---------- */
  function telaProcessando(v, d) {
    const etapas = ['Interpretando o contexto da turma', 'Selecionando metodologias adequadas', 'Estruturando atividades e materiais', 'Preparando critérios de avaliação'];
    const paint = (states) => {
      $('#procList').innerHTML = etapas.map((e, i) => {
        const s = states[i];
        return `<li class="${s}"><span class="st">${s === 'done' ? icon('check', 16) : ''}</span><span class="txt">${e}</span><span class="state">${s === 'done' ? 'Concluído' : s === 'doing' ? 'Processando…' : 'Aguardando'}</span></li>`;
      }).join('');
    };
    v.innerHTML = `${stepper(3)}<section class="process card pad" aria-live="polite" aria-busy="true">
      <div class="orb">${icon('sparkles', 34)}</div>
      <h1>A MetodologIA está organizando sua aula</h1>
      <p class="muted">Você poderá revisar, adaptar ou descartar qualquer sugestão antes de usar a aula.</p>
      <ol class="process-steps" id="procList"></ol></section>`;
    paint(['done', 'done', 'doing', 'wait']);
    timers.push(setTimeout(() => paint(['done', 'done', 'done', 'doing']), 750));
    timers.push(setTimeout(() => {
      const props = Aula.propostas(d.ctx, d.refine);
      setDraft({ ...getDraft(), step: 'propostas', propostas: props, sel: 0 });
      location.replace('#/criar/propostas');
    }, 1500));
  }

  /* ---------- Tela 4: Propostas ---------- */
  function telaPropostas(v, d) {
    const props = d.propostas;
    let sel = Math.min(d.sel || 0, props.length - 1);
    const grupo = Aula.GRUPO[d.ctx.topico] || d.ctx.objetivo || 'Matemática';
    v.innerHTML = `${stepper(3)}
      <div class="page-head with-illu"><div><p class="eyebrow">Ideias que conectam teoria e prática</p><h1>Três caminhos para sua aula de ${esc(grupo)}</h1><p class="sub">Compare as propostas e escolha a que melhor se adapta à sua turma.</p></div><span class="tag green" style="justify-self:start">${icon('sparkles', 16)}Feitas para sua turma</span></div>
      <div class="focus-bar"><span><span class="k">Seu foco:</span> <strong>${esc(Aula.juntar(d.refine.conteudo))}</strong></span><span class="sep"></span><span><span class="k">Recursos:</span> <strong>${esc(d.refine.recursos.join(' · '))}</strong></span><a class="btn link" href="#/criar/refinar">Ajustar ${icon('pencil', 16)}</a></div>
      <div class="props" id="props" role="radiogroup" aria-label="Propostas de aula"></div>
      <section class="card timeline-card" id="estrutura" aria-labelledby="tlTitle" tabindex="-1"></section>
      <div class="note">${icon('shield', 20)}<p><strong>Um ponto de partida, não uma receita.</strong> Adapte a proposta ao ritmo e aos conhecimentos da sua turma na próxima etapa.</p></div>
      <div class="actions"><a class="btn" href="#/criar/refinar">${icon('back')}Voltar para as opções</a><button class="btn primary" id="escolher">${icon('check')}Escolher esta proposta</button></div>`;
    const paint = () => {
      $('#props').innerHTML = props.map((p, i) => `
        <article class="card prop ${i === sel ? 'selected' : ''}" role="radio" aria-checked="${i === sel}" tabindex="${i === sel ? 0 : -1}" data-i="${i}">
          ${i === sel ? `<span class="badge-sel">${icon('check', 14)}Proposta selecionada</span>` : ''}
          <div class="prop-art ${p.cor}">${icon(p.icone, 42)}<span class="n">${String(i + 1).padStart(2, '0')}</span></div>
          <div class="prop-body"><p class="eyebrow">${esc(p.tema)}</p><h3>${esc(p.titulo)}</h3><p class="met">${esc(p.metodologiaLabel)}.</p>
            <dl class="kv"><dt>Foco de aprendizagem</dt><dd>${esc(p.foco)}</dd></dl>
            <dl class="kv"><dt>O desafio</dt><dd>${esc(p.desafio)}</dd></dl>
            <dl class="kv"><dt>Produto final</dt><dd>${esc(p.produto)}</dd></dl>
            <dl class="kv"><dt>Duração</dt><dd>${d.ctx.minutos} minutos</dd></dl></div>
          <div class="prop-foot"><button class="btn ${i === sel ? 'primary' : ''} block" data-ver="${i}">${icon('eye')}Ver plano da aula</button></div>
        </article>`).join('');
      const p = props[sel];
      $('#estrutura').innerHTML = `<div class="tl-head"><div><p class="eyebrow">Um olhar sobre o planejamento</p><h2 id="tlTitle">Estrutura sugerida da aula</h2></div><span class="tag">${icon('clock', 16)}${d.ctx.minutos} minutos</span></div>
        <div class="tl-chosen"><span class="ib tone-${p.cor}" style="height:40px;width:40px;border-radius:10px">${icon(p.icone, 20)}</span><div><strong>${esc(p.titulo)}</strong><p class="muted small">${esc(p.metodologiaLabel)}</p></div></div>
        <ol class="tl">${p.etapas.map((e, i) => `<li><span class="dot">${i + 1}</span><div class="when"><strong>${esc(e.nome)}</strong><span>${e.min} min</span></div><p class="what">${esc(e.desc)}</p></li>`).join('')}</ol>`;
      setDraft({ ...getDraft(), sel });
    };
    const select = (i, focusTl) => { sel = i; paint(); if (focusTl) { $('#estrutura').scrollIntoView({ behavior: 'smooth', block: 'start' }); $('#estrutura').focus({ preventScroll: true }); } };
    $('#props').addEventListener('click', (e) => {
      const ver = e.target.closest('[data-ver]'); if (ver) { select(+ver.dataset.ver, true); return; }
      const c = e.target.closest('.prop'); if (c) select(+c.dataset.i);
    });
    $('#props').addEventListener('keydown', (e) => {
      if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
      e.preventDefault(); select((sel + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : props.length - 1)) % props.length); $(`.prop[data-i="${sel}"]`).focus();
    });
    $('#escolher').onclick = () => {
      const p = props[sel]; const cur = getDraft();
      const same = cur.escolhida && cur.escolhida.id === p.id && cur.custom;
      setDraft({
        ...cur, step: 'materiais', escolhida: p,
        custom: same ? cur.custom : { objetivo: p.objetivo, minutos: d.ctx.minutos, metodologia: p.metodologia, desafio: '', rubrica: Aula.RUBRICA_PADRAO.map((r) => ({ ...r })), observacoes: '', etapas: p.etapas, edited: {} },
        selecionados: same ? cur.selecionados : Aula.MATERIAIS.map((m) => m.id)
      });
      go('#/criar/materiais');
    };
    paint();
  }

  /* ---------- Tela 5: Materiais ---------- */
  const aulaObj = (d) => ({ user, ctx: { ...d.ctx, minutos: d.custom.minutos }, refine: d.refine, proposta: d.escolhida, custom: d.custom });

  function telaMateriais(v, d) {
    const p = d.escolhida, c = d.custom;
    const metLabel = c.metodologia === p.metodologia ? p.metodologiaLabel : METODOLOGIAS[c.metodologia].nome;
    const acts = [
      ['objetivo', 'target', 'Editar objetivo da aula', c.edited.objetivo ? c.objetivo : 'O que a turma vai aprender'],
      ['duracao', 'clock', 'Ajustar duração', `${c.minutos} minutos`],
      ['metodologia', 'users', 'Trocar metodologia', metLabel],
      ['desafio', 'bulb', 'Personalizar desafio', c.desafio || 'Conecte o problema à sua realidade'],
      ['rubrica', 'grid', 'Editar rubrica', c.edited.rubrica ? `${c.rubrica.length} critérios` : 'Critérios de participação e aprendizagem'],
      ['observacoes', 'pencil', 'Adicionar observações para a turma', c.observacoes || 'Apoio e combinados para os grupos']
    ];
    v.innerHTML = `${stepper(4)}
      <div class="page-head"><p class="eyebrow">Seu olhar dá o toque final</p><h1>Personalize e prepare sua aula</h1><p class="sub">Revise os materiais antes de salvar ou apresentar à turma.</p></div>
      <div class="chosen-bar"><div class="who"><span class="ib tone-${p.cor}" style="height:44px;width:44px;border-radius:12px">${icon(p.icone, 22)}</span><div><p class="eyebrow" style="color:var(--muted)">Proposta escolhida</p><h2>${esc(p.titulo)}</h2></div></div>
        <div class="meta"><span class="tag">${icon('users', 16)}${esc(d.ctx.turma)}</span><span class="tag">${icon('clock', 16)}${c.minutos} minutos</span><a class="btn link" href="#/criar/propostas">${icon('pencil', 16)}Alterar proposta</a></div></div>
      <div class="split">
        <section class="card panel col-5" aria-labelledby="actTitle">
          <div class="panel-head"><span class="ib">${icon('pencil')}</span><div><h2 id="actTitle">Ações docentes</h2><p class="muted">A aula com a sua identidade.</p></div></div>
          ${acts.map(([id, ic, t, s]) => `<button class="act" data-act="${id}">${icon(ic, 22, 'lead-ico')}<span class="t"><strong>${t}${c.edited[id] ? '<span class="edited">Editado</span>' : ''}</strong><span>${esc(s)}</span></span>${icon('chevron', 18)}</button>`).join('')}
          <p class="panel-note">${icon('shield', 18)}Suas alterações são aplicadas às prévias de todos os materiais.</p>
        </section>
        <section class="card panel col-7" aria-labelledby="matTitle">
          <div class="panel-head"><span class="ib">${icon('file')}</span><div style="flex:1"><h2 id="matTitle">Materiais gerados</h2><p class="muted">Selecione o que você quer levar para a aula.</p></div><span class="tag" id="matCount"></span></div>
          <div class="sel-all"><label><input type="checkbox" class="check" id="selAll">Selecionar todos</label><span class="muted xs">Prévia dos materiais</span></div>
          ${Aula.MATERIAIS.map((m) => `<div class="mat"><input type="checkbox" class="check" id="m-${m.id}" data-m="${m.id}" ${d.selecionados.includes(m.id) ? 'checked' : ''}>
            <span class="mi ${m.tom}">${icon(m.icone, 20)}</span>
            <span class="t"><label for="m-${m.id}">${m.nome}</label><span class="d">${m.desc}</span><span class="ok">${icon('check', 14)}Pronto para revisar <span class="fmt">· ${m.fmt}</span></span></span>
            <button class="rev" data-rev="${m.id}" aria-label="Revisar ${m.nome}">${icon('eye', 20)}Revisar</button></div>`).join('')}
        </section>
      </div>
      <div class="final-bar">
        <div class="count">${icon('shield', 18)}<div><strong id="selTxt"></strong>Revise antes de compartilhar com a turma.</div></div>
        <div class="btns"><button class="btn" id="salvar">${icon('save')}${d.savedId ? 'Atualizar em Minhas aulas' : 'Salvar em Minhas aulas'}</button><button class="btn primary" id="baixar">${icon('download')}Baixar materiais selecionados</button></div>
        <div class="foot"><a class="btn link" href="#/criar/propostas">${icon('back')}Voltar e alterar proposta</a><span class="muted xs">Downloads simulados neste protótipo.</span></div>
      </div>`;
    const paintSel = () => {
      const cur = getDraft(); const n = cur.selecionados.length;
      $('#matCount').textContent = `${n} de ${Aula.MATERIAIS.length}`;
      $('#selTxt').textContent = n === 1 ? '1 material selecionado' : `${n} materiais selecionados`;
      $('#selAll').checked = n === Aula.MATERIAIS.length; $('#selAll').indeterminate = n > 0 && n < Aula.MATERIAIS.length;
      $('#baixar').disabled = n === 0;
    };
    $('.panel.col-7', v).addEventListener('change', (e) => {
      const cur = getDraft();
      if (e.target.id === 'selAll') { cur.selecionados = e.target.checked ? Aula.MATERIAIS.map((m) => m.id) : []; $$('[data-m]', v).forEach((x) => (x.checked = e.target.checked)); }
      else if (e.target.dataset.m) { const id = e.target.dataset.m; cur.selecionados = e.target.checked ? [...new Set([...cur.selecionados, id])] : cur.selecionados.filter((x) => x !== id); }
      setDraft(cur); paintSel();
    });
    $$('[data-rev]', v).forEach((b) => (b.onclick = () => openPreview(b.dataset.rev)));
    $$('[data-act]', v).forEach((b) => (b.onclick = () => openEditor(b.dataset.act, () => telaMateriais(v, getDraft()))));
    $('#baixar').onclick = () => toast('Materiais preparados para download. Revise o conteúdo antes de utilizar com a turma.', 'download');
    $('#salvar').onclick = () => {
      const cur = getDraft(); const aulas = getAulas();
      const item = { id: cur.savedId || uid('aula'), titulo: cur.escolhida.titulo, metodologia: cur.custom.metodologia === cur.escolhida.metodologia ? cur.escolhida.metodologiaLabel : METODOLOGIAS[cur.custom.metodologia].nome, turma: cur.ctx.turma, minutos: cur.custom.minutos, cor: cur.escolhida.cor, icone: cur.escolhida.icone, data: new Date().toISOString(), draft: { ...cur, step: 'materiais' } };
      item.draft.savedId = item.id;
      const i = aulas.findIndex((a) => a.id === item.id); if (i >= 0) aulas[i] = item; else aulas.unshift(item);
      if (setAulas(aulas)) { setDraft({ ...cur, savedId: item.id }); $('#salvar').innerHTML = `${icon('check')}Salvo em Minhas aulas`; toast(i >= 0 ? 'Aula atualizada em Minhas aulas.' : 'Aula salva em Minhas aulas.'); }
    };
    paintSel();
  }

  function openPreview(id) {
    const d = getDraft(); const m = Aula.MATERIAIS.find((x) => x.id === id);
    const html = Aula.gerarMaterial(id, aulaObj(d)) + `<div class="doc-footer"><span>Gerado com MetodologIA (IA simulada) · revise antes de usar</span><span>${fmtDate(Date.now())}</span></div>`;
    openModal(`${mHead(`${m.nome}`, `${esc(d.escolhida.titulo)} · ${m.fmt}`)}<div class="preview-body"><div class="doc">${html}</div></div>
      <div class="m-foot"><button class="btn sm" id="pPrint">${icon('printer', 18)}Imprimir / PDF</button><button class="btn sm" id="pDoc">${icon('download', 18)}Baixar este material</button><button class="btn sm primary" data-close>${icon('check', 18)}Revisado</button></div>`, 'full');
    const full = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(m.nome)}</title><style>body{margin:0;padding:16px}${DOC_CSS}</style></head><body><div class="doc">${html}</div></body></html>`;
    $('#pPrint').onclick = () => { const w = window.open('', '_blank'); if (!w) { toast('Permita pop-ups para imprimir.', 'x'); return; } w.document.write(full); w.document.close(); setTimeout(() => { w.focus(); w.print(); }, 400); };
    $('#pDoc').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + full], { type: 'application/msword' })); a.download = `${m.nome} - ${d.escolhida.titulo}.doc`.replace(/[\\/:*?"<>|]/g, ''); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); toast('Download iniciado.', 'download'); };
  }

  function openEditor(kind, done) {
    const d = getDraft(); const c = d.custom; const p = d.escolhida;
    const save = (patch, msg = 'Alteração aplicada às prévias dos materiais.') => { const cur = getDraft(); cur.custom = { ...cur.custom, ...patch, edited: { ...cur.custom.edited, [kind]: true } }; setDraft(cur); closeModal(); done(); toast(msg); };
    const foot = `<div class="m-foot"><button class="btn sm" data-close>Cancelar</button><button class="btn sm primary" id="edSave">${icon('check', 18)}Aplicar</button></div>`;
    const map = {
      objetivo: () => {
        openModal(`${mHead('Editar objetivo da aula', 'O que a turma vai aprender')}<div class="m-body"><label class="field">Objetivo<textarea id="edTxt" autofocus>${esc(c.objetivo)}</textarea></label><p class="muted small">Dica: comece com um verbo (calcular, comparar, justificar…).</p></div>${foot}`);
        $('#edSave').onclick = () => { const t = $('#edTxt').value.trim(); if (t.length < 10) { $('#edTxt').focus(); return; } save({ objetivo: t }); };
      },
      duracao: () => {
        openModal(`${mHead('Ajustar duração', 'As etapas são redistribuídas automaticamente')}<div class="m-body"><div class="seg-dur" role="radiogroup">${[50, 100, 150, 200].map((n) => `<button type="button" class="chip" style="justify-content:center" aria-pressed="${n === c.minutos}" data-min="${n}">${n} min</button>`).join('')}</div><p class="muted small">${[50, 100, 150, 200].map((n) => `${n} min = ${n / 50} aula(s) de 50 min`).join(' · ')}</p></div>${foot}`);
        let min = c.minutos; $$('[data-min]').forEach((b) => (b.onclick = () => { min = +b.dataset.min; $$('[data-min]').forEach((x) => x.setAttribute('aria-pressed', x === b)); }));
        $('#edSave').onclick = () => save({ minutos: min, etapas: Aula.reescalar(c.etapas, min) }, `Duração ajustada para ${min} minutos.`);
      },
      metodologia: () => {
        openModal(`${mHead('Trocar metodologia', 'A estrutura e os materiais são atualizados')}<div class="m-body"><div class="radio-list">${Object.entries(METODOLOGIAS).map(([key, m]) => `<label><input type="radio" name="met" value="${key}" ${key === c.metodologia ? 'checked' : ''}><span><strong>${m.icone} ${esc(m.nome)}</strong>${key === p.metodologia ? ' <span class="tag violet">sugerida</span>' : ''}<br><span class="muted small">${esc(m.resumo.split('.')[0])}.</span></span></label>`).join('')}</div></div>${foot}`);
        $('#edSave').onclick = () => {
          const key = $('input[name=met]:checked').value;
          const etapas = key === p.metodologia ? Aula.reescalar(p.etapas, c.minutos) : Aula.reescalar(METODOLOGIAS[key].fases.filter((f) => f.pct > 0).map((f) => ({ nome: f.nome, min: f.pct, desc: f.desc })), c.minutos);
          save({ metodologia: key, etapas }, `Metodologia alterada para ${METODOLOGIAS[key].nome}.`);
        };
      },
      desafio: () => {
        openModal(`${mHead('Personalizar desafio', 'Conecte o problema à sua realidade')}<div class="m-body"><p class="muted small">Desafio sugerido: ${esc(p.desafio)}</p><label class="field">Seu desafio<textarea id="edTxt" autofocus placeholder="Ex.: usar as embalagens vendidas na cantina da escola">${esc(c.desafio || p.desafio)}</textarea></label></div>${foot}`);
        $('#edSave').onclick = () => save({ desafio: $('#edTxt').value.trim() === p.desafio ? '' : $('#edTxt').value.trim() });
      },
      rubrica: () => {
        let rub = c.rubrica.map((r) => ({ ...r }));
        const paint = () => {
          $('#rubList').innerHTML = rub.map((r, i) => `<div class="rub-row"><label class="field">Critério ${i + 1}<input data-n="${i}" value="${esc(r.nome)}"></label><label class="field">Descrição<input data-dsc="${i}" value="${esc(r.desc)}"></label>${rub.length > 2 ? `<button type="button" class="btn sm danger" data-rm="${i}">${icon('trash', 16)}Remover</button>` : ''}</div>`).join('');
          $('#rubAdd').disabled = rub.length >= 6;
        };
        openModal(`${mHead('Editar rubrica', 'Critérios de participação e aprendizagem')}<div class="m-body"><div id="rubList" class="grid"></div><button type="button" class="btn sm" id="rubAdd">${icon('plus', 16)}Adicionar critério</button></div>${foot}`);
        paint();
        $('#rubList').addEventListener('input', (e) => { if (e.target.dataset.n) rub[e.target.dataset.n].nome = e.target.value; if (e.target.dataset.dsc) rub[e.target.dataset.dsc].desc = e.target.value; });
        $('#rubList').addEventListener('click', (e) => { const b = e.target.closest('[data-rm]'); if (b) { rub.splice(+b.dataset.rm, 1); paint(); } });
        $('#rubAdd').onclick = () => { rub.push({ nome: 'Novo critério', desc: 'Descreva o que será observado.' }); paint(); };
        $('#edSave').onclick = () => { rub = rub.filter((r) => r.nome.trim()); if (rub.length < 2) { toast('A rubrica precisa de pelo menos 2 critérios.', 'x'); return; } save({ rubrica: rub }); };
      },
      observacoes: () => {
        openModal(`${mHead('Observações para a turma', 'Aparecem na folha de instruções, no roteiro e no planejamento')}<div class="m-body"><label class="field">Observações<textarea id="edTxt" autofocus placeholder="Ex.: Tragam embalagens limpas de casa. Grupos de 4 já definidos no mural.">${esc(c.observacoes)}</textarea></label></div>${foot}`);
        $('#edSave').onclick = () => save({ observacoes: $('#edTxt').value.trim() });
      }
    };
    map[kind]();
  }

  /* =========================================================
     MINHAS AULAS
     ========================================================= */
  const lessonCard = (a) => `<article class="card lesson" data-aula="${a.id}"><div class="row"><span class="tag ${a.cor === 'yellow' ? 'yellow' : a.cor === 'violet' ? 'violet' : 'green'}">${icon(a.icone, 14)}${esc(a.metodologia)}</span></div><h3>${esc(a.titulo)}</h3><p class="muted small">${esc(a.turma)} · ${a.minutos} min · salva em ${fmtDate(a.data)}</p><div class="btns"><button class="btn sm primary" data-open="${a.id}">${icon('eye', 16)}Abrir materiais</button><button class="btn sm danger" data-del="${a.id}" aria-label="Excluir ${esc(a.titulo)}">${icon('trash', 16)}Excluir</button></div></article>`;
  function bindLessonCards(root, rerender) {
    $$('[data-open]', root).forEach((b) => (b.onclick = () => { const a = getAulas().find((x) => x.id === b.dataset.open); if (a) { setDraft(a.draft); go('#/criar/materiais'); } }));
    $$('[data-del]', root).forEach((b) => (b.onclick = () => { if (!confirm('Excluir esta aula de "Minhas aulas"?')) return; setAulas(getAulas().filter((x) => x.id !== b.dataset.del)); toast('Aula excluída.'); rerender(); }));
  }
  function viewAulas(v) {
    const aulas = getAulas();
    v.innerHTML = `<div class="page-head"><p class="eyebrow">Seu acervo</p><h1>Minhas aulas</h1><p class="sub">Aulas que você personalizou e salvou. Abra para revisar ou baixar os materiais.</p></div>
      <a class="btn primary" href="#/criar/ideia" id="nova" style="margin-bottom:16px">${icon('plus')}Criar nova aula</a>
      ${aulas.length ? `<div class="grid g3">${aulas.map(lessonCard).join('')}</div>` : `<div class="card empty"><div class="ib">${icon('book', 26)}</div><strong>Você ainda não salvou nenhuma aula</strong><p>Na última etapa da criação, toque em "Salvar em Minhas aulas".</p></div>`}`;
    $('#nova').onclick = (e) => { e.preventDefault(); store.del(k('draft')); go('#/criar/ideia'); };
    bindLessonCards(v, () => viewAulas(v));
  }

  /* =========================================================
     MODELOS (metodologias, BNCC e rede de professores)
     ========================================================= */
  let modTab = 'metodologias', bSerie = 0;
  function viewModelos(v, tab) {
    if (tab) modTab = tab;
    v.innerHTML = `<div class="page-head"><p class="eyebrow">Inspiração para planejar</p><h1>Modelos</h1><p class="sub">Comece a partir de uma metodologia, de um conhecimento da BNCC ou de materiais compartilhados por outros professores.</p></div>
      <div class="seg" role="tablist">${[['metodologias', 'Metodologias'], ['bncc', 'BNCC · Matemática EM'], ['rede', 'Rede de professores']].map(([key, l]) => `<button role="tab" aria-selected="${modTab === key}" class="${modTab === key ? 'active' : ''}" data-t="${key}">${l}</button>`).join('')}</div><div id="modBody"></div>`;
    $$('.seg button', v).forEach((b) => (b.onclick = () => { modTab = b.dataset.t; history.replaceState(null, '', '#/modelos/' + modTab); viewModelos(v); }));
    const body = $('#modBody');
    if (modTab === 'metodologias') {
      body.innerHTML = `<div class="grid g3">${Object.entries(METODOLOGIAS).map(([key, m]) => `<article class="card tpl"><span style="font-size:28px" aria-hidden="true">${m.icone}</span><h3>${esc(m.nome)}</h3><p class="muted small">${esc(m.resumo)}</p><div class="chips" style="margin-top:6px"><button class="btn sm primary" data-use="${key}">${icon('sparkles', 16)}Usar este modelo</button><button class="btn sm" data-info="${key}">Saiba mais</button></div></article>`).join('')}</div>`;
      $$('[data-use]', body).forEach((b) => (b.onclick = () => startWith(`Preciso de uma aula usando ${METODOLOGIAS[b.dataset.use].nome.toLowerCase()} sobre `)));
      $$('[data-info]', body).forEach((b) => (b.onclick = () => { const m = METODOLOGIAS[b.dataset.info]; openModal(`${mHead(`${m.icone} ${esc(m.nome)}`, esc(m.autores))}<div class="m-body"><p>${esc(m.fundamentos)}</p><h3 style="font-size:17px">Etapas</h3><ol style="margin:0;padding-left:20px">${m.fases.map((f) => `<li><strong>${esc(f.nome)}</strong> — ${esc(f.desc)}</li>`).join('')}</ol><h3 style="font-size:17px">Cuidados</h3><ul style="margin:0;padding-left:20px">${m.cuidados.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`); }));
    } else if (modTab === 'bncc') {
      const render = () => {
        const q = ($('#bq')?.value || '').toLowerCase();
        const list = Object.entries(TOPICOS).filter(([, t]) => (!bSerie || t.serie === bSerie) && (!q || [t.nome, ...t.hab, ...t.conceitos, ...t.kw].join(' ').toLowerCase().includes(q)));
        $('#bList').innerHTML = list.length ? list.map(([key, t]) => `<article class="card tpl"><div class="chips"><span class="tag petrol">${t.serie}º ano (sugestão)</span>${t.hab.slice(0, 3).map((h) => `<button class="tag code" style="border:0;cursor:pointer" data-hab="${h}">${h}</button>`).join('')}</div><h3>${esc(t.nome)}</h3><p class="muted small">${esc(cap(t.conceitos.join(' · ')))}</p><button class="btn sm primary" style="justify-self:start;margin-top:6px" data-topic="${key}">${icon('sparkles', 16)}Usar na minha aula</button></article>`).join('') : '<p class="muted">Nenhum conteúdo encontrado.</p>';
        $$('[data-topic]', body).forEach((b) => (b.onclick = () => { const t = TOPICOS[b.dataset.topic]; startWith(`Preciso de uma aula prática sobre ${t.nome.split(':')[0].toLowerCase()} para o ${t.serie}º ano do Ensino Médio, com duração de 100 minutos.`); }));
        $$('[data-hab]', body).forEach((b) => (b.onclick = () => openHab(b.dataset.hab)));
      };
      body.innerHTML = `<p class="muted small" style="margin-bottom:12px">Matemática e suas Tecnologias (BNCC, 2018). A BNCC não divide o Ensino Médio por ano: a distribuição é uma sugestão. Confira o texto oficial em basenacionalcomum.mec.gov.br.</p>
        <div class="filters"><input id="bq" placeholder="Buscar conteúdo ou código EM13MAT…" aria-label="Buscar na BNCC"><div class="chips" id="bSeries">${['Todos', '1º ano', '2º ano', '3º ano'].map((l, i) => `<button class="chip" aria-pressed="${i === bSerie}" data-s="${i}">${l}</button>`).join('')}</div></div>
        <div class="grid g3" id="bList"></div>
        <div class="section-title"><h2>Competências específicas e habilidades</h2></div>
        ${[1, 2, 3, 4, 5].map((c) => `<details class="comp"><summary><span class="comp-n">${c}</span><span><strong>Competência específica ${c}</strong><br><span class="muted small">${esc(BNCC_COMP_TITULO[c])}</span></span></summary><div class="body"><p class="muted small" style="margin-bottom:8px">${esc(BNCC_COMPETENCIAS[c])}</p>${Object.entries(BNCC_HABILIDADES).filter(([code]) => competenciaDe(code) === c).map(([code, txt]) => `<div class="hab"><span class="tag code" style="justify-self:start">${code}</span><p>${esc(txt)}</p><button class="btn sm soft" style="justify-self:start" data-habuse="${code}">${icon('sparkles', 16)}Criar aula com ${code}</button></div>`).join('')}</div></details>`).join('')}`;
      $('#bq').oninput = render;
      $('#bSeries').onclick = (e) => { const b = e.target.closest('.chip'); if (!b) return; bSerie = +b.dataset.s; $$('#bSeries .chip').forEach((x) => x.setAttribute('aria-pressed', x === b)); render(); };
      $$('[data-habuse]', body).forEach((b) => (b.onclick = () => habStart(b.dataset.habuse)));
      render();
    } else {
      body.innerHTML = `<div class="filters"><input id="fq" placeholder="Buscar título, conteúdo ou autor…" aria-label="Buscar materiais"><select id="fm" aria-label="Metodologia">${options(METODOLOGIAS, '', 'Todas as metodologias')}</select><select id="fs" aria-label="Ano">${options(SERIES, '', 'Todos os anos')}</select></div>
        <div class="chips" style="justify-content:space-between;margin-bottom:12px;align-items:center"><span class="muted small" id="fc"></span><a class="btn sm primary" href="#/enviar">${icon('upload', 16)}Enviar material</a></div><div class="grid g3" id="mList"></div>`;
      const render = () => {
        const q = $('#fq').value.toLowerCase(), fm = $('#fm').value, fs = $('#fs').value;
        const list = getMats().filter((m) => (!fm || m.metodologia === fm) && (!fs || String(m.serie) === fs) && (!q || [m.titulo, m.descricao, m.autor, TOPICOS[m.topico]?.nome || '', ...(m.tags || [])].join(' ').toLowerCase().includes(q))).sort((a, b) => (b.data > a.data ? 1 : -1));
        $('#fc').textContent = `${list.length} material(is)`;
        const likes = getLikes();
        $('#mList').innerHTML = list.map((m) => `<article class="card mat-card" data-mat="${m.id}" tabindex="0"><div class="chips"><span class="tag violet">${METODOLOGIAS[m.metodologia]?.icone || ''} ${esc(METODOLOGIAS[m.metodologia]?.nome || 'Material')}</span>${m.serie ? `<span class="tag petrol">${m.serie}º ano</span>` : ''}</div><h3>${esc(m.titulo)}</h3><p>${esc(m.descricao)}</p><div class="mat-foot"><span>${esc(m.autor)}${m.fileName ? ' · anexo' : ''}</span><button class="like" data-like="${m.id}" aria-pressed="${likes.includes(m.id)}" aria-label="Curtir">${icon('heart', 16)}${m.curtidas || 0}</button></div></article>`).join('') || '<p class="muted">Nenhum material encontrado.</p>';
      };
      ['#fq', '#fm', '#fs'].forEach((s) => ($(s).oninput = render));
      $('#mList').addEventListener('click', (e) => {
        const lk = e.target.closest('[data-like]');
        if (lk) { e.stopPropagation(); const likes = getLikes(), mats = getMats(), m = mats.find((x) => x.id === lk.dataset.like), on = likes.includes(m.id); m.curtidas = Math.max(0, (m.curtidas || 0) + (on ? -1 : 1)); store.set(k('likes'), on ? likes.filter((x) => x !== m.id) : [...likes, m.id]); setMats(mats); render(); return; }
        const c = e.target.closest('.mat-card'); if (c) openMaterial(c.dataset.mat, render);
      });
      render();
    }
  }
  function habStart(code) { const t = habTopicos(code)[0]; startWith(t ? `Preciso de uma aula prática sobre ${TOPICOS[t].nome.split(':')[0].toLowerCase()} para o ${TOPICOS[t].serie}º ano do Ensino Médio, com duração de 100 minutos, trabalhando a habilidade ${code}.` : `Preciso de uma aula para trabalhar a habilidade ${code}, com duração de 100 minutos.`); }
  function openHab(code) {
    const c = competenciaDe(code);
    openModal(`${mHead(code, `Competência específica ${c}`)}<div class="m-body"><p>${esc(BNCC_HABILIDADES[code])}</p><p class="muted small">${esc(BNCC_COMPETENCIAS[c])}</p><button class="btn primary block" id="hGo">${icon('sparkles')}Criar aula com ${code}</button></div>`);
    $('#hGo').onclick = () => habStart(code);
  }
  function openMaterial(id, rerender) {
    const m = getMats().find((x) => x.id === id); if (!m) return;
    const t = TOPICOS[m.topico];
    openModal(`${mHead(esc(m.titulo), `${esc(m.autor)}${m.escola ? ' · ' + esc(m.escola) : ''} · ${fmtDate(m.data)}`)}<div class="m-body">
      <div class="chips"><span class="tag violet">${esc(METODOLOGIAS[m.metodologia]?.nome || '')}</span>${m.serie ? `<span class="tag petrol">${m.serie}º ano</span>` : ''}${t ? t.hab.map((h) => `<span class="tag code">${h}</span>`).join('') : ''}</div>
      <p style="white-space:pre-line">${esc(m.descricao)}</p>
      ${m.fileName ? `<div class="card pad" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">${icon('file')}<span style="flex:1;overflow-wrap:anywhere">${esc(m.fileName)} <span class="muted">(${fmtSize(m.fileSize || 0)})</span></span>${m.fileData ? '<button class="btn sm" id="dl">Baixar</button>' : '<span class="muted small">não armazenado no protótipo</span>'}</div>` : ''}
      <button class="btn primary block" id="inspire">${icon('sparkles')}Usar como ponto de partida</button>
      ${m.autorId === user.id ? `<button class="btn danger block" id="delM">${icon('trash')}Excluir material</button>` : ''}</div>`);
    $('#dl')?.addEventListener('click', () => { const a = document.createElement('a'); a.href = m.fileData; a.download = m.fileName; a.click(); });
    $('#inspire').onclick = () => startWith(`Preciso de uma aula ${t ? `sobre ${t.nome.split(':')[0].toLowerCase()} ` : ''}inspirada em "${m.titulo}"${m.serie ? ` para o ${m.serie}º ano do Ensino Médio` : ''}, com duração de 100 minutos.`);
    $('#delM')?.addEventListener('click', () => { if (!confirm('Excluir este material da rede?')) return; setMats(getMats().filter((x) => x.id !== m.id)); closeModal(); rerender(); toast('Material excluído.'); });
  }

  /* =========================================================
     ENVIAR MATERIAL
     ========================================================= */
  function viewEnviar(v) {
    let file = null;
    v.innerHTML = `<div class="page-head"><p class="eyebrow">Rede de professores</p><h1>Enviar material</h1><p class="sub">Compartilhe exemplos de atividades, guias de metodologia e relatos de prática. Eles alimentam a rede e inspiram outros professores.</p></div>
      <form class="card pad form" id="mf" style="max-width:760px" novalidate>
        <label>Título<input name="titulo" required placeholder="Ex.: Escape room de logaritmos"></label>
        <label>Metodologia<select name="metodologia" required>${options(METODOLOGIAS, '', 'Selecione…')}</select></label>
        <label>Conteúdo (BNCC)<select name="topico">${topicOptions('', 'Outro / vários conteúdos')}</select></label>
        <div class="grid g2"><label>Ano<select name="serie">${options(SERIES, 1)}</select></label><label>Tipo<select name="tipo">${['Atividade', 'Plano de aula', 'Sequência didática', 'Projeto', 'Guia de metodologia', 'Relato de experiência'].map((t) => `<option>${t}</option>`).join('')}</select></label></div>
        <label>Descrição<textarea name="descricao" required placeholder="Como funciona, para quem é indicada, resultados e dicas"></textarea></label>
        <label>Tags<input name="tags" placeholder="Separadas por vírgula"></label>
        <div class="field">Arquivo (opcional)<div class="dropzone" id="drop" tabindex="0" role="button">${icon('upload', 26)}<br><strong style="color:var(--violet-600)">Escolha um arquivo</strong> ou arraste aqui<br><span class="small">Até 1,5 MB fica disponível para download no protótipo</span></div><input type="file" id="fi" hidden><span id="fInfo" class="small"></span></div>
        <p class="hint-err hidden" id="mErr">${icon('x', 16)}Preencha título, metodologia e descrição.</p>
        <div class="actions"><a class="btn" href="#/modelos/rede">${icon('back')}Voltar para a rede</a><button class="btn primary" type="submit">${icon('upload')}Publicar na rede</button></div>
      </form>`;
    const setFile = (f) => { file = f; $('#fInfo').textContent = f ? `Arquivo: ${f.name} (${fmtSize(f.size)})` : ''; };
    $('#drop').onclick = () => $('#fi').click();
    $('#drop').onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('#fi').click(); } };
    $('#fi').onchange = () => setFile($('#fi').files[0] || null);
    $('#drop').ondragover = (e) => { e.preventDefault(); $('#drop').classList.add('drag'); };
    $('#drop').ondragleave = () => $('#drop').classList.remove('drag');
    $('#drop').ondrop = (e) => { e.preventDefault(); $('#drop').classList.remove('drag'); setFile(e.dataTransfer.files[0]); };
    $('#mf').onsubmit = async (e) => {
      e.preventDefault(); const f = new FormData(e.target);
      if (!f.get('titulo').trim() || !f.get('metodologia') || !f.get('descricao').trim()) { $('#mErr').classList.remove('hidden'); return; }
      const m = { id: uid('mat'), autorId: user.id, autor: user.nome, escola: user.escola?.nome || '', titulo: f.get('titulo').trim(), metodologia: f.get('metodologia'), topico: f.get('topico'), serie: +f.get('serie'), tipo: f.get('tipo'), area: 'matematica', nivel: 'medio', descricao: f.get('descricao').trim(), tags: f.get('tags').split(',').map((x) => x.trim()).filter(Boolean), curtidas: 0, data: new Date().toISOString().slice(0, 10) };
      if (file) { m.fileName = file.name; m.fileSize = file.size; m.fileType = file.type; if (file.size <= MAX_FILE) m.fileData = await readFile(file); }
      if (setMats([m, ...getMats()])) { toast('Material publicado na rede de professores.'); go('#/modelos/rede'); }
    };
  }

  /* =========================================================
     AJUDA
     ========================================================= */
  function viewAjuda(v) {
    const faq = [
      ['Como funciona a criação de uma aula?', 'Você descreve sua ideia, responde a três perguntas rápidas, compara três propostas e escolhe uma. Depois personaliza objetivo, duração, metodologia, desafio, rubrica e observações, e seleciona os materiais.'],
      ['A inteligência artificial é real?', 'Neste protótipo, a IA é simulada: as propostas são montadas a partir de modelos pedagógicos e de uma base de conteúdos da BNCC. Nenhum dado é enviado para servidores.'],
      ['Posso alterar o que a IA sugeriu?', 'Sim. Tudo é um ponto de partida. Use as "Ações docentes" para editar e revise cada material antes de usar. Você tem a palavra final. Sempre.'],
      ['As habilidades da BNCC estão corretas?', 'Os textos foram incluídos para apoiar o planejamento, mas confira sempre o documento oficial em basenacionalcomum.mec.gov.br. A divisão por ano é uma sugestão.'],
      ['Os downloads funcionam?', 'O botão "Baixar materiais selecionados" é simulado. Em "Revisar", você pode imprimir/salvar em PDF ou baixar cada material em .doc.'],
      ['Onde ficam meus dados?', 'Somente neste navegador (armazenamento local). Use "Restaurar demonstração" no menu do seu avatar para voltar ao estado inicial.']
    ];
    v.innerHTML = `<div class="page-head"><p class="eyebrow">Estamos com você</p><h1>Central de ajuda</h1><p class="sub">Respostas rápidas sobre como usar a MetodologIA.</p></div>
      <div class="faq" style="max-width:820px">${faq.map(([q, a], i) => `<details ${i === 0 ? 'open' : ''}><summary>${q}${icon('chevron', 18)}</summary><p>${a}</p></details>`).join('')}</div>
      <a class="btn primary" href="#/criar" style="margin-top:8px">${icon('sparkles')}Criar uma aula agora</a>`;
  }

  /* =========================================================
     PERFIL E ESCOLA
     ========================================================= */
  function viewPerfil(v) {
    const e = user.escola || {}; let foto = user.foto, logo = e.logo;
    v.innerHTML = `<div class="page-head"><p class="eyebrow">Sua conta</p><h1>Perfil e escola</h1><p class="sub">A logo da escola aparece no cabeçalho dos materiais dos estudantes.</p></div>
      <form id="pf" class="grid g2" style="align-items:start" novalidate>
        <section class="card pad form"><h2 style="font-size:20px">Meus dados</h2>
          <div class="img-upload"><div class="preview round" id="fp">${foto ? `<img src="${foto}" alt="">` : esc(initials(user.nome))}</div><div class="chips"><button type="button" class="btn sm" id="fb">${icon('upload', 16)}Enviar foto</button><button type="button" class="btn sm danger" id="fr">Remover</button></div><input type="file" accept="image/*" id="fi" hidden></div>
          <label>Nome<input name="nome" value="${esc(user.nome)}" required></label>
          <label>E-mail<input type="email" name="email" value="${esc(user.email)}" required></label>
          <label>Disciplinas<input name="disciplinas" value="${esc(user.disciplinas || '')}"></label>
          <label>Formação<input name="formacao" value="${esc(user.formacao || '')}"></label>
          <label>Sobre mim<textarea name="bio">${esc(user.bio || '')}</textarea></label>
          <label>Nova senha<input type="password" name="senha" placeholder="Deixe em branco para manter" autocomplete="new-password"></label></section>
        <section class="card pad form"><h2 style="font-size:20px">Minha escola</h2>
          <div class="img-upload"><div class="preview" id="lp">${logo ? `<img src="${logo}" alt="">` : icon('home', 28)}</div><div class="chips"><button type="button" class="btn sm" id="lb">${icon('upload', 16)}Enviar logo</button><button type="button" class="btn sm danger" id="lr">Remover</button></div><input type="file" accept="image/*" id="li" hidden></div>
          <label>Nome da escola<input name="en" value="${esc(e.nome || '')}"></label>
          <div class="grid" style="grid-template-columns:1fr 96px"><label>Cidade<input name="ec" value="${esc(e.cidade || '')}"></label><label>UF<input name="eu" maxlength="2" value="${esc(e.uf || '')}"></label></div>
          <label>Rede<select name="er">${['', 'Pública estadual', 'Pública municipal', 'Pública federal', 'Privada', 'Comunitária'].map((r) => `<option ${r === e.rede ? 'selected' : ''} value="${r}">${r || 'Selecione…'}</option>`).join('')}</select></label>
          <label>Segmentos<input name="es" value="${esc(e.segmentos || '')}"></label>
          <button class="btn primary block" type="submit">${icon('save')}Salvar alterações</button></section>
      </form>`;
    const bind = (btn, inp, rm, prev, set, ph) => { $(btn).onclick = () => $(inp).click(); $(inp).onchange = async () => { const f = $(inp).files[0]; if (!f) return; const d = await resizeImage(f); if (!d) { toast('Imagem inválida.', 'x'); return; } set(d); $(prev).innerHTML = `<img src="${d}" alt="">`; }; $(rm).onclick = () => { set(null); $(prev).innerHTML = ph; }; };
    bind('#fb', '#fi', '#fr', '#fp', (d) => (foto = d), esc(initials(user.nome)));
    bind('#lb', '#li', '#lr', '#lp', (d) => (logo = d), icon('home', 28));
    $('#pf').onsubmit = (ev) => {
      ev.preventDefault(); const f = new FormData(ev.target); const email = f.get('email').trim();
      if (!f.get('nome').trim() || !email) { toast('Nome e e-mail são obrigatórios.', 'x'); return; }
      if (users().some((u) => u.id !== user.id && u.email.toLowerCase() === email.toLowerCase())) { toast('Este e-mail já está em uso.', 'x'); return; }
      const u = { ...user, nome: f.get('nome').trim(), email, disciplinas: f.get('disciplinas').trim(), formacao: f.get('formacao').trim(), bio: f.get('bio').trim(), foto, escola: { nome: f.get('en').trim(), cidade: f.get('ec').trim(), uf: f.get('eu').trim().toUpperCase(), rede: f.get('er'), segmentos: f.get('es').trim(), logo } };
      if (f.get('senha')) { if (f.get('senha').length < 6) { toast('A senha precisa de 6+ caracteres.', 'x'); return; } u.senha = hashPw(f.get('senha')); }
      if (saveUser(u)) { refreshChrome(); toast('Perfil atualizado.'); }
    };
  }

  boot();
})();
