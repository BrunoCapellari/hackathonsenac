package br.com.senac.backend.repository;

import br.com.senac.backend.model.Product;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class ProductRepository {

    private final List<Product> products = new ArrayList<>();

    public ProductRepository() {

        products.add(
            new Product(
                1L,
                "Pão Francês",
                1.00,
                "Pão fresco",
                "Pão francês assado diariamente.",
                "pao.jpg",
                1L
            )
        );
    }

    public List<Product> findAll() {
        return products;
    }

    public Product save(Product product) {
        products.add(product);
        return product;
    }

    public Product findById(Long id) {
        return products.stream()
                .filter(product -> product.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public List<Product> findByBusinessId(Long businessId) {

        return products.stream()
                .filter(product ->
                        product.getBusinessId().equals(businessId))
                .toList();
    }
}