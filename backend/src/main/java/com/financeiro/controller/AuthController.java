package com.financeiro.controller;

import com.financeiro.model.Usuario;
import com.financeiro.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller de Autenticacao - registro e login de usuarios.
 * Rotas publicas (nao precisam de token JWT).
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    /**
     * POST /api/auth/registro
     * Registra um novo usuario e retorna o token JWT.
     */
    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody Usuario usuario) {
        try {
            Map<String, String> resposta = usuarioService.registrar(usuario);
            System.out.println("Novo usuario registrado: " + usuario.getEmail());
            return ResponseEntity.ok(resposta);
        } catch (RuntimeException e) {
            System.out.println("Erro no registro: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    /**
     * POST /api/auth/login
     * Faz login e retorna o token JWT + nome do usuario.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> dados) {
        try {
            String email = dados.get("email");
            String senha = dados.get("senha");
            Map<String, String> resposta = usuarioService.login(email, senha);
            System.out.println("Login realizado: " + email);
            return ResponseEntity.ok(resposta);
        } catch (RuntimeException e) {
            System.out.println("Erro no login: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
}
