package br.com.senac.backend.service;

import br.com.senac.backend.model.Business;
import br.com.senac.backend.repository.BusinessRepository;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

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
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Empresa não encontrada"
                ));
    }

    public Business save(Business business) {
        return repository.save(business);
    }
}