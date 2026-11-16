/* Ponto — protótipo navegável (HTML/CSS/JS puros, sem build) */
(function () {
  'use strict';

  // ---------- Dados ----------
  var METODOS = [
    { id: 'pano', rotulo: 'Pano', nome: 'Coador de pano', curto: 'no coador de pano', nota: 'No pano, escalde o coador com água quente antes de colocar o pó.' },
    { id: 'papel', rotulo: 'Papel', nome: 'Filtro de papel', curto: 'no filtro de papel', nota: 'Molhe o filtro de papel antes para tirar o gosto de papel.' },
    { id: 'italiana', rotulo: 'Italiana', nome: 'Italiana', curto: 'na italiana', nota: 'Na italiana, use fogo baixo e tire do fogo assim que começar a borbulhar.' },
    { id: 'prensa', rotulo: 'Prensa', nome: 'Prensa francesa', curto: 'na prensa francesa', nota: 'Na prensa, espere 4 minutos e desça o êmbolo devagar.' },
    { id: 'eletrica', rotulo: 'Elétrica', nome: 'Cafeteira elétrica', curto: 'na cafeteira elétrica', nota: 'Na elétrica, não deixe a jarra muito tempo na chapa quente.' }
  ];

  var SINTOMAS = [
    {
      id: 'amargo', nome: 'Amargo', dica: 'pesado, queimado', adj: 'amargo',
      titulo: 'O café passou do ponto',
      texto: 'A água tirou mais do pó do que devia. Dá para corrigir com o que você já tem.',
      receita: { cafe: 15, agua: 250, temp: 92, tempo: '3' }, rotTemp: 'ferveu + 30 s',
      dicas: [
        { t: 'Água um pouco menos quente', d: 'Desligue quando ferver e espere 30 segundos.', p: 'termometro' },
        { t: 'Moagem mais grossa', d: 'Abra um ou dois cliques no moedor. Pó de mercado: use um pouco menos.', p: 'moedor' },
        { t: 'Menos tempo de contato', d: 'Despeje em três etapas, sem deixar o pó encharcado.', p: 'balanca' }
      ]
    },
    {
      id: 'azedo', nome: 'Azedo', dica: 'cortante, verde', adj: 'azedo',
      titulo: 'Faltou chegar no ponto',
      texto: 'A água não teve tempo ou calor suficiente para tirar a doçura do pó.',
      receita: { cafe: 15, agua: 250, temp: 96, tempo: '4' }, rotTemp: 'logo após ferver',
      dicas: [
        { t: 'Água mais quente', d: 'Use a água logo depois de ferver, sem esperar.', p: 'chaleira' },
        { t: 'Moagem mais fina', d: 'Feche um ou dois cliques no moedor.', p: 'moedor' },
        { t: 'Despeje mais devagar', d: 'Molhe o pó, espere 30 segundos e siga em fio fino.', p: 'balanca' }
      ]
    },
    {
      id: 'aguado', nome: 'Aguado', dica: 'fraco, sem graça', adj: 'aguado',
      titulo: 'Faltou café na xícara',
      texto: 'A proporção ficou com água demais para o pó que você usou.',
      receita: { cafe: 18, agua: 250, temp: 94, tempo: '3,5' }, rotTemp: 'ferveu + 15 s',
      dicas: [
        { t: 'Mais pó na mesma água', d: 'Comece com uma colher de sopa a mais.', p: 'balanca' },
        { t: 'Moagem um pouco mais fina', d: 'Pó mais fino libera sabor mais rápido.', p: 'moedor' },
        { t: 'Guarde o pó bem fechado', d: 'Café aberto perde aroma em poucos dias.', p: 'pote' }
      ]
    },
    {
      id: 'seco', nome: 'Seca a boca', dica: 'adstringente', adj: 'adstringente',
      titulo: 'A água passou de forma desigual',
      texto: 'Parte do pó extraiu demais e parte de menos. Isso deixa a boca seca.',
      receita: { cafe: 15, agua: 250, temp: 93, tempo: '3' }, rotTemp: 'ferveu + 20 s',
      dicas: [
        { t: 'Molhe todo o pó primeiro', d: 'Um pouco de água em círculos, espere 30 segundos e continue.', p: 'chaleira' },
        { t: 'Moagem mais uniforme', d: 'Moedor de lâmina deixa pedaços desiguais; prefira mó.', p: 'moedor' },
        { t: 'Não esprema o coador', d: 'Deixe escorrer sozinho até o fim.', p: 'coador-pano' }
      ]
    },
    {
      id: 'forte', nome: 'Forte demais', dica: 'denso, pesado', adj: 'forte demais',
      titulo: 'Concentrado demais',
      texto: 'Pouca água para muito pó. Fácil de acertar na próxima.',
      receita: { cafe: 13, agua: 250, temp: 93, tempo: '3' }, rotTemp: 'ferveu + 20 s',
      dicas: [
        { t: 'Menos pó', d: 'Tire uma colher de sopa e compare.', p: 'balanca' },
        { t: 'Complete com água quente', d: 'Se já passou, dilua na xícara aos poucos.', p: 'jarra' },
        { t: 'Experimente uma torra média', d: 'Torras escuras pesam mais na boca.', p: 'cafe-torra-media' }
      ]
    },
    {
      id: 'bom', nome: 'Ficou ótimo', dica: 'equilibrado', adj: 'no ponto',
      titulo: 'No ponto',
      texto: 'Guarde essa receita. Ela é o seu ponto de partida para explorar.',
      receita: { cafe: 15, agua: 250, temp: 93, tempo: '3' }, rotTemp: 'ferveu + 20 s',
      dicas: [
        { t: 'Repita a receita', d: 'Faça igual amanhã para confirmar.', p: 'balanca' },
        { t: 'Troque só o café', d: 'Mesmo método, outro grão: compare as diferenças.', p: 'cafe-natural-sul-minas' },
        { t: 'Teste outro método', d: 'O mesmo café na prensa ou na italiana muda tudo.', p: 'prensa' }
      ]
    }
  ];

  // ---------- Estado ----------
  var CHAVE = 'ponto:estado';
  var CAFE_VAZIO = { nome: null, torrefacao: null, produtor: null, regiao: null, variedade: null, processo: null, torra: null, pontuacao_sca: null, notas: [] };
  var PROCESSOS = ['natural', 'lavado', 'cereja descascado', 'honey', 'fermentado'];
  var TORRAS = ['clara', 'média-clara', 'média', 'média-escura', 'escura'];

  // Receita de partida: a torra decide a temperatura, o método decide proporção e moagem.
  // Torra clara pede água mais quente (extrai devagar); escura, mais fria (amarga fácil).
  var TEMP_TORRA = { 'clara': 95, 'média-clara': 94, 'média': 93, 'média-escura': 91, 'escura': 89 };
  var PARTIDA = {
    pano: { cafe: 15, agua: 250, moagem: 'média-fina' },
    papel: { cafe: 15, agua: 250, moagem: 'média' },
    prensa: { cafe: 16, agua: 250, moagem: 'grossa' },
    italiana: { moagem: 'fina', italiana: true },
    eletrica: { cafe: 15, agua: 250, moagem: 'média', eletrica: true }
  };
  function receitaPartida(torra, metodo) {
    var t = TEMP_TORRA[torra] ? torra : 'média';
    var r = PARTIDA[metodo] || PARTIDA.pano, temp = TEMP_TORRA[t];
    if (r.italiana) return [['Água na base', 'quente', ''], ['Café no funil', 'cheio', ''], ['Fogo', 'baixo', ''], ['Moagem', r.moagem, '']];
    return [['Temperatura', r.eletrica ? 'máquina' : temp, r.eletrica ? '' : '°C', !r.eletrica], ['Café', r.cafe, 'g'], ['Água', r.agua, 'ml'], ['Moagem', r.moagem, '']];
  }
  function blocoPartida(c, m) {
    if (!c || c.origem === 'exemplo') return '';
    var sem = !TEMP_TORRA[c.torra];
    return '<div class="grupo"><span class="rotulo">Para começar · ' + (sem ? 'torra não informada' : 'torra ' + esc(c.torra)) + ' ' + m.curto + '</span>' +
      ficha(receitaPartida(c.torra, m.id)) +
      '<p class="nota-metodo">' + (m.id === 'italiana' ? 'Água já quente até a válvula, pó sem apertar, e tire do fogo quando começar a borbulhar. ' : '') + (sem ? 'Sem a torra no rótulo, partimos da média. ' : '') + 'Prove e conte abaixo como ficou.</p></div>';
  }

  var padrao = { metodo: 'pano', sintoma: null, nota: 0, dica: 0, salvo: null, xicaras: 0, cafe: null, retorno: null, historico: [] };
  var MAX_HISTORICO = 200;
  var estado = carregar();
  // Só em memória (não vai para o armazenamento do navegador)
  var sessao = { lendo: false, foto: null, rascunho: null, apagar: false };
  if (!Array.isArray(estado.historico)) estado.historico = [];
  // Quem abriu versões antigas guardou o estado de demonstração: sem xícaras salvas, nada disso é da pessoa.
  if (!estado.historico.length) { estado.salvo = null; estado.xicaras = 0; }
  if (estado.cafe && estado.cafe.origem === 'exemplo') estado.cafe = null;

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

  // ---------- Ícones (uma família de linha, 18 px, traço 1,5) ----------
  function linha(d, extra) {
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra || '') + '>' + d + '</svg>';
  }
  var ic = {
    simbolo: function (t, traco) {
      return '<svg width="' + t + '" height="' + t + '" viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" rx="22" fill="#1c1a18"/><rect x=".5" y=".5" width="99" height="99" rx="21.5" fill="none" stroke="rgba(239,233,222,.08)"/><circle cx="50" cy="50" r="26" fill="none" stroke="#efe9de" stroke-width="' + (traco || 2.4) + '"/><circle cx="50" cy="50" r="8" fill="#b8926a"/></svg>';
    },
    voltar: linha('<path d="M15 5l-7 7 7 7"/>'),
    camera: linha('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),
    grao: linha('<ellipse cx="12" cy="12" rx="7" ry="9.5" transform="rotate(30 12 12)"/><path d="M9 5.5c3 3 3 10 6 13"/>'),
    compartilhar: linha('<path d="M12 4v11"/><path d="M8 8l4-4 4 4"/><path d="M5 13v6h14v-6"/>'),
    sacola: linha('<path d="M6 7h12l-1 12H7z"/><path d="M9 7a3 3 0 0 1 6 0"/>'),
    inicio: linha('<path d="M4 11l8-6 8 6v8H4z"/>'),
    xicara: linha('<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16"/>'),
    paladar: linha('<circle cx="12" cy="12" r="8"/><path d="M12 12l4-3"/>'),
    lista: linha('<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="4.5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="4.5" cy="18" r="1" fill="currentColor" stroke="none"/>'),
    comunidade: linha('<circle cx="9" cy="9" r="3"/><circle cx="16" cy="10" r="2.5"/><path d="M3 19c1-3 3.5-4.5 6-4.5s5 1.5 6 4.5M14 15c2.5 0 4.5 1.2 5.5 4"/>')
  };

  // Métodos: desenhos de linha, mesma família dos ícones
  var IC_METODO = {
    pano: '<path d="M3 5h18"/><path d="M6 5c0 6.5 3 10 6 10s6-3.5 6-10"/><path d="M12 15v3"/><path d="M8 20h8"/>',
    papel: '<path d="M4 5h16l-5 9H9z"/><path d="M9.5 8l1.2 3M14.5 8l-1.2 3"/><path d="M9 14v2.5h6V14"/><path d="M7 20h10"/>',
    italiana: '<path d="M8.5 3h7l-.8 4.5H9.3z"/><path d="M8 7.5h8"/><path d="M7 21l2-13.5h6L17 21z"/><path d="M16.3 11h2.2v4.5l-1.7.8"/>',
    prensa: '<rect x="6" y="7" width="11" height="14" rx="1.5"/><path d="M11.5 2.5v10"/><path d="M8 12.5h7"/><path d="M9 2.5h5"/><path d="M17 10h2v8h-2"/>',
    eletrica: '<rect x="4" y="3" width="16" height="6" rx="1.5"/><path d="M6 9v12h12V9"/><path d="M9 13h6v5H9z"/><path d="M4 21h16"/>'
  };
  // Reações: a careta de quem provou
  var OLHO = function (x) { return '<circle cx="' + x + '" cy="10" r=".9" fill="currentColor" stroke="none"/>'; };
  var IC_CARA = {
    amargo: '<path d="M7.5 9.2l2.5 1.2M16.5 9.2L14 10.4"/><path d="M8 16l1.3-1 1.3 1 1.4-1 1.4 1 1.3-1 1.3 1"/>',
    azedo: '<path d="M7.5 10.5l2.5-1M14 10h2.5"/><circle cx="12" cy="15.6" r="1.4"/>',
    aguado: OLHO(9) + OLHO(15) + '<path d="M9 15.5h6"/>',
    seco: OLHO(9) + OLHO(15) + '<path d="M8.5 15h7"/><path d="M11 15v1.6a1 1 0 0 0 2 0V15"/>',
    forte: '<circle cx="9" cy="10" r="1.6"/><circle cx="15" cy="10" r="1.6"/><path d="M9.5 16.5a2.5 2.2 0 0 1 5 0z"/>',
    bom: '<path d="M7.8 10.6q1.2-1.6 2.4 0M13.8 10.6q1.2-1.6 2.4 0"/><path d="M8.5 14.3q3.5 3.4 7 0"/>'
  };
  function icone(desenho, tam) {
    return '<svg width="' + tam + '" height="' + tam + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + desenho + '</svg>';
  }
  function cara(id, tam) { return icone('<circle cx="12" cy="12" r="9.25"/>' + (IC_CARA[id] || IC_CARA.bom), tam); }

  function logotipo(tam) {
    return '<span class="logotipo" style="font-size:' + tam + 'px">ponto<span class="ponto-final">.</span></span>';
  }

  function nav(atual) {
    var itens = [
      ['inicio', 'Início', ic.inicio],
      ['registrar', 'Registrar', ic.xicara],
      ['historico', 'Xícaras', ic.lista],
      ['paladar', 'Paladar', ic.paladar]
    ];
    return '<nav class="nav" aria-label="Navegação principal">' + itens.map(function (i) {
      return '<a href="#/' + i[0] + '"' + (atual === i[0] ? ' aria-current="page"' : '') + '>' + i[2] + i[1] + '</a>';
    }).join('') + '</nav>';
  }

  var DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  var MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  function data() {
    var d = new Date();
    var dia = DIAS[d.getDay()];
    return dia.charAt(0).toUpperCase() + dia.slice(1) + ', ' + d.getDate() + ' de ' + MESES[d.getMonth()];
  }
  function dataCurta(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return '';
    var hh = ('0' + d.getHours()).slice(-2), mm = ('0' + d.getMinutes()).slice(-2);
    return DIAS[d.getDay()].slice(0, 3) + ', ' + d.getDate() + ' ' + MESES[d.getMonth()].slice(0, 3) + ' · ' + hh + ':' + mm;
  }
  function rotuloRegistros(n) { return n === 1 ? '1 xícara' : n + ' xícaras'; }
  function nomeCafe(c) { return (c && (c.nome || c.torrefacao)) || 'Café sem nome'; }

  function linhaCafe(c) {
    return [c.variedade, c.torra ? 'torra ' + c.torra : null, c.processo, c.regiao].filter(Boolean).map(esc).join(' · ');
  }

  // ---------- Mapa do ponto ----------
  // Extração (faltou → passou) no eixo x, força (aguado → forte) no eixo y.
  // O ponto bronze é a xícara de hoje; o anel é o ponto certo; a seta, o ajuste de amanhã.
  var POSICAO = {
    amargo: { x: 0.82, y: 0.54, rumo: 'Amanhã, menos extração' },
    azedo: { x: 0.18, y: 0.48, rumo: 'Amanhã, mais extração' },
    aguado: { x: 0.44, y: 0.16, rumo: 'Amanhã, um café mais forte' },
    seco: { x: 0.78, y: 0.72, rumo: 'Amanhã, uma extração mais uniforme' },
    forte: { x: 0.56, y: 0.86, rumo: 'Amanhã, um café mais suave' },
    bom: { x: 0.5, y: 0.5, rumo: 'No ponto, repita a receita amanhã' }
  };

  function desenhoMapa(sid, opcoes) {
    opcoes = opcoes || {};
    var mini = opcoes.mini;
    var p = POSICAO[sid] || POSICAO.amargo;
    var W = mini ? 88 : 342, H = mini ? 88 : 232;
    var x0 = mini ? 4 : 56, x1 = W - (mini ? 4 : 8), y0 = mini ? 4 : 8, y1 = mini ? 84 : 192;
    var w = x1 - x0, h = y1 - y0;
    var cx = x0 + w / 2, cy = y0 + h / 2;
    var px = x0 + p.x * w, py = y1 - p.y * h;
    var noPonto = sid === 'bom';
    var linhas = '';
    [1, 2].forEach(function (k) {
      linhas += '<line x1="' + (x0 + w * k / 3) + '" y1="' + y0 + '" x2="' + (x0 + w * k / 3) + '" y2="' + y1 + '"/>';
      linhas += '<line x1="' + x0 + '" y1="' + (y0 + h * k / 3) + '" x2="' + x1 + '" y2="' + (y0 + h * k / 3) + '"/>';
    });
    var dx = px - cx, dy = py - cy, dist = Math.sqrt(dx * dx + dy * dy) || 1;
    var anel = mini ? 6 : 9;
    var fimX = cx + dx / dist * (anel + 4), fimY = cy + dy / dist * (anel + 4);
    var iniX = px - dx / dist * (mini ? 7 : 11), iniY = py - dy / dist * (mini ? 7 : 11);
    var id = 'seta-' + (mini ? 'mini' : 'grande') + (opcoes.entra ? '-entra' : '');
    var seta = noPonto ? '' :
      '<g class="seta-hoje"><defs><marker id="' + id + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#aaa398"/></marker></defs>' +
      '<line x1="' + iniX.toFixed(1) + '" y1="' + iniY.toFixed(1) + '" x2="' + fimX.toFixed(1) + '" y2="' + fimY.toFixed(1) + '" stroke="#aaa398" stroke-width="1.25" stroke-dasharray="3 3" marker-end="url(#' + id + ')"/></g>';
    // Na abertura, o ponto nasce na posição de "amargo" e desliza até o anel.
    var pontoX = opcoes.entra ? cx : px, pontoY = opcoes.entra ? cy : py;
    var desloc = opcoes.entra ? ' style="--dx:' + (px - cx).toFixed(1) + 'px;--dy:' + (py - cy).toFixed(1) + 'px"' : '';
    var rotulos = mini ? '' :
      '<g font-family="Manrope, system-ui, sans-serif" font-size="12" fill="#8a847a">' +
      '<text x="' + (x0 - 8) + '" y="' + (y0 + 12) + '" text-anchor="end">Forte</text>' +
      '<text x="' + (x0 - 8) + '" y="' + y1 + '" text-anchor="end">Aguado</text>' +
      '<text x="' + x0 + '" y="' + (y1 + 24) + '">Faltou</text>' +
      '<text x="' + cx + '" y="' + (y1 + 24) + '" text-anchor="middle" fill="#aaa398">Extração</text>' +
      '<text x="' + x1 + '" y="' + (y1 + 24) + '" text-anchor="end">Passou</text>' +
      '<text x="' + cx + '" y="' + (y0 + h / 3 + 16) + '" text-anchor="middle" fill="#b8926a">o ponto</text></g>';
    if (opcoes.passeio) {
      var alvos = Object.keys(POSICAO).map(function (k) {
        var q = POSICAO[k], qx = k === 'bom' ? cx : x0 + q.x * w, qy = k === 'bom' ? cy : y1 - q.y * h;
        return 'data-' + k + '="translate(' + qx.toFixed(1) + 'px, ' + qy.toFixed(1) + 'px)"';
      }).join(' ');
      return '<svg class="passeio" ' + alvos + ' viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="O ponto bronze anda pelo mapa: amargo, azedo, aguado ou forte, e volta ao centro, o ponto certo">' +
        '<rect x="' + x0 + '" y="' + y0 + '" width="' + w + '" height="' + h + '" rx="12" fill="#1c1a18" stroke="rgba(239,233,222,.08)"/>' +
        '<g stroke="rgba(239,233,222,.06)" stroke-width="1">' + linhas + '</g>' +
        '<rect x="' + (x0 + w / 3) + '" y="' + (y0 + h / 3) + '" width="' + (w / 3) + '" height="' + (h / 3) + '" rx="8" fill="rgba(184,146,106,.1)" stroke="rgba(184,146,106,.36)"/>' +
        rotulos +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + anel + '" fill="none" stroke="#efe9de" stroke-width="1.25"/>' +
        '<g class="viajante" style="transform:translate(' + px.toFixed(1) + 'px, ' + py.toFixed(1) + 'px)">' +
        '<circle r="6.5" fill="#b8926a" stroke="#12110f" stroke-width="2"/>' +
        '<g transform="translate(12,-9)" style="color:#efe9de"><svg width="22" height="22" viewBox="0 0 24 24" fill="#12110f" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.25"/><g class="cara" fill="none">' + IC_CARA[sid] + '</g></svg></g>' +
        '</g></svg>';
    }
    var titulo = noPonto ? 'Sua xícara de hoje ficou no ponto' : 'Sua xícara de hoje ficou fora do ponto. ' + p.rumo;
    return '<svg class="' + (mini ? 'mapa-mini' : '') + (opcoes.entra ? ' entra' : '') + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(titulo) + '">' +
      '<rect x="' + x0 + '" y="' + y0 + '" width="' + w + '" height="' + h + '" rx="' + (mini ? 8 : 12) + '" fill="#1c1a18" stroke="rgba(239,233,222,.08)"/>' +
      '<g stroke="rgba(239,233,222,.06)" stroke-width="1">' + linhas + '</g>' +
      '<rect x="' + (x0 + w / 3) + '" y="' + (y0 + h / 3) + '" width="' + (w / 3) + '" height="' + (h / 3) + '" rx="' + (mini ? 4 : 8) + '" fill="rgba(184,146,106,.1)" stroke="rgba(184,146,106,.36)"/>' +
      rotulos +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + anel + '" fill="none" stroke="#efe9de" stroke-width="1.25"/>' +
      seta +
      '<circle class="ponto-hoje" cx="' + pontoX.toFixed(1) + '" cy="' + pontoY.toFixed(1) + '" r="' + (mini ? 4.5 : 6.5) + '" fill="#b8926a" stroke="#12110f" stroke-width="2"' + desloc + '/>' +
      '</svg>';
  }

  function mapa(sid) {
    var p = POSICAO[sid] || POSICAO.amargo;
    return '<section class="mapa" aria-label="Mapa do ponto">' +
      '<div class="linha-topo"><span class="rotulo">Onde sua xícara caiu</span>' +
      '<span class="legenda meta"><span><i class="marcador"></i>hoje</span><span><i class="marcador vazado"></i>o ponto</span></span></div>' +
      desenhoMapa(sid) +
      '<p class="rumo">' + p.rumo + '</p></section>';
  }

  function ficha(itens) {
    return '<dl class="ficha">' + itens.map(function (i) {
      return '<div' + (i[3] ? ' class="destaque"' : '') + '><dt>' + i[0] + '</dt><dd>' + i[1] + (i[2] ? '<small>' + i[2] + '</small>' : '') + '</dd></div>';
    }).join('') + '</dl>';
  }

  function cartaoCafe() {
    if (sessao.lendo) {
      return '<div class="cafe" aria-busy="true"><div class="pacote"><span class="girando" aria-hidden="true"></span></div>' +
        '<div style="display:flex;flex-direction:column;gap:4px;flex:1"><span class="meta">Lendo o rótulo</span>' +
        '<span class="cartao-titulo">Um instante</span><span class="meta">Identificando origem, torra e notas</span></div></div>';
    }
    var c = estado.cafe;
    if (!c) {
      return '<div class="grupo folgado"><div class="cafe"><div class="pacote">' + ic.grao + '</div>' +
        '<div style="display:flex;flex-direction:column;gap:4px;flex:1;min-width:0"><span class="cartao-titulo">Qual café você tomou?</span>' +
        '<span class="meta">Fotografe o pacote e a IA lê o rótulo</span></div></div>' +
        '<div class="acoes-cafe"><button type="button" class="btn secundario" data-acao="foto">' + ic.camera + 'Fotografar</button>' +
        '<button type="button" class="link" data-acao="manual">Preencher à mão</button></div></div>';
    }
    var rotulos = { foto: 'Lido da foto', manual: 'Informado por você' };
    var miniatura = sessao.foto && c.origem === 'foto' ? '<img src="' + sessao.foto + '" alt="">' : ic.grao;
    return '<div class="grupo folgado"><div class="cafe"><div class="pacote">' + miniatura + '</div>' +
      '<div style="display:flex;flex-direction:column;gap:4px;flex:1;min-width:0"><span class="meta">' + (rotulos[c.origem] || rotulos.manual) + '</span>' +
      '<span class="cartao-titulo">' + esc(c.nome || c.torrefacao || 'Café sem nome') + '</span>' +
      '<span class="meta">' + (linhaCafe(c) || 'Fotografe o rótulo para ver origem e torra') + '</span></div></div>' +
      '<div class="acoes-cafe"><button type="button" class="btn secundario" data-acao="foto">' + ic.camera + 'Fotografar</button>' +
      '<button type="button" class="link" data-acao="manual">Preencher à mão</button></div></div>';
  }

  // ---------- Cartão para compartilhar (imagem 1080 × 1350, feita no próprio aparelho) ----------
  function quebrar(ctx, texto, largura) {
    var palavras = texto.split(' '), linhas = [], atual = '';
    palavras.forEach(function (p) {
      var teste = atual ? atual + ' ' + p : p;
      if (ctx.measureText(teste).width > largura && atual) { linhas.push(atual); atual = p; } else atual = teste;
    });
    if (atual) linhas.push(atual);
    return linhas;
  }

  function imagemDoMapa(sid) {
    var svg = desenhoMapa(sid).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="1026" height="696" ');
    return new Promise(function (ok, falha) {
      var img = new Image();
      img.onload = function () { ok(img); };
      img.onerror = falha;
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
  }

  function desenharCartao() {
    var s = achar(SINTOMAS, estado.sintoma), m = achar(METODOS, estado.metodo), p = POSICAO[s.id] || POSICAO.amargo, r = s.receita;
    var serif = '"Cormorant Garamond", Georgia, serif', sans = 'Manrope, system-ui, sans-serif';
    var fontes = document.fonts && document.fonts.load
      ? Promise.all(['500 84px "Cormorant Garamond"', '400 32px Manrope', '500 60px Manrope'].map(function (f) { return document.fonts.load(f); })).catch(function () {})
      : Promise.resolve();
    return fontes.then(function () { return imagemDoMapa(s.id); }).then(function (mapaImg) {
      var W = 1080, H = 1350, X = 80, L = W - 2 * X;
      var c = document.createElement('canvas'); c.width = W; c.height = H;
      var g = c.getContext('2d');
      g.fillStyle = '#12110f'; g.fillRect(0, 0, W, H);
      // marca
      g.fillStyle = '#1c1a18'; g.beginPath(); g.roundRect ? g.roundRect(X, 72, 64, 64, 14) : g.rect(X, 72, 64, 64); g.fill();
      g.strokeStyle = '#efe9de'; g.lineWidth = 3; g.beginPath(); g.arc(X + 32, 104, 17, 0, Math.PI * 2); g.stroke();
      g.fillStyle = '#b8926a'; g.beginPath(); g.arc(X + 32, 104, 5.5, 0, Math.PI * 2); g.fill();
      g.textBaseline = 'alphabetic';
      g.font = '500 60px ' + serif; g.fillStyle = '#efe9de'; g.fillText('ponto', X + 88, 122);
      var wp = g.measureText('ponto').width; g.fillStyle = '#b8926a'; g.fillText('.', X + 88 + wp, 122);
      g.font = '400 28px ' + sans; g.fillStyle = '#8a847a'; g.textAlign = 'right'; g.fillText(data(), W - X, 116); g.textAlign = 'left';
      // título
      var y = 250;
      g.font = '400 32px ' + sans; g.fillStyle = '#8a847a';
      g.fillText(s.id === 'bom' ? 'Meu café de hoje ficou no ponto' : 'Meu café de hoje', X, y);
      g.font = '500 84px ' + serif; g.fillStyle = '#efe9de';
      y += 92;
      var ls = quebrar(g, s.titulo, L);
      ls.forEach(function (linha, i) { g.fillText(linha, X, y + i * 88); });
      y += (ls.length - 1) * 88;
      var cafe = estado.cafe && estado.cafe.origem !== 'exemplo' ? nomeCafe(estado.cafe) : null;
      g.font = '400 32px ' + sans; g.fillStyle = '#aaa398';
      y += 60; g.fillText(s.nome + ' no ' + m.nome.toLowerCase() + (cafe ? ' · ' + cafe : ''), X, y);
      // mapa
      y += 36;
      var mw = L * 0.86, mh = mw * 232 / 342; g.drawImage(mapaImg, (W - mw) / 2 - 24, y, mw, mh);
      y += mh + 34;
      g.font = '500 32px ' + sans; g.fillStyle = '#efe9de'; g.fillText(p.rumo, X, y);
      // receita de amanhã
      y += 70;
      g.font = '400 26px ' + sans; g.fillStyle = '#8a847a'; g.fillText('Receita para amanhã', X, y);
      y += 70;
      var itens = [[r.cafe, 'g'], [r.agua, 'ml'], [r.temp, '°C'], [r.tempo, 'min']], cx = X;
      itens.forEach(function (it) {
        g.font = '500 60px ' + sans; g.fillStyle = '#efe9de'; g.fillText(String(it[0]), cx, y);
        var w = g.measureText(String(it[0])).width;
        g.font = '400 30px ' + sans; g.fillStyle = '#aaa398'; g.fillText(it[1], cx + w + 8, y);
        cx += w + 8 + g.measureText(it[1]).width + 56;
      });
      // rodapé
      g.fillStyle = 'rgba(239,233,222,.08)'; g.fillRect(X, H - 150, L, 1);
      g.font = '500 44px ' + serif; g.fillStyle = '#efe9de'; g.fillText('Encontre o seu ponto', X, H - 78);
      g.font = '400 26px ' + sans; g.fillStyle = '#8a847a'; g.textAlign = 'right'; g.fillText(location.host, W - X, H - 82); g.textAlign = 'left';
      return new Promise(function (ok) { c.toBlob(ok, 'image/png'); });
    });
  }

  function compartilhar() {
    if (sessao.compartilhando) return;
    sessao.compartilhando = true;
    var link = location.origin + '/?utm_source=cartao';
    desenharCartao().then(function (blob) {
      var arquivo = new File([blob], 'meu-ponto.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [arquivo] })) {
        return navigator.share({ files: [arquivo], text: 'Acertando o meu café com o Ponto: ' + link }).catch(function () {});
      }
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = 'meu-ponto.png';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
      avisar('Cartão salvo. Mande com o link ' + location.host);
    }).catch(function () { avisar('Não consegui montar o cartão agora.'); })
      .then(function () { sessao.compartilhando = false; });
  }

  // ---------- Produtos (vêm de produtos.json) ----------
  var produtos = {};

  function produto(id) {
    var p = produtos[id] || {};
    var link = typeof p.link === 'string' && /^https:\/\//i.test(p.link.trim()) ? p.link.trim() : null;
    var preco = typeof p.preco === 'number' && p.preco > 0
      ? p.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : null;
    return { nome: p.nome || id, loja: p.loja || null, link: link, preco: preco };
  }

  function cartaoProduto(id) {
    var p = produto(id);
    var origem = p.link ? 'Link de afiliado' + (p.loja ? ' · ' + esc(p.loja) : '') : 'Ajuda neste ajuste';
    var acao = p.link
      ? '<a href="' + esc(p.link) + '" target="_blank" rel="sponsored noopener noreferrer">Ver na loja<span class="sr"> (abre em nova aba)</span></a>'
      : '<span class="em-breve">Em breve</span>';
    return '<div class="produto"><div class="img">' + ic.sacola + '</div><div class="info">' +
      '<span class="meta">' + origem + '</span><b>' + esc(p.nome) + '</b>' +
      (p.preco ? '<span class="preco">' + p.preco + '</span>' : '') + '</div>' + acao + '</div>';
  }

  function degrau() {
    var p = produto('cafe-natural-sul-minas');
    var detalhe = 'Mais doçura, chocolate ao leite' + (p.preco ? ' · ' + p.preco : '');
    var miolo = '<span class="meta">Próximo</span><span class="cartao-titulo">' + esc(p.nome) + '</span>' +
      '<span class="corpo menor">' + detalhe + '</span>' +
      (p.link ? '<span class="meta">Link de afiliado · ver na loja</span>' : '');
    return p.link
      ? '<a class="cartao" href="' + esc(p.link) + '" target="_blank" rel="sponsored noopener noreferrer">' + miolo + '</a>'
      : '<div class="cartao">' + miolo + '</div>';
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

  function cabecalho(voltar, texto) {
    return '<div class="cabecalho"><a class="btn-icone" href="' + voltar + '" aria-label="Voltar">' + ic.voltar + '</a><span class="rotulo">' + texto + '</span></div>';
  }

  var MIN_PALADAR = 3;

  // ---------- Recompensa: sequência de dias e uma descoberta por visita ----------
  function diaLocal(d) { return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function sequencia() {
    var dias = {};
    estado.historico.forEach(function (h) { var d = new Date(h.quando); if (!isNaN(d)) dias[diaLocal(d)] = true; });
    var d = new Date(), hoje = !!dias[diaLocal(d)], n = 0;
    if (!hoje) d.setDate(d.getDate() - 1);
    while (dias[diaLocal(d)]) { n++; d.setDate(d.getDate() - 1); }
    return { dias: n, hoje: hoje };
  }
  function contar(lista, chave) {
    var c = {};
    lista.forEach(function (h) { if (h[chave]) c[h[chave]] = (c[h[chave]] || 0) + 1; });
    var top = null; Object.keys(c).forEach(function (k) { if (!top || c[k] > c[top]) top = k; });
    return { id: top, n: top ? c[top] : 0 };
  }
  function descobertas() {
    var h = estado.historico, n = h.length, lista = [];
    if (!n) return lista;
    var melhor = h.slice().sort(function (a, b) { return (b.nota || 0) - (a.nota || 0); })[0];
    if (melhor && melhor.nota) lista.push('Sua melhor nota até agora: ' + melhor.nota + ' de 5, com ' + esc(nomeCafe(melhor.cafe)) + ' ' + achar(METODOS, melhor.metodo).curto + '.');
    var primeira = h[n - 1], ultima = h[0];
    if (n >= 2 && ultima.nota > primeira.nota) lista.push('Sua nota subiu de ' + primeira.nota + ' para ' + ultima.nota + ' desde a primeira xícara registrada.');
    var bons = h.filter(function (x) { return x.sintoma === 'bom'; }).length;
    if (bons) lista.push('Você já acertou o ponto ' + (bons === 1 ? '1 vez' : bons + ' vezes') + '.');
    var sint = contar(h.filter(function (x) { return x.sintoma !== 'bom'; }), 'sintoma');
    if (sint.n >= 2) { var s = achar(SINTOMAS, sint.id); lista.push('O que mais aparece no seu café: ' + s.adj + ' (' + sint.n + ' vezes). O ajuste que mais ajuda: ' + s.dicas[0].t.toLowerCase() + '.'); }
    var met = contar(h, 'metodo');
    if (n >= 2) lista.push('Seu método mais usado é o ' + achar(METODOS, met.id).nome.toLowerCase() + '.');
    lista.push('Você já registrou ' + rotuloRegistros(n) + '. Cada uma deixa o próximo ajuste mais certeiro.');
    return lista;
  }
  function descobertaDeHoje() {
    var l = descobertas(); if (!l.length) return '';
    var d = new Date(), dia = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5);
    return l[dia % l.length];
  }

  // ---------- Abertura: o ponto passeia pelo mapa ----------
  var PASSEIO = ['amargo', 'bom', 'azedo', 'bom', 'aguado', 'bom', 'forte', 'bom'];
  var passeio = null;
  function legendaPasseio(sid) {
    var s = achar(SINTOMAS, sid);
    return sid === 'bom' ? '<b>No ponto</b>' : '<b>' + s.nome + '</b> · ' + (POSICAO[sid] || {}).rumo.toLowerCase();
  }
  function iniciarPasseio() {
    pararPasseio();
    var svg = app.querySelector('.passeio'), leg = app.querySelector('.legenda-passeio');
    if (!svg || !leg) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var i = 0;
    passeio = setInterval(function () {
      i = (i + 1) % PASSEIO.length;
      var sid = PASSEIO[i], g = svg.querySelector('.viajante'), alvo = svg.getAttribute('data-' + sid);
      if (!g || !alvo) return;
      g.style.transform = alvo;
      g.querySelector('.cara').innerHTML = IC_CARA[sid];
      g.classList.toggle('no-ponto', sid === 'bom');
      leg.innerHTML = cara(sid, 20) + '<span>' + legendaPasseio(sid) + '</span>';
    }, 1700);
  }
  function pararPasseio() { if (passeio) { clearInterval(passeio); passeio = null; } }


  // ---------- Telas ----------
  var telas = {
    abertura: function () {
      return '<section class="tela abertura">' +
        '<span class="marca">' + ic.simbolo(28, 4) + logotipo(28) + '</span>' +
        '<div class="miolo">' +
        '<div class="grupo folgado"><h1 class="titulo">Acerte o café com o que você já tem em casa</h1>' +
        '<p class="corpo">Conte como ficou a xícara e saiba o que mudar amanhã.</p></div>' +
        '<div class="mapa">' + desenhoMapa('amargo', { passeio: true }) +
        '<p class="legenda-passeio">' + cara('amargo', 20) + '<span>' + legendaPasseio('amargo') + '</span></p></div>' +
        '</div>' +
        '<div class="acoes"><a class="btn" href="#/inicio">Começar</a></div>' +
        '</section>';
    },

    inicio: function () {
      var topo = '<div class="linha-topo" style="align-items:center"><span class="marca">' + ic.simbolo(28, 4) + logotipo(28) + '</span><span class="meta">' + data() + '</span></div>';
      var n = estado.historico.length;
      if (!estado.salvo || !n) {
        var passos = [[ic.camera, 'Fotografe o pacote', 'A IA lê origem, torra e notas'], [cara('amargo', 18), 'Conte como ficou', 'Amargo, azedo, aguado ou no ponto'], [ic.paladar, 'Ajuste amanhã', 'Água, moagem e tempo, no seu método']];
        return '<section class="tela"><div class="conteudo com-nav">' + topo +
          '<div class="grupo folgado"><span class="rotulo">Bem-vindo</span><h1 class="titulo">Vamos achar o seu ponto</h1></div>' +
          '<ol class="passos">' + passos.map(function (p) { return '<li><span class="passo-ic">' + p[0] + '</span><span><b>' + p[1] + '</b><small>' + p[2] + '</small></span></li>'; }).join('') + '</ol>' +
          '<a class="btn" href="#/registrar">Registrar o primeiro café</a>' +
          '<p class="nota-metodo">Tudo fica guardado só neste aparelho. Sem cadastro.</p>' +
          '</div>' + nav('inicio') + '</section>';
      }
      var s = achar(SINTOMAS, estado.salvo.sintoma);
      var m = achar(METODOS, estado.salvo.metodo);
      var primeira = s.dicas[0];
      var titulo = s.id === 'bom' ? 'Ontem, no ponto ' + m.curto : 'Ontem, ' + s.adj + ' ' + m.curto;
      var seq = sequencia(), desc = descobertaDeHoje();
      var faltam = Math.max(0, MIN_PALADAR - n);
      return '<section class="tela"><div class="conteudo com-nav">' + topo +
        '<div class="grupo folgado"><span class="rotulo">Sua próxima xícara</span>' +
        '<div style="display:flex;gap:16px;align-items:flex-start;justify-content:space-between"><h1 class="titulo">' + titulo + '</h1>' + desenhoMapa(s.id, { mini: true }) + '</div>' +
        '<p class="corpo">Hoje, ' + primeira.t.charAt(0).toLowerCase() + primeira.t.slice(1) + '.</p></div>' +
        ficha([['Temperatura', s.receita.temp, '°C', true], ['Proporção', s.receita.cafe + ' g', '· ' + s.receita.agua + ' ml']]) +
        '<a class="btn" href="#/registrar">Registrar o café de hoje</a>' +
        '<div class="grupo">' +
        (seq.dias ? '<div class="cartao sequencia"><span class="seq-num">' + seq.dias + '</span><span><b>' + (seq.dias === 1 ? 'dia' : 'dias seguidos') + ' registrando</b><small>' + (seq.hoje ? 'Sequência em dia. Até amanhã!' : 'Registre hoje para manter a sequência') + '</small></span></div>' : '') +
        (desc ? '<div class="cartao"><span class="meta">Descoberta de hoje</span><p class="corpo" style="color:var(--texto)">' + desc + '</p></div>' : '') +
        (faltam ? '<a class="cartao" href="#/paladar"><div class="linha-topo"><span class="cartao-titulo">Seu paladar</span><span class="meta num">' + n + ' de ' + MIN_PALADAR + '</span></div><p class="corpo menor">Faltam ' + (faltam === 1 ? '1 xícara' : faltam + ' xícaras') + ' para ver os seus padrões.</p></a>' : '') +
        '</div>' +
        '</div>' + nav('inicio') + '</section>';
    },

    registrar: function () {
      var chipsM = METODOS.map(function (m) {
        return '<button type="button" class="metodo" data-acao="metodo" data-id="' + m.id + '" aria-pressed="' + (estado.metodo === m.id) + '" aria-label="' + m.nome + '">' + icone(IC_METODO[m.id], 32) + '<span>' + m.rotulo + '</span></button>';
      }).join('');
      var chipsS = SINTOMAS.map(function (s) {
        return '<button type="button" class="sintoma" data-acao="sintoma" data-id="' + s.id + '" aria-pressed="' + (estado.sintoma === s.id) + '">' + cara(s.id, 28) + '<span><b>' + s.nome + '</b><small>' + s.dica + '</small></span></button>';
      }).join('');
      var pontos = [1, 2, 3, 4, 5].map(function (n) {
        var cheio = n <= estado.nota;
        return '<button type="button" data-acao="nota" data-id="' + n + '" aria-label="Nota ' + n + ' de 5" aria-pressed="' + (estado.nota === n) + '"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7" stroke="' + (cheio ? '#b8926a' : '#8a847a') + '" stroke-width="1.5" fill="' + (cheio ? '#b8926a' : 'none') + '"/></svg></button>';
      }).join('');
      var pronto = !!estado.sintoma;
      return '<section class="tela"><div class="conteudo">' +
        cabecalho('#/inicio', 'Nova xícara') +
        '<h1 class="titulo">Como foi o café de hoje?</h1>' +
        cartaoCafe() +
        '<div class="grupo"><span class="rotulo" id="r-metodo">Método</span><div class="metodos" role="group" aria-labelledby="r-metodo">' + chipsM + '</div></div>' +
        blocoPartida(estado.cafe, achar(METODOS, estado.metodo)) +
        '<div class="grupo"><span class="rotulo" id="r-sintoma">Como ficou na boca</span><div class="grade-2" role="group" aria-labelledby="r-sintoma">' + chipsS + '</div></div>' +
        '<div class="linha-topo" style="align-items:center"><span class="rotulo" id="r-nota">Nota</span><div class="pontos" role="group" aria-labelledby="r-nota">' + pontos + '</div></div>' +
        (pronto ? '<a class="btn" href="#/ajuste" style="margin-top:auto">Ver como melhorar</a>'
          : '<button type="button" class="btn" disabled style="margin-top:auto">Escolha como ficou na boca</button>') +
        '</div></section>';
    },

    ajuste: function () {
      var s = achar(SINTOMAS, estado.sintoma);
      var m = achar(METODOS, estado.metodo);
      var dicas = s.dicas.map(function (d, i) {
        var aberta = estado.dica === i;
        return '<div class="dica' + (aberta ? ' aberta' : '') + '">' +
          '<button type="button" data-acao="dica" data-id="' + i + '" aria-expanded="' + aberta + '"><span class="n">' + (i + 1) + '</span><span><strong>' + d.t + '</strong><span class="corpo">' + d.d + '</span></span></button>' +
          (aberta ? cartaoProduto(d.p) : '') +
          '</div>';
      }).join('');
      var r = s.receita;
      return '<section class="tela"><div class="conteudo">' +
        cabecalho('#/registrar', s.nome + ' no ' + m.nome.charAt(0).toLowerCase() + m.nome.slice(1)) +
        '<div class="grupo folgado"><h1 class="titulo">' + s.titulo + '</h1><p class="corpo">' + s.texto + '</p></div>' +
        mapa(s.id) +
        '<div class="grupo"><span class="rotulo">Ajustes para amanhã</span><div class="dicas">' + dicas + '</div></div>' +
        (estado.retorno && estado.retorno.metodo === estado.metodo && estado.retorno.dica
          ? '<div class="cartao"><span class="meta">Sobre ' + esc(estado.cafe.nome || 'este café') + '</span><p class="corpo menor">' + esc(estado.retorno.dica) + '</p></div>'
          : '') +
        '<div class="grupo folgado"><span class="rotulo">Receita para amanhã</span>' +
        ficha([['Temperatura', r.temp, '°C · ' + s.rotTemp, ['amargo', 'azedo', 'seco'].indexOf(s.id) > -1], ['Café', r.cafe, 'g', ['aguado', 'forte'].indexOf(s.id) > -1], ['Água', r.agua, 'ml'], ['Tempo', r.tempo, 'min']]) +
        '<p class="nota-metodo">' + m.nota + ' Sem balança? Uma colher de sopa cheia tem cerca de 7 g.</p></div>' +
        '<div class="grupo"><button type="button" class="btn" data-acao="salvar">Salvar e lembrar amanhã</button>' +
        '<button type="button" class="btn secundario" data-acao="compartilhar">' + ic.compartilhar + 'Compartilhar o cartão</button></div>' +
        '</div><div class="aviso" id="aviso" role="status"></div></section>';
    },

    paladar: function () {
      var h = estado.historico, n = h.length, faltam = Math.max(0, MIN_PALADAR - n);
      if (faltam) {
        var bolinhas = [];
        for (var i = 1; i <= MIN_PALADAR; i++) bolinhas.push('<span class="pt' + (i <= n ? ' cheio' : '') + '"></span>');
        return '<section class="tela"><div class="conteudo com-nav">' +
          '<div class="grupo folgado"><span class="rotulo">Seu paladar</span><h1 class="titulo">Faltam ' + (faltam === 1 ? '1 xícara' : faltam + ' xícaras') + '</h1>' +
          '<p class="corpo">Com ' + MIN_PALADAR + ' xícaras registradas, o Ponto mostra o que mais acontece no seu café e o que funciona para você.</p></div>' +
          '<div class="progresso" role="img" aria-label="' + n + ' de ' + MIN_PALADAR + ' xícaras">' + bolinhas.join('') + '</div>' +
          '<a class="btn" href="#/registrar">Registrar uma xícara</a>' +
          '</div>' + nav('paladar') + '</section>';
      }
      var media = h.reduce(function (t, x) { return t + (x.nota || 0); }, 0) / n;
      var met = contar(h, 'metodo'), bons = h.filter(function (x) { return x.sintoma === 'bom'; }).length;
      var sint = contar(h.filter(function (x) { return x.sintoma !== 'bom'; }), 'sintoma');
      var titulo = sint.id && sint.n >= Math.max(2, bons)
        ? 'Seu café costuma sair ' + achar(SINTOMAS, sint.id).adj
        : 'Você já acerta o ponto ' + achar(METODOS, met.id).curto;
      var lista = descobertas().map(function (d) { return '<li>' + d + '</li>'; }).join('');
      return '<section class="tela"><div class="conteudo com-nav">' +
        '<div class="grupo folgado"><span class="rotulo">Seu paladar · ' + rotuloRegistros(n) + '</span><h1 class="titulo">' + titulo + '</h1></div>' +
        ficha([['Nota média', media.toFixed(1).replace('.', ','), 'de 5', true], ['No ponto', bons, bons === 1 ? 'vez' : 'vezes'], ['Método', achar(METODOS, met.id).rotulo, ''], ['Xícaras', n, '']]) +
        '<div class="grupo"><span class="rotulo">O que o Ponto percebeu</span><ul class="percebido">' + lista + '</ul></div>' +
        '<div class="grupo folgado"><span class="rotulo">Seu próximo degrau</span>' + degrau() + '</div>' +
        '<a class="btn secundario" href="#/historico">Ver minhas xícaras</a>' +
        '</div>' + nav('paladar') + '</section>';
    },

    confirmar: function () {
      var r = sessao.rascunho || { cafe: copia(CAFE_VAZIO), origem: 'manual' };
      var c = r.cafe;
      var porFoto = r.origem === 'foto';
      var conf = { alta: 'Rótulo bem legível', media: 'Leitura parcial, confira', baixa: 'Leitura difícil, confira com atenção' };
      var topo = porFoto
        ? '<h1 class="titulo">Foi isso que li no rótulo</h1><p class="corpo">' + esc(conf[r.confianca] || conf.baixa) + '. Corrija o que estiver errado.</p>'
        : '<h1 class="titulo">Conte qual café você tomou</h1><p class="corpo">' + (r.erro ? esc(r.erro) + ' ' : '') + 'Preencha só o que souber.</p>';
      var retorno = porFoto && (r.resumo || r.dica)
        ? '<div class="cartao"><span class="meta">O que esperar</span>' +
          (r.resumo ? '<p class="corpo" style="color:var(--texto)">' + esc(r.resumo) + '</p>' : '') +
          (r.dica ? '<p class="corpo menor">' + esc(r.dica) + '</p>' : '') + '</div>'
        : '';
      var foto = porFoto && sessao.foto ? '<img class="foto-lida" src="' + sessao.foto + '" alt="Foto do pacote enviada">' : '';
      return '<section class="tela"><form class="conteudo" id="form-cafe" novalidate>' +
        cabecalho('#/registrar', porFoto ? 'Confira os dados' : 'Preenchimento manual') +
        '<div style="display:flex;gap:16px;align-items:flex-start">' + foto + '<div class="grupo folgado" style="flex:1;min-width:0">' + topo + '</div></div>' +
        retorno +
        '<div class="grupo folgado">' +
        campo('nome', 'Nome do café ou lote', c.nome, 'Sítio Boa Vista') +
        campo('torrefacao', 'Torrefação ou marca', c.torrefacao, 'Torrefação do bairro') +
        '<div class="grade-2" style="gap:12px">' + campo('regiao', 'Região', c.regiao, 'Sul de Minas') + campo('variedade', 'Variedade', c.variedade, 'Catuaí') + '</div>' +
        '<div class="grade-2" style="gap:12px">' + seletor('processo', 'Processo', c.processo, PROCESSOS) + seletor('torra', 'Torra', c.torra, TORRAS) + '</div>' +
        campo('notas', 'Notas do rótulo', (c.notas || []).join(', '), 'chocolate, caramelo') +
        '</div>' +
        '<div class="grupo">' +
        '<button type="submit" class="btn">Usar este café</button>' +
        '<button type="button" class="btn secundario" data-acao="foto">' + ic.camera + (porFoto ? 'Tirar outra foto' : 'Fotografar o pacote') + '</button>' +
        '</div>' +
        (porFoto && r.registrado ? '<p class="nota-metodo">Para melhorar a leitura, guardamos de forma anônima o que foi lido e o que você corrigiu. A foto não é guardada.</p>' : '') +
        '</form><div class="aviso" id="aviso" role="status"></div></section>';
    },

    historico: function () {
      var lista = estado.historico;
      var itens = lista.map(function (h) {
        var m = achar(METODOS, h.metodo), s = achar(SINTOMAS, h.sintoma);
        var pontos = [1, 2, 3, 4, 5].map(function (n) {
          return '<span class="pt' + (n <= h.nota ? ' cheio' : '') + '"></span>';
        }).join('');
        var origem = { foto: 'Lido da foto', manual: 'Informado', exemplo: 'Exemplo' }[h.cafe && h.cafe.origem] || 'Informado';
        var detalhe = linhaCafe(h.cafe || {});
        return '<li class="registro">' +
          '<div class="linha-topo"><span class="meta">' + dataCurta(h.quando) + '</span><span class="meta">' + origem + '</span></div>' +
          '<span class="cartao-titulo">' + esc(nomeCafe(h.cafe)) + '</span>' +
          (detalhe ? '<span class="meta">' + detalhe + '</span>' : '') +
          '<div class="linha-topo" style="align-items:center;margin-top:4px"><span class="corpo menor">' + esc(m.nome) + ' · ' + esc(s.nome.toLowerCase()) + '</span>' +
          '<span class="mini-pontos" role="img" aria-label="Nota ' + h.nota + ' de 5">' + pontos + '</span></div>' +
          '</li>';
      }).join('');
      var vazio = '<div class="cartao"><p class="corpo menor">Nenhuma xícara registrada ainda. Registre o café de hoje e toque em Salvar e lembrar amanhã.</p></div>' +
        '<a class="btn" href="#/registrar">Registrar o café de hoje</a>';
      var apagar = lista.length
        ? '<button type="button" class="link" data-acao="apagar-historico">' + (sessao.apagar ? 'Toque de novo para apagar tudo' : 'Apagar o histórico deste aparelho') + '</button>'
        : '';
      return '<section class="tela"><div class="conteudo com-nav">' +
        cabecalho('#/inicio', rotuloRegistros(lista.length)) +
        '<div class="grupo"><h1 class="titulo">Minhas xícaras</h1><span class="meta">Guardadas só neste aparelho</span></div>' +
        (lista.length ? '<ul class="registros">' + itens + '</ul>' : vazio) +
        apagar +
        '</div>' + nav('historico') + '</section>';
    },

    comunidade: function () {
      return '<section class="tela"><div class="conteudo com-nav">' +
        '<div class="grupo folgado"><span class="rotulo">Em breve</span><h1 class="titulo">Comunidade</h1>' +
        '<p class="corpo">Aqui você vai ver as dicas de quem usa o mesmo método e tomou o mesmo café que você.</p></div>' +
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
    if (r === 'ajuste' && !estado.sintoma) { location.replace('#/registrar'); return; }
    pararPasseio();
    app.innerHTML = telas[r]();
    if (r === 'abertura') iniciarPasseio();
    var nova = app.querySelector('.tela');
    if (nova) nova.scrollTop = y;
    var titulos = { abertura: 'Ponto — Encontre o seu ponto', inicio: 'Início · Ponto', registrar: 'Registrar · Ponto', ajuste: 'Ajuste · Ponto', paladar: 'Meu paladar · Ponto', confirmar: 'Confira os dados · Ponto', historico: 'Minhas xícaras · Ponto', comunidade: 'Comunidade · Ponto' };
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
    else if (acao === 'apagar-historico') {
      if (!sessao.apagar) { sessao.apagar = true; render(true); return; }
      sessao.apagar = false;
      estado.historico = [];
    }
    else if (acao === 'foto') { if (!sessao.lendo) document.getElementById('foto-input').click(); return; }
    else if (acao === 'manual') {
      var base = estado.cafe && estado.cafe.origem !== 'exemplo' ? copia(estado.cafe) : copia(CAFE_VAZIO);
      sessao.rascunho = { cafe: base, origem: 'manual' };
      if (rota() === 'confirmar') render(false); else location.hash = '#/confirmar';
      return;
    }
    else if (acao === 'compartilhar') { compartilhar(); return; }
    else if (acao === 'loja') { ev.preventDefault(); avisar('Link do parceiro ainda não configurado.'); return; }
    else if (acao === 'salvar') {
      estado.salvo = { metodo: estado.metodo, sintoma: estado.sintoma };
      estado.xicaras += 1;
      var c = estado.cafe || copia(CAFE_VAZIO);
      estado.historico.unshift({
        quando: new Date().toISOString(),
        cafe: { nome: c.nome, torrefacao: c.torrefacao, regiao: c.regiao, variedade: c.variedade, processo: c.processo, torra: c.torra, notas: c.notas || [], origem: c.origem || 'manual' },
        metodo: estado.metodo, sintoma: estado.sintoma, nota: estado.nota
      });
      estado.historico = estado.historico.slice(0, MAX_HISTORICO);
      estado.sintoma = null; estado.nota = 0; estado.dica = 0;
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
      sessao.rascunho = { cafe: dados.cafe, origem: 'foto', confianca: dados.confianca, resumo: dados.resumo, dica: dados.dica, leitura_id: dados.leitura_id || null, registrado: dados.registrado === true };
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
    if (r.origem === 'foto' && r.leitura_id) {
      // Registro anônimo: o que a IA leu × o que a pessoa confirmou. Falhas são ignoradas.
      try {
        fetch('/api/confirmar-leitura', {
          method: 'POST',
          keepalive: true,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: r.leitura_id, metodo: estado.metodo, lida: r.cafe, final: estado.cafe })
        }).catch(function () {});
      } catch (e) { /* ignora */ }
      r.leitura_id = null;
    }
    location.hash = '#/registrar';
  });

  window.addEventListener('hashchange', function () {
    sessao.apagar = false; render(false);
    // Visitas anônimas (Vercel Web Analytics): cada tela do app conta como uma página
    try { if (window.va) window.va('pageview', { route: '/app/' + rota(), path: '/app/' + rota() }); } catch (e) { /* ignora */ }
  });
  render(false);

  fetch('produtos.json', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : {}; })
    .then(function (d) { produtos = (d && d.produtos) || {}; render(true); })
    .catch(function () { /* sem produtos: os cartões aparecem como "Em breve" */ });
})();
