# Decisões do projeto

[English](DECISIONS.md) · **Português (Brasil)**

Registrem aqui as decisões importantes do time. Cada entrada deve ser curta e trazer o que foi decidido, as alternativas consideradas e o motivo da escolha.

A documentação do projeto deve ser escrita **em inglês** (a versão principal é o [`DECISIONS.md`](DECISIONS.md)), com uma **versão em português** ao lado. Mantenham as duas versões alinhadas.

Mantenham este arquivo na **raiz** do repositório. Incluam uma entrada nova para cada decisão relevante (stack, arquitetura, recorte do MVP, o que ficou de fora, caminhos que vocês tentaram e abandonaram etc.). Este arquivo serve de roteiro para o bloco de decisões da apresentação.

Copiem o modelo abaixo sempre que precisarem de uma entrada nova.

## Modelo

```markdown
## [data] — [título da decisão]
- **Decisão:**
- **Alternativas consideradas:**
- **Motivo:**
```

## 25/11/2026 — Geração de descrições por IA baseada em texto

- **Decisão:** A IA gerará descrições de produtos utilizando somente as informações textuais fornecidas pelo lojista. A análise de imagens está fora do MVP. As fotos dos produtos ainda poderão ser cadastradas e exibidas no aplicativo, mas não serão processadas pela IA.
- **Alternativas consideradas:** Gerar descrições a partir de fotos e textos ou utilizar somente informações textuais.
- **Motivo:** A geração baseada em texto reduz a complexidade da implementação e o tempo de desenvolvimento, mantendo a funcionalidade de IA alinhada ao prazo do MVP. A revisão do lojista continuará obrigatória antes da publicação.

## 25/11/2026 — Segurança de senhas e credenciais do banco de dados

- **Decisão:** Utilizar BCrypt para gerar hashes das senhas dos usuários antes de armazená-las no PostgreSQL. Armazenar as credenciais de conexão com o banco em variáveis de ambiente, em vez de deixá-las diretamente no código-fonte.
- **Alternativas consideradas:** Armazenar senhas em texto puro e deixar as credenciais do banco diretamente no código.
- **Motivo:** O hash das senhas aumenta a segurança dos dados dos usuários, enquanto as variáveis de ambiente evitam a exposição de credenciais sensíveis no código-fonte ou no repositório do GitHub.

## 23/11/2026 — Escolha da stack de back-end (exemplo)

- **Decisão:** usar Node.js com Express no back-end.
- **Alternativas consideradas:** Java com Spring Boot; Python com FastAPI.
- **Motivo:** o time já tem mais familiaridade com JavaScript, e o prazo de uma semana favorece uma stack na qual todos conseguem contribuir desde o primeiro dia.

## 24/11/2026 — Escolha de linguagem para o back-end

- **Decisão:** Usar java para programar o back end
- **Alternativas consideradas:** Python e Node.js
- **Motivo:** O java acaba se tornando mais sustentavel para projetos grandes

## 24/11/2026 — Escolha de SGDB e front-end

- **Decisão:** Utilizar o PostgreSQL para o banco de dados e react + expo para o front end pois sera uma webview
- **Motivo:** o PostgreSQL acaba se tornando a opção mais viavel para este tipo de projeto, e o react para tornar a aplicação uma webview.

## 24/11/2026 — Escolha da tecnologia de IA

- **Decisão:** Utilizar o Ollama com o modelo Qwen 2.5 3B para integrar inteligência artificial à aplicação Java.
- **Alternativas consideradas:** APIs externas de IA, como Gemini e outras soluções em nuvem.
- **Motivo:** O Ollama permite executar modelos de IA localmente, sem depender de serviços externos ou de chaves de API, tornando a solução mais acessível e adequada para o ambiente de apresentação.

## 24/11/2026 — Modelagem do banco de dados

- **Decisão:** Utilizar PostgreSQL com três tabelas principais: usuários, estabelecimentos e produtos.
- **Alternativas consideradas:** Outros sistemas de gerenciamento de banco de dados relacionais.
- **Motivo:** A estrutura permite relacionar lojistas aos seus estabelecimentos e cada estabelecimento aos seus produtos, atendendo às necessidades do MVP.

## [data] — [título da decisão]

- **Decisão:**
- **Alternativas consideradas:**
- **Motivo:**
