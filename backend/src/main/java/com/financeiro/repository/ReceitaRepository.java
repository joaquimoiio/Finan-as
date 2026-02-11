package com.financeiro.repository;

import com.financeiro.model.Receita;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository de Receita - acessa a tabela de receitas no banco.
 * Tem queries para buscar por usuario e por periodo.
 */
public interface ReceitaRepository extends JpaRepository<Receita, Long> {

    // Busca todas as receitas de um usuario
    List<Receita> findByUsuarioId(Long usuarioId);

    // Busca receitas de um usuario em um periodo (usado para filtrar por mes)
    List<Receita> findByUsuarioIdAndDataBetween(Long usuarioId, LocalDate inicio, LocalDate fim);
}
