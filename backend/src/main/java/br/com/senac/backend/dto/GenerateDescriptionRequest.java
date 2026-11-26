
package br.com.senac.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record GenerateDescriptionRequest(
    @NotBlank(message = "O nome do produto e obrigatorio")
    String name,
    Double price,
    String notes
) {}
