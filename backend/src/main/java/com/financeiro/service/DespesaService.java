package com.financeiro.service;

import com.financeiro.model.Despesa;
import com.financeiro.repository.DespesaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    public Despesa salvar(Despesa despesa) {
        despesa.setUsuarioId(usuarioService.getUsuarioLogadoId());
        return despesaRepository.save(despesa);
    }

    /**
     * Atualiza uma despesa existente.
     */
    public Despesa atualizar(Long id, Despesa despesaAtualizada) {
        Despesa despesa = buscarPorId(id);

        despesa.setData(despesaAtualizada.getData());
        despesa.setDescricao(despesaAtualizada.getDescricao());
        despesa.setCategoria(despesaAtualizada.getCategoria());
        despesa.setTipo(despesaAtualizada.getTipo());
        despesa.setFormaPagamento(despesaAtualizada.getFormaPagamento());
        despesa.setValor(despesaAtualizada.getValor());
        despesa.setStatus(despesaAtualizada.getStatus());

        return despesaRepository.save(despesa);
    }

    /**
     * Deleta uma despesa por ID.
     */
    public void deletar(Long id) {
        buscarPorId(id);
        despesaRepository.deleteById(id);
    }
}
