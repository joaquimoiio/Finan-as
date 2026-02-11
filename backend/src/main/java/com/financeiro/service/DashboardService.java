package com.financeiro.service;

import com.financeiro.model.Despesa;
import com.financeiro.model.Investimento;
import com.financeiro.model.Receita;
import com.financeiro.repository.DespesaRepository;
import com.financeiro.repository.InvestimentoRepository;
import com.financeiro.repository.ReceitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service do Dashboard - calcula todos os indicadores financeiros do mes.
 * Retorna um Map com os dados para o frontend montar os graficos e KPIs.
 */
@Service
public class DashboardService {

    @Autowired
    private ReceitaRepository receitaRepository;

    @Autowired
    private DespesaRepository despesaRepository;

    @Autowired
    private InvestimentoRepository investimentoRepository;

    @Autowired
    private UsuarioService usuarioService;

    /**
     * Calcula todos os indicadores do dashboard para o mes/ano informado.
     */
    public Map<String, Object> getDashboard(int mes, int ano) {
        Long usuarioId = usuarioService.getUsuarioLogadoId();
        Map<String, Object> dashboard = new LinkedHashMap<>();

        // Define o periodo do mes
        LocalDate inicio = LocalDate.of(ano, mes, 1);
        LocalDate fim = inicio.withDayOfMonth(inicio.lengthOfMonth());

        // Busca receitas e despesas do mes
        List<Receita> receitas = receitaRepository
                .findByUsuarioIdAndDataBetween(usuarioId, inicio, fim);
        List<Despesa> despesas = despesaRepository
                .findByUsuarioIdAndDataBetween(usuarioId, inicio, fim);

        // Busca todos os investimentos do usuario
        List<Investimento> investimentos = investimentoRepository
                .findByUsuarioId(usuarioId);

        // --- Calculos basicos ---

        // Total de receitas do mes
        double totalReceitas = receitas.stream()
                .mapToDouble(Receita::getValor)
                .sum();
        dashboard.put("totalReceitas", totalReceitas);

        // Total de despesas do mes
        double totalDespesas = despesas.stream()
                .mapToDouble(Despesa::getValor)
                .sum();
        dashboard.put("totalDespesas", totalDespesas);

        // Saldo do mes (receitas - despesas)
        double saldo = totalReceitas - totalDespesas;
        dashboard.put("saldo", saldo);

        // Percentual de gastos (despesas / receitas * 100)
        double percentualGastos = totalReceitas > 0
                ? (totalDespesas / totalReceitas) * 100
                : 0;
        dashboard.put("percentualGastos", Math.round(percentualGastos * 100.0) / 100.0);

        // Percentual investido (despesas na categoria "Investimentos" / receitas * 100)
        double gastoInvestimentos = despesas.stream()
                .filter(d -> "Investimentos".equals(d.getCategoria()))
                .mapToDouble(Despesa::getValor)
                .sum();
        double percentualInvestido = totalReceitas > 0
                ? (gastoInvestimentos / totalReceitas) * 100
                : 0;
        dashboard.put("percentualInvestido", Math.round(percentualInvestido * 100.0) / 100.0);

        // --- Gastos por categoria ---

        // Agrupa despesas por categoria e calcula valor e percentual
        List<Map<String, Object>> gastosPorCategoria = new ArrayList<>();
        Map<String, Double> categoriasMap = despesas.stream()
                .collect(Collectors.groupingBy(
                        Despesa::getCategoria,
                        Collectors.summingDouble(Despesa::getValor)
                ));

        for (Map.Entry<String, Double> entry : categoriasMap.entrySet()) {
            Map<String, Object> categoria = new HashMap<>();
            categoria.put("categoria", entry.getKey());
            categoria.put("valor", entry.getValue());
            double percentual = totalDespesas > 0
                    ? (entry.getValue() / totalDespesas) * 100
                    : 0;
            categoria.put("percentual", Math.round(percentual * 100.0) / 100.0);
            gastosPorCategoria.add(categoria);
        }

        // Ordena por valor (maior primeiro)
        gastosPorCategoria.sort((a, b) ->
                Double.compare((Double) b.get("valor"), (Double) a.get("valor")));
        dashboard.put("gastosPorCategoria", gastosPorCategoria);

        // --- Investimentos ---

        // Total investido (soma de todos os investimentos ativos)
        double totalInvestido = investimentos.stream()
                .filter(i -> "Ativo".equals(i.getStatus()))
                .mapToDouble(Investimento::getValorInvestido)
                .sum();
        dashboard.put("totalInvestido", totalInvestido);

        // Patrimonio atual (valor investido + rentabilidade real)
        double patrimonioAtual = investimentos.stream()
                .filter(i -> "Ativo".equals(i.getStatus()))
                .mapToDouble(i -> {
                    double rentReal = i.getRentabilidadeReal() != null
                            ? i.getRentabilidadeReal() : 0;
                    return i.getValorInvestido() * (1 + rentReal / 100);
                })
                .sum();
        dashboard.put("patrimonioAtual", Math.round(patrimonioAtual * 100.0) / 100.0);

        // --- Despesas pendentes ---

        double despesasPendentes = despesas.stream()
                .filter(d -> "Pendente".equals(d.getStatus()))
                .mapToDouble(Despesa::getValor)
                .sum();
        dashboard.put("despesasPendentes", despesasPendentes);

        // --- Despesas fixas e variaveis (para regra 50/30/20) ---

        double despesasFixas = despesas.stream()
                .filter(d -> "Fixa".equals(d.getTipo()))
                .mapToDouble(Despesa::getValor)
                .sum();
        dashboard.put("despesasFixas", despesasFixas);

        double despesasVariaveis = despesas.stream()
                .filter(d -> "Variavel".equals(d.getTipo()) || "Variável".equals(d.getTipo()))
                .filter(d -> !"Investimentos".equals(d.getCategoria()))
                .mapToDouble(Despesa::getValor)
                .sum();
        dashboard.put("despesasVariaveis", despesasVariaveis);

        return dashboard;
    }
}
