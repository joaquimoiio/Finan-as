package com.financeiro.controller;

import com.financeiro.model.Meta;
import com.financeiro.service.MetaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller de Metas - endpoints REST para gerenciar metas financeiras.
 * Todas as rotas sao protegidas (precisam de token JWT).
 */
@RestController
@RequestMapping("/api/metas")
public class MetaController {

    @Autowired
    private MetaService metaService;

    /**
     * GET /api/metas
     * Lista todas as metas do usuario.
     */
    @GetMapping
    public ResponseEntity<?> listar() {
        try {
            List<Meta> metas = metaService.listar();
            return ResponseEntity.ok(metas);
        } catch (Exception e) {
            System.out.println("Erro ao listar metas: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    /**
     * POST /api/metas
     * Cria uma nova meta.
     */
    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Meta meta) {
        try {
            Meta salva = metaService.salvar(meta);
            System.out.println("Meta criada: " + salva.getDescricao());
            return ResponseEntity.ok(salva);
        } catch (Exception e) {
            System.out.println("Erro ao criar meta: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    /**
     * PUT /api/metas/{id}
     * Atualiza uma meta existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Meta meta) {
        try {
            Meta atualizada = metaService.atualizar(id, meta);
            return ResponseEntity.ok(atualizada);
        } catch (Exception e) {
            System.out.println("Erro ao atualizar meta: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    /**
     * DELETE /api/metas/{id}
     * Deleta uma meta.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            metaService.deletar(id);
            return ResponseEntity.ok(Map.of("mensagem", "Meta deletada com sucesso"));
        } catch (Exception e) {
            System.out.println("Erro ao deletar meta: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
}
