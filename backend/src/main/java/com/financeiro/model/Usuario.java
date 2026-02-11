package com.financeiro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidade Usuario - representa um usuario do sistema.
 * Cada usuario tem seu proprio conjunto de receitas, despesas, investimentos e metas.
 * A senha eh salva criptografada com BCrypt.
 */
@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(unique = true)
    private String email;

    private String senha;
}
