import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogIn } from 'lucide-react'

/**
 * Pagina de Login — tela centralizada com email e senha.
 * Chama fazerLogin do AuthContext ao submeter.
 */
function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const { fazerLogin } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      await fazerLogin(email, senha)
    } catch (error) {
      console.log('Erro no login:', error)
      const msg = error.response?.data?.erro || 'Erro ao fazer login. Verifique suas credenciais.'
      setErro(msg)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo e titulo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">💰</div>
          <h1 className="text-3xl font-bold text-white mb-1">MeuFinanceiro</h1>
          <p className="text-gray-400 text-sm">Controle financeiro pessoal</p>
        </div>

        {/* Erro */}
        {erro && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
            {erro}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-1.5">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              placeholder="Sua senha"
              className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white
                       py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {carregando ? (
              <div className="spinner !w-5 !h-5 !border-2 !border-blue-400 !border-t-white"></div>
            ) : (
              <>
                <LogIn size={18} />
                Entrar
              </>
            )}
          </button>
        </form>

        {/* Link para registro */}
        <p className="text-center text-gray-400 mt-6 text-sm">
          Não tem conta?{' '}
          <Link to="/registro" className="text-blue-400 hover:text-blue-300 font-medium">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
