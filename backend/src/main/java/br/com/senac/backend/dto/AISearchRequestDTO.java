package br.com.senac.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record AISearchRequestDTO(
    @NotBlank String query,
    String originLocation
) {}
