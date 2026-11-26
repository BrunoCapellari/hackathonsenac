package br.com.senac.backend.service;

import br.com.senac.backend.model.Business;
import br.com.senac.backend.repository.BusinessRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BusinessService {

    private final BusinessRepository repository;

    public BusinessService(BusinessRepository repository) {
        this.repository = repository;
    }

    public List<Business> findAll() {
        return repository.findAll();
    }

    public Business findById(Long id) {
        return repository.findById(id);
    }

    public Business save(Business business) {
        return repository.save(business);
    }
}