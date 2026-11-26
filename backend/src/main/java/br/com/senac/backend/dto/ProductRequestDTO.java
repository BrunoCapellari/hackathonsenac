package br.com.senac.backend.dto;

public record ProductRequestDTO(

    String name,

    Double price,

    String notes,

    String imageUrl,

    Long businessId

) {}