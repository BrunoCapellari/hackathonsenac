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

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "estabelecimentos")
public class Business {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id", nullable = false)
    private Long userId;

    @Column(name = "nome", nullable = false, length = 150)
    private String name;

    @Column(name = "categoria", length = 80)
    private String category;

    @Column(name = "endereco", columnDefinition = "text")
    private String address;

    @Column(name = "horario_funcionamento", columnDefinition = "text")
    private String openingHours;
}