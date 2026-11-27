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
}