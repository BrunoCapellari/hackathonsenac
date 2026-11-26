# AI Description API

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