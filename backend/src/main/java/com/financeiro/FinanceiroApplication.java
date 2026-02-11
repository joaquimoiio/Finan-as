package com.financeiro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Classe principal do sistema financeiro.
 * Inicia o Spring Boot e sobe o servidor na porta 8080.
 *
 * Para rodar: mvn spring-boot:run
 * Console H2: http://localhost:8080/h2-console
 */
@SpringBootApplication
public class FinanceiroApplication {

    public static void main(String[] args) {
        SpringApplication.run(FinanceiroApplication.class, args);
        System.out.println("===========================================");
        System.out.println("  Sistema Financeiro rodando na porta 8080");
        System.out.println("  H2 Console: http://localhost:8080/h2-console");
        System.out.println("===========================================");
    }
}
