# MetodologIA — Protótipo (Matemática · Ensino Médio)

Plataforma web **mobile-first**, funcional e simulada, para professores de **Matemática do Ensino Médio** planejarem aulas com metodologias ativas alinhadas à **BNCC**.

## Como executar

Abra `index.html` no navegador (celular ou computador) ou sirva a pasta:

```bash
python3 -m http.server 8080   # acesse http://localhost:8080 (no celular: http://IP-do-computador:8080)
```

Usuária de demonstração: **Marina** — `marina@metodologia.app` / `123456` (ou botão "Entrar como Marina").

## Funcionalidades

**Login genérico** para qualquer docente. Ao tocar no cartão "Acesso de demonstração", e-mail e senha são preenchidos automaticamente.

**Criar aula: fluxo em 5 telas** (com base nas telas do Figma):
1. **Sua ideia**: campo livre com detecção automática de disciplina, turma, duração e objetivo; sugestões rápidas; caixa de sugestões ao digitar.
2. **Refinamento**: três perguntas com seleção múltipla (conteúdo, recursos, produto final) e o pedido da professora ao lado.
3. **Processamento**: quatro etapas animadas; avança sozinho em ~1,5 s.
4. **Propostas**: três caminhos comparáveis, com a estrutura sugerida da aula (linha do tempo com minutos).
5. **Seus materiais**: ações docentes (objetivo, duração, metodologia, desafio, rubrica, observações) e sete materiais com prévia. Em "Revisar" é possível imprimir/salvar em PDF ou baixar em .doc. "Baixar materiais selecionados" é simulado e mostra um aviso.

Também há **Minhas aulas** (aulas salvas), **Modelos** (metodologias, BNCC do EM e rede de professores com envio de materiais), **Central de ajuda** e **Perfil e escola** (foto e logo).

Navegação: barra lateral no computador, barra inferior no celular, botão "voltar" do navegador entre as etapas.

## O que é simulado

| Recurso | No protótipo | Em produção |
| --- | --- | --- |
| IA | Motor de regras (`js/ai.js`) + modelos pedagógicos e banco de conteúdos | LLM (ex.: API do Claude) com RAG sobre a BNCC e os materiais da rede |
| Banco de dados | `localStorage` do navegador | Banco real (ex.: PostgreSQL) |
| Autenticação | Local, hash simples | Backend com autenticação segura |
| Arquivos | Até 1,5 MB no navegador | Armazenamento de objetos |

Os textos da BNCC estão em `js/bncc.js`. Confira sempre o documento oficial (basenacionalcomum.mec.gov.br). A divisão por série é uma sugestão, porque a BNCC não divide o Ensino Médio por série.

## Estrutura

```text
index.html            Telas e estrutura (mobile-first)
manifest.webmanifest  Instalação na tela inicial
css/style.css         Estilos: base celular → tablet (700px) → desktop (1024px)
js/data.js            Metodologias ativas e competências gerais
js/bncc.js            BNCC Matemática EM: competências, habilidades, conteúdos, materiais da rede
js/ai.js              Interpretação do pedido e sugestões ao digitar
js/aula.js            Ícones, propostas, perguntas de refinamento e os 7 materiais
js/app.js             Aplicação: login, rotas, fluxo de criação, modelos, aulas, perfil
```
