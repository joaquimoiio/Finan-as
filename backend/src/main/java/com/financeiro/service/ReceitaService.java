package com.financeiro.service;

import com.financeiro.model.Receita;
import com.financeiro.repository.ReceitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Service de Receita - logica de negocio para receitas.
 * Todas as operacoes filtram pelo usuario logado.
 */
@Service
public class ReceitaService {

    @Autowired
    private ReceitaRepository receitaRepository;

    @Autowired
    private UsuarioService usuarioService;

    /**
     * Lista receitas do usuario logado, filtradas por mes e ano.
     */
    public List<Receita> listar(int mes, int ano) {
        Long usuarioId = usuarioService.getUsuarioLogadoId();
        LocalDate inicio = LocalDate.of(ano, mes, 1);
        LocalDate fim = inicio.withDayOfMonth(inicio.lengthOfMonth());
        return receitaRepository.findByUsuarioIdAndDataBetween(usuarioId, inicio, fim);
    }

    /**
     * Busca uma receita por ID (verificando se pertence ao usuario).
     */
    public Receita buscarPorId(Long id) {
        Receita receita = receitaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receita nao encontrada"));

        // Verifica se a receita pertence ao usuario logado
        Long usuarioId = usuarioService.getUsuarioLogadoId();
        if (!receita.getUsuarioId().equals(usuarioId)) {
            throw new RuntimeException("Receita nao pertence ao usuario");
        }
        return receita;
    }

    /**
     * Salva uma nova receita para o usuario logado.
     */
    @Transactional
    public Receita salvar(Receita receita) {
        receita.setUsuarioId(usuarioService.getUsuarioLogadoId());
        return receitaRepository.save(receita);
    }

    /**
     * Atualiza uma receita existente.
     */
    @Transactional
    public Receita atualizar(Long id, Receita receitaAtualizada) {
        Receita receita = buscarPorId(id);

        if (receitaAtualizada.getValor() != null && receitaAtualizada.getValor() <= 0) {
            throw new RuntimeException("Valor deve ser maior que zero");
        }

        if (receitaAtualizada.getData() != null) receita.setData(receitaAtualizada.getData());
        if (receitaAtualizada.getFonte() != null) receita.setFonte(receitaAtualizada.getFonte());
        if (receitaAtualizada.getTipo() != null) receita.setTipo(receitaAtualizada.getTipo());
        if (receitaAtualizada.getValor() != null) receita.setValor(receitaAtualizada.getValor());
        receita.setObservacoes(receitaAtualizada.getObservacoes());

        return receitaRepository.save(receita);
    }

    /**
     * Deleta uma receita por ID.
     */
    public void deletar(Long id) {
        buscarPorId(id); // Verifica se existe e pertence ao usuario
        receitaRepository.deleteById(id);
    }
}
