package br.com.senac.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "produtos")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false, length = 150)
    private String name;

    @Column(name = "preco", precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "observacoes", columnDefinition = "text")
    private String notes;

    @Column(name = "descricao", columnDefinition = "text")
    private String description;

    @Column(name = "foto_url", columnDefinition = "text")
    private String imageUrl;

    @Column(name = "estabelecimento_id", nullable = false)
    private Long businessId;

    @Column(name = "descricao_gerada", columnDefinition = "text")
    private String generatedDescription;

    @Column(name = "descricao_final", columnDefinition = "text")
    private String finalDescription;

    @Column(name = "publicado")
    private Boolean published;

    @Column(name = "criado_em")
    private LocalDateTime createdAt;
}