package br.com.senac.backend.dto;

import java.math.BigDecimal;

public record ProductRequestDTO(

    String name,

    BigDecimal price,

    String notes,

    String imageUrl,

    Long businessId

) {}