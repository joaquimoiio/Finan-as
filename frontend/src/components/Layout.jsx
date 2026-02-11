import { useState, createContext, useContext } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

// Contexto global do mes/ano selecionado — acessivel por todas as paginas
const MesAnoContext = createContext()

export function useMesAno() {
  return useContext(MesAnoContext)
}

/**
 * Layout principal — estrutura com sidebar fixa (250px) + area principal.
 * Gerencia o mes/ano selecionado e o estado da sidebar no mobile.
 */
function Layout({ children }) {
  const hoje = new Date()
  const [mes, setMes] = useState(hoje.getMonth() + 1)
  const [ano, setAno] = useState(hoje.getFullYear())
  const [sidebarAberta, setSidebarAberta] = useState(false)

  const handleMesAnoChange = (novoMes, novoAno) => {
    setMes(novoMes)
    setAno(novoAno)
  }

  return (
    <MesAnoContext.Provider value={{ mes, ano }}>
      <div className="flex h-screen bg-gray-900 overflow-hidden">
        {/* Sidebar fixa a esquerda */}
        <Sidebar
          aberta={sidebarAberta}
          fechar={() => setSidebarAberta(false)}
        />

        {/* Area principal — header + conteudo */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            mes={mes}
            ano={ano}
            onMesAnoChange={handleMesAnoChange}
            onToggleSidebar={() => setSidebarAberta(!sidebarAberta)}
          />

          {/* Conteudo da pagina com scroll */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </MesAnoContext.Provider>
  )
}

export default Layout
