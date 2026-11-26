package br.com.senac.backend.dto;

public record BusinessRequestDTO(

    String name,

    String category,

    String address,

    String openingHours

) {}