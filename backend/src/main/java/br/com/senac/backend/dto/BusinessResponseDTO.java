package br.com.senac.backend.dto;

public record BusinessResponseDTO(

    Long id,

    String name,

    String category,

    String address,

    String openingHours

) {}