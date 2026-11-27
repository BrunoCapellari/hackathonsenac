package br.com.senac.backend.dto;

public record BusinessResponseDTO(

    Long id,

    Long userId,

    String name,

    String category,

    String address,

    String openingHours

) {}