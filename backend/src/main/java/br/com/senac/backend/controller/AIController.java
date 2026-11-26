package br.com.senac.backend.controller;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin("*")
public class AIController {

    @PostMapping("/generate-description")
    public Map<String, String> generate() {

        return Map.of(
            "description",
            "Produto artesanal elaborado com ingredientes selecionados."
        );
    }
}