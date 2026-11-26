
package br.com.senac.backend.service;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Service
public class AIService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${ollama.model}")
    private String model;

    public AIService(
        @Value("${ollama.base-url}") String baseUrl,
        ObjectMapper objectMapper
    ) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();

        this.objectMapper = objectMapper;
    }

    public String generateDescription(
        String name,
        Double price,
        String notes
    ) {

        // 1. Validar dados recebidos

        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException(
                "O nome do produto é obrigatório."
            );
        }

        if (price != null && price < 0) {
            throw new IllegalArgumentException(
                "O preço não pode ser negativo."
            );
        }

        if (notes != null && notes.length() > 1000) {
            throw new IllegalArgumentException(
                "As informações do produto devem ter no máximo 1000 caracteres."
            );
        }

        // 2. Construir o prompt

        String prompt = """
            Você deve transformar os dados do lojista em uma descrição
            comercial curta.

            DADOS DO PRODUTO:
            Nome: %s
            Preço: %s
            Informações do lojista: %s

            REGRAS OBRIGATÓRIAS:
            1. Utilize exclusivamente as informações fornecidas.
            2. Não adicione características, ingredientes ou qualidades.
            3. Não utilize adjetivos sem comprovação nos dados.
            4. Não invente informações para tornar o texto mais atrativo.
            5. Se houver poucas informações, escreva uma descrição simples.
            6. Não inclua chamadas de venda.
            7. Escreva em português brasileiro.
            8. Retorne somente a descrição, em uma ou duas frases.

            IMPORTANTE:
            Se uma informação não estiver nos dados, ela não pode aparecer.
            """.formatted(
                name,
                price == null ? "Não informado" : "R$ " + price,
                notes == null || notes.isBlank()
                    ? "Nenhuma informação adicional"
                    : notes
            );

        Map<String, Object> request = Map.of(
            "model", model,
            "stream", false,
            "options", Map.of(
                "temperature", 0.1
            ),
            "messages", List.of(
                Map.of(
                    "role", "system",
                    "content", """
                        Você cria descrições comerciais.
                        Sua prioridade é a fidelidade aos dados.
                        Nunca invente informações.
                        """
                ),
                Map.of(
                    "role", "user",
                    "content", prompt
                )
            )
        );

        // 3. Comunicar com o Ollama

        byte[] responseBytes;

        try {
            responseBytes = restClient.post()
                    .uri("/api/chat")
                    .body(request)
                    .retrieve()
                    .body(byte[].class);

        } catch (RestClientException e) {
            throw new IllegalStateException(
                "Não foi possível comunicar com o serviço de IA. "
                + "Verifique se o Ollama está funcionando.",
                e
            );
        }

        // 4. Verificar se houve resposta

        if (responseBytes == null || responseBytes.length == 0) {
            throw new IllegalStateException(
                "O Ollama retornou uma resposta vazia."
            );
        }

        String json = new String(
            responseBytes,
            StandardCharsets.UTF_8
        );

        // 5. Interpretar a resposta

        try {
            JsonNode response = objectMapper.readTree(json);

            String description = response
                    .path("message")
                    .path("content")
                    .asText("");

            if (description.isBlank()) {
                throw new IllegalStateException(
                    "A IA não conseguiu gerar uma descrição."
                );
            }

            return description.trim();

        } catch (JacksonException e) {
            throw new IllegalStateException(
                "Não foi possível interpretar a resposta do Ollama.",
                e
            );
        }
    }
}
