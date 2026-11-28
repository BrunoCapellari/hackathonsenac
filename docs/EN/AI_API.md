# AI Description API

## Local search endpoint

`POST /api/ai/search`

The frontend sends a natural-language query and the backend combines the establishments and products from PostgreSQL with local Ollama ranking. It also provides a deterministic catalog fallback when Ollama is unavailable.

```json
{
  "query": "Lanche rápido até R$ 15",
  "originLocation": "Senac Canoas"
}
```

The response contains a summary and recommended establishments with their products.

## Endpoint

`POST /api/ai/generate-description`

Generates a product description using the Ollama AI service.

## Request

**Content-Type:** `application/json`

```json
{
  "name": "X-Bacon",
  "price": 25.00,
  "notes": "Pão, hambúrguer, queijo, bacon e molho especial da casa."
}
```

## Successful response — 200

```json
{
  "description": "Generated product description."
}
```

## Error responses

- `400 Bad Request`: Invalid product information.
- `503 Service Unavailable`: AI service unavailable or invalid response.
- `500 Internal Server Error`: Unexpected server error.

## Integration notes

- The frontend must communicate with the Spring Boot backend.
- Do not call the Ollama API directly from the frontend.
- The backend communicates with Ollama locally.
- The merchant must review and approve the generated description before publishing the product.
- AI generation uses only the textual information provided by the merchant.
- Product images are not sent to the AI.