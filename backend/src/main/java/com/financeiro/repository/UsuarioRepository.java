package com.financeiro.repository;

import com.financeiro.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository do Usuario - acessa a tabela de usuarios no banco.
 * O Spring Data JPA gera a implementacao automaticamente.
 */
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Busca usuario pelo email (usado no login)
    Optional<Usuario> findByEmail(String email);

    // Verifica se ja existe um usuario com esse email (usado no registro)
    boolean existsByEmail(String email);
}
