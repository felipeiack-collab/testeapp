// Ponto — lê a foto do pacote de café e devolve os dados + um retorno curto.
// Roda como função da Vercel. A chave fica na variável de ambiente ANTHROPIC_API_KEY.

const MODELO = process.env.CLAUDE_MODEL || 'claude-haiku-5-5';
const TIPOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_BASE64 = 4 * 1024 * 1024; // ~3 MB de imagem; o app já envia bem menos
const LIMITE_POR_HORA = Number(process.env.LIMITE_FOTOS_HORA || 20);

const METODOS = {
  pano: 'coador de pano',
  papel: 'filtro de papel',
  italiana: 'cafeteira italiana (moka)',
  prensa: 'prensa francesa',
  eletrica: 'cafeteira elétrica'
};

const PROCESSOS = ['natural', 'lavado', 'cereja descascado', 'honey', 'fermentado'];
const TORRAS = ['clara', 'média', 'média-escura', 'escura'];

// Limite simples por IP. Em funções serverless ele vale por instância, então é uma
// proteção básica; o teto de gastos no Claude Console é a proteção de verdade.
const usos = new Map();
function permitido(ip) {
  const agora = Date.now();
  const lista = (usos.get(ip) || []).filter((t) => agora - t < 3600000);
  if (lista.length >= LIMITE_POR_HORA) { usos.set(ip, lista); return false; }
  lista.push(agora);
  usos.set(ip, lista);
  return true;
}

function texto(v, max) {
  if (typeof v !== 'string') return null;
  const t = v.replace(/\s+/g, ' ').trim();
  return t ? t.slice(0, max || 80) : null;
}

function prompt(metodo) {
  return [
    'Você é o assistente do Ponto, um app que ajuda iniciantes a entender e preparar café.',
    'A imagem deve ser a foto de um pacote ou rótulo de café. Leia SOMENTE o que estiver escrito ou claramente visível. Não invente dados: use null quando algo não aparecer.',
    'O usuário prepara o café em: ' + metodo + '.',
    'Responda apenas com um objeto JSON, sem texto antes ou depois, neste formato:',
    '{',
    '  "eh_cafe": true ou false (a foto é de um pacote/rótulo de café?),',
    '  "nome": nome do café ou do lote, ou null,',
    '  "torrefacao": marca ou torrefação, ou null,',
    '  "produtor": fazenda, sítio ou produtor, ou null,',
    '  "regiao": região de origem (ex.: Cerrado Mineiro, Sul de Minas), ou null,',
    '  "variedade": variedade do café (ex.: Catuaí Amarelo), ou null,',
    '  "processo": um de ' + JSON.stringify(PROCESSOS) + ' ou null,',
    '  "torra": um de ' + JSON.stringify(TORRAS) + ' ou null,',
    '  "pontuacao_sca": número se estiver no rótulo, ou null,',
    '  "notas": lista de até 5 notas sensoriais escritas no rótulo, em minúsculas,',
    '  "confianca": "alta", "media" ou "baixa" (quão legível estava o rótulo),',
    '  "resumo": uma frase simples, para iniciante, sobre o que esperar deste café na xícara, baseada no rótulo,',
    '  "dica": uma dica prática e curta para preparar ESTE café no ' + metodo + ', com equipamento caseiro',
    '}',
    'Escreva resumo e dica em português do Brasil, sem jargão, com no máximo 160 caracteres cada. Se eh_cafe for false, deixe os outros campos como null e notas como [].'
  ].join('\n');
}

function extrairJSON(t) {
  const ini = t.indexOf('{');
  const fim = t.lastIndexOf('}');
  if (ini < 0 || fim <= ini) throw new Error('sem JSON');
  return JSON.parse(t.slice(ini, fim + 1));
}

function limpar(d) {
  const processo = PROCESSOS.includes(d.processo) ? d.processo : null;
  const torra = TORRAS.includes(d.torra) ? d.torra : null;
  const sca = Number(d.pontuacao_sca);
  return {
    eh_cafe: d.eh_cafe !== false,
    confianca: ['alta', 'media', 'baixa'].includes(d.confianca) ? d.confianca : 'baixa',
    cafe: {
      nome: texto(d.nome),
      torrefacao: texto(d.torrefacao),
      produtor: texto(d.produtor),
      regiao: texto(d.regiao),
      variedade: texto(d.variedade),
      processo: processo,
      torra: torra,
      pontuacao_sca: sca >= 60 && sca <= 100 ? sca : null,
      notas: Array.isArray(d.notas) ? d.notas.map((n) => texto(n, 30)).filter(Boolean).map((n) => n.toLowerCase()).slice(0, 5) : []
    },
    resumo: texto(d.resumo, 200),
    dica: texto(d.dica, 200)
  };
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ erro: 'metodo', mensagem: 'Use POST.' });
  }

  const chave = process.env.ANTHROPIC_API_KEY;
  if (!chave) {
    return res.status(503).json({ erro: 'sem_chave', mensagem: 'A leitura por foto ainda não está configurada.' });
  }

  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'anon').split(',')[0].trim();
  if (!permitido(ip)) {
    return res.status(429).json({ erro: 'limite', mensagem: 'Muitas fotos em pouco tempo. Tente de novo mais tarde ou preencha à mão.' });
  }

  let corpo = req.body;
  if (typeof corpo === 'string') { try { corpo = JSON.parse(corpo); } catch (e) { corpo = null; } }
  const imagem = corpo && corpo.imagem;
  const tipo = corpo && corpo.media_type;
  if (typeof imagem !== 'string' || !imagem || imagem.length > MAX_BASE64 || !TIPOS.includes(tipo)) {
    return res.status(400).json({ erro: 'imagem', mensagem: 'Não consegui ler essa imagem. Tente outra foto.' });
  }
  const metodo = METODOS[corpo.metodo] || METODOS.pano;

  const controle = new AbortController();
  const tempo = setTimeout(() => controle.abort(), 30000);

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: controle.signal,
      headers: {
        'x-api-key': chave,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: MODELO,
        max_tokens: 700,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: tipo, data: imagem } },
            { type: 'text', text: prompt(metodo) }
          ]
        }]
      })
    });

    if (!resp.ok) {
      const detalhe = await resp.text().catch(() => '');
      console.error('Claude API', resp.status, detalhe.slice(0, 500));
      const mensagem = resp.status === 401
        ? 'A chave da API não foi aceita. Confira a variável ANTHROPIC_API_KEY na Vercel.'
        : 'O serviço de leitura não respondeu agora. Tente de novo ou preencha à mão.';
      return res.status(502).json({ erro: 'api', mensagem: mensagem });
    }

    const dados = await resp.json();
    const saida = (dados.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');
    let resultado;
    try {
      resultado = limpar(extrairJSON(saida));
    } catch (e) {
      console.error('Resposta sem JSON válido:', saida.slice(0, 500));
      return res.status(502).json({ erro: 'formato', mensagem: 'Não consegui entender o rótulo. Tente outra foto ou preencha à mão.' });
    }

    if (!resultado.eh_cafe) {
      return res.status(422).json({ erro: 'nao_cafe', mensagem: 'Essa foto não parece ser de um pacote de café. Tente enquadrar o rótulo.' });
    }
    return res.status(200).json(resultado);
  } catch (e) {
    const mensagem = e.name === 'AbortError'
      ? 'A leitura demorou demais. Tente de novo com uma foto mais nítida.'
      : 'Não foi possível ler a foto agora. Tente de novo ou preencha à mão.';
    console.error('Falha ao identificar:', e.message);
    return res.status(502).json({ erro: 'falha', mensagem: mensagem });
  } finally {
    clearTimeout(tempo);
  }
};
