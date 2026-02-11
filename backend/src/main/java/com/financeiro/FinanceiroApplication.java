package com.financeiro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;


@SpringBootApplication
public class FinanceiroApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(FinanceiroApplication.class, args);
        Environment env = context.getEnvironment();
        String porta = env.getProperty("server.port", "8080");
        System.out.println("===========================================");
        System.out.println("  Sistema Financeiro rodando na porta " + porta);
        System.out.println("===========================================");
    }
}
