// Ponto — lê a foto do pacote de café e devolve os dados + um retorno curto.
// Roda como função da Vercel. A chave fica na variável de ambiente ANTHROPIC_API_KEY.
// Se houver um Blob conectado, guarda um registro anônimo da leitura (sem a foto).

const crypto = require('node:crypto');
const reg = require('../lib/registro.js');

const MODELO = process.env.CLAUDE_MODEL || 'claude-haiku-5-5';
const TIPOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_BASE64 = 4 * 1024 * 1024; // ~3 MB de imagem; o app já envia bem menos

const METODOS = {
  pano: 'coador de pano',
  papel: 'filtro de papel',
  italiana: 'cafeteira italiana (moka)',
  prensa: 'prensa francesa',
  eletrica: 'cafeteira elétrica'
};

// Proteção básica por IP; o teto de gastos no Claude Console é a proteção de verdade.
const permitido = reg.limitador(Number(process.env.LIMITE_FOTOS_HORA || 20));

function prompt(metodo) {
  return [
    'Você é o assistente do Ponto, um app que ajuda iniciantes a entender e preparar café.',
    'A imagem deve ser a foto de um pacote ou rótulo de café. Leia SOMENTE o que estiver escrito ou claramente visível. Não invente dados: use null quando algo não aparecer.',
    'O usuário prepara o café em: ' + metodo + '.',
    'Registre o resultado chamando a ferramenta registrar_rotulo.',
    'Escreva resumo e dica em português do Brasil, sem jargão, com no máximo 160 caracteres cada.',
    'Se a foto não for de um pacote ou rótulo de café, use eh_cafe = false, deixe os outros campos como null e notas como [].'
  ].join('\n');
}

const TEXTO_OU_NULO = { type: ['string', 'null'] };
function ferramenta(metodo) {
  return {
    name: 'registrar_rotulo',
    description: 'Registra os dados lidos no rótulo do café e um retorno curto para o usuário.',
    input_schema: {
      type: 'object',
      properties: {
        eh_cafe: { type: 'boolean', description: 'A foto é de um pacote ou rótulo de café?' },
        nome: Object.assign({ description: 'Nome do café ou do lote' }, TEXTO_OU_NULO),
        torrefacao: Object.assign({ description: 'Marca ou torrefação' }, TEXTO_OU_NULO),
        produtor: Object.assign({ description: 'Fazenda, sítio ou produtor' }, TEXTO_OU_NULO),
        regiao: Object.assign({ description: 'Região de origem, ex.: Cerrado Mineiro, Sul de Minas' }, TEXTO_OU_NULO),
        variedade: Object.assign({ description: 'Variedade, ex.: Catuaí Amarelo' }, TEXTO_OU_NULO),
        processo: { type: ['string', 'null'], enum: reg.PROCESSOS.concat([null]) },
        torra: { type: ['string', 'null'], enum: reg.TORRAS.concat([null]) },
        pontuacao_sca: { type: ['number', 'null'], description: 'Pontuação SCA, se estiver no rótulo' },
        notas: { type: 'array', items: { type: 'string' }, maxItems: 5, description: 'Notas sensoriais escritas no rótulo, em minúsculas' },
        confianca: { type: 'string', enum: ['alta', 'media', 'baixa'], description: 'Quão legível estava o rótulo' },
        resumo: Object.assign({ description: 'Uma frase simples, para iniciante, sobre o que esperar deste café na xícara' }, TEXTO_OU_NULO),
        dica: Object.assign({ description: 'Dica prática e curta para preparar este café no ' + metodo + ', com equipamento caseiro' }, TEXTO_OU_NULO)
      },
      required: ['eh_cafe', 'nome', 'torrefacao', 'produtor', 'regiao', 'variedade', 'processo', 'torra', 'pontuacao_sca', 'notas', 'confianca', 'resumo', 'dica']
    }
  };
}

function extrairJSON(t) {
  const ini = t.indexOf('{');
  const fim = t.lastIndexOf('}');
  if (ini < 0 || fim <= ini) throw new Error('sem JSON');
  return JSON.parse(t.slice(ini, fim + 1));
}

function limpar(d) {
  return {
    eh_cafe: d.eh_cafe !== false,
    confianca: ['alta', 'media', 'baixa'].includes(d.confianca) ? d.confianca : 'baixa',
    cafe: reg.limparCafe(d),
    resumo: reg.texto(d.resumo, 200),
    dica: reg.texto(d.dica, 200)
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

  if (!permitido(reg.ipDe(req))) {
    return res.status(429).json({ erro: 'limite', mensagem: 'Muitas fotos em pouco tempo. Tente de novo mais tarde ou preencha à mão.' });
  }

  const corpo = reg.corpoJSON(req);
  const imagem = corpo && corpo.imagem;
  const tipo = corpo && corpo.media_type;
  if (typeof imagem !== 'string' || !imagem || imagem.length > MAX_BASE64 || !TIPOS.includes(tipo)) {
    return res.status(400).json({ erro: 'imagem', mensagem: 'Não consegui ler essa imagem. Tente outra foto.' });
  }
  const chaveMetodo = reg.metodo(corpo.metodo) || 'pano';
  const metodo = METODOS[chaveMetodo];

  const id = crypto.randomUUID();
  const base = { metodo: chaveMetodo, modelo: MODELO };
  // Registra o desfecho de cada tentativa (sem a foto). Não bloqueia a resposta se falhar.
  const registrar = (resultado, extra) => reg.gravar('leituras', id, Object.assign({ resultado: resultado }, base, extra || {}));

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
        max_tokens: 1024,
        tools: [ferramenta(metodo)],
        tool_choice: { type: 'tool', name: 'registrar_rotulo' },
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
      await registrar('erro_api', { status: resp.status });
      const mensagem = resp.status === 401
        ? 'A chave da API não foi aceita. Confira a variável ANTHROPIC_API_KEY na Vercel.'
        : 'O serviço de leitura não respondeu agora. Tente de novo ou preencha à mão.';
      return res.status(502).json({ erro: 'api', mensagem: mensagem });
    }

    const dados = await resp.json();
    const blocos = dados.content || [];
    const uso = blocos.find((b) => b.type === 'tool_use' && b.name === 'registrar_rotulo');
    const saida = blocos.filter((b) => b.type === 'text').map((b) => b.text).join('');
    let resultado;
    try {
      // Caminho normal: a ferramenta devolve um objeto já estruturado. Texto com JSON é só um plano B.
      resultado = limpar(uso && uso.input && typeof uso.input === 'object' ? uso.input : extrairJSON(saida));
    } catch (e) {
      const amostra = (saida || JSON.stringify(blocos)).slice(0, 800);
      console.error('Resposta fora do formato:', dados.stop_reason, amostra);
      await registrar('erro_formato', { stop_reason: dados.stop_reason || null, amostra: amostra });
      return res.status(502).json({ erro: 'formato', mensagem: 'Não consegui entender o rótulo. Tente outra foto ou preencha à mão.' });
    }

    if (!resultado.eh_cafe) {
      await registrar('nao_cafe');
      return res.status(422).json({ erro: 'nao_cafe', mensagem: 'Essa foto não parece ser de um pacote de café. Tente enquadrar o rótulo.' });
    }

    const registrado = await registrar('ok', {
      confianca: resultado.confianca,
      lida: resultado.cafe,
      resumo: resultado.resumo,
      dica: resultado.dica
    });
    return res.status(200).json(Object.assign(resultado, registrado ? { leitura_id: id, registrado: true } : { registrado: false }));
  } catch (e) {
    const demorou = e.name === 'AbortError';
    console.error('Falha ao identificar:', e.message);
    await registrar(demorou ? 'erro_tempo' : 'erro_falha');
    const mensagem = demorou
      ? 'A leitura demorou demais. Tente de novo com uma foto mais nítida.'
      : 'Não foi possível ler a foto agora. Tente de novo ou preencha à mão.';
    return res.status(502).json({ erro: 'falha', mensagem: mensagem });
  } finally {
    clearTimeout(tempo);
  }
};
