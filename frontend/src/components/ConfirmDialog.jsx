import { AlertTriangle } from 'lucide-react'

/**
 * ConfirmDialog — dialogo de confirmacao para exclusao.
 * Pede confirmacao antes de deletar um registro.
 *
 * Props:
 *   aberto      — boolean
 *   fechar      — funcao para fechar
 *   onConfirmar — funcao chamada ao clicar em "Excluir"
 *   mensagem    — texto da confirmacao
 */
function ConfirmDialog({ aberto, fechar, onConfirmar, mensagem }) {
  if (!aberto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={fechar} />

      <div className="relative bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
            <AlertTriangle size={28} className="text-yellow-500" />
          </div>

          <h3 className="text-lg font-semibold text-white mb-2">Confirmar exclusão</h3>
          <p className="text-gray-400 mb-6 text-sm">
            {mensagem || 'Tem certeza que deseja excluir este registro? Essa ação não pode ser desfeita.'}
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={fechar}
              className="flex-1 px-4 py-2.5 bg-gray-700 text-white rounded-lg text-sm font-medium
                         hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => { onConfirmar(); fechar() }}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium
                         hover:bg-red-700 transition-colors"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
