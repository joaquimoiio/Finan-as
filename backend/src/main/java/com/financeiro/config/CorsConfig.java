package com.financeiro.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import org.springframework.beans.factory.annotation.Value;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Configuracao de CORS - permite que o frontend acesse a API.
 * Libera o localhost:5173 (Vite em desenvolvimento) e a URL do Vercel em producao.
 */
@Configuration
public class CorsConfig {

    @Value("${CORS_ORIGINS:}")
    private String corsOrigins;

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Origens permitidas (frontend)
        List<String> origins = new ArrayList<>(Arrays.asList(
                "http://localhost:5173",  // Vite em desenvolvimento
                "http://localhost:3000"   // Caso use outra porta
        ));

        // Adiciona origens de producao (ex: URL da Vercel)
        if (corsOrigins != null && !corsOrigins.isEmpty()) {
            for (String origin : corsOrigins.split(",")) {
                origins.add(origin.trim());
            }
        }

        config.setAllowedOrigins(origins);

        // Metodos HTTP permitidos
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Headers permitidos
        config.setAllowedHeaders(Arrays.asList("*"));

        // Permite enviar cookies/credenciais
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
