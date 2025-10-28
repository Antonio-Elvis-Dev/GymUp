import { api } from '../lib/axios'

interface CreateSessionParams {
  email: string
  password: string
}

interface CreateSessionResponse {
  id: string
  email: string
  token: string
}

export async function createSession({ email, password }: CreateSessionParams) {
  const response = await api.post<CreateSessionResponse>(
    '/sessions',
    {
      email,
      password,
    },
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  return response.data
}
