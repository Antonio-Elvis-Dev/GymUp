import { createSession } from "@/api/create-session";
import { getMe, GetMeResponse } from "@/api/get-me";
import { registerUser } from "@/api/register";
import { useMutation } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
interface AuthProps {
  children: React.ReactNode;
}

const signInZod = z.object({
  email: z.string().email(),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

const signUpZod = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
  confirmPassword: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres."),
});

type SignInForm = z.infer<typeof signInZod>;
type SignUpForm = z.infer<typeof signUpZod>;

interface User {
  token: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: SignInForm) => Promise<void>;
  userData: GetMeResponse | null;
  signOut: () => void;
  signUp: (credentials: SignUpForm) => Promise<void>;
  fetchCurrentUser: () => Promise<GetMeResponse>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: AuthProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<GetMeResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: createSession,
  });

  const { mutateAsync: createUser } = useMutation({
    mutationFn: registerUser,
  });

  const { mutateAsync: getCurrentUser } = useMutation({
    mutationFn: (token: string) => getMe(token),
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchCurrentUser();
    setIsLoading(false);
  }, []);
  if (isLoading) {
    return (
      <div>
        <span>Carregando informações...</span>
      </div>
    );
  }
  async function signIn({ email, password }: SignInForm) {
    try {
      const { token } = await authenticate({ email, password });
      const loggerUser = { token };
      localStorage.setItem("authToken", token);
      localStorage.setItem("authUser", JSON.stringify(loggerUser));
      setUser(loggerUser);

      toast.success(`Bem-Vindo! `);
    } catch (error) {
      toast.error(`Credenciais inválidas  `);
    }
  }

  async function signUp({
    name,
    email,
    password,
    confirmPassword,
  }: SignUpForm) {
    try {
      if (password !== confirmPassword) {
        toast.error(`As senhas divergem! `);
        return;
      }

      await createUser({
        name,
        email,
        password,
      });
      toast.success(`Conta criada com sucesso! `);
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("O e-mail já está em uso!");
        return;
      }

      toast.error("Ocorreu um erro inesperado. Tente novamente.");
    }
  }

  async function signOut() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setUser(null);
  }

  async function fetchCurrentUser() {
    const stored = localStorage.getItem("authUser");

    if (!stored) return;

    const { token } = JSON.parse(stored);

    try {
      const response = await getCurrentUser(token);
      setUser({
        token,
      });
      setUserData(response);
      return token;
    } catch (error) {
      console.log("Erro ao buscar usuário:", error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        isAuthenticated: !!user,
        signUp,
        user,
        isLoading,
        userData,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
