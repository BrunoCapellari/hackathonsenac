package br.com.marketplace.api.service;

import br.com.marketplace.api.model.Estabelecimento;
import br.com.marketplace.api.repository.EstabelecimentoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EstabelecimentoService {

    private final EstabelecimentoRepository repository;

    public EstabelecimentoService(EstabelecimentoRepository repository) {
        this.repository = repository;
    }

    public List<Estabelecimento> listarTodos() {
        return repository.findAll();
    }

    public Estabelecimento cadastrar(Estabelecimento estabelecimento) {
        return repository.save(estabelecimento);
    }
}