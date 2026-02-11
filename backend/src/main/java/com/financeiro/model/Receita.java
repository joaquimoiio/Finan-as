package com.financeiro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Entidade Receita - representa uma entrada de dinheiro.
 * Pode ser fixa (salario) ou variavel (freelance, bonus, etc).
 * Vinculada a um usuario pelo usuarioId.
 */
@Entity
@Table(name = "receitas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Receita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate data;

    // Fonte da receita: "Salario", "Freelance", "Bonus", etc.
    private String fonte;

    // Tipo: "Fixa" ou "Variavel"
    private String tipo;

    private Double valor;

    private String observacoes;

    // ID do usuario dono dessa receita
    private Long usuarioId;
}
