import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Dashboard from './pages/Dashboard'
import Receitas from './pages/Receitas'
import Despesas from './pages/Despesas'
import Investimentos from './pages/Investimentos'
import Planejamento from './pages/Planejamento'

// Componente que protege rotas — redireciona para /login se nao estiver logado
function RotaProtegida({ children }) {
  const { logado, carregando } = useAuth()

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!logado) {
    return <Navigate to="/login" />
  }

  return children
}

// Componente principal — define todas as rotas da aplicacao
function App() {
  return (
    <Routes>
      {/* Rotas publicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      {/* Rotas protegidas — envolvidas pelo Layout (sidebar + header) */}
      <Route path="/" element={
        <RotaProtegida><Layout><Dashboard /></Layout></RotaProtegida>
      } />
      <Route path="/receitas" element={
        <RotaProtegida><Layout><Receitas /></Layout></RotaProtegida>
      } />
      <Route path="/despesas" element={
        <RotaProtegida><Layout><Despesas /></Layout></RotaProtegida>
      } />
      <Route path="/investimentos" element={
        <RotaProtegida><Layout><Investimentos /></Layout></RotaProtegida>
      } />
      <Route path="/planejamento" element={
        <RotaProtegida><Layout><Planejamento /></Layout></RotaProtegida>
      } />
    </Routes>
  )
}

export default App
