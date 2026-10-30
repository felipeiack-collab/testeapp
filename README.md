# Ponto

**Encontre o seu ponto.** Um app para quem está começando no café: registra o que tomou, conta como ficou e recebe ajustes simples para a próxima xícara, usando os equipamentos que já tem.

## O que tem aqui

| Caminho | O que é |
|---|---|
| `index.html`, `css/`, `js/` | Protótipo navegável (HTML, CSS e JS puros, sem build). É o que a Vercel publica. |
| `identidade.html` | Identidade visual: ícone, logotipo, paleta e tipografia. |
| `img/icone.svg` | Ícone do app (também usado como favicon). |
| `design/` | Fontes do canvas de design (`.dc.html`). Só abrem no editor de design; não são publicadas. |

## Fluxo do protótipo

`#/` Abertura → `#/inicio` Início → `#/registrar` Registrar a xícara → `#/ajuste` Diagnóstico e ajuste → `#/paladar` Meu paladar

- O diagnóstico muda conforme o sintoma escolhido (amargo, azedo, aguado, seca a boca, forte demais, ficou ótimo) e traz uma dica específica do método de preparo.
- Cada ajuste tem um produto relacionado, com link de afiliado configurado em `produtos.json`.
- "Salvar e lembrar amanhã" guarda o registro no navegador e atualiza a tela de Início.

## Produtos e links de afiliado (`produtos.json`)

Para cada produto, preencha:

- `link`: o link de afiliado, começando com `https://`
- `preco`: só o número, com ponto nos centavos (`89.90`), ou `null` para não mostrar preço
- `loja`: nome da loja (`"Mercado Livre"`), ou `null`

Produto sem link aparece como "Em breve". Não mude os identificadores (`"termometro"`, `"moedor"`…), porque o app usa esses nomes.

Para editar pelo navegador: abra `produtos.json` no GitHub, clique no lápis (Edit), faça a mudança e clique em **Commit changes**. A Vercel publica sozinha em seguida.

## Leitura do rótulo por foto

Na tela Registrar, "Fotografar pacote" abre a câmera do celular. A foto é reduzida no navegador e enviada para `api/identificar.js`, uma função da Vercel que pede a um modelo de IA da Claude API para ler o rótulo. A pessoa confere e corrige os dados na tela **Confira os dados** (`#/confirmar`) antes de usar.

Variáveis de ambiente na Vercel:

| Variável | Obrigatória | Para quê |
|---|---|---|
| `ANTHROPIC_API_KEY` | Sim | Chave da Claude API. Sem ela, o app cai no preenchimento manual. |
| `CLAUDE_MODEL` | Não | Modelo usado (padrão: `claude-haiku-5-5`). |
| `LIMITE_FOTOS_HORA` | Não | Fotos por hora por IP (padrão: 20). |

Depois de criar ou mudar uma variável, faça um novo deploy. O limite por IP é uma proteção básica; o teto de gastos no Claude Console é o que controla o custo de verdade.

## Rodar localmente

Qualquer servidor estático serve, por exemplo:

```bash
npx serve .
```

## Identidade

- Cores: Torra `#0F0D0B`, Grão `#1A1714`, Leite `#EFE7DA`, Bronze `#B8926A`
- Tipos: Cormorant Garamond (títulos) e Manrope (texto e interface)
