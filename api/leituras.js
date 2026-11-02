// Ponto — consulta dos registros de leitura (uso interno).
// Exige o cabeçalho "Authorization: Bearer <ADMIN_TOKEN>". A página admin.html faz isso por você.

const crypto = require('node:crypto');
const reg = require('../lib/registro.js');

const MAX = 500;

function autorizado(req) {
  const esperado = process.env.ADMIN_TOKEN || '';
  const cab = String((req.headers && req.headers.authorization) || '');
  const recebido = cab.startsWith('Bearer ') ? cab.slice(7) : '';
  if (esperado.length < 16 || !recebido) return false;
  const a = crypto.createHash('sha256').update(esperado).digest();
  const b = crypto.createHash('sha256').update(recebido).digest();
  return crypto.timingSafeEqual(a, b);
}

function contar(lista, chave) {
  const saida = {};
  lista.forEach((x) => {
    const v = x[chave] || 'sem_info';
    saida[v] = (saida[v] || 0) + 1;
  });
  return saida;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Robots-Tag', 'noindex');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ erro: 'metodo' });
  }
  if (!process.env.ADMIN_TOKEN || process.env.ADMIN_TOKEN.length < 16) {
    return res.status(503).json({ erro: 'sem_token', mensagem: 'Crie a variável ADMIN_TOKEN (16 caracteres ou mais) na Vercel e faça um novo deploy.' });
  }
  if (!autorizado(req)) {
    return res.status(401).json({ erro: 'nao_autorizado', mensagem: 'Senha de administração incorreta.' });
  }
  if (!reg.configurado()) {
    return res.status(503).json({ erro: 'sem_blob', mensagem: 'Nenhum Blob conectado ao projeto. Conecte um em Storage na Vercel.' });
  }

  try {
    const [leituras, confirmacoes] = await Promise.all([reg.listar('leituras', MAX), reg.listar('confirmacoes', MAX)]);
    const porId = new Map(confirmacoes.map((c) => [c.id, c]));

    const itens = leituras.map((l) => {
      const c = porId.get(l.id);
      return {
        id: l.id,
        quando: l.quando,
        metodo: l.metodo,
        modelo: l.modelo,
        resultado: l.resultado,
        confianca: l.confianca || null,
        lida: l.lida || null,
        confirmada: Boolean(c),
        sem_correcao: c ? c.sem_correcao : null,
        campos_alterados: c ? c.campos_alterados : [],
        final: c ? c.final : null
      };
    });

    const ok = itens.filter((i) => i.resultado === 'ok');
    const confirmadas = ok.filter((i) => i.confirmada);
    const acertoPorCampo = {};
    reg.CAMPOS.forEach((campo) => {
      const avaliadas = confirmadas.length;
      const erradas = confirmadas.filter((i) => i.campos_alterados.includes(campo)).length;
      acertoPorCampo[campo] = avaliadas ? Math.round(((avaliadas - erradas) / avaliadas) * 100) : null;
    });

    return res.status(200).json({
      gerado_em: new Date().toISOString(),
      limite: MAX,
      resumo: {
        tentativas: itens.length,
        por_resultado: contar(itens, 'resultado'),
        por_confianca: contar(ok, 'confianca'),
        por_metodo: contar(itens, 'metodo'),
        lidas_com_sucesso: ok.length,
        confirmadas: confirmadas.length,
        confirmadas_sem_correcao: confirmadas.filter((i) => i.sem_correcao).length,
        acerto_por_campo_pct: acertoPorCampo
      },
      itens: itens
    });
  } catch (e) {
    console.error('Falha ao listar registros:', e && e.message);
    return res.status(500).json({ erro: 'falha', mensagem: 'Não foi possível ler os registros agora.' });
  }
};
