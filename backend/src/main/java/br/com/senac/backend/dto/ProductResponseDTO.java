package br.com.senac.backend.dto;

public record ProductResponseDTO(

    Long id,

    String name,

    Double price,

    String notes,

    String description,

    String imageUrl,

    Long businessId

) {}