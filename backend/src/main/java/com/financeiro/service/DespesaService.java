package com.financeiro.service;

import com.financeiro.model.Despesa;
import com.financeiro.repository.DespesaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Service de Despesa - logica de negocio para despesas.
 * Todas as operacoes filtram pelo usuario logado.
 */
@Service
public class DespesaService {

    @Autowired
    private DespesaRepository despesaRepository;

    @Autowired
    private UsuarioService usuarioService;

    /**
     * Lista despesas do usuario logado, filtradas por mes e ano.
     */
    public List<Despesa> listar(int mes, int ano) {
        Long usuarioId = usuarioService.getUsuarioLogadoId();
        LocalDate inicio = LocalDate.of(ano, mes, 1);
        LocalDate fim = inicio.withDayOfMonth(inicio.lengthOfMonth());
        return despesaRepository.findByUsuarioIdAndDataBetween(usuarioId, inicio, fim);
    }

    /**
     * Busca uma despesa por ID (verificando se pertence ao usuario).
     */
    public Despesa buscarPorId(Long id) {
        Despesa despesa = despesaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Despesa nao encontrada"));

        Long usuarioId = usuarioService.getUsuarioLogadoId();
        if (!despesa.getUsuarioId().equals(usuarioId)) {
            throw new RuntimeException("Despesa nao pertence ao usuario");
        }
        return despesa;
    }

    /**
     * Salva uma nova despesa para o usuario logado.
     */
    @Transactional
    public Despesa salvar(Despesa despesa) {
        despesa.setUsuarioId(usuarioService.getUsuarioLogadoId());
        return despesaRepository.save(despesa);
    }

    /**
     * Atualiza uma despesa existente.
     */
    @Transactional
    public Despesa atualizar(Long id, Despesa despesaAtualizada) {
        Despesa despesa = buscarPorId(id);

        if (despesaAtualizada.getValor() != null && despesaAtualizada.getValor() <= 0) {
            throw new RuntimeException("Valor deve ser maior que zero");
        }

        if (despesaAtualizada.getData() != null) despesa.setData(despesaAtualizada.getData());
        if (despesaAtualizada.getDescricao() != null) despesa.setDescricao(despesaAtualizada.getDescricao());
        if (despesaAtualizada.getCategoria() != null) despesa.setCategoria(despesaAtualizada.getCategoria());
        if (despesaAtualizada.getTipo() != null) despesa.setTipo(despesaAtualizada.getTipo());
        if (despesaAtualizada.getFormaPagamento() != null) despesa.setFormaPagamento(despesaAtualizada.getFormaPagamento());
        if (despesaAtualizada.getValor() != null) despesa.setValor(despesaAtualizada.getValor());
        if (despesaAtualizada.getStatus() != null) despesa.setStatus(despesaAtualizada.getStatus());

        return despesaRepository.save(despesa);
    }

    /**
     * Deleta uma despesa por ID.
     */
    @Transactional
    public void deletar(Long id) {
        buscarPorId(id);
        despesaRepository.deleteById(id);
    }
}
