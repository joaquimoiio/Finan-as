/**
 * KPICard — card de indicador financeiro.
 * Mostra titulo em cinza, valor grande em branco, icone colorido e borda lateral.
 *
 * Props:
 *   titulo — texto do indicador (ex: "Total Recebido")
 *   valor  — valor formatado (ex: "R$ 6.550,00")
 *   icone  — componente Lucide (ex: DollarSign)
 *   cor    — "green" | "red" | "blue" | "orange" | "purple"
 */
function KPICard({ titulo, valor, icone: Icone, cor }) {
  // Mapeia a cor para classes do Tailwind
  const estilos = {
    green:  { borda: 'border-[#00B050]', texto: 'text-[#00B050]' },
    red:    { borda: 'border-[#FF4444]', texto: 'text-[#FF4444]' },
    blue:   { borda: 'border-[#2E75B6]', texto: 'text-[#2E75B6]' },
    orange: { borda: 'border-[#ED7D31]', texto: 'text-[#ED7D31]' },
    purple: { borda: 'border-[#7B68EE]', texto: 'text-[#7B68EE]' },
  }

  const estilo = estilos[cor] || estilos.blue

  return (
    <div className={`bg-gray-800 rounded-lg p-3 sm:p-4 border-l-4 ${estilo.borda}`}>
      <div className="flex items-center justify-between mb-1 sm:mb-2">
        <span className="text-gray-400 text-xs sm:text-sm">{titulo}</span>
        {Icone && <Icone size={18} className={`${estilo.texto} shrink-0`} />}
      </div>
      <p className="text-white text-base sm:text-xl font-bold truncate">{valor}</p>
    </div>
  )
}

export default KPICard
