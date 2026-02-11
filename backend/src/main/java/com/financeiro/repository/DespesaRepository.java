package com.financeiro.repository;

import com.financeiro.model.Despesa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository de Despesa - acessa a tabela de despesas no banco.
 * Tem queries para buscar por usuario e por periodo.
 */
public interface DespesaRepository extends JpaRepository<Despesa, Long> {

    // Busca todas as despesas de um usuario
    List<Despesa> findByUsuarioId(Long usuarioId);

    // Busca despesas de um usuario em um periodo (usado para filtrar por mes)
    List<Despesa> findByUsuarioIdAndDataBetween(Long usuarioId, LocalDate inicio, LocalDate fim);
}
