package com.financeiro.repository;

import com.financeiro.model.Investimento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Repository de Investimento - acessa a tabela de investimentos no banco.
 */
public interface InvestimentoRepository extends JpaRepository<Investimento, Long> {

    // Busca todos os investimentos de um usuario
    List<Investimento> findByUsuarioId(Long usuarioId);
}
