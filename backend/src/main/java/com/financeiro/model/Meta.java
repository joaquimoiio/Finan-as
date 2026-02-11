package com.financeiro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidade Meta - representa uma meta financeira do usuario.
 * Exemplo: "Viagem para Europa" com valor de R$ 15.000.
 * Acompanha o valor atual guardado e o aporte mensal.
 */
@Entity
@Table(name = "metas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Meta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Descricao da meta: "Viagem", "Carro novo", "Reserva de emergencia", etc.
    private String descricao;

    // Quanto quer juntar no total
    private Double valorMeta;

    // Quanto ja tem guardado
    private Double valorAtual;

    // Quanto pretende guardar por mes
    private Double aporteMensal;

    // ID do usuario dono dessa meta
    private Long usuarioId;
}
