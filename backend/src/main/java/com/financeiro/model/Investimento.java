package com.financeiro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Entidade Investimento - representa um investimento financeiro.
 * Tipos: CDB, Acoes, FIIs, Cripto, Tesouro Direto, Poupanca, Outros.
 * Guarda valor investido e rentabilidade estimada/real.
 */
@Entity
@Table(name = "investimentos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Investimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Tipo: "CDB", "Acoes", "FIIs", "Cripto", "Tesouro Direto", "Poupanca", "Outros"
    private String tipo;

    private String descricao;

    private LocalDate dataAporte;

    private Double valorInvestido;

    // Rentabilidade estimada em percentual (ex: 12.5 = 12.5%)
    private Double rentabilidadeEstimada;

    // Rentabilidade real em percentual
    private Double rentabilidadeReal;

    // Status: "Ativo" ou "Resgatado"
    private String status;

    // ID do usuario dono desse investimento
    private Long usuarioId;
}
