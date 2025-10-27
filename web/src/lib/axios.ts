import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_URL || 'http://localhost:3333',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken")

        if (token) {
            config.headers.Authorization = `Bearer ${token}`

            return config
        }

    },
    (error) => {
        return Promise.reject(error)
    }
)
api.interceptors.response.use(
  (response) => response, // Se a resposta for bem-sucedida, apenas a retorna
  (error) => {
    // Lida com erros de resposta
    const status = error.response?.status
    const isSignInRoute = window.location.pathname.startsWith('/sign-in')

    // Se o status for 401 e não estivermos já na tela de login
    if (status === 401 && !isSignInRoute) {
      // Limpa a sessão (apenas em caso de token expirado/inválido)
      localStorage.removeItem('authToken')
      localStorage.removeItem('authUser')
      
      // Redireciona o usuário para a tela de login.
      // Usar a navegação do router diretamente é complexo aqui,
      // então o mais simples é forçar o redirecionamento.
      window.location.href = '/sign-in' 
    }

    return Promise.reject(error)
  },
)

export { api }