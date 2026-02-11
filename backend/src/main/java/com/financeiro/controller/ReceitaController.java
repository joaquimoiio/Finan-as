package com.financeiro.controller;

import com.financeiro.model.Receita;
import com.financeiro.service.ReceitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller de Receitas - endpoints REST para gerenciar receitas.
 * Todas as rotas sao protegidas (precisam de token JWT).
 */
@RestController
@RequestMapping("/api/receitas")
public class ReceitaController {

    @Autowired
    private ReceitaService receitaService;

    /**
     * GET /api/receitas?mes=1&ano=2026
     * Lista receitas do mes/ano informado.
     */
    @GetMapping
    public ResponseEntity<?> listar(@RequestParam int mes, @RequestParam int ano) {
        try {
            List<Receita> receitas = receitaService.listar(mes, ano);
            return ResponseEntity.ok(receitas);
        } catch (Exception e) {
            System.out.println("Erro ao listar receitas: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    /**
     * POST /api/receitas
     * Cria uma nova receita.
     */
    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Receita receita) {
        try {
            Receita salva = receitaService.salvar(receita);
            System.out.println("Receita criada: " + salva.getFonte() + " - R$ " + salva.getValor());
            return ResponseEntity.ok(salva);
        } catch (Exception e) {
            System.out.println("Erro ao criar receita: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    /**
     * PUT /api/receitas/{id}
     * Atualiza uma receita existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Receita receita) {
        try {
            Receita atualizada = receitaService.atualizar(id, receita);
            return ResponseEntity.ok(atualizada);
        } catch (Exception e) {
            System.out.println("Erro ao atualizar receita: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    /**
     * DELETE /api/receitas/{id}
     * Deleta uma receita.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            receitaService.deletar(id);
            return ResponseEntity.ok(Map.of("mensagem", "Receita deletada com sucesso"));
        } catch (Exception e) {
            System.out.println("Erro ao deletar receita: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
}
