package br.com.senac.backend.controller;

import br.com.senac.backend.dto.AIRequestDTO;
import br.com.senac.backend.dto.AIResponseDTO;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin("*")
public class AIController {

    @PostMapping("/generate-description")
    public AIResponseDTO generate(
            @RequestBody AIRequestDTO request) {

        return new AIResponseDTO(
                "Descrição gerada para "
                        + request.productName()
                        + ". "
                        + request.notes()
        );
    }
}