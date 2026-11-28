# API de Geração de Descrições com IA

## Endpoint de busca local

`POST /api/ai/search`

O frontend envia uma consulta em linguagem natural. O backend combina estabelecimentos e produtos do PostgreSQL com o ranking feito pelo Ollama local. Quando o Ollama não está disponível, é usado um filtro determinístico do catálogo.

```json
{
  "query": "Lanche rápido até R$ 15",
  "originLocation": "Senac Canoas"
}
```

A resposta contém um resumo e os estabelecimentos recomendados com seus produtos.

## Endpoint

`POST /api/ai/generate-description`

Gera uma descrição de produto utilizando o serviço de IA Ollama.

## Requisição

**Content-Type:** `application/json`

```json
{
  "name": "X-Bacon",
  "price": 25.00,
  "notes": "Pão, hambúrguer, queijo, bacon e molho especial da casa."
}
```

## Resposta de sucesso — 200

```json
{
  "description": "Descrição do produto gerada pela IA."
}
```

## Respostas de erro

- `400 Bad Request`: Informações inválidas do produto.
- `503 Service Unavailable`: Serviço de IA indisponível ou resposta inválida.
- `500 Internal Server Error`: Erro inesperado no servidor.

## Observações para integração

- O frontend deve se comunicar com o backend Spring Boot.
- Não realizar chamadas diretamente à API do Ollama pelo frontend.
- O backend é responsável pela comunicação local com o Ollama.
- O lojista deve revisar e aprovar a descrição gerada antes de publicar o produto.
- A IA utiliza exclusivamente as informações textuais fornecidas pelo lojista.
- As imagens dos produtos não são enviadas à IA.