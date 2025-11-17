import { createSession } from "@/api/create-session";
import { getMe, GetMeResponse } from "@/api/get-me";
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
  token: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: SignInForm) => Promise<void>;
  userData: GetMeResponse | null;
  signOut: () => void;
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

   const { mutateAsync: getCurrentUser } = useMutation({
    mutationFn: getMe ,
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

  async function signOut() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setUser(null);
  }

  async function fetchCurrentUser() {
    const currentUserData = await getCurrentUser(user);
    console.log(currentUserData);
    setUserData(currentUserData);
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        isAuthenticated: !!user,
        user,
        isLoading,
        userData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
