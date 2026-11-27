# Guia de Instalação e Execução

Este documento explica como configurar e executar o projeto Comércio do Bairro no computador utilizado para a apresentação.

## 1. Pré-requisitos

Instale os seguintes programas:

| Ferramenta | Finalidade |
|---|---|
| Java JDK 21 | Executar o backend |
| PostgreSQL | Gerenciar o banco de dados |
| Ollama | Executar o modelo de IA localmente |
| Node.js | Executar o frontend |
| Git | Clonar e atualizar o projeto |

## 2. Obter o projeto

Clone o repositório:

bash
git clone URL_DO_REPOSITORIO


Entre na pasta:

bash
cd NOME_DO_PROJETO


## 3. Configurar a Inteligência Artificial

Instale o Ollama e baixe o modelo utilizado pelo projeto:

bash
ollama pull qwen2.5vl:3b


Verifique se o modelo foi instalado:

bash
ollama list


O Ollama deve estar em execução para que o backend consiga utilizar a IA.

## 4. Configurar o banco de dados

1. Instale e inicie o PostgreSQL.
2. Crie o banco de dados do projeto.
3. Execute o script SQL localizado em database/schema.sql.
4. Configure as credenciais de acesso no backend.

## 5. Executar o backend

Entre na pasta backend:

bash
cd backend


Execute:

powershell
.\mvnw.cmd spring-boot:run


O backend estará disponível na porta 8080.

## 6. Executar o frontend

As instruções de instalação das dependências e inicialização do frontend serão adicionadas após a definição dos comandos e configurações definitivas do projeto.

## 7. Acessar o sistema

Após iniciar o backend e o frontend, acesse o endereço disponibilizado pelo servidor no navegador.

Para acessar por outros dispositivos, eles precisam conseguir se comunicar com o computador servidor pela rede.

## 8. Observações importantes

- O PostgreSQL e o Ollama devem estar funcionando no computador servidor.
- O backend é responsável pela comunicação com o banco de dados e o serviço de IA.
- O frontend deve consumir as APIs do backend.
- O modelo de IA é executado localmente e não precisa de conexão externa para gerar descrições após sua instalação.
- Não exponha diretamente o PostgreSQL ou o Ollama à internet.
- As credenciais e configurações sensíveis não devem ser compartilhadas no repositório.
