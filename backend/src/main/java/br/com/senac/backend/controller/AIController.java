
package br.com.senac.backend.controller;


import br.com.senac.backend.dto.GenerateDescriptionRequest;
import br.com.senac.backend.service.AIService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin("*")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/generate-description")
    public ResponseEntity<Map<String, String>> generate(
        @Valid @RequestBody GenerateDescriptionRequest request
    ) {

        String description = aiService.generateDescription(
            request.name(),
            request.price(),
            request.notes()
        );

        return ResponseEntity.ok()
        .contentType(new MediaType(
                "application",
                "json",
                java.nio.charset.StandardCharsets.UTF_8
        ))
        .body(Map.of("description", description));
    }

    @ExceptionHandler(IllegalArgumentException.class)
public ResponseEntity<Map<String, String>> handleBadRequest(
    IllegalArgumentException e
) {
    return ResponseEntity.badRequest().body(
        Map.of("error", e.getMessage())
    );
}

@ExceptionHandler(IllegalStateException.class)
public ResponseEntity<Map<String, String>> handleAIError(
    IllegalStateException e
) {
    return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(
        Map.of(
            "error",
            "Serviço de IA indisponível ou retornou uma resposta inválida."
        )
    );
}
}
