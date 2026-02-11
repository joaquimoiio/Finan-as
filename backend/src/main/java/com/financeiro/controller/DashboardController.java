package com.financeiro.controller;

import com.financeiro.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller do Dashboard - retorna os indicadores financeiros do mes.
 * Rota protegida (precisa de token JWT).
 */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    /**
     * GET /api/dashboard?mes=1&ano=2026
     * Retorna todos os indicadores do dashboard para o mes/ano.
     */
    @GetMapping
    public ResponseEntity<?> getDashboard(@RequestParam int mes, @RequestParam int ano) {
        try {
            Map<String, Object> dashboard = dashboardService.getDashboard(mes, ano);
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            System.out.println("Erro ao carregar dashboard: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
}
