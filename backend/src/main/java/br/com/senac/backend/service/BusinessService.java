package br.com.senac.backend.service;

import br.com.senac.backend.model.Business;
import br.com.senac.backend.repository.BusinessRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class BusinessService {

    private final BusinessRepository repository;
    private final ProductService productService;

    public BusinessService(
            BusinessRepository repository,
            ProductService productService) {

        this.repository = repository;
        this.productService = productService;
    }

    public List<Business> findAll() {
        return repository.findAll();
    }

    public Business findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Empresa não encontrada"
                ));
    }

    public Business save(Business business) {
        return repository.save(business);
    }

    public Business update(Long id, Business updatedBusiness) {

        Business existing = findById(id);

        existing.setUserId(updatedBusiness.getUserId());
        existing.setName(updatedBusiness.getName());
        existing.setCategory(updatedBusiness.getCategory());
        existing.setAddress(updatedBusiness.getAddress());
        existing.setOpeningHours(updatedBusiness.getOpeningHours());

        return repository.save(existing);
    }

    public void delete(Long id) {

        Business business = findById(id);

        if (!productService.findByBusinessId(id).isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Existem produtos vinculados a este estabelecimento"
            );
        }

        repository.delete(business);
    }
}