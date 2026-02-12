import { useState, useEffect } from 'react'
import { useMesAno } from '../components/Layout'
import { getDespesas, criarDespesa, atualizarDespesa, deletarDespesa } from '../services/api'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import { Plus, Pencil, Trash2 } from 'lucide-react'

// Categorias de despesa
const CATEGORIAS = [
  'Moradia', 'Alimentação', 'Transporte', 'Saúde',
  'Educação', 'Lazer', 'Vestuário', 'Investimentos', 'Outros'
]

// Formas de pagamento
const FORMAS_PAGAMENTO = [
  'Dinheiro', 'PIX', 'Cartão Crédito', 'Cartão Débito', 'Transferência', 'Boleto'
]

const formatarMoeda = (valor) =>
  (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const formatarData = (data) => {
  if (!data) return ''
  return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR')
}

/**
 * Pagina de Despesas — tabela com CRUD completo.
 * Tem filtro por categoria, badges de status e totalizador.
 */
function Despesas() {
  const { mes, ano } = useMesAno()
  const [despesas, setDespesas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')

  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [confirmAberto, setConfirmAberto] = useState(false)
  const [idParaDeletar, setIdParaDeletar] = useState(null)

  const [form, setForm] = useState({
    data: '', descricao: '', categoria: 'Outros', tipo: 'Variável',
    formaPagamento: 'PIX', valor: '', status: 'Pago'
  })

  useEffect(() => {
    carregarDespesas()
  }, [mes, ano])

  const carregarDespesas = async () => {
    setCarregando(true)
    setErro('')
    try {
      const resp = await getDespesas(mes, ano)
      setDespesas(resp.data)
    } catch (error) {
      console.log('Erro ao carregar despesas:', error)
      setErro('Erro ao carregar despesas')
    } finally {
      setCarregando(false)
    }
  }

  // Filtra por categoria
  const despesasFiltradas = filtroCategoria
    ? despesas.filter(d => d.categoria === filtroCategoria)
    : despesas

  const abrirNovo = () => {
    setEditando(null)
    setForm({
      data: '', descricao: '', categoria: 'Outros', tipo: 'Variável',
      formaPagamento: 'PIX', valor: '', status: 'Pago'
    })
    setModalAberto(true)
  }

  const abrirEditar = (despesa) => {
    setEditando(despesa)
    setForm({
      data: despesa.data,
      descricao: despesa.descricao,
      categoria: despesa.categoria,
      tipo: despesa.tipo,
      formaPagamento: despesa.formaPagamento,
      valor: despesa.valor,
      status: despesa.status
    })
    setModalAberto(true)
  }

  const salvar = async (e) => {
    e.preventDefault()
    const valorNumerico = parseFloat(form.valor)
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      alert('Valor deve ser um numero maior que zero')
      return
    }
    try {
      const dados = { ...form, valor: valorNumerico }
      if (editando) await atualizarDespesa(editando.id, dados)
      else await criarDespesa(dados)
      setModalAberto(false)
      carregarDespesas()
    } catch (error) {
      console.log('Erro ao salvar despesa:', error)
      alert('Erro ao salvar despesa')
    }
  }

  const deletar = async () => {
    await deletarDespesa(idParaDeletar)
    carregarDespesas()
  }

  const total = despesasFiltradas.reduce((soma, d) => soma + (d.valor || 0), 0)

  return (
    <div>
      {/* Cabecalho com filtro */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">Despesas</h2>
        <div className="flex items-center gap-3">
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas categorias</option>
            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button
            onClick={abrirNovo}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium
                       hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Nova Despesa
          </button>
        </div>
      </div>

      {carregando && (
        <div className="flex justify-center py-12"><div className="spinner"></div></div>
      )}
      {erro && <p className="text-center text-red-400 py-8">{erro}</p>}

      {/* Lista de despesas */}
      {!carregando && !erro && despesasFiltradas.length === 0 && (
        <div className="bg-gray-800 rounded-lg px-4 py-12 text-center text-gray-500">
          Nenhuma despesa registrada neste mes
        </div>
      )}

      {!carregando && !erro && despesasFiltradas.length > 0 && (
        <>
          {/* Cards no mobile */}
          <div className="space-y-3 md:hidden">
            {despesasFiltradas.map((despesa) => (
              <div key={despesa.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{despesa.descricao}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{formatarData(despesa.data)} - {despesa.categoria}</p>
                  </div>
                  <div className="flex items-center gap-0.5 ml-2 shrink-0">
                    <button onClick={() => abrirEditar(despesa)}
                      className="p-2.5 rounded-lg active:bg-gray-700 text-blue-400">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => { setIdParaDeletar(despesa.id); setConfirmAberto(true) }}
                      className="p-2.5 rounded-lg active:bg-gray-700 text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      despesa.status === 'Pago' ? 'bg-green-500/15 text-green-400' : 'bg-yellow-500/15 text-yellow-400'
                    }`}>{despesa.status}</span>
                    <span className="text-gray-600 text-xs">{despesa.tipo} - {despesa.formaPagamento}</span>
                  </div>
                  <span className="text-[#FF4444] font-bold text-sm">{formatarMoeda(despesa.valor)}</span>
                </div>
              </div>
            ))}
            <div className="bg-gray-800 rounded-lg p-4 border-t-2 border-[#FF4444]">
              <div className="flex justify-between items-center">
                <span className="text-white font-bold">Total</span>
                <span className="text-[#FF4444] font-bold text-lg">{formatarMoeda(total)}</span>
              </div>
            </div>
          </div>

          {/* Tabela no desktop */}
          <div className="hidden md:block bg-gray-800 rounded-lg overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-4 py-3 text-gray-400 font-medium">Data</th>
                  <th className="px-4 py-3 text-gray-400 font-medium">Descricao</th>
                  <th className="px-4 py-3 text-gray-400 font-medium hidden lg:table-cell">Categoria</th>
                  <th className="px-4 py-3 text-gray-400 font-medium hidden lg:table-cell">Tipo</th>
                  <th className="px-4 py-3 text-gray-400 font-medium">Forma Pgto</th>
                  <th className="px-4 py-3 text-gray-400 font-medium text-right">Valor</th>
                  <th className="px-4 py-3 text-gray-400 font-medium text-center">Status</th>
                  <th className="px-4 py-3 text-gray-400 font-medium text-center">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {despesasFiltradas.map((despesa, i) => (
                  <tr key={despesa.id} className={`border-b border-gray-700/50 ${i % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/50'}`}>
                    <td className="px-4 py-3 text-white">{formatarData(despesa.data)}</td>
                    <td className="px-4 py-3 text-white">{despesa.descricao}</td>
                    <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">{despesa.categoria}</td>
                    <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">{despesa.tipo}</td>
                    <td className="px-4 py-3 text-gray-400">{despesa.formaPagamento}</td>
                    <td className="px-4 py-3 text-[#FF4444] text-right font-semibold">{formatarMoeda(despesa.valor)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                        despesa.status === 'Pago' ? 'bg-green-500/15 text-green-400' : 'bg-yellow-500/15 text-yellow-400'
                      }`}>{despesa.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => abrirEditar(despesa)}
                          className="p-1.5 rounded hover:bg-gray-700 text-blue-400 hover:text-blue-300 transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => { setIdParaDeletar(despesa.id); setConfirmAberto(true) }}
                          className="p-1.5 rounded hover:bg-gray-700 text-red-400 hover:text-red-300 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-600">
                  <td colSpan="5" className="px-4 py-3 text-white font-bold">Total</td>
                  <td className="px-4 py-3 text-[#FF4444] text-right font-bold">{formatarMoeda(total)}</td>
                  <td colSpan="2"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}

      {/* Modal */}
      <Modal
        aberto={modalAberto}
        fechar={() => setModalAberto(false)}
        titulo={editando ? 'Editar Despesa' : 'Nova Despesa'}
      >
        <form onSubmit={salvar} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Data</label>
            <input
              type="date" value={form.data}
              onChange={(e) => setForm({ ...form, data: e.target.value })}
              required
              className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Descrição</label>
            <input
              type="text" value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              required placeholder="Ex: Aluguel, Supermercado"
              className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Categoria</label>
              <select value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Tipo</label>
              <select value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Fixa">Fixa</option>
                <option value="Variável">Variável</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Forma de Pagamento</label>
              <select value={form.formaPagamento}
                onChange={(e) => setForm({ ...form, formaPagamento: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {FORMAS_PAGAMENTO.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Status</label>
              <select value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Pago">Pago</option>
                <option value="Pendente">Pendente</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Valor (R$)</label>
            <input
              type="number" step="0.01" min="0" value={form.valor}
              onChange={(e) => setForm({ ...form, valor: e.target.value })}
              required placeholder="0,00"
              className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {editando ? 'Atualizar' : 'Salvar'}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        aberto={confirmAberto}
        fechar={() => setConfirmAberto(false)}
        onConfirmar={deletar}
        mensagem="Tem certeza que deseja excluir esta despesa?"
      />
    </div>
  )
}

export default Despesas
