package com.financeiro.controller;

import com.financeiro.model.Investimento;
import com.financeiro.service.InvestimentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller de Investimentos - endpoints REST para gerenciar investimentos.
 * Todas as rotas sao protegidas (precisam de token JWT).
 */
@RestController
@RequestMapping("/api/investimentos")
public class InvestimentoController {

    @Autowired
    private InvestimentoService investimentoService;

    /**
     * GET /api/investimentos
     * Lista todos os investimentos do usuario.
     */
    @GetMapping
    public ResponseEntity<?> listar() {
        try {
            List<Investimento> investimentos = investimentoService.listar();
            return ResponseEntity.ok(investimentos);
        } catch (Exception e) {
            System.out.println("Erro ao listar investimentos: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    /**
     * POST /api/investimentos
     * Cria um novo investimento.
     */
    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Investimento investimento) {
        try {
            Investimento salvo = investimentoService.salvar(investimento);
            System.out.println("Investimento criado: " + salvo.getDescricao() + " - R$ " + salvo.getValorInvestido());
            return ResponseEntity.ok(salvo);
        } catch (Exception e) {
            System.out.println("Erro ao criar investimento: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    /**
     * PUT /api/investimentos/{id}
     * Atualiza um investimento existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Investimento investimento) {
        try {
            Investimento atualizado = investimentoService.atualizar(id, investimento);
            return ResponseEntity.ok(atualizado);
        } catch (Exception e) {
            System.out.println("Erro ao atualizar investimento: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    /**
     * DELETE /api/investimentos/{id}
     * Deleta um investimento.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            investimentoService.deletar(id);
            return ResponseEntity.ok(Map.of("mensagem", "Investimento deletado com sucesso"));
        } catch (Exception e) {
            System.out.println("Erro ao deletar investimento: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
}
