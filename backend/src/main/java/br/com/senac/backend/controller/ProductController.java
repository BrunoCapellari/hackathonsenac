package br.com.senac.backend.controller;

import br.com.senac.backend.dto.ProductRequestDTO;
import br.com.senac.backend.dto.ProductResponseDTO;
import br.com.senac.backend.model.Product;
import br.com.senac.backend.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    public List<Product> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Product findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public ProductResponseDTO save(
            @RequestBody ProductRequestDTO dto) {

        Product product = new Product();

        product.setId(System.currentTimeMillis());

        product.setName(dto.name());

        product.setPrice(dto.price());

        product.setNotes(dto.notes());

        product.setImageUrl(dto.imageUrl());

        product.setBusinessId(dto.businessId());

        Product saved = service.save(product);

        return new ProductResponseDTO(
                saved.getId(),
                saved.getName(),
                saved.getPrice(),
                saved.getNotes(),
                saved.getDescription(),
                saved.getImageUrl(),
                saved.getBusinessId()
        );
    }
}