// Ponto — recebe sugestões e problemas enviados de dentro do app.
// Anônimo: guarda só o texto, a tela de onde veio e quantas xícaras a pessoa tem. Sem IP, sem contato.

const crypto = require('node:crypto');
const reg = require('../lib/registro.js');

const permitido = reg.limitador(10);
const TELAS = ['inicio', 'registrar', 'ajuste', 'paladar', 'historico', 'confirmar', 'abertura', 'sugestao'];

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ erro: 'metodo' });
  }
  if (!permitido(reg.ipDe(req))) {
    return res.status(429).json({ erro: 'limite', mensagem: 'Muitas mensagens seguidas. Tente de novo mais tarde.' });
  }
  const corpo = reg.corpoJSON(req) || {};
  const texto = typeof corpo.texto === 'string' ? corpo.texto.replace(/\s+\n/g, '\n').trim().slice(0, 1000) : '';
  if (texto.length < 3) {
    return res.status(400).json({ erro: 'dados', mensagem: 'Escreva um pouco mais.' });
  }
  if (!reg.configurado()) {
    return res.status(503).json({ erro: 'sem_blob', mensagem: 'Não consegui enviar agora.' });
  }
  const xicaras = Number(corpo.xicaras);
  const ok = await reg.gravar('sugestoes', crypto.randomUUID(), {
    texto: texto,
    tela: TELAS.includes(corpo.tela) ? corpo.tela : null,
    metodo: reg.metodo(corpo.metodo),
    xicaras: Number.isInteger(xicaras) && xicaras >= 0 && xicaras < 10000 ? xicaras : null
  });
  return ok ? res.status(201).json({ enviado: true }) : res.status(500).json({ erro: 'falha', mensagem: 'Não consegui enviar agora.' });
};
