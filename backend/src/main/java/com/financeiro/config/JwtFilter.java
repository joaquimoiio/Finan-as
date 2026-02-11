package com.financeiro.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

/**
 * Filtro JWT - intercepta todas as requisicoes HTTP.
 * Se a requisicao tiver um token valido no header Authorization,
 * seta a autenticacao no SecurityContext do Spring.
 */
@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Pega o header Authorization
        String authHeader = request.getHeader("Authorization");

        // Verifica se tem o token no formato "Bearer xxx.yyy.zzz"
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // Remove "Bearer "

            // Se o token eh valido, seta a autenticacao
            if (jwtUtil.validarToken(token)) {
                String email = jwtUtil.getEmail(token);

                // Cria a autenticacao com o email do usuario
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(email, null, new ArrayList<>());

                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        // Continua a cadeia de filtros
        filterChain.doFilter(request, response);
    }
}
