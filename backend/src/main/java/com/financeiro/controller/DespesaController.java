package com.financeiro.controller;

import com.financeiro.model.Despesa;
import com.financeiro.service.DespesaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller de Despesas - endpoints REST para gerenciar despesas.
 * Todas as rotas sao protegidas (precisam de token JWT).
 */
@RestController
@RequestMapping("/api/despesas")
public class DespesaController {

    @Autowired
    private DespesaService despesaService;

    /**
     * GET /api/despesas?mes=1&ano=2026
     * Lista despesas do mes/ano informado.
     */
    @GetMapping
    public ResponseEntity<?> listar(@RequestParam int mes, @RequestParam int ano) {
        try {
            List<Despesa> despesas = despesaService.listar(mes, ano);
            return ResponseEntity.ok(despesas);
        } catch (Exception e) {
            System.out.println("Erro ao listar despesas: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    /**
     * POST /api/despesas
     * Cria uma nova despesa.
     */
    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Despesa despesa) {
        try {
            Despesa salva = despesaService.salvar(despesa);
            System.out.println("Despesa criada: " + salva.getDescricao() + " - R$ " + salva.getValor());
            return ResponseEntity.ok(salva);
        } catch (Exception e) {
            System.out.println("Erro ao criar despesa: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    /**
     * PUT /api/despesas/{id}
     * Atualiza uma despesa existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Despesa despesa) {
        try {
            Despesa atualizada = despesaService.atualizar(id, despesa);
            return ResponseEntity.ok(atualizada);
        } catch (Exception e) {
            System.out.println("Erro ao atualizar despesa: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    /**
     * DELETE /api/despesas/{id}
     * Deleta uma despesa.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            despesaService.deletar(id);
            return ResponseEntity.ok(Map.of("mensagem", "Despesa deletada com sucesso"));
        } catch (Exception e) {
            System.out.println("Erro ao deletar despesa: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
}
