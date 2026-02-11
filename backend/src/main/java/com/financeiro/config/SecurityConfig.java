package com.financeiro.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Configuracao de seguranca do Spring Security.
 * - Libera as rotas de autenticacao (/api/auth/**)
 * - Protege todas as outras rotas (precisa de token JWT)
 * - Desabilita CSRF (nao precisa para API REST)
 * - Usa sessao stateless (sem cookie de sessao, so JWT)
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Desabilita CSRF (nao precisa para API REST com JWT)
                .csrf(csrf -> csrf.disable())

                // Configura as rotas
                .authorizeHttpRequests(auth -> auth
                        // Libera rotas de autenticacao
                        .requestMatchers("/api/auth/**").permitAll()
                        // Libera o console do H2 (para desenvolvimento)
                        .requestMatchers("/h2-console/**").permitAll()
                        // Todas as outras rotas precisam de autenticacao
                        .anyRequest().authenticated()
                )

                // Sessao stateless (sem cookies, so JWT)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Permite o H2 Console funcionar (usa iframe)
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))

                // Adiciona o filtro JWT antes do filtro padrao do Spring
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Bean do BCrypt para criptografar senhas
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
