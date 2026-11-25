# Registro de uso de IA (AI_LOG)

[English](AI_LOG.md) · **Português (Brasil)**

Registrem aqui como o time usou inteligência artificial no projeto. O uso de IA é liberado e incentivado, desde que documentado: este arquivo é entregável obrigatório e serve de roteiro para o bloco “IA na prática” da apresentação.

A documentação do projeto deve ser escrita **em inglês** (a versão principal é o [`AI_LOG.md`](AI_LOG.md)), com uma **versão em português** ao lado. Mantenham as duas versões alinhadas.

Mantenham este arquivo na **raiz** do repositório. Incluam as ferramentas utilizadas e, para cada uso relevante, o prompt principal, o que a IA gerou, o que o time aproveitou e o que foi corrigido ou rejeitado — e por quê.

Nunca commitem chaves de API, senhas ou outros segredos. Esses valores vão em `.env` (fora do repositório) e em GitHub Secrets.

Copiem o modelo abaixo sempre que precisarem de uma entrada nova.

## Ferramentas

- (ex.: ChatGPT, GitHub Copilot, Cursor, outro)

## Modelo de registro

```markdown
### [data] — [tarefa ou trecho]
- **Prompt principal:**
- **O que a IA gerou:**
- **O que o time aproveitou:**
- **O que o time corrigiu ou rejeitou, e por quê:**
```

## Registro

### 24/11/2026 — Autenticação JWT (exemplo)

- **Prompt principal:** "Gere um middleware de autenticação JWT em Node.js/Express, com tratamento de token expirado e uma rota protegida de exemplo."
- **O que a IA gerou:** um middleware e um exemplo de rota, com uma dependência desatualizada e sem validação de variáveis de ambiente.
- **O que o time aproveitou:** a estrutura do middleware e o fluxo de verificação do token.
- **O que o time corrigiu ou rejeitou, e por quê:** atualizamos a biblioteca, movemos o segredo para variável de ambiente e incluímos testes. O exemplo de rota foi reescrito para se adequar ao nosso modelo de usuário.

### 23/11/2026 — Correção de branches/repositorio

- **Prompt Inicial:** github como pego o conteudo de uma branch e boto em outra
- **O que a IA gerou:** Passo a passo e ajuda em correção de segunda branch, como apagar

### 23/11/2026 — Ajuda com o desenvolvimento do APP

- **Prompt Inicial:** Estou planejando um aplicativo parecido como o ifood para estabelecimentos ao redor de uma instituição de ensino. O backend sera feito em java, como posso começar a desenvolver para esta aplicação mobile? SEM dar o código completo, me ajude a chegar ao resultado final somente
- **O que a IA gerou:** Sugestões de ferramentas para usar para o MVP
- **O que o time aproveitou:** Utilizaremos o Java + Spring Boot para o backend, PostgreSQL para o banco de dados e o React Native + Expo para a interface/aplicativo

  ### 24/11/2026 — Conceito do Front End com a IA do Figma
- **Prompt principal:** "Faça o layout de um aplicativo que apresenta negócios locais perto de uma instituição especifica. O aplicativo usa IA como sua ferramenta principal para apresentar todos os negócios locais e seus produtos/serviços.
- **O que a IA gerou:** O menu principal do nosso aplicativo, com exemplos de categorias (Comidas & Bebidas, Recursos Escolares, Itens do Dia-a-Dia, Presentes & mais.
- **O que o time aproveitou:** O layout, menos o formato (já que deve ser webview, não um app de desktop).
- **O que o time corrigiu ou rejeitou, e por quê:** Como dito antes, o formato. A IA fez um aplicativo de desktop ao invés de um aplicativo mobile webview, que é o que nos queremos fazer, mesmo que seja apenas um esboço, eu (Felipe) que cometi o erro por não ter especificado o formato.

### 24/11/2026 — Corrigindo o formato do Front End
- **Prompt principal:** "Tem que ser um app mobile webview."
- **O que a IA gerou:** Apenas ajustou o layout do aplicativo para ser um webview.
- **O que o time aproveitou:** O layout, basicamente tudo.
- **O que o time corrigiu ou rejeitou, e por quê:** Nada, já que o erro já foi corrigido.
