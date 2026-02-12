package com.financeiro.service;

import com.financeiro.model.Meta;
import com.financeiro.repository.MetaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service de Meta - logica de negocio para metas financeiras.
 * Todas as operacoes filtram pelo usuario logado.
 */
@Service
public class MetaService {

    @Autowired
    private MetaRepository metaRepository;

    @Autowired
    private UsuarioService usuarioService;

    /**
     * Lista todas as metas do usuario logado.
     */
    public List<Meta> listar() {
        Long usuarioId = usuarioService.getUsuarioLogadoId();
        return metaRepository.findByUsuarioId(usuarioId);
    }

    /**
     * Busca uma meta por ID (verificando se pertence ao usuario).
     */
    public Meta buscarPorId(Long id) {
        Meta meta = metaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meta nao encontrada"));

        Long usuarioId = usuarioService.getUsuarioLogadoId();
        if (!meta.getUsuarioId().equals(usuarioId)) {
            throw new RuntimeException("Meta nao pertence ao usuario");
        }
        return meta;
    }

    /**
     * Salva uma nova meta para o usuario logado.
     */
    @Transactional
    public Meta salvar(Meta meta) {
        meta.setUsuarioId(usuarioService.getUsuarioLogadoId());
        return metaRepository.save(meta);
    }

    /**
     * Atualiza uma meta existente.
     */
    @Transactional
    public Meta atualizar(Long id, Meta metaAtualizada) {
        Meta meta = buscarPorId(id);

        if (metaAtualizada.getValorMeta() != null && metaAtualizada.getValorMeta() <= 0) {
            throw new RuntimeException("Valor da meta deve ser maior que zero");
        }

        if (metaAtualizada.getDescricao() != null) meta.setDescricao(metaAtualizada.getDescricao());
        if (metaAtualizada.getValorMeta() != null) meta.setValorMeta(metaAtualizada.getValorMeta());
        if (metaAtualizada.getValorAtual() != null) meta.setValorAtual(metaAtualizada.getValorAtual());
        if (metaAtualizada.getAporteMensal() != null) meta.setAporteMensal(metaAtualizada.getAporteMensal());

        return metaRepository.save(meta);
    }

    /**
     * Deleta uma meta por ID.
     */
    @Transactional
    public void deletar(Long id) {
        buscarPorId(id);
        metaRepository.deleteById(id);
    }
}
