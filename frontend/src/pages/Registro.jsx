import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserPlus } from 'lucide-react'

/**
 * Pagina de Registro — formulario para criar conta.
 * Valida campos obrigatorios, senha minima de 6 caracteres e confirmacao.
 */
function Registro() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const { fazerRegistro } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')

    // Validacoes
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres')
      return
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não conferem')
      return
    }

    setCarregando(true)
    try {
      await fazerRegistro(nome, email, senha)
    } catch (error) {
      console.log('Erro no registro:', error)
      const msg = error.response?.data?.erro || 'Erro ao criar conta. Tente novamente.'
      setErro(msg)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md">
        {/* Titulo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">💰</div>
          <h1 className="text-3xl font-bold text-white mb-1">Criar Conta</h1>
          <p className="text-gray-400 text-sm">Comece a controlar suas finanças</p>
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
            <label className="block text-gray-400 text-sm mb-1.5">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              placeholder="Seu nome completo"
              className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

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

          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-1.5">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              placeholder="Mínimo 6 caracteres"
              className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-1.5">Confirmar Senha</label>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
              placeholder="Repita a senha"
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
                <UserPlus size={18} />
                Criar Conta
              </>
            )}
          </button>
        </form>

        {/* Link para login */}
        <p className="text-center text-gray-400 mt-6 text-sm">
          Já tem conta?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Registro
