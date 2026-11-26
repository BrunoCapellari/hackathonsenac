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

## 23/11/2026 — Escolha da stack de back-end (exemplo)

- **Decisão:** usar Node.js com Express no back-end.
- **Alternativas consideradas:** Java com Spring Boot; Python com FastAPI.
- **Motivo:** o time já tem mais familiaridade com JavaScript, e o prazo de uma semana favorece uma stack na qual todos conseguem contribuir desde o primeiro dia.

## 24/11/2026 — Escolha de Linguagem para o Back-End

- **Decisão:** Usar Java para programar o *back-end*
- **Alternativas consideradas:** Python e Node.js
- **Motivo:** O Java acaba se tornando mais sustentável para projetos grandes

## 24/11/2026 — Escolha de SGBD e Front-End

- **Decisão:** Utilizar o PostgreSQL para o banco de dados e React + Expo para o *front-end*, pois será uma *webview*
- **Motivo:** O PostgreSQL acaba se tornando a opção mais viável para este tipo de projeto, e o React para tornar a aplicação uma *webview*

## 24/11/2026 — Uso de Inteligência Artificial para Descrições de Produtos

- **Decisão:** Usar o Ollama com o modelo Qwen 2.5 3B para gerar descrições de produtos com base nas informações fornecidas pelo proprietário do comércio.
- **Alternativas consideradas:** APIs de IA externas e redação manual de descrições.
- **Motivo:** A execução local reduz a dependência de serviços externos e permite integrar a IA ao sistema. As descrições geradas também serão revisadas e poderão ser editadas pelo proprietário antes da publicação, evitando informações imprecisas.

## 24/11/2026 — Modelagem do Banco de Dados

- **Decisão:** Usar o PostgreSQL com três tabelas principais: `users` (usuários), `establishments` (estabelecimentos) e `products` (produtos).
- **Alternativas consideradas:** Outros sistemas de gerenciamento de banco de dados relacional.
- **Motivo:** Essa estrutura permite que usuários gerenciem múltiplos estabelecimentos e que cada estabelecimento gerencie seus próprios produtos, atendendo aos requisitos do MVP.

## 25/11/2026 — Segurança de Senhas e Credenciais do Banco de Dados

- **Decisão:** Usar BCrypt para aplicar *hash* nas senhas dos usuários antes de armazená-las no PostgreSQL. Armazenar as credenciais de conexão com o banco de dados em variáveis de ambiente em vez de deixá-las fixas (*hardcoded*) no código-fonte.
- **Alternativas consideradas:** Armazenar senhas em texto puro e deixar credenciais de banco fixas no código.
- **Motivo:** O *hash* de senhas melhora a segurança dos dados dos usuários, enquanto as variáveis de ambiente evitam que credenciais sensíveis fiquem expostas no código-fonte ou no repositório do GitHub.

### 26/11/2026 — Descrições de produtos geradas por IA

- **Decisão:** O *backend* usará o Ollama com o modelo `qwen2.5vl:3b` para gerar descrições de produtos por meio da API do Spring Boot.
- **Implementação:** O *backend* envia o nome do produto, o preço e as anotações fornecidas pelo comerciante para o Ollama pelo *endpoint* `/api/chat`.
- **Regras:** A IA deve usar apenas as informações fornecidas pelo comerciante e não deve inventar ingredientes, características, benefícios, promoções ou outras informações do produto.
- **Revisão:** As descrições geradas por IA devem ser revisadas e aprovadas pelo comerciante antes de o produto ser publicado.
- **Motivo:** Essa abordagem oferece processamento local de IA sem exigir uma API de IA externa e mantém a geração por IA centralizada no *backend*.

### Pré-requisitos

- **Java JDK 21:** execução da aplicação.
- **Apache Maven 3.9+:** compilação do projeto.
- **Ollama:** execução local de IA.
- **Qwen 2.5 3B:** modelo de IA utilizado pelo sistema.
- **Windows 10 ou superior.**
- **8 GB de RAM e 5 GB de espaço livre em disco recomendados.**


## [data] — [título da decisão]

- **Decisão:**
- **Alternativas consideradas:**
- **Motivo:**
