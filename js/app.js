/* Ponto — protótipo navegável (HTML/CSS/JS puros, sem build) */
(function () {
  'use strict';

  // ---------- Dados ----------
  var METODOS = [
    { id: 'pano', nome: 'Coador de pano', curto: 'no coador de pano', nota: 'No pano, escalde o coador com água quente antes de colocar o pó.' },
    { id: 'papel', nome: 'Filtro de papel', curto: 'no filtro de papel', nota: 'Molhe o filtro de papel antes para tirar o gosto de papel.' },
    { id: 'italiana', nome: 'Italiana', curto: 'na italiana', nota: 'Na italiana, use fogo baixo e tire do fogo assim que começar a borbulhar.' },
    { id: 'prensa', nome: 'Prensa francesa', curto: 'na prensa francesa', nota: 'Na prensa, espere 4 minutos e desça o êmbolo devagar.' },
    { id: 'eletrica', nome: 'Cafeteira elétrica', curto: 'na cafeteira elétrica', nota: 'Na elétrica, não deixe a jarra muito tempo na chapa quente.' }
  ];

  var SINTOMAS = [
    {
      id: 'amargo', nome: 'Amargo', dica: 'pesado, queimado', adj: 'amargo',
      titulo: 'O café passou<br>do ponto.',
      texto: 'A água tirou mais do pó do que devia. Dá para corrigir com o que você já tem.',
      receita: ['15 g', '250', '92°', '3 min'], rotTemp: '+30 s',
      dicas: [
        { t: 'Água um pouco menos quente', d: 'Desligue quando ferver e espere 30 segundos.', p: 'Termômetro culinário digital' },
        { t: 'Moagem mais grossa', d: 'Abra um ou dois cliques no moedor. Pó de mercado: use um pouco menos.', p: 'Moedor manual com regulagem' },
        { t: 'Menos tempo de contato', d: 'Despeje em três etapas, sem deixar o pó encharcado.', p: 'Balança com timer para café' }
      ]
    },
    {
      id: 'azedo', nome: 'Azedo', dica: 'cortante, verde', adj: 'azedo',
      titulo: 'Faltou chegar<br>no ponto.',
      texto: 'A água não teve tempo ou calor suficiente para tirar a doçura do pó.',
      receita: ['15 g', '250', '96°', '4 min'], rotTemp: 'logo após ferver',
      dicas: [
        { t: 'Água mais quente', d: 'Use a água logo depois de ferver, sem esperar.', p: 'Chaleira com bico de ganso' },
        { t: 'Moagem mais fina', d: 'Feche um ou dois cliques no moedor.', p: 'Moedor manual com regulagem' },
        { t: 'Despeje mais devagar', d: 'Molhe o pó, espere 30 segundos e siga em fio fino.', p: 'Balança com timer para café' }
      ]
    },
    {
      id: 'aguado', nome: 'Aguado', dica: 'fraco, sem graça', adj: 'aguado',
      titulo: 'Faltou café<br>na xícara.',
      texto: 'A proporção ficou com água demais para o pó que você usou.',
      receita: ['18 g', '250', '94°', '3,5 min'], rotTemp: 'ferveu +15 s',
      dicas: [
        { t: 'Mais pó na mesma água', d: 'Comece com uma colher de sopa a mais.', p: 'Balança com timer para café' },
        { t: 'Moagem um pouco mais fina', d: 'Pó mais fino libera sabor mais rápido.', p: 'Moedor manual com regulagem' },
        { t: 'Guarde o pó bem fechado', d: 'Café aberto perde aroma em poucos dias.', p: 'Pote hermético com válvula' }
      ]
    },
    {
      id: 'seco', nome: 'Seca a boca', dica: 'adstringente', adj: 'adstringente',
      titulo: 'A água passou<br>de forma desigual.',
      texto: 'Parte do pó extraiu demais e parte de menos. Isso deixa a boca seca.',
      receita: ['15 g', '250', '93°', '3 min'], rotTemp: 'ferveu +20 s',
      dicas: [
        { t: 'Molhe todo o pó primeiro', d: 'Um pouco de água em círculos, espere 30 segundos e continue.', p: 'Chaleira com bico de ganso' },
        { t: 'Moagem mais uniforme', d: 'Moedor de lâmina deixa pedaços desiguais; prefira mó.', p: 'Moedor manual com regulagem' },
        { t: 'Não esprema o coador', d: 'Deixe escorrer sozinho até o fim.', p: 'Coador de pano novo' }
      ]
    },
    {
      id: 'forte', nome: 'Forte demais', dica: 'denso, pesado', adj: 'forte demais',
      titulo: 'Concentrado<br>demais.',
      texto: 'Pouca água para muito pó. Fácil de acertar na próxima.',
      receita: ['13 g', '250', '93°', '3 min'], rotTemp: 'ferveu +20 s',
      dicas: [
        { t: 'Menos pó', d: 'Tire uma colher de sopa e compare.', p: 'Balança com timer para café' },
        { t: 'Complete com água quente', d: 'Se já passou, dilua na xícara aos poucos.', p: 'Jarra graduada' },
        { t: 'Experimente uma torra média', d: 'Torras escuras pesam mais na boca.', p: 'Café especial torra média' }
      ]
    },
    {
      id: 'bom', nome: 'Ficou ótimo', dica: 'equilibrado', adj: 'no ponto',
      titulo: 'No ponto.',
      texto: 'Guarde essa receita. Ela é o seu ponto de partida para explorar.',
      receita: ['15 g', '250', '93°', '3 min'], rotTemp: 'ferveu +20 s',
      dicas: [
        { t: 'Repita a receita', d: 'Faça igual amanhã para confirmar.', p: 'Balança com timer para café' },
        { t: 'Troque só o café', d: 'Mesmo método, outro grão: compare as diferenças.', p: 'Café especial natural do Sul de Minas' },
        { t: 'Teste outro método', d: 'O mesmo café na prensa ou na italiana muda tudo.', p: 'Prensa francesa 350 ml' }
      ]
    }
  ];

  // ---------- Estado ----------
  var CHAVE = 'ponto:estado';
  var CAFE_EXEMPLO = { nome: 'Sítio Boa Vista', torrefacao: null, produtor: null, regiao: 'Cerrado Mineiro', variedade: 'Catuaí Amarelo', processo: null, torra: 'média', pontuacao_sca: null, notas: [], origem: 'exemplo' };
  var CAFE_VAZIO = { nome: null, torrefacao: null, produtor: null, regiao: null, variedade: null, processo: null, torra: null, pontuacao_sca: null, notas: [] };
  var PROCESSOS = ['natural', 'lavado', 'cereja descascado', 'honey', 'fermentado'];
  var TORRAS = ['clara', 'média', 'média-escura', 'escura'];

  var padrao = { metodo: 'pano', sintoma: 'amargo', nota: 3, dica: 0, salvo: { metodo: 'pano', sintoma: 'amargo' }, xicaras: 7, cafe: CAFE_EXEMPLO, retorno: null };
  var estado = carregar();
  // Só em memória (não vai para o armazenamento do navegador)
  var sessao = { lendo: false, foto: null, rascunho: null };

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function copia(o) { return JSON.parse(JSON.stringify(o)); }

  function carregar() {
    try {
      var bruto = window.localStorage.getItem(CHAVE);
      if (bruto) { return Object.assign({}, padrao, JSON.parse(bruto)); }
    } catch (e) { /* armazenamento indisponível: segue com o padrão */ }
    return Object.assign({}, padrao);
  }
  function guardar() {
    try { window.localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) { /* ignora */ }
  }
  function achar(lista, id) { for (var i = 0; i < lista.length; i++) { if (lista[i].id === id) return lista[i]; } return lista[0]; }

  // ---------- Ícones ----------
  var ic = {
    simbolo: function (t, traco) {
      return '<svg width="' + t + '" height="' + t + '" viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" rx="22" fill="#1A1714"/><rect x=".5" y=".5" width="99" height="99" rx="21.5" fill="none" stroke="#2E2924"/><circle cx="50" cy="50" r="26" fill="none" stroke="#EFE7DA" stroke-width="' + (traco || 2.4) + '"/><circle cx="50" cy="50" r="8" fill="#B8926A"/></svg>';
    },
    mini: '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="#EFE7DA" stroke-width="1.4"/><circle cx="12" cy="12" r="2.6" fill="#B8926A"/></svg>',
    voltar: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EFE7DA" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    camera: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EFE7DA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
    grao: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#B8926A" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><ellipse cx="12" cy="12" rx="7" ry="9.5" transform="rotate(30 12 12)"/><path d="M9 5.5c3 3 3 10 6 13"/></svg>',
    sacola: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B8926A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 7h12l-1 12H7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>',
    inicio: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11l8-6 8 6v8H4z"/></svg>',
    xicara: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16"/></svg>',
    paladar: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 12l4-3"/></svg>',
    comunidade: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="9" cy="9" r="3"/><circle cx="16" cy="10" r="2.5"/><path d="M3 19c1-3 3.5-4.5 6-4.5s5 1.5 6 4.5M14 15c2.5 0 4.5 1.2 5.5 4"/></svg>'
  };

  function logotipo(tam) {
    return '<span class="logotipo" style="font-size:' + tam + 'px">ponto<span class="ponto-final">.</span></span>';
  }

  function nav(atual) {
    var itens = [
      ['inicio', 'Início', ic.inicio],
      ['registrar', 'Registrar', ic.xicara],
      ['paladar', 'Paladar', ic.paladar],
      ['comunidade', 'Comunidade', ic.comunidade]
    ];
    return '<nav class="nav" aria-label="Navegação principal">' + itens.map(function (i) {
      return '<a href="#/' + i[0] + '"' + (atual === i[0] ? ' aria-current="page"' : '') + '>' + i[2] + i[1].toUpperCase() + '</a>';
    }).join('') + '</nav>';
  }

  function data() {
    var d = new Date();
    var dias = ['DOMINGO', 'SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO'];
    var meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    return dias[d.getDay()] + ' · ' + d.getDate() + ' ' + meses[d.getMonth()];
  }

  function linhaCafe(c) {
    return [c.variedade, c.torra ? 'torra ' + c.torra : null, c.processo, c.regiao].filter(Boolean).map(esc).join(' · ');
  }

  function cartaoCafe() {
    if (sessao.lendo) {
      return '<div class="cafe" aria-busy="true"><div class="pacote"><span class="girando" aria-hidden="true"></span></div>' +
        '<div style="display:flex;flex-direction:column;gap:3px;flex:1"><span class="rotulo bronze" style="font-size:10px">Lendo o rótulo</span>' +
        '<span class="serif" style="font-size:22px">Um instante…</span><span style="font-size:12px;color:var(--texto-3)">Identificando origem, torra e notas.</span></div></div>';
    }
    var c = estado.cafe || CAFE_EXEMPLO;
    var rotulos = { foto: 'Lido da foto', manual: 'Informado por você', exemplo: 'Exemplo · fotografe o seu' };
    var miniatura = sessao.foto && c.origem === 'foto' ? '<img src="' + sessao.foto + '" alt="">' : ic.grao;
    return '<div class="cafe"><div class="pacote">' + miniatura + '</div>' +
      '<div style="display:flex;flex-direction:column;gap:3px;flex:1;min-width:0"><span class="rotulo bronze" style="font-size:10px">' + (rotulos[c.origem] || rotulos.manual) + '</span>' +
      '<span class="serif" style="font-size:22px">' + esc(c.nome || c.torrefacao || 'Café sem nome') + '</span>' +
      '<span style="font-size:12px;color:var(--texto-3)">' + (linhaCafe(c) || 'Toque na câmera para ler o rótulo') + '</span></div>' +
      '<button type="button" class="btn-icone" data-acao="foto" aria-label="Fotografar o pacote">' + ic.camera + '</button></div>' +
      '<div class="acoes-cafe"><button type="button" class="link" data-acao="foto">Fotografar pacote</button><button type="button" class="link" data-acao="manual">Preencher à mão</button></div>';
  }

  function campo(id, rotulo, valor, dica) {
    return '<label class="campo-form" for="f-' + id + '"><span class="rotulo">' + rotulo + '</span>' +
      '<input id="f-' + id + '" name="' + id + '" value="' + esc(valor) + '" placeholder="' + esc(dica || '') + '" autocomplete="off"></label>';
  }
  function seletor(id, rotulo, valor, opcoes) {
    return '<label class="campo-form" for="f-' + id + '"><span class="rotulo">' + rotulo + '</span><select id="f-' + id + '" name="' + id + '">' +
      '<option value="">Não sei</option>' + opcoes.map(function (o) { return '<option' + (o === valor ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') +
      '</select></label>';
  }

  // ---------- Telas ----------
  var telas = {
    abertura: function () {
      return '<section class="tela abertura">' +
        '<div class="centro">' + ic.simbolo(132) +
        '<div style="display:flex;flex-direction:column;gap:10px;align-items:center">' + logotipo(76) +
        '<span class="serif" style="font-size:22px;font-style:italic;color:var(--texto-2)">Encontre o seu ponto.</span></div>' +
        '<p class="corpo" style="max-width:280px;color:var(--texto-3)">Registre o café de cada dia, entenda o que mudou e acerte a próxima xícara com o que você já tem em casa.</p></div>' +
        '<div class="acoes"><a class="btn" href="#/inicio">Começar</a><a class="btn contorno" href="#/inicio">Já tenho conta</a></div>' +
        '</section>';
    },

    inicio: function () {
      var s = achar(SINTOMAS, estado.salvo.sintoma);
      var m = achar(METODOS, estado.salvo.metodo);
      var primeira = s.dicas[0];
      var titulo = s.id === 'bom' ? 'Ontem, no ponto<br>' + m.curto + '.' : 'Ontem, ' + s.adj + '<br>' + m.curto + '.';
      return '<section class="tela"><div class="conteudo com-nav" style="gap:22px;padding-top:36px">' +
        '<div class="linha-topo" style="align-items:center"><span class="marca">' + ic.simbolo(30, 4) + logotipo(30) + '</span><span class="rotulo" style="font-size:11px">' + data() + '</span></div>' +
        '<div style="display:flex;flex-direction:column;gap:6px"><span class="rotulo bronze">Sua próxima xícara</span>' +
        '<h1 class="titulo">' + titulo + '</h1>' +
        '<p class="corpo">Hoje: ' + primeira.t.toLowerCase() + '. ' + primeira.d + '</p></div>' +
        '<div class="duplas"><div><span class="numero">' + s.receita[2] + '</span><span class="rotulo" style="font-size:11px">Temperatura</span></div>' +
        '<div><span class="numero">' + s.receita[0] + ' · ' + s.receita[1] + ' ml</span><span class="rotulo" style="font-size:11px">Proporção</span></div></div>' +
        '<a class="btn" href="#/registrar">Registrar o café de hoje</a>' +
        '<a class="cartao" href="#/paladar"><div class="linha-topo"><span class="serif" style="font-size:22px">Seu paladar</span><span class="rotulo">' + estado.xicaras + ' xícaras</span></div>' +
        '<p class="corpo">Encorpado e doce, com pouca acidez. Notas de chocolate e caramelo.</p></a>' +
        '<div class="cartao"><div class="linha-topo"><span class="rotulo bronze">Trilha · Semana 1</span><span class="rotulo">3 / 5</span></div>' +
        '<span class="serif" style="font-size:22px">A proporção certa</span>' +
        '<p class="corpo" style="font-size:13px">Desafio: o mesmo café com 12 g e com 18 g. Qual você prefere?</p>' +
        '<div class="barra"><span style="width:60%"></span></div></div>' +
        '</div>' + nav('inicio') + '</section>';
    },

    registrar: function () {
      var chipsM = METODOS.map(function (m) {
        return '<button type="button" class="chip" data-acao="metodo" data-id="' + m.id + '" aria-pressed="' + (estado.metodo === m.id) + '">' + m.nome + '</button>';
      }).join('');
      var chipsS = SINTOMAS.map(function (s) {
        return '<button type="button" class="sintoma" data-acao="sintoma" data-id="' + s.id + '" aria-pressed="' + (estado.sintoma === s.id) + '"><span class="serif">' + s.nome + '</span><small>' + s.dica + '</small></button>';
      }).join('');
      var pontos = [1, 2, 3, 4, 5].map(function (n) {
        var cheio = n <= estado.nota;
        return '<button type="button" data-acao="nota" data-id="' + n + '" aria-label="Nota ' + n + ' de 5" aria-pressed="' + (estado.nota === n) + '"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7" stroke="#B8926A" stroke-width="1.5" fill="' + (cheio ? '#B8926A' : 'none') + '"/></svg></button>';
      }).join('');
      return '<section class="tela"><div class="conteudo" style="gap:22px">' +
        '<div class="cabecalho"><a class="btn-icone" href="#/inicio" aria-label="Voltar">' + ic.voltar + '</a><span class="rotulo">Leva 15 segundos' + ic.mini + '</span></div>' +
        '<h1 class="titulo">Como foi<br>o café de hoje?</h1>' +
        cartaoCafe() +
        '<div class="campo"><span class="rotulo" id="r-metodo">Método</span><div class="chips" role="group" aria-labelledby="r-metodo">' + chipsM + '</div></div>' +
        '<div class="campo"><span class="rotulo" id="r-sintoma">Como ficou na boca</span><div class="grade-2" role="group" aria-labelledby="r-sintoma">' + chipsS + '</div></div>' +
        '<div class="linha-topo" style="align-items:center"><span class="rotulo" id="r-nota">Nota em pontos</span><div class="pontos" role="group" aria-labelledby="r-nota">' + pontos + '</div></div>' +
        '<a class="btn" href="#/ajuste" style="margin-top:auto">Ver como melhorar</a>' +
        '</div></section>';
    },

    ajuste: function () {
      var s = achar(SINTOMAS, estado.sintoma);
      var m = achar(METODOS, estado.metodo);
      var dicas = s.dicas.map(function (d, i) {
        var aberta = estado.dica === i;
        return '<div class="dica' + (aberta ? ' aberta' : '') + '">' +
          '<button type="button" data-acao="dica" data-id="' + i + '" aria-expanded="' + aberta + '"><span class="n">' + (i + 1) + '</span><span><strong>' + d.t + '</strong><span class="corpo">' + d.d + '</span></span></button>' +
          (aberta ? '<div class="produto"><div class="img">' + ic.sacola + '</div><div class="info"><span class="rotulo" style="font-size:10px;letter-spacing:1.5px">Parceiro</span><b>' + d.p + '</b><span class="preco">[PREÇO]</span></div><a href="#" data-acao="loja">Ver na loja</a></div>' : '') +
          '</div>';
      }).join('');
      var r = s.receita;
      return '<section class="tela"><div class="conteudo">' +
        '<div class="cabecalho"><a class="btn-icone" href="#/registrar" aria-label="Voltar">' + ic.voltar + '</a><span class="rotulo">' + s.nome + ' · ' + m.nome + ic.mini + '</span></div>' +
        '<div style="display:flex;flex-direction:column;gap:8px"><h1 class="titulo g">' + s.titulo + '</h1><p class="corpo">' + s.texto + '</p></div>' +
        '<div class="dicas">' + dicas + '</div>' +
        (estado.retorno && estado.retorno.metodo === estado.metodo && estado.retorno.dica
          ? '<div class="cartao" style="gap:6px"><span class="rotulo bronze" style="font-size:10px">Sobre ' + esc(estado.cafe.nome || 'este café') + '</span><p class="corpo" style="font-size:13px">' + esc(estado.retorno.dica) + '</p></div>'
          : '') +
        '<div class="cartao"><span class="rotulo bronze">Receita para amanhã</span>' +
        '<div class="receita"><div><span class="numero">' + r[0] + '</span><small>Café</small></div><div><span class="numero">' + r[1] + '</span><small>ml água</small></div><div><span class="numero">' + r[2] + '</span><small>' + s.rotTemp + '</small></div><div><span class="numero">' + r[3] + '</span><small>Tempo</small></div></div>' +
        '<p class="nota-metodo">' + m.nota + ' Sem balança? 1 colher de sopa cheia ≈ 7 g.</p></div>' +
        '<button type="button" class="btn" data-acao="salvar" style="margin-top:auto">Salvar e lembrar amanhã</button>' +
        '</div><div class="aviso" id="aviso" role="status"></div></section>';
    },

    paladar: function () {
      var eixos = [['Doçura', 'gosta muito', 80], ['Corpo', 'gosta muito', 75], ['Acidez', 'prefere pouca', 25], ['Amargor', 'tolera médio', 45]];
      return '<section class="tela"><div class="conteudo com-nav" style="gap:22px;padding-top:36px">' +
        '<div style="display:flex;flex-direction:column;gap:6px"><span class="rotulo bronze">Baseado em ' + estado.xicaras + ' xícaras</span><h1 class="titulo">Você prefere cafés<br>doces e encorpados.</h1></div>' +
        '<div class="eixos">' + eixos.map(function (e) {
          return '<div class="eixo"><div class="linha-topo"><span style="font-weight:600">' + e[0] + '</span><span>' + e[1] + '</span></div><div class="barra" role="img" aria-label="' + e[0] + ': ' + e[2] + '%"><span style="width:' + e[2] + '%"></span></div></div>';
        }).join('') + '</div>' +
        '<div class="campo"><span class="rotulo">Seu próximo degrau</span>' +
        '<div class="degraus"><div><small>FEITO</small>Tradicional de mercado</div><div><small>FEITO</small>Gourmet torra média</div></div>' +
        '<div class="cartao destaque" style="gap:6px"><span class="rotulo bronze" style="font-size:10px">Agora</span><span class="serif" style="font-size:24px;line-height:1.1">Especial natural do Sul de Minas</span><span style="font-size:13px;color:var(--texto-3)">Mais doçura, chocolate ao leite · [PREÇO]</span></div></div>' +
        '<div class="chips"><span class="tag">Chocolate · 5×</span><span class="tag">Caramelo · 3×</span><span class="tag apagada">Frutado · não curtiu</span></div>' +
        '</div>' + nav('paladar') + '</section>';
    },

    confirmar: function () {
      var r = sessao.rascunho || { cafe: copia(CAFE_VAZIO), origem: 'manual' };
      var c = r.cafe;
      var porFoto = r.origem === 'foto';
      var conf = { alta: 'Rótulo bem legível', media: 'Leitura parcial, confira', baixa: 'Leitura difícil, confira com atenção' };
      var topo = porFoto
        ? '<span class="rotulo bronze">Confira os dados</span><h1 class="titulo">Foi isso que<br>li no rótulo.</h1><p class="corpo">' + esc(conf[r.confianca] || conf.baixa) + '. Corrija o que estiver errado.</p>'
        : '<span class="rotulo bronze">Seu café</span><h1 class="titulo">Conte qual café<br>você tomou.</h1><p class="corpo">' + (r.erro ? esc(r.erro) + ' ' : '') + 'Preencha só o que souber.</p>';
      var retorno = porFoto && (r.resumo || r.dica)
        ? '<div class="cartao destaque" style="gap:8px"><span class="rotulo bronze" style="font-size:10px">O que esperar</span>' +
          (r.resumo ? '<p class="corpo" style="color:var(--leite)">' + esc(r.resumo) + '</p>' : '') +
          (r.dica ? '<p class="corpo" style="font-size:13px">' + esc(r.dica) + '</p>' : '') + '</div>'
        : '';
      var foto = porFoto && sessao.foto ? '<img class="foto-lida" src="' + sessao.foto + '" alt="Foto do pacote enviada">' : '';
      return '<section class="tela"><form class="conteudo" id="form-cafe" novalidate>' +
        '<div class="cabecalho"><a class="btn-icone" href="#/registrar" aria-label="Voltar">' + ic.voltar + '</a><span class="rotulo">' + (porFoto ? 'Lido da foto' : 'Preenchimento manual') + ic.mini + '</span></div>' +
        '<div style="display:flex;gap:16px;align-items:flex-start">' + foto + '<div style="display:flex;flex-direction:column;gap:6px;flex:1;min-width:0">' + topo + '</div></div>' +
        retorno +
        campo('nome', 'Nome do café ou lote', c.nome, 'Ex.: Sítio Boa Vista') +
        campo('torrefacao', 'Torrefação ou marca', c.torrefacao, 'Ex.: Torrefação do bairro') +
        '<div class="grade-2" style="gap:12px">' + campo('regiao', 'Região', c.regiao, 'Ex.: Sul de Minas') + campo('variedade', 'Variedade', c.variedade, 'Ex.: Catuaí') + '</div>' +
        '<div class="grade-2" style="gap:12px">' + seletor('processo', 'Processo', c.processo, PROCESSOS) + seletor('torra', 'Torra', c.torra, TORRAS) + '</div>' +
        campo('notas', 'Notas do rótulo', (c.notas || []).join(', '), 'Ex.: chocolate, caramelo') +
        '<button type="submit" class="btn" style="margin-top:8px">Usar este café</button>' +
        '<button type="button" class="btn contorno" data-acao="foto">' + (porFoto ? 'Tirar outra foto' : 'Fotografar o pacote') + '</button>' +
        '</form><div class="aviso" id="aviso" role="status"></div></section>';
    },

    comunidade: function () {
      return '<section class="tela"><div class="conteudo com-nav" style="padding-top:36px">' +
        '<span class="rotulo bronze">Em breve</span><h1 class="titulo">Comunidade</h1>' +
        '<p class="corpo">Aqui você vai ver dicas de quem usa o mesmo método e tomou o mesmo café que você.</p>' +
        '</div>' + nav('comunidade') + '</section>';
    }
  };

  // ---------- Roteamento e eventos ----------
  var app = document.getElementById('app');

  function rota() {
    var r = (location.hash || '#/').replace('#/', '');
    return telas[r] ? r : 'abertura';
  }

  function render(manterRolagem) {
    var tela = app.querySelector('.tela');
    var y = manterRolagem && tela ? tela.scrollTop : 0;
    var r = rota();
    app.innerHTML = telas[r]();
    var nova = app.querySelector('.tela');
    if (nova) nova.scrollTop = y;
    var titulos = { abertura: 'Ponto — Encontre o seu ponto', inicio: 'Início · Ponto', registrar: 'Registrar · Ponto', ajuste: 'Ajuste · Ponto', paladar: 'Meu paladar · Ponto', confirmar: 'Confira os dados · Ponto', comunidade: 'Comunidade · Ponto' };
    document.title = titulos[r];
  }

  function avisar(msg) {
    var el = document.getElementById('aviso');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('visivel');
    setTimeout(function () { el.classList.remove('visivel'); }, 2200);
  }

  app.addEventListener('click', function (ev) {
    var alvo = ev.target.closest('[data-acao]');
    if (!alvo) return;
    var acao = alvo.getAttribute('data-acao');
    var id = alvo.getAttribute('data-id');
    if (acao === 'metodo') { estado.metodo = id; }
    else if (acao === 'sintoma') { estado.sintoma = id; estado.dica = 0; }
    else if (acao === 'nota') { estado.nota = Number(id); }
    else if (acao === 'dica') { estado.dica = Number(id); }
    else if (acao === 'foto') { if (!sessao.lendo) document.getElementById('foto-input').click(); return; }
    else if (acao === 'manual') {
      var base = estado.cafe && estado.cafe.origem !== 'exemplo' ? copia(estado.cafe) : copia(CAFE_VAZIO);
      sessao.rascunho = { cafe: base, origem: 'manual' };
      if (rota() === 'confirmar') render(false); else location.hash = '#/confirmar';
      return;
    }
    else if (acao === 'loja') { ev.preventDefault(); avisar('Link do parceiro ainda não configurado.'); return; }
    else if (acao === 'salvar') {
      estado.salvo = { metodo: estado.metodo, sintoma: estado.sintoma };
      estado.xicaras += 1;
      guardar();
      location.hash = '#/inicio';
      return;
    }
    guardar();
    render(true);
  });

  // ---------- Foto ----------
  function comprimir(arquivo) {
    return new Promise(function (ok, falha) {
      var leitor = new FileReader();
      leitor.onerror = function () { falha(new Error('leitura')); };
      leitor.onload = function () {
        var img = new Image();
        img.onerror = function () { falha(new Error('imagem')); };
        img.onload = function () {
          var max = 1280;
          var escala = Math.min(1, max / Math.max(img.width, img.height));
          var w = Math.round(img.width * escala), h = Math.round(img.height * escala);
          var tela = document.createElement('canvas');
          tela.width = w; tela.height = h;
          tela.getContext('2d').drawImage(img, 0, 0, w, h);
          ok(tela.toDataURL('image/jpeg', 0.82));
        };
        img.src = leitor.result;
      };
      leitor.readAsDataURL(arquivo);
    });
  }

  function irParaConfirmar() {
    if (rota() === 'confirmar') render(false); else location.hash = '#/confirmar';
  }

  function lerFoto(arquivo) {
    sessao.lendo = true;
    if (rota() !== 'registrar') location.hash = '#/registrar'; else render(true);
    comprimir(arquivo).then(function (dataUrl) {
      sessao.foto = dataUrl;
      return fetch('/api/identificar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagem: dataUrl.split(',')[1], media_type: 'image/jpeg', metodo: estado.metodo })
      }).then(function (resp) {
        return resp.json().catch(function () { return {}; }).then(function (dados) {
          if (!resp.ok) { throw new Error(dados.mensagem || 'Não consegui ler a foto agora. Preencha à mão.'); }
          return dados;
        });
      });
    }).then(function (dados) {
      sessao.rascunho = { cafe: dados.cafe, origem: 'foto', confianca: dados.confianca, resumo: dados.resumo, dica: dados.dica };
    }).catch(function (erro) {
      var msg = erro && erro.message && erro.message !== 'Failed to fetch' ? erro.message : 'Sem conexão com o serviço de leitura.';
      sessao.rascunho = { cafe: copia(CAFE_VAZIO), origem: 'manual', erro: msg };
    }).then(function () {
      sessao.lendo = false;
      irParaConfirmar();
    });
  }

  document.getElementById('foto-input').addEventListener('change', function (ev) {
    var arquivo = ev.target.files && ev.target.files[0];
    ev.target.value = '';
    if (arquivo) lerFoto(arquivo);
  });

  app.addEventListener('submit', function (ev) {
    if (ev.target.id !== 'form-cafe') return;
    ev.preventDefault();
    var f = new FormData(ev.target);
    var val = function (k) { var v = String(f.get(k) || '').trim(); return v || null; };
    var r = sessao.rascunho || { origem: 'manual' };
    estado.cafe = {
      nome: val('nome'), torrefacao: val('torrefacao'), produtor: r.cafe ? r.cafe.produtor : null,
      regiao: val('regiao'), variedade: val('variedade'), processo: val('processo'), torra: val('torra'),
      pontuacao_sca: r.cafe ? r.cafe.pontuacao_sca : null,
      notas: String(f.get('notas') || '').split(',').map(function (n) { return n.trim().toLowerCase(); }).filter(Boolean).slice(0, 5),
      origem: r.origem === 'foto' ? 'foto' : 'manual'
    };
    estado.retorno = r.origem === 'foto' ? { resumo: r.resumo, dica: r.dica, metodo: estado.metodo } : null;
    guardar();
    location.hash = '#/registrar';
  });

  window.addEventListener('hashchange', function () { render(false); });
  render(false);
})();
