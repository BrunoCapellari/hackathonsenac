package br.com.senac.backend.repository;

import br.com.senac.backend.model.Business;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class BusinessRepository {

    private final List<Business> businesses = new ArrayList<>();

    public BusinessRepository() {

        businesses.add(
            new Business(
                1L,
                "Padaria Central",
                "Padaria",
                "Centro",
                "08:00 às 18:00"
            )
        );
    }

    public List<Business> findAll() {
        return businesses;
    }

    public Business findById(Long id) {

        return businesses.stream()
                .filter(business -> business.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public Business save(Business business) {

        businesses.add(business);
        return business;
    }
}