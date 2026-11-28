package br.com.senac.backend.dto;

import java.util.List;

public record AISearchResponseDTO(
    String summary,
    List<LocalBusinessDTO> recommendedBusinesses
) {
    public record LocalBusinessDTO(
        Long id,
        Long userId,
        String name,
        String category,
        String address,
        String openingHours,
        Double rating,
        Integer reviewCount,
        Integer walkTimeMinutes,
        Boolean isOpen,
        String imageUrl,
        Double latitude,
        Double longitude,
        List<LocalProductDTO> products
    ) {}

    public record LocalProductDTO(
        Long id,
        String name,
        Double price,
        String accentColor,
        String imageUrl
    ) {}
}
