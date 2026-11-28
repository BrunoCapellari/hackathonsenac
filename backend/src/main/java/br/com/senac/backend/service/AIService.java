
package br.com.senac.backend.service;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import br.com.senac.backend.dto.AISearchResponseDTO;
import br.com.senac.backend.model.Business;
import br.com.senac.backend.model.Product;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashSet;

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

    public AISearchResponseDTO search(
        String query,
        String originLocation,
        List<Business> businesses,
        List<Product> products
    ) {
        String normalizedQuery = query == null ? "" : query.trim();
        if (normalizedQuery.isBlank()) {
            throw new IllegalArgumentException("Informe o que você procura.");
        }

        StringBuilder catalog = new StringBuilder();
        for (Business business : businesses) {
            catalog.append("Estabelecimento ")
                .append(business.getId())
                .append(" | ")
                .append(business.getName())
                .append(" | ")
                .append(business.getCategory())
                .append(" | ")
                .append(business.getAddress())
                .append(" | Produtos: ");

            products.stream()
                .filter(product -> business.getId().equals(product.getBusinessId()))
                .forEach(product -> catalog.append(product.getName())
                    .append(" R$")
                    .append(product.getPrice())
                    .append("; "));
            catalog.append('\n');
        }

        LinkedHashSet<Long> rankedIds = rankWithOllama(normalizedQuery, originLocation, catalog.toString());
        if (rankedIds.isEmpty()) {
            String terms = normalizedQuery.toLowerCase();
            businesses.stream()
                .filter(business -> {
                    String haystack = (business.getName() + " " + business.getCategory() + " " +
                        products.stream()
                            .filter(product -> business.getId().equals(product.getBusinessId()))
                            .map(Product::getName)
                            .reduce("", (left, right) -> left + " " + right))
                        .toLowerCase();
                    return haystack.contains(terms)
                        || terms.contains("lanche") && haystack.contains("lanche")
                        || terms.contains("papel") && haystack.contains("papel")
                        || terms.contains("mercado") && haystack.contains("mercado")
                        || terms.contains("caf") && haystack.contains("caf");
                })
                .forEach(business -> rankedIds.add(business.getId()));
        }

        if (rankedIds.isEmpty()) {
            businesses.forEach(business -> rankedIds.add(business.getId()));
        }

        List<AISearchResponseDTO.LocalBusinessDTO> recommendations = rankedIds.stream()
            .map(id -> businesses.stream()
                .filter(business -> business.getId().equals(id))
                .findFirst()
                .orElse(null))
            .filter(business -> business != null)
            .map(business -> toSearchBusiness(business, products, normalizedQuery))
            .toList();

        return new AISearchResponseDTO(
            "A IA encontrou " + recommendations.size()
                + " estabelecimento(s) perto de " + (originLocation == null
                    ? "Senac Canoas" : originLocation)
                + " para \"" + normalizedQuery + "\".",
            recommendations
        );
    }

    private LinkedHashSet<Long> rankWithOllama(
        String query,
        String originLocation,
        String catalog
    ) {
        LinkedHashSet<Long> ids = new LinkedHashSet<>();
        if (catalog.isBlank()) {
            return ids;
        }

        String prompt = """
            Ordene os estabelecimentos do catálogo de acordo com esta busca:
            Busca: %s
            Origem: %s

            CATÁLOGO:
            %s

            Retorne somente os IDs dos estabelecimentos mais relevantes,
            separados por vírgula, sem nomes ou explicações.
            """.formatted(query, originLocation == null ? "Senac Canoas" : originLocation, catalog);

        try {
            byte[] responseBytes = restClient.post()
                .uri("/api/chat")
                .body(Map.of(
                    "model", model,
                    "stream", false,
                    "options", Map.of("temperature", 0.1),
                    "messages", List.of(
                        Map.of("role", "system", "content",
                            "Você recomenda estabelecimentos locais usando somente o catálogo fornecido."),
                        Map.of("role", "user", "content", prompt)
                    )
                ))
                .retrieve()
                .body(byte[].class);

            if (responseBytes == null || responseBytes.length == 0) {
                return ids;
            }

            JsonNode response = objectMapper.readTree(
                new String(responseBytes, StandardCharsets.UTF_8)
            );
            String content = response.path("message").path("content").asText("");
            for (String part : content.split("[^0-9]+")) {
                if (!part.isBlank()) {
                    try {
                        ids.add(Long.parseLong(part));
                    } catch (NumberFormatException ignored) {
                    }
                }
            }
        } catch (RestClientException | JacksonException ignored) {
            return ids;
        }
        return ids;
    }

    private AISearchResponseDTO.LocalBusinessDTO toSearchBusiness(
        Business business,
        List<Product> products,
        String query
    ) {
        String normalizedQuery = query.toLowerCase();
        String category = business.getCategory() == null ? "" : business.getCategory().toLowerCase();
        List<AISearchResponseDTO.LocalProductDTO> localProducts = products.stream()
            .filter(product -> business.getId().equals(product.getBusinessId()))
            .filter(product -> normalizedQuery.isBlank()
                || product.getName().toLowerCase().contains(normalizedQuery)
                || normalizedQuery.contains("lanche") && category.contains("lanche")
                || normalizedQuery.contains("caf") && category.contains("caf")
                || normalizedQuery.contains("barato") && product.getPrice() != null
                    && product.getPrice().doubleValue() <= 15)
            .map(product -> new AISearchResponseDTO.LocalProductDTO(
                product.getId(),
                product.getName(),
                product.getPrice() == null ? null : product.getPrice().doubleValue(),
                "#EAB338",
                product.getImageUrl()
            ))
            .toList();

        List<AISearchResponseDTO.LocalProductDTO> visibleProducts =
            localProducts.isEmpty()
                ? products.stream()
                    .filter(product -> business.getId().equals(product.getBusinessId()))
                    .limit(3)
                    .map(product -> new AISearchResponseDTO.LocalProductDTO(
                        product.getId(),
                        product.getName(),
                        product.getPrice() == null ? null : product.getPrice().doubleValue(),
                        "#EAB338",
                        product.getImageUrl()
                    ))
                    .toList()
                : localProducts;

        String displayCategory = business.getCategory() == null ? "Comércio" : business.getCategory();
        return new AISearchResponseDTO.LocalBusinessDTO(
            business.getId(),
            business.getUserId(),
            business.getName(),
            displayCategory,
            business.getAddress(),
            business.getOpeningHours(),
            4.8,
            50,
            5,
            true,
            business.getImageUrl(),
            null,
            null,
            visibleProducts
        );
    }
}
