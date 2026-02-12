import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  DollarSign,
  CreditCard,
  TrendingUp,
  Target,
  BookOpen,
  LogOut,
  X,
  Wallet
} from 'lucide-react'

// Links do menu com icone e texto
const LINKS = [
  { to: '/', icone: LayoutDashboard, texto: 'Dashboard' },
  { to: '/receitas', icone: DollarSign, texto: 'Receitas' },
  { to: '/despesas', icone: CreditCard, texto: 'Despesas' },
  { to: '/investimentos', icone: TrendingUp, texto: 'Investimentos' },
  { to: '/planejamento', icone: Target, texto: 'Planejamento' },
  { to: '/guia', icone: BookOpen, texto: 'Guia' },
]

/**
 * Sidebar — menu lateral de navegacao.
 * No desktop fica sempre visivel (w-64). No mobile abre/fecha com animacao.
 */
function Sidebar({ aberta, fechar }) {
  const { fazerLogout } = useAuth()

  return (
    <>
      {/* Overlay escuro no mobile */}
      {aberta && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={fechar}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-gray-800 z-30 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${aberta ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Wallet size={22} className="text-blue-400" /> CashWise
          </h1>
          <button
            onClick={fechar}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Links de navegacao */}
        <nav className="flex-1 mt-4 px-3">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={fechar}
              end={link.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <link.icone size={20} />
              <span>{link.texto}</span>
            </NavLink>
          ))}
        </nav>

        {/* Botao sair */}
        <div className="p-3 border-t border-gray-700">
          <button
            onClick={fazerLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-sm font-medium
                       text-gray-400 hover:bg-red-600/20 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
