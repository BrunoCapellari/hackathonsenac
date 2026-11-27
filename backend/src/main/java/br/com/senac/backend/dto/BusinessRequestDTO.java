package br.com.senac.backend.dto;

import jakarta.validation.constraints.NotNull;

public record BusinessRequestDTO(

    @NotNull(message = "O ID do usuário é obrigatório")
    Long userId,

    String name,

    String category,

    String address,

    String openingHours

) {}