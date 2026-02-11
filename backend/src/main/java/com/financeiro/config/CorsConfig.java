package com.financeiro.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

/**
 * Configuracao de CORS - permite que o frontend acesse a API.
 * Libera o localhost:5173 (Vite em desenvolvimento) e futuramente a URL do Vercel.
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Origens permitidas (frontend)
        config.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",  // Vite em desenvolvimento
                "http://localhost:3000"   // Caso use outra porta
        ));

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
