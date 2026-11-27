package br.com.senac.backend.repository;

import br.com.senac.backend.model.Business;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusinessRepository extends JpaRepository<Business, Long> {
}
