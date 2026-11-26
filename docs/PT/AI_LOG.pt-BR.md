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

### 25/11/2026 — Integração Java com PostgreSQL e cadastro de usuários
- **Prompt principal:** "Quero fazer um código de teste para conectar o Java ao PostgreSQL e realizar o cadastro de usuários."
- **O que a IA gerou:** Um exemplo de aplicação Java utilizando Maven e JDBC, com a biblioteca PostgreSQL, conexão por meio de DriverManager e inserção de usuários utilizando PreparedStatement.
- **O que o time aproveitou:** A estrutura de conexão entre Java e PostgreSQL, a configuração da dependência JDBC no pom.xml e o processo de cadastro de usuários na tabela usuarios. O teste confirmou que a aplicação Java consegue inserir registros no banco de dados.
- **O que o time corrigiu ou rejeitou, e por quê:** O primeiro exemplo armazenava a senha diretamente no banco, sem hash. Essa abordagem não será utilizada na versão definitiva. O backend deverá utilizar BCrypt para proteger as senhas e variáveis de ambiente para armazenar as credenciais de conexão.

### 24/11/2026 — Teste de integração de IA com Java

- **Prompt principal:** Testar a possibilidade de integrar uma inteligência artificial a uma aplicação Java, permitindo enviar perguntas e receber respostas por meio de código Java.
- **O que a IA gerou:** Exemplos de código Java utilizando requisições HTTP para conectar a aplicação a modelos de inteligência artificial, inicialmente pelo Google Gemini e posteriormente pelo Ollama.
- **O que o time aproveitou:** O conhecimento adquirido sobre integração de APIs, requisições HTTP, utilização do HttpClient do Java 21 e execução de modelos locais com Ollama e Qwen 2.5 3B.
- **O que o time corrigiu ou rejeitou, e por quê:** A integração com o Google Gemini foi abandonada devido a problemas de disponibilidade e instabilidade durante os testes. A alternativa com Ollama foi utilizada para concluir o experimento e comprovar que é possível conectar uma IA local a uma aplicação Java.

### 24/11/2026 — Autenticação JWT (exemplo)

- **Prompt principal:** "Gere um middleware de autenticação JWT em Node.js/Express, com tratamento de token expirado e uma rota protegida de exemplo."
- **O que a IA gerou:** um middleware e um exemplo de rota, com uma dependência desatualizada e sem validação de variáveis de ambiente.
- **O que o time aproveitou:** a estrutura do middleware e o fluxo de verificação do token.
- **O que o time corrigiu ou rejeitou, e por quê:** atualizamos a biblioteca, movemos o segredo para variável de ambiente e incluímos testes. O exemplo de rota foi reescrito para se adequar ao nosso modelo de usuário.

### 25/11/2026 — Arquitetura Inicial do Frontend em React + Expo e Adaptação para o Senac Canoas

- **Prompt inicial:** Criar um aplicativo *webview* de *frontend* em React + Expo com base na imagem de referência da interface, localizado no Senac Canoas (R. Mathias Velho, 255 - Centro, Canoas - RS) em vez do local do protótipo, usando IA para exibir os produtos vendidos por comércios locais próximos e alinhado ao *backend* em Spring Boot enviado (`backend.zip`).
- **O que a IA gerou:** Gerou um *frontend* modular em React Native + Expo TypeScript (`colors.ts`, `api.ts`, `HeaderBar.tsx`, `AISearchBanner.tsx`, `CategoryPills.tsx`, `BusinessCard.tsx`, `BottomNavBar.tsx`, `MapWebViewModal.tsx` e `App.tsx`) com *banner* de busca por IA em verde-escuro, dados de contingência de comércios e produtos do Senac Canoas, integração com a API REST em Spring Boot e um modal com *WebView* interativo do OpenStreetMap.
- **O que o time aproveitou:** Tudo, exceto a maior parte das lojas e a precisão do mapa.
- **O que o time corrigiu ou rejeitou, e por quê:** As lojas e a precisão do mapa, que serão atualizadas em breve porque 2 dos estabelecimentos são fictícios.

### 25/11/2026 — Conexão com o Backend em Spring Boot e Localização de Arquivos

- **Prompt inicial:** Perguntou como conectar o *frontend* ao *backend* ("how do i do this") e onde ficavam os arquivos de *backend* mencionados ("where are these").
- **O que a IA gerou:** Explicou como habilitar CORS (`@CrossOrigin`), alinhar os DTOs e *endpoints* REST (`/api/businesses`, `/api/products`, `/api/ai/search`), configurar `EXPO_PUBLIC_API_URL` e identificou os caminhos exatos dentro de `src/main/java/br/com/senac/backend/` (`dto/`, `controller/` e `service/`).

### 25/11/2026 — Configuração de Pastas do Projeto e Consolidação em Arquivo Único `App.tsx`

- **Prompt inicial:** Observou que o projeto padrão do Expo não correspondia à estrutura de várias pastas ("its not looking like this") e perguntou como colocar tudo dentro de `App.tsx` ("how do i do this inside app.tsx" / "so i just replace everything inside of app.tsx with this?").
- **O que a IA gerou:** Explicou como criar as subpastas de `src/` manualmente e, em seguida, forneceu um arquivo `App.tsx` consolidado em peça única contendo constantes de tema, interfaces de DTO, serviços de API/contingência, componentes de interface e o modal de mapa em *WebView*.
- **O que o time corrigiu ou rejeitou, e por quê:** O código dentro de `app.tsx`, pois não estava carregando a *webview* corretamente.

### 25/11/2026 — Integração com Java e PostgreSQL e Cadastro de Usuários

- **Prompt inicial:** "I want to create a test program to connect Java to PostgreSQL and register users."
- **O que a IA gerou:** Uma aplicação de exemplo em Java usando Maven e JDBC, com o driver do PostgreSQL, conexão estabelecida via `DriverManager` e inserção de usuários usando `PreparedStatement`.
- **O que o time aproveitou:** A estrutura de conexão entre Java e PostgreSQL, a configuração da dependência JDBC no `pom.xml` e o processo de cadastro de usuários na tabela `usuarios`. O teste confirmou que a aplicação Java consegue inserir registros no banco de dados com sucesso.
- **O que o time corrigiu ou rejeitou, e por quê:** O exemplo inicial armazenava senhas diretamente no banco de dados sem *hash*. Essa abordagem não será usada na implementação final. O *backend* usará BCrypt para proteger as senhas e variáveis de ambiente para armazenar as credenciais de conexão com o banco de dados.

### 26/11/2026 — Correção do `<StatusBar>` no TypeScript e Resolução de Problemas na Execução do Expo

- **Prompt inicial:** Compartilhou um erro de sobrecarga do TypeScript em `<StatusBar backgroundColor="{...}"/>`, perguntou como executar o projeto novamente ("how do i execute this again") e enviou uma captura de tela do `ConfigError` mostrando `npx expo start --web` falhando devido à ausência de `package.json` na pasta raiz `hackathonsenac`.
- **O que a IA gerou:** Orientou remover a propriedade obsoleta `backgroundColor` de `<StatusBar>` em `App.tsx` e navegar para o subdiretório `frontend/senac-nearby` (`cd frontend/senac-nearby`) antes de executar `npx expo start --web`.
- **O que o time corrigiu ou rejeitou, e por quê:** Corrigiu o problema de a *webview* não rodar devido à ausência de um `package.json` na pasta raiz `hackathonsenac`.


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
