# Briefing do tema: Comércio do bairro

[English](BRIEFING.md) · **Português (Brasil)**

**Hack com IA: Codando com Inteligência**  
Senac na Prática · Técnico em Desenvolvimento de Sistemas  
Área: vida no campus e comunidade  
Imersão de 23/11 a 29/11 · apresentações em 30/11 e 01/12

Este briefing é o ponto de partida do **seu** tema. Leiam com calma, recortem um MVP que caiba em uma semana e registrem as decisões. Vocês vão transformar este problema em um produto real, com front-end e back-end, repositório organizado e uso documentado de IA. Esta é uma imersão colaborativa: a banca avalia o que o time construiu, decidiu e aprendeu.

## Tema e contexto

**Comércio do bairro** — Vitrine digital para pequenos negócios do entorno, com IA gerando descrições dos produtos.

No entorno do Senac de Canoas — perto da Rua Mathias Velho e dos caminhos que alunos e funcionários fazem todo dia — há lanchonetes, papelarias, gráficas e outros negócios pequenos que sustentam a rotina do campus. Muitos têm pouca presença digital: o cardápio está num papel, a promoção do dia circula só no balcão, e descrever um produto com clareza leva tempo que a pessoa dona do negócio quase não tem. Do outro lado, quem estuda ou trabalha no Senac muitas vezes não conhece o que existe a poucos quarteirões.

Vocês vão construir uma vitrine digital desse comércio de proximidade, em que a IA ajuda a redigir descrições, sempre com revisão de quem conhece o produto.

## Público e personas

- **Estudante ou funcionário que busca algo perto do campus:** almoço, material, impressão, um serviço rápido.
- **Pessoa dona ou responsável por um negócio pequeno do entorno:** quer publicar o essencial (horário, o que oferece) sem ter de escrever tudo do zero.
- **Quem vai representar o lojista na demo:** precisa de um fluxo simples para incluir um produto e aceitar ou editar o texto gerado.

## Objetivo

Entregar um MVP de vitrine em que o visitante encontra negócios e produtos do entorno, e quem administra o estabelecimento cadastra itens com foto e notas curtas para a IA propor uma descrição — que só entra no ar depois da revisão.

## Requisitos mínimos (MVP)

O recorte abaixo é realista para uma semana. Fechem-no no primeiro dia e registrem no `DECISIONS.md` o que entra, o que fica de fora e por quê. É melhor um fluxo completo e demonstrável do que uma lista longa pela metade.

1. Listar negócios do entorno com nome, categoria, endereço ou referência e horário de funcionamento.
2. Abrir a página de um negócio, com seus produtos ou serviços.
3. Cadastrar um produto com foto e algumas notas (ingredientes, preço aproximado, o que destaca) e gerar a descrição com IA.
4. Revisar e editar o texto gerado antes de publicar.
5. Buscar e filtrar negócios e produtos por categoria ou palavra.
6. Um perfil simples de quem administra o negócio (no MVP, um usuário lojista já é suficiente).

## Onde a IA entra

O uso de IA é liberado e incentivado — no produto e no processo — e precisa aparecer no `AI_LOG.md`. Algumas frentes concretas neste tema:

- Gerar a descrição do produto a partir da foto e das notas, em tom adequado a um comércio de bairro.
- Sugerir uma categoria e um título curto, para revisão.
- Ajudar a escrever um texto breve “sobre o negócio”, se a pessoa tiver só alguns tópicos.
- Manter a descrição honesta: não inventar ingredientes, promoções ou diferenciais que ninguém informou.

Não publiquem, sem revisão de vocês, um texto ou uma decisão automática da IA como se já fosse a versão final.

## Extras opcionais

Só depois que o MVP estiver em pé. São ideias, não obrigações:

- Indicação de “aberto agora”, a partir do horário cadastrado.
- Um mapa ou uma referência visual do entorno do campus.
- Uma lista de favoritos do estudante.
- Destaque para a sugestão do dia de um negócio.

## Fora de escopo

Para proteger o prazo e o foco do produto:

- Pagamento, carrinho, entrega e logística.
- Um comércio eletrônico completo, com estoque oficial e finalização de compra.
- Avaliações públicas sem nenhuma moderação, que possam expor o negócio de forma injusta nesta semana.
- Cadastrar automaticamente qualquer empresa da cidade — o recorte é o entorno do campus.

## Perguntas para guiar o time

Usem estas perguntas no primeiro dia, ao definir o MVP, e de novo antes da demo:

- De onde vem a primeira lista de negócios da demo — um conjunto de exemplos do entorno é suficiente e transparente?
- Quem pode editar a página de um estabelecimento?
- Como vocês evitam que a IA invente um detalhe que o lojista não confirmou?
- O que acontece se a foto for ruim ou as notas forem vagas demais?
- Como a vitrine deixa claro que é uma montra, não um aplicativo de pedido e pagamento?

## Entregáveis e como a banca avalia

Esta é uma **imersão colaborativa** de uma semana, com times de 3 ou 4 estudantes do TDS. A banca avalia o trabalho de **vocês**, no próprio projeto — um retorno formativo, não uma comparação com outros times.

**O que precisa estar pronto no repositório** (raiz), em **inglês** (versão principal) e em **português** (`.pt-BR`), com o link entre os idiomas no topo de cada arquivo:

- `README.md` e `README.pt-BR.md`
- `DECISIONS.md` e `DECISIONS.pt-BR.md`
- `AI_LOG.md` e `AI_LOG.pt-BR.md`

A aplicação precisa ter **front-end e back-end**. O back-end pode ser **Java**, **Python** ou **Node.js** (isolados ou combinados, desde que integrados). O front-end é obrigatório (web, desktop ou mobile). Justifiquem a stack no `DECISIONS.md`. Também são obrigatórios o histórico com Conventional Commits, o trabalho via Pull Request com revisão, a proteção da `main` e uma pipeline de **GitHub Actions** verde (build, lint e testes) em PRs e na `main`. Não commitem segredos. No primeiro dia, adicionem o professor como colaborador: **adrianoanschau@gmail.com**.

O **congelamento do código** é no domingo, **29/11, às 23h59**. As apresentações são em **15 minutos + 5 minutos de perguntas**, nos dias 30/11 e 01/12, no Senac de Canoas, Sala 103. Ensaiem a demo e o roteiro (problema e solução, demo ao vivo, fluxo de trabalho, decisões, IA na prática e CI/CD).

A avaliação tem **duas bancas, com o mesmo peso**:

- **Banca Técnica (50%):** qualidade de código e arquitetura; Git, Conventional Commits e PRs; CI/CD; domínio do código nas perguntas.
- **Banca de Inovação e Impacto (50%):** originalidade; impacto (o problema real e para quem); experiência do usuário; clareza do pitch; uso criativo da IA.

Qualquer pessoa do time pode ser perguntada sobre qualquer parte do projeto. Usem a IA com inteligência, registrem o que ela gerou e o que vocês corrigiram, e assumam o código que forem apresentar.

Bom trabalho — e que a semana seja intensa, colaborativa e bem documentada.

