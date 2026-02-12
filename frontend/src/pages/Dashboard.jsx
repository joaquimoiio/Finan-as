import { useState, useEffect } from 'react'
import { useMesAno } from '../components/Layout'
import { getDashboard } from '../services/api'
import KPICard from '../components/KPICard'
import {
  DollarSign,
  CreditCard,
  Wallet,
  TrendingUp,
  PieChart as PieIcon,
  AlertCircle
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

// Cores para o grafico de pizza (uma por categoria)
const CORES_CATEGORIAS = [
  '#00B050', '#FF4444', '#2E75B6', '#ED7D31',
  '#7B68EE', '#FFD700', '#00CED1', '#FF69B4', '#A9A9A9'
]

// Formata valor em reais (R$)
const formatarMoeda = (valor) => {
  return (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

/**
 * Pagina Dashboard — resumo financeiro do mes selecionado.
 * Mostra 5 KPIs, graficos de barras e pizza, regra 50/30/20 e despesas pendentes.
 */
function Dashboard() {
  const { mes, ano } = useMesAno()
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  // Recarrega sempre que muda o mes/ano
  useEffect(() => {
    const carregar = async () => {
      setCarregando(true)
      setErro('')
      try {
        const resp = await getDashboard(mes, ano)
        setDados(resp.data)
      } catch (error) {
        console.log('Erro ao carregar dashboard:', error)
        setErro('Erro ao carregar dados do dashboard')
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [mes, ano])

  // Loading
  if (carregando) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="spinner"></div>
        <span className="text-gray-400 text-sm">Carregando dashboard...</span>
      </div>
    )
  }

  // Erro
  if (erro) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400">{erro}</p>
      </div>
    )
  }

  if (!dados) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Nenhum dado disponivel para este periodo</p>
      </div>
    )
  }

  // Prepara dados dos graficos
  const gastosPorCategoria = (dados.gastosPorCategoria || [])
  const dadosBarras = gastosPorCategoria.map(item => ({
    nome: item.categoria,
    valor: item.valor
  }))
  const dadosPizza = gastosPorCategoria.map(item => ({
    name: item.categoria,
    value: item.valor
  }))

  // Valores para regra 50/30/20
  const totalReceitas = dados.totalReceitas || 0
  const despesasFixas = dados.despesasFixas || 0
  const despesasVariaveis = dados.despesasVariaveis || 0
  const gastoInvestimentos = totalReceitas > 0 ? (dados.percentualInvestido / 100) * totalReceitas : 0

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Dashboard</h2>

      {/* ===== 5 KPI Cards ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <KPICard
          titulo="Total Recebido"
          valor={formatarMoeda(dados.totalReceitas)}
          icone={DollarSign}
          cor="green"
        />
        <KPICard
          titulo="Total Gasto"
          valor={formatarMoeda(dados.totalDespesas)}
          icone={CreditCard}
          cor="red"
        />
        <KPICard
          titulo="Saldo"
          valor={formatarMoeda(dados.saldo)}
          icone={Wallet}
          cor="blue"
        />
        <KPICard
          titulo="% Gastos"
          valor={`${(dados.percentualGastos || 0).toFixed(1)}%`}
          icone={PieIcon}
          cor="orange"
        />
        <KPICard
          titulo="% Investido"
          valor={`${(dados.percentualInvestido || 0).toFixed(1)}%`}
          icone={TrendingUp}
          cor="purple"
        />
      </div>

      {/* ===== Graficos lado a lado ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Grafico de barras — gastos por categoria */}
        <div className="bg-gray-800 rounded-lg p-3 sm:p-5">
          <h3 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">Gastos por Categoria</h3>
          {dadosBarras.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dadosBarras} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="nome"
                  tick={{ fill: '#9CA3AF', fontSize: 10 }}
                  angle={-35}
                  textAnchor="end"
                  height={70}
                  interval={0}
                />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} width={50} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value) => [formatarMoeda(value), 'Valor']}
                />
                <Bar dataKey="valor" fill="#2E75B6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-gray-500 text-sm">
              Nenhuma despesa registrada neste mês
            </div>
          )}
        </div>

        {/* Grafico de pizza — distribuicao */}
        <div className="bg-gray-800 rounded-lg p-3 sm:p-5">
          <h3 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">Distribuição por Categoria</h3>
          {dadosPizza.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={dadosPizza}
                  cx="50%"
                  cy="45%"
                  outerRadius={70}
                  innerRadius={30}
                  dataKey="value"
                  label={false}
                >
                  {dadosPizza.map((_, i) => (
                    <Cell key={i} fill={CORES_CATEGORIAS[i % CORES_CATEGORIAS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  formatter={(value) => [formatarMoeda(value), 'Valor']}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '11px', color: '#9CA3AF', paddingTop: '8px' }}
                  formatter={(value) => <span style={{ color: '#D1D5DB' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-gray-500 text-sm">
              Nenhuma despesa registrada neste mês
            </div>
          )}
        </div>
      </div>

      {/* ===== Regra 50/30/20 ===== */}
      <div className="bg-gray-800 rounded-lg p-3 sm:p-5 mb-4 sm:mb-6">
        <h3 className="text-white font-semibold mb-4">Regra 50/30/20</h3>
        {totalReceitas > 0 ? (
          <div className="space-y-4">
            <BarraProgresso
              label="Necessidades (50%)"
              meta={totalReceitas * 0.5}
              atual={despesasFixas}
              cor="bg-[#00B050]"
            />
            <BarraProgresso
              label="Desejos (30%)"
              meta={totalReceitas * 0.3}
              atual={despesasVariaveis}
              cor="bg-[#ED7D31]"
            />
            <BarraProgresso
              label="Investimentos (20%)"
              meta={totalReceitas * 0.2}
              atual={gastoInvestimentos}
              cor="bg-[#7B68EE]"
            />
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Registre receitas para ver a regra 50/30/20</p>
        )}
      </div>

      {/* ===== Despesas Pendentes ===== */}
      {(dados.despesasPendentes || 0) > 0 && (
        <div className="bg-gray-800 rounded-lg p-3 sm:p-5 border-l-4 border-[#FF4444]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertCircle size={22} className="text-[#FF4444]" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Despesas Pendentes</h3>
              <p className="text-[#FF4444] text-xl font-bold">
                {formatarMoeda(dados.despesasPendentes)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * BarraProgresso — barra de progresso da regra 50/30/20.
 * Fica vermelha se ultrapassar a meta.
 */
function BarraProgresso({ label, meta, atual, cor }) {
  const percentual = meta > 0 ? (atual / meta) * 100 : 0
  const ultrapassou = percentual > 100

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between text-sm mb-1 gap-0.5">
        <span className="text-gray-400">{label}</span>
        <span className={`text-xs sm:text-sm ${ultrapassou ? 'text-[#FF4444]' : 'text-gray-400'}`}>
          {formatarMoeda(atual)} / {formatarMoeda(meta)} ({percentual.toFixed(0)}%)
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${ultrapassou ? 'bg-[#FF4444]' : cor}`}
          style={{ width: `${Math.min(percentual, 100)}%` }}
        />
      </div>
    </div>
  )
}

export default Dashboard
