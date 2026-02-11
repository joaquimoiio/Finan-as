import axios from 'axios'

// Instancia do Axios com a URL base da API (definida no .env)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

// Interceptor de REQUEST — adiciona o token JWT no header Authorization
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor de RESPONSE — redireciona para /login se receber 401 (nao autorizado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('nomeUsuario')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// =====================
// Funcoes de Autenticacao
// =====================
export const login = (dados) => api.post('/auth/login', dados)
export const registro = (dados) => api.post('/auth/registro', dados)

// =====================
// Funcoes de Receitas
// =====================
export const getReceitas = (mes, ano) => api.get(`/receitas?mes=${mes}&ano=${ano}`)
export const criarReceita = (dados) => api.post('/receitas', dados)
export const atualizarReceita = (id, dados) => api.put(`/receitas/${id}`, dados)
export const deletarReceita = (id) => api.delete(`/receitas/${id}`)

// =====================
// Funcoes de Despesas
// =====================
export const getDespesas = (mes, ano) => api.get(`/despesas?mes=${mes}&ano=${ano}`)
export const criarDespesa = (dados) => api.post('/despesas', dados)
export const atualizarDespesa = (id, dados) => api.put(`/despesas/${id}`, dados)
export const deletarDespesa = (id) => api.delete(`/despesas/${id}`)

// =====================
// Funcoes de Investimentos
// =====================
export const getInvestimentos = () => api.get('/investimentos')
export const criarInvestimento = (dados) => api.post('/investimentos', dados)
export const atualizarInvestimento = (id, dados) => api.put(`/investimentos/${id}`, dados)
export const deletarInvestimento = (id) => api.delete(`/investimentos/${id}`)

// =====================
// Funcoes de Metas
// =====================
export const getMetas = () => api.get('/metas')
export const criarMeta = (dados) => api.post('/metas', dados)
export const atualizarMeta = (id, dados) => api.put(`/metas/${id}`, dados)
export const deletarMeta = (id) => api.delete(`/metas/${id}`)

// =====================
// Funcoes de Dashboard
// =====================
export const getDashboard = (mes, ano) => api.get(`/dashboard?mes=${mes}&ano=${ano}`)

export default api
