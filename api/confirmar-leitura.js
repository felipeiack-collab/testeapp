// Ponto — registra, de forma anônima, como a pessoa confirmou ou corrigiu uma leitura de rótulo.
// Serve para medir quantas vezes a IA acerta cada campo. Não recebe foto nem dados pessoais.

const reg = require('../lib/registro.js');

const permitido = reg.limitador(60);

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ erro: 'metodo' });
  }
  if (!reg.configurado()) {
    return res.status(204).end();
  }
  if (!permitido(reg.ipDe(req))) {
    return res.status(429).json({ erro: 'limite' });
  }

  const corpo = reg.corpoJSON(req);
  if (!corpo || !reg.idValido(corpo.id)) {
    return res.status(400).json({ erro: 'dados' });
  }

  const lida = reg.limparCafe(corpo.lida);
  const final = reg.limparCafe(corpo.final);
  const alteracoes = reg.comparar(lida, final);
  const corrigidos = Object.keys(alteracoes).filter((c) => ['corrigido', 'adicionado', 'removido'].includes(alteracoes[c]));

  const ok = await reg.gravar('confirmacoes', corpo.id, {
    metodo: reg.metodo(corpo.metodo),
    sem_correcao: corrigidos.length === 0,
    campos_alterados: corrigidos,
    alteracoes: alteracoes,
    final: final
  });
  return res.status(ok ? 201 : 202).json({ registrado: ok });
};
