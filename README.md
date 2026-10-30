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
- Cada ajuste tem um produto de parceiro relacionado (preço e link ainda a preencher: procure `[PREÇO]` e `data-acao="loja"` em `js/app.js`).
- "Salvar e lembrar amanhã" guarda o registro no navegador e atualiza a tela de Início.

## Rodar localmente

Qualquer servidor estático serve, por exemplo:

```bash
npx serve .
```

## Identidade

- Cores: Torra `#0F0D0B`, Grão `#1A1714`, Leite `#EFE7DA`, Bronze `#B8926A`
- Tipos: Cormorant Garamond (títulos) e Manrope (texto e interface)
