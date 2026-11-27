package br.com.senac.backend.dto;

import java.math.BigDecimal;

public record ProductResponseDTO(

    Long id,

    String name,

    BigDecimal price,

    String notes,

    String description,

    String imageUrl,

    Long businessId

) {}