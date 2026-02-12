import { useState, useEffect } from 'react'
import { useMesAno } from '../components/Layout'
import { getDashboard, getMetas, criarMeta, atualizarMeta, deletarMeta } from '../services/api'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import { Plus, Pencil, Trash2, Target, Calculator, TrendingUp } from 'lucide-react'

const formatarMoeda = (valor) =>
  (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

/**
 * Pagina de Planejamento — dividida em 3 secoes:
 * 1. Regra 50/30/20 com barras de progresso e sugestoes
 * 2. Simulador "Quanto posso investir"
 * 3. Metas financeiras com progresso visual
 */
function Planejamento() {
  const { mes, ano } = useMesAno()
  const [dashboard, setDashboard] = useState(null)
  const [metas, setMetas] = useState([])
  const [carregando, setCarregando] = useState(true)

  // Modal de metas
  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [confirmAberto, setConfirmAberto] = useState(false)
  const [idParaDeletar, setIdParaDeletar] = useState(null)

  const [form, setForm] = useState({
    descricao: '', valorMeta: '', valorAtual: '0', aporteMensal: ''
  })

  useEffect(() => { carregarDados() }, [mes, ano])

  const carregarDados = async () => {
    setCarregando(true)
    try {
      const [dashResp, metasResp] = await Promise.all([
        getDashboard(mes, ano),
        getMetas()
      ])
      setDashboard(dashResp.data)
      setMetas(metasResp.data)
    } catch (error) {
      console.log('Erro ao carregar planejamento:', error)
    } finally {
      setCarregando(false)
    }
  }

  // CRUD de metas
  const abrirNovo = () => {
    setEditando(null)
    setForm({ descricao: '', valorMeta: '', valorAtual: '0', aporteMensal: '' })
    setModalAberto(true)
  }

  const abrirEditar = (meta) => {
    setEditando(meta)
    setForm({
      descricao: meta.descricao, valorMeta: meta.valorMeta,
      valorAtual: meta.valorAtual, aporteMensal: meta.aporteMensal
    })
    setModalAberto(true)
  }

  const salvar = async (e) => {
    e.preventDefault()
    const valorMetaNum = parseFloat(form.valorMeta)
    const valorAtualNum = parseFloat(form.valorAtual) || 0
    const aporteNum = parseFloat(form.aporteMensal)
    if (isNaN(valorMetaNum) || valorMetaNum <= 0) {
      alert('Valor da meta deve ser um numero maior que zero')
      return
    }
    if (isNaN(aporteNum) || aporteNum < 0) {
      alert('Aporte mensal deve ser um numero valido')
      return
    }
    try {
      const dados = {
        ...form,
        valorMeta: valorMetaNum,
        valorAtual: valorAtualNum,
        aporteMensal: aporteNum
      }
      if (editando) await atualizarMeta(editando.id, dados)
      else await criarMeta(dados)
      setModalAberto(false)
      carregarDados()
    } catch (error) {
      console.log('Erro ao salvar meta:', error)
      alert('Erro ao salvar meta')
    }
  }

  const deletar = async () => {
    await deletarMeta(idParaDeletar)
    carregarDados()
  }

  if (carregando) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="spinner"></div>
        <span className="text-gray-400 text-sm">Carregando planejamento...</span>
      </div>
    )
  }

  // Valores do dashboard
  const totalReceitas = dashboard?.totalReceitas || 0
  const despesasFixas = dashboard?.despesasFixas || 0
  const despesasVariaveis = dashboard?.despesasVariaveis || 0
  const percentualInvestido = dashboard?.percentualInvestido || 0
  const gastoInvestimentos = totalReceitas > 0 ? (percentualInvestido / 100) * totalReceitas : 0

  // Regra 50/30/20
  const meta50 = totalReceitas * 0.5
  const meta30 = totalReceitas * 0.3
  const meta20 = totalReceitas * 0.2

  // Simulador
  const reservaEmergencia = totalReceitas * 0.10
  const disponivelInvestir = totalReceitas - despesasFixas - despesasVariaveis - reservaEmergencia
  const aindaPodeInvestir = disponivelInvestir - gastoInvestimentos

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Planejamento</h2>

      {/* ===== SECAO 1: REGRA 50/30/20 ===== */}
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Target size={22} className="text-[#2E75B6]" />
          <h3 className="text-lg font-semibold text-white">Regra 50/30/20</h3>
        </div>

        {totalReceitas > 0 ? (
          <div className="space-y-6">
            <BarraRegra
              label="Necessidades"
              percentMeta={50}
              metaValor={meta50}
              atual={despesasFixas}
              cor="bg-[#00B050]"
              sugestaoTexto="em necessidades"
            />
            <BarraRegra
              label="Desejos"
              percentMeta={30}
              metaValor={meta30}
              atual={despesasVariaveis}
              cor="bg-[#ED7D31]"
              sugestaoTexto="em desejos"
            />
            <BarraRegra
              label="Investimentos"
              percentMeta={20}
              metaValor={meta20}
              atual={gastoInvestimentos}
              cor="bg-[#7B68EE]"
              sugestaoTexto="em investimentos"
            />
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Registre receitas para ver a análise 50/30/20</p>
        )}
      </div>

      {/* ===== SECAO 2: SIMULADOR ===== */}
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-5">
          <Calculator size={22} className="text-[#7B68EE] shrink-0" />
          <h3 className="text-base sm:text-lg font-semibold text-white">Simulador — Quanto Posso Investir</h3>
        </div>

        {totalReceitas > 0 ? (
          <div className="space-y-3">
            <LinhaSimulador label="Receita Total" valor={totalReceitas} tipo="positivo" />
            <LinhaSimulador label="(-) Desp. Fixas" labelDesktop="(-) Despesas Fixas" valor={despesasFixas} tipo="negativo" />
            <LinhaSimulador label="(-) Desp. Variáveis" labelDesktop="(-) Despesas Variáveis Essenciais" valor={despesasVariaveis} tipo="negativo" />
            <LinhaSimulador label="(-) Reserva (10%)" labelDesktop="(-) Reserva Emergência (10%)" valor={reservaEmergencia} tipo="negativo" />

            <div className="border-t border-gray-700 pt-3">
              <LinhaSimulador label="= Disponível p/ Investir" labelDesktop="= Disponível para Investir" valor={disponivelInvestir} tipo="destaque" />
            </div>

            <LinhaSimulador label="(-) Já investido" labelDesktop="(-) Já investido este mês" valor={gastoInvestimentos} tipo="negativo" />

            <div className="border-t-2 border-gray-600 pt-3 sm:pt-4">
              <div className="flex justify-between items-center gap-2">
                <span className="text-white font-bold text-sm sm:text-lg">Ainda pode investir</span>
                <span className={`text-lg sm:text-2xl font-bold shrink-0 ${aindaPodeInvestir >= 0 ? 'text-[#00B050]' : 'text-[#FF4444]'}`}>
                  {formatarMoeda(Math.abs(aindaPodeInvestir))}
                </span>
              </div>
              {aindaPodeInvestir < 0 && (
                <p className="text-[#FF4444] text-xs mt-1">Você já investiu mais do que o disponível este mês</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Registre receitas e despesas para ver o simulador</p>
        )}
      </div>

      {/* ===== SECAO 3: METAS FINANCEIRAS ===== */}
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp size={22} className="text-[#00B050] shrink-0" />
            <h3 className="text-base sm:text-lg font-semibold text-white">Metas Financeiras</h3>
          </div>
          <button onClick={abrirNovo}
            className="flex items-center gap-1.5 sm:gap-2 bg-blue-600 text-white px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
          >
            <Plus size={16} /> <span className="hidden sm:inline">Nova</span> Meta
          </button>
        </div>

        {metas.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">
            Nenhuma meta criada ainda. Clique em "Nova Meta" para começar!
          </p>
        ) : (
          <div className="space-y-4">
            {metas.map((meta) => {
              const valorMeta = meta.valorMeta || 0
              const valorAtual = meta.valorAtual || 0
              const aporteMensal = meta.aporteMensal || 0
              const progresso = valorMeta > 0 ? (valorAtual / valorMeta) * 100 : 0
              const faltam = valorMeta - valorAtual
              const mesesRestantes = aporteMensal > 0 ? Math.ceil(Math.max(faltam, 0) / aporteMensal) : '∞'
              const atingida = progresso >= 100

              return (
                <div key={meta.id} className="bg-gray-700/50 rounded-lg p-3 sm:p-4">
                  {/* Cabecalho da meta */}
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium text-sm sm:text-base truncate mr-2">{meta.descricao}</h4>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button onClick={() => abrirEditar(meta)}
                        className="p-2 sm:p-1.5 rounded-lg active:bg-gray-600 text-blue-400 hover:text-blue-300 transition-colors">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => { setIdParaDeletar(meta.id); setConfirmAberto(true) }}
                        className="p-2 sm:p-1.5 rounded-lg active:bg-gray-600 text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Valores */}
                  <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-400 mb-2 gap-0.5">
                    <span className="text-xs sm:text-sm">{formatarMoeda(meta.valorAtual)} de {formatarMoeda(meta.valorMeta)}</span>
                    <span className={`text-xs sm:text-sm ${atingida ? 'text-[#00B050] font-medium' : ''}`}>{progresso.toFixed(0)}%</span>
                  </div>

                  {/* Barra de progresso */}
                  <div className="w-full bg-gray-600 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${atingida ? 'bg-[#00B050]' : 'bg-[#2E75B6]'}`}
                      style={{ width: `${Math.min(progresso, 100)}%` }}
                    />
                  </div>

                  {/* Detalhes */}
                  <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-gray-500 gap-0.5">
                    <span>Aporte: {formatarMoeda(meta.aporteMensal)}/mes</span>
                    <span>{atingida ? 'Meta atingida!' : `~${mesesRestantes} meses restantes`}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal de metas */}
      <Modal aberto={modalAberto} fechar={() => setModalAberto(false)} titulo={editando ? 'Editar Meta' : 'Nova Meta'}>
        <form onSubmit={salvar} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Descrição da Meta</label>
            <input type="text" value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              required placeholder="Ex: Viagem para Europa"
              className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Valor da Meta (R$)</label>
            <input type="number" step="0.01" min="0" value={form.valorMeta}
              onChange={(e) => setForm({ ...form, valorMeta: e.target.value })} required
              className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Valor Atual Guardado (R$)</label>
            <input type="number" step="0.01" min="0" value={form.valorAtual}
              onChange={(e) => setForm({ ...form, valorAtual: e.target.value })}
              className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Aporte Mensal (R$)</label>
            <input type="number" step="0.01" min="0" value={form.aporteMensal}
              onChange={(e) => setForm({ ...form, aporteMensal: e.target.value })} required
              className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {editando ? 'Atualizar' : 'Salvar'}
          </button>
        </form>
      </Modal>

      <ConfirmDialog aberto={confirmAberto} fechar={() => setConfirmAberto(false)} onConfirmar={deletar}
        mensagem="Tem certeza que deseja excluir esta meta?" />
    </div>
  )
}

/**
 * BarraRegra — barra de progresso para a regra 50/30/20.
 * Mostra meta vs real com sugestao se ultrapassar.
 */
function BarraRegra({ label, percentMeta, metaValor, atual, cor, sugestaoTexto }) {
  const percentReal = metaValor > 0 ? (atual / metaValor) * 100 : 0
  const ultrapassou = percentReal > 100
  const diferenca = metaValor - atual

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1.5 gap-0.5">
        <span className="text-white font-medium text-sm">{label} ({percentMeta}%)</span>
        <span className={`text-xs sm:text-sm ${ultrapassou ? 'text-[#FF4444]' : 'text-gray-400'}`}>
          {formatarMoeda(atual)} / {formatarMoeda(metaValor)}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3 sm:h-4 mb-1.5">
        <div
          className={`h-3 sm:h-4 rounded-full transition-all duration-500 ${ultrapassou ? 'bg-[#FF4444]' : cor}`}
          style={{ width: `${Math.min(percentReal, 100)}%` }}
        />
      </div>
      <p className={`text-xs ${ultrapassou ? 'text-[#FF4444]' : 'text-gray-500'}`}>
        {ultrapassou
          ? `Reduza ${formatarMoeda(Math.abs(diferenca))} ${sugestaoTexto}`
          : diferenca > 0
            ? `Sobra: ${formatarMoeda(diferenca)}`
            : `Invista mais ${formatarMoeda(Math.abs(diferenca))} ${sugestaoTexto}`
        }
      </p>
    </div>
  )
}

/**
 * LinhaSimulador — uma linha do simulador de investimento.
 */
function LinhaSimulador({ label, labelDesktop, valor, tipo }) {
  const estiloValor = {
    positivo: 'text-[#00B050]',
    negativo: 'text-[#FF4444]',
    destaque: 'text-[#2E75B6] text-base sm:text-lg font-bold',
  }

  return (
    <div className="flex justify-between items-center gap-2">
      {labelDesktop ? (
        <>
          <span className={`sm:hidden ${tipo === 'destaque' ? 'text-white font-medium text-sm' : 'text-gray-400 text-xs'}`}>{label}</span>
          <span className={`hidden sm:inline ${tipo === 'destaque' ? 'text-white font-medium' : 'text-gray-400 text-sm'}`}>{labelDesktop}</span>
        </>
      ) : (
        <span className={tipo === 'destaque' ? 'text-white font-medium text-sm sm:text-base' : 'text-gray-400 text-xs sm:text-sm'}>{label}</span>
      )}
      <span className={`font-medium shrink-0 text-sm sm:text-base ${estiloValor[tipo]}`}>
        {tipo === 'negativo' ? '- ' : ''}{formatarMoeda(valor)}
      </span>
    </div>
  )
}

export default Planejamento
