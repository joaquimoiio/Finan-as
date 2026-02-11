package com.financeiro.repository;

import com.financeiro.model.Meta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Repository de Meta - acessa a tabela de metas no banco.
 */
public interface MetaRepository extends JpaRepository<Meta, Long> {

    // Busca todas as metas de um usuario
    List<Meta> findByUsuarioId(Long usuarioId);
}
