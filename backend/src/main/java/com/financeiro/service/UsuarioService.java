package com.financeiro.service;

import com.financeiro.config.JwtUtil;
import com.financeiro.model.Usuario;
import com.financeiro.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * Service do Usuario - cuida do registro, login e busca de usuario.
 * A senha eh salva criptografada com BCrypt.
 */
@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Registra um novo usuario no sistema.
     * Retorna um Map com o token JWT gerado.
     */
    public Map<String, String> registrar(Usuario usuario) {
        // Verifica se ja existe um usuario com esse email
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("Ja existe um usuario com esse email");
        }

        // Criptografa a senha antes de salvar
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        usuarioRepository.save(usuario);

        // Gera o token JWT
        String token = jwtUtil.gerarToken(usuario.getEmail());

        Map<String, String> resposta = new HashMap<>();
        resposta.put("token", token);
        resposta.put("nome", usuario.getNome());
        return resposta;
    }

    /**
     * Faz o login do usuario.
     * Verifica email e senha, retorna token se correto.
     */
    public Map<String, String> login(String email, String senha) {
        // Busca o usuario pelo email
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email ou senha incorretos"));

        // Verifica se a senha esta correta
        if (!passwordEncoder.matches(senha, usuario.getSenha())) {
            throw new RuntimeException("Email ou senha incorretos");
        }

        // Gera o token JWT
        String token = jwtUtil.gerarToken(email);

        Map<String, String> resposta = new HashMap<>();
        resposta.put("token", token);
        resposta.put("nome", usuario.getNome());
        return resposta;
    }

    /**
     * Pega o ID do usuario logado a partir do token JWT no SecurityContext.
     * Usado pelos outros services para filtrar dados por usuario.
     */
    public Long getUsuarioLogadoId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            throw new RuntimeException("Usuario nao autenticado");
        }
        String email = (String) auth.getPrincipal();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));
        return usuario.getId();
    }
}
