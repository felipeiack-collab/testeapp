# App Ponto

Última atualização: 2026-11-06 · site: https://pontocafe.vercel.app

## Objetivo e visão

* Ajudar quem está começando no café a acertar a próxima xícara com o que já tem em casa, sem jargão.
* A pessoa registra o café, diz como ficou (amargo, azedo, aguado…) e recebe ajustes simples para o método dela, inclusive os brasileiros, como o coador de pano.
* Com os registros, o app monta o diagnóstico do paladar e indica o próximo café, do pó de mercado ao primeiro especial.
* Cada ajuste traz os utensílios que ajudam a corrigir o preparo, com link de compra (afiliado), sempre separado do que é recomendação.
* Promessa que dá para medir: a nota da xícara sobe depois de seguir as dicas.
* Sucesso na validação (metas sugeridas): 7 de cada 10 rótulos lidos sem correção, nota média da xícara subindo e metade dos testadores dizendo que usaria.

## Afazeres imediatos

### Validação (próximas 2 semanas)

* [ ] Teste próprio: registrar xícaras, testar a câmera com pouca luz e pacote amassado, conferir `/admin.html`
* [ ] Ajustar a interface com o que aparecer no teste próprio
* [ ] Código de testador no link (ex.: `?t=t1`) para marcar as leituras de cada pessoa
* [ ] Botão "Enviar meu histórico" para os testadores
* [ ] Mensagem de convite com o roteiro de uma semana
* [ ] Teste com 5 a 10 amigos
* [ ] Cadastro no programa de afiliados do Mercado Livre e links no `produtos.json`

### Prova de valor (logo depois)

* [ ] Paladar real, calculado a partir do histórico e escrito pela IA
* [ ] Medida automática de "a próxima xícara melhorou?"
* [ ] Cadastro dos equipamentos que a pessoa tem em casa
* [ ] Trilha real com desafios curtos
* [ ] Versão premium (sugestão do Richard): mais receitas e outros métodos de extração
* [ ] Apresentação do curso: novo posicionamento, comparação com apps parecidos, números do teste, vídeo da demonstração e linha do tempo das decisões

### Já feito

* [x] Protótipo navegável e identidade visual Ponto
* [x] Leitura do rótulo por foto com a Claude API, com tela de conferência
* [x] Diagnóstico por sintoma e método, com receita para o dia seguinte
* [x] Histórico "Minhas xícaras" no celular
* [x] Registro anônimo das leituras e página de consulta protegida por senha
* [x] Estrutura de produtos em `produtos.json`
* [x] Teste de ponta a ponta no site publicado, com correção do formato da resposta da IA
* [x] Revisão visual com a skill unslop: sem caixa alta, pílulas e pontos finais; mapa do ponto no diagnóstico; ficha da receita; paladar marcado como exemplo
* [x] Contagem anônima de visitas com o Vercel Web Analytics (sem cookies), por tela e por origem
* [x] Receita de partida pela torra e pelo método, antes da primeira xícara, e torra média-clara (sugestões do Richard, que está abrindo uma torrefação)
* [x] Página de apresentação em /apresentacao, com o vídeo do YouTube
* [x] Cartão para compartilhar a xícara (imagem feita no aparelho, com o link do app marcado com ?utm_source=cartao)
* [x] Vídeo de apresentação de 2:30 com as telas reais (versão sem voz); refazer em 4 min com a voz clonada no ElevenLabs
* [ ] Aplicar a mesma revisão visual em `identidade.html` e `admin.html`

## Não fazer

* Não abrir cadastro de usuários antes de validar o uso. Quando abrir: Supabase com RLS em todas as tabelas e LGPD (política, consentimento, apagar conta).
* Não abrir loja própria nem ter estoque agora: começar com afiliados e parcerias com torrefações.
* Não usar o afiliado do Mercado Livre para os cafés (a categoria Alimentos e Bebidas não paga comissão): para eles, parceria direta com torrefações.
* Não deixar a comissão decidir a recomendação: "afiliado" sempre separado de "recomendado para você".
* Não guardar fotos nem dados pessoais nas leituras.
* Não colocar chaves ou senhas no código nem no chat: só nas variáveis de ambiente da Vercel.
* Não lançar comercialmente no plano gratuito da Vercel: migrar para o Pro antes.
* Não se apresentar como "o Vivino dos cafés": o diferencial é o iniciante brasileiro e o diagnóstico pelo sintoma.
* Não copiar a identidade visual de outra marca.
* Não voltar aos sinais de design feito por IA: rótulos em caixa alta, tudo em pílula, bronze em todo título, pontos finais em títulos curtos. O bronze fica só no botão principal, na seleção e no ponto que marca a xícara.
* Não começar pela coleção de microlotes raros: ela fica para depois, quando o iniciante amadurecer.
* Não construir a comunidade antes de o app ser útil para uma pessoa sozinha.
