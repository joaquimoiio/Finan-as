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
    try {
      const dados = {
        ...form,
        valorInvestido: parseFloat(form.valorInvestido),
        rentabilidadeEstimada: parseFloat(form.rentabilidadeEstimada),
        rentabilidadeReal: parseFloat(form.rentabilidadeReal)
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
    try {
      await deletarInvestimento(idParaDeletar)
      carregarInvestimentos()
    } catch (error) {
      console.log('Erro ao deletar investimento:', error)
    }
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

      {/* Tabela */}
      {!carregando && !erro && (
        <div className="bg-gray-800 rounded-lg overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-3 py-3 text-gray-400 font-medium">Tipo</th>
                <th className="px-3 py-3 text-gray-400 font-medium">Descrição</th>
                <th className="px-3 py-3 text-gray-400 font-medium hidden md:table-cell">Data Aporte</th>
                <th className="px-3 py-3 text-gray-400 font-medium text-right">Investido</th>
                <th className="px-3 py-3 text-gray-400 font-medium text-right hidden lg:table-cell">Rent. Est.</th>
                <th className="px-3 py-3 text-gray-400 font-medium text-right hidden lg:table-cell">Rent. Real</th>
                <th className="px-3 py-3 text-gray-400 font-medium text-right">Valor Atual</th>
                <th className="px-3 py-3 text-gray-400 font-medium text-right">Lucro</th>
                <th className="px-3 py-3 text-gray-400 font-medium text-center">Status</th>
                <th className="px-3 py-3 text-gray-400 font-medium text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {investimentos.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-4 py-12 text-center text-gray-500">
                    Nenhum investimento registrado
                  </td>
                </tr>
              ) : (
                investimentos.map((inv, i) => {
                  const rentReal = inv.rentabilidadeReal || 0
                  const valorAtual = inv.valorInvestido * (1 + rentReal / 100)
                  const lucro = valorAtual - inv.valorInvestido

                  return (
                    <tr key={inv.id} className={`border-b border-gray-700/50 ${i % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/50'}`}>
                      <td className="px-3 py-3 text-white">{inv.tipo}</td>
                      <td className="px-3 py-3 text-white">{inv.descricao}</td>
                      <td className="px-3 py-3 text-gray-400 hidden md:table-cell">{formatarData(inv.dataAporte)}</td>
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
                        }`}>
                          {inv.status}
                        </span>
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
                })
              )}
            </tbody>
          </table>
        </div>
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
