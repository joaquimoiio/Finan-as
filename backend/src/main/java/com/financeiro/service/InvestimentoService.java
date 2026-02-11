package com.financeiro.service;

import com.financeiro.model.Investimento;
import com.financeiro.repository.InvestimentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service de Investimento - logica de negocio para investimentos.
 * Todas as operacoes filtram pelo usuario logado.
 */
@Service
public class InvestimentoService {

    @Autowired
    private InvestimentoRepository investimentoRepository;

    @Autowired
    private UsuarioService usuarioService;

    /**
     * Lista todos os investimentos do usuario logado.
     */
    public List<Investimento> listar() {
        Long usuarioId = usuarioService.getUsuarioLogadoId();
        return investimentoRepository.findByUsuarioId(usuarioId);
    }

    /**
     * Busca um investimento por ID (verificando se pertence ao usuario).
     */
    public Investimento buscarPorId(Long id) {
        Investimento investimento = investimentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Investimento nao encontrado"));

        Long usuarioId = usuarioService.getUsuarioLogadoId();
        if (!investimento.getUsuarioId().equals(usuarioId)) {
            throw new RuntimeException("Investimento nao pertence ao usuario");
        }
        return investimento;
    }

    /**
     * Salva um novo investimento para o usuario logado.
     */
    public Investimento salvar(Investimento investimento) {
        investimento.setUsuarioId(usuarioService.getUsuarioLogadoId());
        return investimentoRepository.save(investimento);
    }

    /**
     * Atualiza um investimento existente.
     */
    public Investimento atualizar(Long id, Investimento investimentoAtualizado) {
        Investimento investimento = buscarPorId(id);

        investimento.setTipo(investimentoAtualizado.getTipo());
        investimento.setDescricao(investimentoAtualizado.getDescricao());
        investimento.setDataAporte(investimentoAtualizado.getDataAporte());
        investimento.setValorInvestido(investimentoAtualizado.getValorInvestido());
        investimento.setRentabilidadeEstimada(investimentoAtualizado.getRentabilidadeEstimada());
        investimento.setRentabilidadeReal(investimentoAtualizado.getRentabilidadeReal());
        investimento.setStatus(investimentoAtualizado.getStatus());

        return investimentoRepository.save(investimento);
    }

    /**
     * Deleta um investimento por ID.
     */
    public void deletar(Long id) {
        buscarPorId(id);
        investimentoRepository.deleteById(id);
    }
}
