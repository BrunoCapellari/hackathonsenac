package br.com.senac.backend.service;

import br.com.senac.backend.model.Product;
import br.com.senac.backend.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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

    public Product findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Produto não encontrado"
                ));
    }

    public Product save(Product product) {
        return repository.save(product);
    }

    public List<Product> findByBusinessId(Long businessId) {
        return repository.findByBusinessId(businessId);
    }
}