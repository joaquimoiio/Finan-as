import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as apiLogin, registro as apiRegistro } from '../services/api'

// Contexto de autenticacao — compartilha dados do usuario logado com toda a app
const AuthContext = createContext()

/**
 * Provider de autenticacao.
 * Guarda token e nome do usuario no state + localStorage.
 * Oferece funcoes de login, registro e logout.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [nomeUsuario, setNomeUsuario] = useState('')
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  // Ao iniciar, verifica se ja tem token salvo
  useEffect(() => {
    const tokenSalvo = localStorage.getItem('token')
    const nomeSalvo = localStorage.getItem('nomeUsuario')
    if (tokenSalvo) {
      setToken(tokenSalvo)
      setNomeUsuario(nomeSalvo || '')
    }
    setCarregando(false)
  }, [])

  // Faz login — chama a API e salva o token
  const fazerLogin = async (email, senha) => {
    const resposta = await apiLogin({ email, senha })
    const { token: novoToken, nome } = resposta.data

    localStorage.setItem('token', novoToken)
    localStorage.setItem('nomeUsuario', nome)
    setToken(novoToken)
    setNomeUsuario(nome)
    navigate('/')
  }

  // Faz registro — chama a API, salva token e redireciona
  const fazerRegistro = async (nome, email, senha) => {
    const resposta = await apiRegistro({ nome, email, senha })
    const { token: novoToken, nome: nomeRetornado } = resposta.data

    localStorage.setItem('token', novoToken)
    localStorage.setItem('nomeUsuario', nomeRetornado)
    setToken(novoToken)
    setNomeUsuario(nomeRetornado)
    navigate('/')
  }

  // Faz logout — limpa tudo e redireciona para login
  const fazerLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('nomeUsuario')
    setToken(null)
    setNomeUsuario('')
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{
      token,
      nomeUsuario,
      carregando,
      logado: !!token,
      fazerLogin,
      fazerRegistro,
      fazerLogout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar o contexto em qualquer componente
export function useAuth() {
  return useContext(AuthContext)
}
