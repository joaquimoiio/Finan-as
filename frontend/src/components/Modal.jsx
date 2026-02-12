import { X } from 'lucide-react'

/**
 * Modal reutilizavel — painel flutuante para formularios.
 * No mobile: sobe da parte inferior (sheet style) ocupando ate 95vh.
 * No desktop: centralizado com max-w-md.
 */
function Modal({ aberto, fechar, titulo, children }) {
  if (!aberto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" onClick={fechar} />

      {/* Card — sheet no mobile, card centralizado no desktop */}
      <div className="relative bg-gray-800 shadow-2xl w-full sm:max-w-md
                      rounded-t-2xl sm:rounded-xl
                      max-h-[92vh] sm:max-h-[90vh] flex flex-col">
        {/* Indicador de arraste (mobile) */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 bg-gray-600 rounded-full" />
        </div>

        {/* Cabecalho fixo */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-700 shrink-0">
          <h2 className="text-lg font-semibold text-white">{titulo}</h2>
          <button
            onClick={fechar}
            className="text-gray-400 hover:text-white transition-colors p-2 -mr-2 rounded-lg active:bg-gray-700"
          >
            <X size={22} />
          </button>
        </div>

        {/* Corpo com scroll */}
        <div className="p-4 sm:p-5 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
