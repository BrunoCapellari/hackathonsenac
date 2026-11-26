package br.com.senac.backend.service;

import br.com.senac.backend.model.Product;
import br.com.senac.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public List<Product> findAll() {
        return repository.findAll();
    }

    public Product save(Product product) {
        return repository.save(product);
    }

    public Product findById(Long id) {
        return repository.findById(id);
    }
}