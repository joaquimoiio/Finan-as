import { ChevronLeft, ChevronRight } from 'lucide-react'

// Nomes dos meses em portugues
const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

/**
 * MonthPicker — seletor de mes e ano com setas para navegar.
 * Props: mes (1-12), ano, onChange(novoMes, novoAno)
 */
function MonthPicker({ mes, ano, onChange }) {
  const mesAnterior = () => {
    if (mes === 1) onChange(12, ano - 1)
    else onChange(mes - 1, ano)
  }

  const proximoMes = () => {
    if (mes === 12) onChange(1, ano + 1)
    else onChange(mes + 1, ano)
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={mesAnterior}
        className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
      >
        <ChevronLeft size={20} />
      </button>

      <span className="text-white font-semibold min-w-[170px] text-center select-none">
        {MESES[mes - 1]} {ano}
      </span>

      <button
        onClick={proximoMes}
        className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}

export default MonthPicker
