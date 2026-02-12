import { useState, useEffect } from 'react'
import { getInvestimentos, criarInvestimento, atualizarInvestimento, deletarInvestimento } from '../services/api'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import KPICard from '../components/KPICard'
import { Plus, Pencil, Trash2, TrendingUp, Wallet, DollarSign } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

// Tipos de investimento
const TIPOS = ['CDB', 'Ações', 'FIIs', 'Cripto', 'Tesouro Direto', 'Poupança', 'Outros']

// Cores para o grafico de alocacao
const CORES = ['#00B050', '#FF4444', '#2E75B6', '#ED7D31', '#7B68EE', '#FFD700', '#00CED1']

const formatarMoeda = (valor) =>
  (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const formatarData = (data) => {
  if (!data) return ''
  return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR')
}

/**
 * Pagina de Investimentos — tabela com CRUD, KPIs de resumo e grafico de alocacao.
 * Calcula Valor Atual e Lucro/Prejuizo no frontend.
 */
function Investimentos() {
  const [investimentos, setInvestimentos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [confirmAberto, setConfirmAberto] = useState(false)
  const [idParaDeletar, setIdParaDeletar] = useState(null)

  const [form, setForm] = useState({
    tipo: 'CDB', descricao: '', dataAporte: '', valorInvestido: '',
    rentabilidadeEstimada: '', rentabilidadeReal: '0', status: 'Ativo'
  })

  useEffect(() => { carregarInvestimentos() }, [])

  const carregarInvestimentos = async () => {
    setCarregando(true)
    setErro('')
    try {
      const resp = await getInvestimentos()
      setInvestimentos(resp.data)
    } catch (error) {
      console.log('Erro ao carregar investimentos:', error)
      setErro('Erro ao carregar investimentos')
    } finally {
      setCarregando(false)
    }
  }

  // Calculos de resumo (apenas investimentos ativos)
  const ativos = investimentos.filter(i => i.status === 'Ativo')
  const totalInvestido = ativos.reduce((s, i) => s + (i.valorInvestido || 0), 0)
  const patrimonioAtual = ativos.reduce((s, i) => {
    const rent = i.rentabilidadeReal || 0
    return s + i.valorInvestido * (1 + rent / 100)
  }, 0)
  const lucroPrejuizo = patrimonioAtual - totalInvestido

  // Dados do grafico de pizza (alocacao por tipo)
  const alocacao = {}
  ativos.forEach(i => { alocacao[i.tipo] = (alocacao[i.tipo] || 0) + i.valorInvestido })
  const dadosPizza = Object.entries(alocacao).map(([name, value]) => ({ name, value }))

  const abrirNovo = () => {
    setEditando(null)
    setForm({
      tipo: 'CDB', descricao: '', dataAporte: '', valorInvestido: '',
      rentabilidadeEstimada: '', rentabilidadeReal: '0', status: 'Ativo'
    })
    setModalAberto(true)
  }

  const abrirEditar = (inv) => {
    setEditando(inv)
    setForm({
      tipo: inv.tipo, descricao: inv.descricao, dataAporte: inv.dataAporte,
      valorInvestido: inv.valorInvestido, rentabilidadeEstimada: inv.rentabilidadeEstimada,
      rentabilidadeReal: inv.rentabilidadeReal || 0, status: inv.status
    })
    setModalAberto(true)
  }

  const salvar = async (e) => {
    e.preventDefault()
    const valorNum = parseFloat(form.valorInvestido)
    const rentEstNum = parseFloat(form.rentabilidadeEstimada)
    if (isNaN(valorNum) || valorNum <= 0) {
      alert('Valor investido deve ser um numero maior que zero')
      return
    }
    if (isNaN(rentEstNum)) {
      alert('Rentabilidade estimada deve ser um numero valido')
      return
    }
    try {
      const dados = {
        ...form,
        valorInvestido: valorNum,
        rentabilidadeEstimada: rentEstNum,
        rentabilidadeReal: parseFloat(form.rentabilidadeReal) || 0
      }
      if (editando) await atualizarInvestimento(editando.id, dados)
      else await criarInvestimento(dados)
      setModalAberto(false)
      carregarInvestimentos()
    } catch (error) {
      console.log('Erro ao salvar investimento:', error)
      alert('Erro ao salvar investimento')
    }
  }

  const deletar = async () => {
    await deletarInvestimento(idParaDeletar)
    carregarInvestimentos()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Investimentos</h2>
        <button onClick={abrirNovo}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} /> Novo Investimento
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KPICard titulo="Total Investido" valor={formatarMoeda(totalInvestido)} icone={Wallet} cor="blue" />
        <KPICard titulo="Patrimônio Atual" valor={formatarMoeda(patrimonioAtual)} icone={TrendingUp} cor="purple" />
        <KPICard titulo="Lucro / Prejuízo" valor={formatarMoeda(lucroPrejuizo)} icone={DollarSign} cor={lucroPrejuizo >= 0 ? 'green' : 'red'} />
      </div>

      {/* Grafico de alocacao */}
      {dadosPizza.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-5 mb-6">
          <h3 className="text-white font-semibold mb-4">Alocação por Tipo</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={dadosPizza} cx="50%" cy="50%" outerRadius={90} innerRadius={35} dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {dadosPizza.map((_, i) => (
                  <Cell key={i} fill={CORES[i % CORES.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                formatter={(value) => [formatarMoeda(value), 'Valor']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {carregando && <div className="flex justify-center py-12"><div className="spinner"></div></div>}
      {erro && <p className="text-center text-red-400 py-8">{erro}</p>}

      {/* Lista de investimentos */}
      {!carregando && !erro && investimentos.length === 0 && (
        <div className="bg-gray-800 rounded-lg px-4 py-12 text-center text-gray-500">
          Nenhum investimento registrado
        </div>
      )}

      {!carregando && !erro && investimentos.length > 0 && (
        <>
          {/* Cards no mobile */}
          <div className="space-y-3 md:hidden">
            {investimentos.map((inv) => {
              const rentReal = inv.rentabilidadeReal || 0
              const valorAtual = inv.valorInvestido * (1 + rentReal / 100)
              const lucro = valorAtual - inv.valorInvestido

              return (
                <div key={inv.id} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          inv.status === 'Ativo' ? 'bg-green-500/15 text-green-400' : 'bg-gray-600/50 text-gray-300'
                        }`}>{inv.tipo}</span>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-xs ${
                          inv.status === 'Ativo' ? 'text-green-500' : 'text-gray-500'
                        }`}>{inv.status}</span>
                      </div>
                      <p className="text-white font-medium truncate">{inv.descricao}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{formatarData(inv.dataAporte)}</p>
                    </div>
                    <div className="flex items-center gap-0.5 ml-2 shrink-0">
                      <button onClick={() => abrirEditar(inv)}
                        className="p-2.5 rounded-lg active:bg-gray-700 text-blue-400">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => { setIdParaDeletar(inv.id); setConfirmAberto(true) }}
                        className="p-2.5 rounded-lg active:bg-gray-700 text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  {/* Valores em grid 2x2 */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-xs">Investido</span>
                      <span className="text-white text-xs font-medium">{formatarMoeda(inv.valorInvestido)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-xs">Atual</span>
                      <span className="text-white text-xs font-medium">{formatarMoeda(valorAtual)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-xs">Est. / Real</span>
                      <span className="text-gray-400 text-xs">{inv.rentabilidadeEstimada}% / {rentReal}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-xs">Lucro</span>
                      <span className={`text-xs font-bold ${lucro >= 0 ? 'text-[#00B050]' : 'text-[#FF4444]'}`}>
                        {formatarMoeda(lucro)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Tabela no desktop */}
          <div className="hidden md:block bg-gray-800 rounded-lg overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-3 py-3 text-gray-400 font-medium">Tipo</th>
                  <th className="px-3 py-3 text-gray-400 font-medium">Descricao</th>
                  <th className="px-3 py-3 text-gray-400 font-medium hidden lg:table-cell">Data Aporte</th>
                  <th className="px-3 py-3 text-gray-400 font-medium text-right">Investido</th>
                  <th className="px-3 py-3 text-gray-400 font-medium text-right hidden lg:table-cell">Rent. Est.</th>
                  <th className="px-3 py-3 text-gray-400 font-medium text-right hidden lg:table-cell">Rent. Real</th>
                  <th className="px-3 py-3 text-gray-400 font-medium text-right">Valor Atual</th>
                  <th className="px-3 py-3 text-gray-400 font-medium text-right">Lucro</th>
                  <th className="px-3 py-3 text-gray-400 font-medium text-center">Status</th>
                  <th className="px-3 py-3 text-gray-400 font-medium text-center">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {investimentos.map((inv, i) => {
                  const rentReal = inv.rentabilidadeReal || 0
                  const valorAtual = inv.valorInvestido * (1 + rentReal / 100)
                  const lucro = valorAtual - inv.valorInvestido
                  return (
                    <tr key={inv.id} className={`border-b border-gray-700/50 ${i % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/50'}`}>
                      <td className="px-3 py-3 text-white">{inv.tipo}</td>
                      <td className="px-3 py-3 text-white">{inv.descricao}</td>
                      <td className="px-3 py-3 text-gray-400 hidden lg:table-cell">{formatarData(inv.dataAporte)}</td>
                      <td className="px-3 py-3 text-white text-right">{formatarMoeda(inv.valorInvestido)}</td>
                      <td className="px-3 py-3 text-gray-400 text-right hidden lg:table-cell">{inv.rentabilidadeEstimada}%</td>
                      <td className="px-3 py-3 text-gray-400 text-right hidden lg:table-cell">{rentReal}%</td>
                      <td className="px-3 py-3 text-white text-right font-medium">{formatarMoeda(valorAtual)}</td>
                      <td className={`px-3 py-3 text-right font-semibold ${lucro >= 0 ? 'text-[#00B050]' : 'text-[#FF4444]'}`}>
                        {formatarMoeda(lucro)}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                          inv.status === 'Ativo' ? 'bg-green-500/15 text-green-400' : 'bg-gray-600/50 text-gray-300'
                        }`}>{inv.status}</span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => abrirEditar(inv)} className="p-1.5 rounded hover:bg-gray-700 text-blue-400 hover:text-blue-300 transition-colors">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => { setIdParaDeletar(inv.id); setConfirmAberto(true) }} className="p-1.5 rounded hover:bg-gray-700 text-red-400 hover:text-red-300 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal */}
      <Modal aberto={modalAberto} fechar={() => setModalAberto(false)} titulo={editando ? 'Editar Investimento' : 'Novo Investimento'}>
        <form onSubmit={salvar} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Tipo</label>
            <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Descrição</label>
            <input type="text" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              required placeholder="Ex: CDB Banco Inter 120% CDI"
              className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Data do Aporte</label>
            <input type="date" value={form.dataAporte} onChange={(e) => setForm({ ...form, dataAporte: e.target.value })}
              required
              className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Valor Investido (R$)</label>
            <input type="number" step="0.01" min="0" value={form.valorInvestido}
              onChange={(e) => setForm({ ...form, valorInvestido: e.target.value })} required
              className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Rent. Estimada (%)</label>
              <input type="number" step="0.1" value={form.rentabilidadeEstimada}
                onChange={(e) => setForm({ ...form, rentabilidadeEstimada: e.target.value })} required placeholder="12.5"
                className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Rent. Real (%)</label>
              <input type="number" step="0.1" value={form.rentabilidadeReal}
                onChange={(e) => setForm({ ...form, rentabilidadeReal: e.target.value })} placeholder="0"
                className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Ativo">Ativo</option>
              <option value="Resgatado">Resgatado</option>
            </select>
          </div>
          <button type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {editando ? 'Atualizar' : 'Salvar'}
          </button>
        </form>
      </Modal>

      <ConfirmDialog aberto={confirmAberto} fechar={() => setConfirmAberto(false)} onConfirmar={deletar}
        mensagem="Tem certeza que deseja excluir este investimento?" />
    </div>
  )
}

export default Investimentos
