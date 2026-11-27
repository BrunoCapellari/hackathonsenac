package br.com.senac.backend.controller;

import br.com.senac.backend.dto.BusinessRequestDTO;
import br.com.senac.backend.dto.BusinessResponseDTO;
import br.com.senac.backend.model.Business;
import br.com.senac.backend.model.Product;
import br.com.senac.backend.service.BusinessService;
import br.com.senac.backend.service.ProductService;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/businesses")
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
    public BusinessResponseDTO save(
            @Valid @RequestBody BusinessRequestDTO dto) {

        Business business = new Business();

        business.setUserId(dto.userId());
        business.setName(dto.name());
        business.setCategory(dto.category());
        business.setAddress(dto.address());
        business.setOpeningHours(dto.openingHours());

        Business saved = businessService.save(business);

        return new BusinessResponseDTO(
                saved.getId(),
                saved.getUserId(),
                saved.getName(),
                saved.getCategory(),
                saved.getAddress(),
                saved.getOpeningHours()
        );
    }

    @PutMapping("/{id}")
public BusinessResponseDTO update(
        @PathVariable Long id,
        @Valid @RequestBody BusinessRequestDTO dto) {

    Business business = new Business();

    business.setUserId(dto.userId());
    business.setName(dto.name());
    business.setCategory(dto.category());
    business.setAddress(dto.address());
    business.setOpeningHours(dto.openingHours());

    Business updated = businessService.update(id, business);

    return new BusinessResponseDTO(
            updated.getId(),
            updated.getUserId(),
            updated.getName(),
            updated.getCategory(),
            updated.getAddress(),
            updated.getOpeningHours()
    );
}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        businessService.delete(id);

        return ResponseEntity.noContent().build();
    }
}