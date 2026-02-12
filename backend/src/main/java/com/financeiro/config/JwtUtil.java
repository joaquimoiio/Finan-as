package com.financeiro.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Classe utilitaria para lidar com tokens JWT.
 * Gera, valida e extrai informacoes do token.
 */
@Component
public class JwtUtil {

    // Chave secreta definida no application.properties
    @Value("${jwt.secret}")
    private String secret;

    // Tempo de expiracao do token (24h por padrao)
    @Value("${jwt.expiration}")
    private Long expiration;

    // Cria a chave de assinatura a partir da string secreta
    private SecretKey getChave() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Gera um token JWT para o email informado.
     * O token expira apos o tempo configurado.
     */
    public String gerarToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getChave())
                .compact();
    }

    /**
     * Valida se o token eh valido (assinatura correta e nao expirado).
     */
    public boolean validarToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getChave())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            System.out.println("Token invalido: " + e.getMessage());
            return false;
        }
    }

    /**
     * Extrai o email (subject) do token JWT.
     * Retorna null se o token for invalido.
     */
    public String getEmail(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getChave())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return claims.getSubject();
        } catch (Exception e) {
            System.out.println("Erro ao extrair email do token: " + e.getMessage());
            return null;
        }
    }
}
