package br.com.senac.backend.controller;

import br.com.senac.backend.model.Business;
import br.com.senac.backend.model.Product;
import br.com.senac.backend.service.BusinessService;
import br.com.senac.backend.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/businesses")
@CrossOrigin("*")
public class BusinessController {

    private final BusinessService businessService;
    private final ProductService productService;

    public BusinessController(
            BusinessService businessService,
            ProductService productService) {

        this.businessService = businessService;
        this.productService = productService;
    }

    @GetMapping
    public List<Business> findAll() {
        return businessService.findAll();
    }

    @GetMapping("/{id}")
    public Business findById(@PathVariable Long id) {
        return businessService.findById(id);
    }

    @GetMapping("/{id}/products")
    public List<Product> findProducts(
            @PathVariable Long id) {

        return productService.findByBusinessId(id);
    }

    @PostMapping
    public Business save(
            @RequestBody Business business) {

        return businessService.save(business);
    }
}