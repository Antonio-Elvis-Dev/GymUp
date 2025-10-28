import { createSession } from "@/api/create-session";
import { useMutation } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { string, z } from "zod";
interface AuthProps {
  children: React.ReactNode;
}

const signInZod = z.object({
  email: z.string().email(),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

type SignInForm = z.infer<typeof signInZod>;

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: SignInForm) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: AuthProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { mutateAsync: authenticate } = useMutation({
    mutationFn: createSession,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
    }

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
      const { token,  id } = await authenticate({ email, password });

      const loggerUser = { id, email };
      localStorage.setItem("authToken", token);
      localStorage.setItem("authUser", JSON.stringify(loggerUser));
      setUser(loggerUser);
      toast.success(`Bem-Vindo! `);
    } catch (error) {
      toast.error(`Credenciais inválidas  `);
    }
  }

  async function signOut() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ signIn, signOut, isAuthenticated: !!user, user, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
