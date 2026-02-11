import { useState, useEffect } from 'react'
import { useMesAno } from '../components/Layout'
import { getReceitas, criarReceita, atualizarReceita, deletarReceita } from '../services/api'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import { Plus, Pencil, Trash2 } from 'lucide-react'

// Formata valor em reais
const formatarMoeda = (valor) =>
  (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// Formata data para DD/MM/AAAA
const formatarData = (data) => {
  if (!data) return ''
  return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR')
}

/**
 * Pagina de Receitas — tabela com CRUD completo.
 * Botao "+ Nova Receita" abre modal. Cada linha tem Editar e Excluir.
 */
function Receitas() {
  const { mes, ano } = useMesAno()
  const [receitas, setReceitas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  // Modal de criar/editar
  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null)

  // Dialogo de exclusao
  const [confirmAberto, setConfirmAberto] = useState(false)
  const [idParaDeletar, setIdParaDeletar] = useState(null)

  // Formulario
  const [form, setForm] = useState({
    data: '', fonte: '', tipo: 'Fixa', valor: '', observacoes: ''
  })

  // Carrega receitas quando muda mes/ano
  useEffect(() => {
    carregarReceitas()
  }, [mes, ano])

  const carregarReceitas = async () => {
    setCarregando(true)
    setErro('')
    try {
      const resp = await getReceitas(mes, ano)
      setReceitas(resp.data)
    } catch (error) {
      console.log('Erro ao carregar receitas:', error)
      setErro('Erro ao carregar receitas')
    } finally {
      setCarregando(false)
    }
  }

  // Abre modal para nova receita
  const abrirNovo = () => {
    setEditando(null)
    setForm({ data: '', fonte: '', tipo: 'Fixa', valor: '', observacoes: '' })
    setModalAberto(true)
  }

  // Abre modal preenchido para editar
  const abrirEditar = (receita) => {
    setEditando(receita)
    setForm({
      data: receita.data,
      fonte: receita.fonte,
      tipo: receita.tipo,
      valor: receita.valor,
      observacoes: receita.observacoes || ''
    })
    setModalAberto(true)
  }

  // Salva (criar ou atualizar)
  const salvar = async (e) => {
    e.preventDefault()
    try {
      const dados = { ...form, valor: parseFloat(form.valor) }
      if (editando) {
        await atualizarReceita(editando.id, dados)
      } else {
        await criarReceita(dados)
      }
      setModalAberto(false)
      carregarReceitas()
    } catch (error) {
      console.log('Erro ao salvar receita:', error)
      alert('Erro ao salvar receita')
    }
  }

  // Exclui
  const deletar = async () => {
    try {
      await deletarReceita(idParaDeletar)
      carregarReceitas()
    } catch (error) {
      console.log('Erro ao deletar receita:', error)
    }
  }

  // Total do mes
  const total = receitas.reduce((soma, r) => soma + (r.valor || 0), 0)

  return (
    <div>
      {/* Cabecalho */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Receitas</h2>
        <button
          onClick={abrirNovo}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium
                     hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Nova Receita
        </button>
      </div>

      {/* Loading */}
      {carregando && (
        <div className="flex justify-center py-12">
          <div className="spinner"></div>
        </div>
      )}

      {/* Erro */}
      {erro && <p className="text-center text-red-400 py-8">{erro}</p>}

      {/* Tabela */}
      {!carregando && !erro && (
        <div className="bg-gray-800 rounded-lg overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-4 py-3 text-gray-400 font-medium">Data</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Fonte</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Tipo</th>
                <th className="px-4 py-3 text-gray-400 font-medium text-right">Valor</th>
                <th className="px-4 py-3 text-gray-400 font-medium hidden md:table-cell">Observações</th>
                <th className="px-4 py-3 text-gray-400 font-medium text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {receitas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-gray-500">
                    Nenhuma receita registrada neste mês
                  </td>
                </tr>
              ) : (
                receitas.map((receita, i) => (
                  <tr key={receita.id} className={`border-b border-gray-700/50 ${i % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/50'}`}>
                    <td className="px-4 py-3 text-white">{formatarData(receita.data)}</td>
                    <td className="px-4 py-3 text-white">{receita.fonte}</td>
                    <td className="px-4 py-3 text-gray-400">{receita.tipo}</td>
                    <td className="px-4 py-3 text-[#00B050] text-right font-semibold">
                      {formatarMoeda(receita.valor)}
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{receita.observacoes}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => abrirEditar(receita)}
                          className="p-1.5 rounded hover:bg-gray-700 text-blue-400 hover:text-blue-300 transition-colors"
                          title="Editar"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => { setIdParaDeletar(receita.id); setConfirmAberto(true) }}
                          className="p-1.5 rounded hover:bg-gray-700 text-red-400 hover:text-red-300 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {receitas.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-gray-600">
                  <td colSpan="3" className="px-4 py-3 text-white font-bold">Total</td>
                  <td className="px-4 py-3 text-[#00B050] text-right font-bold">
                    {formatarMoeda(total)}
                  </td>
                  <td colSpan="2"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal
        aberto={modalAberto}
        fechar={() => setModalAberto(false)}
        titulo={editando ? 'Editar Receita' : 'Nova Receita'}
      >
        <form onSubmit={salvar} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Data</label>
            <input
              type="date"
              value={form.data}
              onChange={(e) => setForm({ ...form, data: e.target.value })}
              required
              className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg
                         text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Fonte de Renda</label>
            <input
              type="text"
              value={form.fonte}
              onChange={(e) => setForm({ ...form, fonte: e.target.value })}
              required
              placeholder="Ex: Salário, Freelance, Bonus"
              className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Tipo</label>
            <select
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg
                         text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Fixa">Fixa</option>
              <option value="Variável">Variável</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.valor}
              onChange={(e) => setForm({ ...form, valor: e.target.value })}
              required
              placeholder="0,00"
              className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Observações</label>
            <textarea
              value={form.observacoes}
              onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
              rows="2"
              placeholder="Opcional"
              className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
          <button
            type="submit"
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
        mensagem="Tem certeza que deseja excluir esta receita?"
      />
    </div>
  )
}

export default Receitas
