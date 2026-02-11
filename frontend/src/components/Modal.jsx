import { X } from 'lucide-react'

/**
 * Modal reutilizavel — painel flutuante para formularios.
 * Abre por cima da tela com overlay escuro.
 *
 * Props:
 *   aberto  — boolean que controla visibilidade
 *   fechar  — funcao chamada ao clicar no X ou no overlay
 *   titulo  — texto do cabecalho
 *   children — conteudo do modal (formulario)
 */
function Modal({ aberto, fechar, titulo, children }) {
  if (!aberto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" onClick={fechar} />

      {/* Card do modal */}
      <div className="relative bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Cabecalho */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">{titulo}</h2>
          <button
            onClick={fechar}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corpo */}
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
