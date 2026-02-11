package com.financeiro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Entidade Despesa - representa um gasto/saida de dinheiro.
 * Tem categoria, forma de pagamento e status (pago ou pendente).
 * Vinculada a um usuario pelo usuarioId.
 */
@Entity
@Table(name = "despesas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Despesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate data;

    private String descricao;

    // Categorias: "Moradia", "Alimentacao", "Transporte", "Saude",
    // "Educacao", "Lazer", "Vestuario", "Investimentos", "Outros"
    private String categoria;

    // Tipo: "Fixa" ou "Variavel"
    private String tipo;

    // Forma de pagamento: "Dinheiro", "PIX", "Cartao Credito",
    // "Cartao Debito", "Transferencia", "Boleto"
    private String formaPagamento;

    private Double valor;

    // Status: "Pago" ou "Pendente"
    private String status;

    // ID do usuario dono dessa despesa
    private Long usuarioId;
}
