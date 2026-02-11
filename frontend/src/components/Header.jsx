import { useAuth } from '../context/AuthContext'
import { Menu, User } from 'lucide-react'
import MonthPicker from './MonthPicker'

/**
 * Header — barra superior com:
 * - Botao hamburger (mobile)
 * - MonthPicker no centro
 * - Nome do usuario a direita
 */
function Header({ mes, ano, onMesAnoChange, onToggleSidebar }) {
  const { nomeUsuario } = useAuth()

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between shrink-0">
      {/* Hamburger no mobile */}
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
      >
        <Menu size={22} />
      </button>

      {/* Seletor de mes/ano centralizado */}
      <div className="flex-1 flex justify-center">
        <MonthPicker mes={mes} ano={ano} onChange={onMesAnoChange} />
      </div>

      {/* Nome do usuario */}
      <div className="flex items-center gap-2 text-gray-400">
        <User size={18} />
        <span className="hidden sm:inline text-sm font-medium">{nomeUsuario}</span>
      </div>
    </header>
  )
}

export default Header
