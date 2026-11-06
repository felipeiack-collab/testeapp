// Ponto — registro anônimo das leituras de rótulo, guardado num Blob privado da Vercel.
// Nada aqui guarda a foto, o IP ou qualquer dado que identifique a pessoa.
// Sem um Blob conectado ao projeto, as funções simplesmente não gravam nada.

const PREFIXO = 'ponto/';
const PROCESSOS = ['natural', 'lavado', 'cereja descascado', 'honey', 'fermentado'];
const TORRAS = ['clara', 'média-clara', 'média', 'média-escura', 'escura'];
const CAMPOS = ['nome', 'torrefacao', 'produtor', 'regiao', 'variedade', 'processo', 'torra', 'notas'];
const METODOS = ['pano', 'papel', 'italiana', 'prensa', 'eletrica'];

let sdk = null;
async function blob() {
  if (!sdk) sdk = await import('@vercel/blob');
  return sdk;
}

function configurado() {
  // Ao conectar um Blob ao projeto, a Vercel cria BLOB_STORE_ID (e autentica por OIDC).
  // BLOB_READ_WRITE_TOKEN cobre lojas conectadas do jeito antigo.
  return Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);
}

function texto(v, max) {
  if (typeof v !== 'string') return null;
  const t = v.replace(/\s+/g, ' ').trim();
  return t ? t.slice(0, max || 80) : null;
}

function limparCafe(c) {
  c = c && typeof c === 'object' ? c : {};
  const sca = Number(c.pontuacao_sca);
  return {
    nome: texto(c.nome),
    torrefacao: texto(c.torrefacao),
    produtor: texto(c.produtor),
    regiao: texto(c.regiao),
    variedade: texto(c.variedade),
    processo: PROCESSOS.includes(c.processo) ? c.processo : null,
    torra: TORRAS.includes(c.torra) ? c.torra : null,
    pontuacao_sca: sca >= 60 && sca <= 100 ? sca : null,
    notas: Array.isArray(c.notas)
      ? c.notas.map((n) => texto(n, 30)).filter(Boolean).map((n) => n.toLowerCase()).slice(0, 5)
      : []
  };
}

function metodo(m) {
  return METODOS.includes(m) ? m : null;
}

function normal(v) {
  if (Array.isArray(v)) return v.map((n) => String(n).trim().toLowerCase()).sort().join(',');
  return v == null ? '' : String(v).trim().toLowerCase();
}

// Compara o que a IA leu com o que a pessoa confirmou, campo a campo.
function comparar(lida, final) {
  const saida = {};
  CAMPOS.forEach((campo) => {
    const a = normal(lida[campo]);
    const b = normal(final[campo]);
    if (a === b) saida[campo] = a ? 'igual' : 'vazio';
    else if (!a) saida[campo] = 'adicionado';
    else if (!b) saida[campo] = 'removido';
    else saida[campo] = 'corrigido';
  });
  return saida;
}

const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
function idValido(id) {
  return typeof id === 'string' && ID.test(id);
}

async function gravar(tipo, id, dados) {
  if (!configurado()) return false;
  try {
    const { put } = await blob();
    const agora = new Date();
    const caminho = PREFIXO + tipo + '/' + agora.toISOString().slice(0, 10) + '/' + id + '.json';
    const conteudo = Object.assign({ id: id, tipo: tipo, quando: agora.toISOString() }, dados);
    await put(caminho, JSON.stringify(conteudo), {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false
    });
    return true;
  } catch (e) {
    console.error('Falha ao gravar registro (' + tipo + '):', e && e.message);
    return false;
  }
}

async function listar(tipo, max) {
  const { list, get } = await blob();
  let cursor;
  let blobs = [];
  do {
    const r = await list({ prefix: PREFIXO + tipo + '/', cursor: cursor, limit: 1000 });
    blobs = blobs.concat(r.blobs || []);
    cursor = r.hasMore ? r.cursor : undefined;
  } while (cursor && blobs.length < 5000);

  blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  blobs = blobs.slice(0, max);

  const saida = [];
  for (let i = 0; i < blobs.length; i += 10) {
    const lote = await Promise.all(blobs.slice(i, i + 10).map(async (b) => {
      try {
        const r = await get(b.pathname, { access: 'private' });
        if (!r || r.statusCode !== 200) return null;
        return JSON.parse(await new Response(r.stream).text());
      } catch (e) {
        return null;
      }
    }));
    lote.forEach((x) => { if (x) saida.push(x); });
  }
  return saida;
}

// Limite simples por IP, em memória (vale por instância da função).
function limitador(porHora) {
  const usos = new Map();
  return function permitido(ip) {
    const agora = Date.now();
    const lista = (usos.get(ip) || []).filter((t) => agora - t < 3600000);
    if (lista.length >= porHora) { usos.set(ip, lista); return false; }
    lista.push(agora);
    usos.set(ip, lista);
    return true;
  };
}

function ipDe(req) {
  return String((req.headers && req.headers['x-forwarded-for']) || (req.socket && req.socket.remoteAddress) || 'anon').split(',')[0].trim();
}

function corpoJSON(req) {
  let corpo = req.body;
  if (typeof corpo === 'string') { try { corpo = JSON.parse(corpo); } catch (e) { corpo = null; } }
  return corpo && typeof corpo === 'object' ? corpo : null;
}

module.exports = {
  CAMPOS, PROCESSOS, TORRAS,
  configurado, limparCafe, metodo, comparar, idValido, gravar, listar, limitador, ipDe, corpoJSON, texto,
  _definirSdk: (s) => { sdk = s; } // usado só nos testes
};
