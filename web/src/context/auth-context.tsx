import { createSession } from "@/api/create-session";
import { getMe, GetMeResponse } from "@/api/get-me";
import { registerUser } from "@/api/register";
import { updateProfile, UpdateProfilePayload } from "@/api/update-profile";
import { useMutation } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { string, z } from "zod";
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
  updateUser: (payload: UpdateProfilePayload) => Promise<void>;
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
    mutationFn: getMe,
  });
  const { mutateAsync: mutateUpdateProfile } = useMutation({
    mutationFn: updateProfile,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  // Fetch user data quando user muda (depois do token ser setado)
  useEffect(() => {
    if (user?.token) {
      fetchCurrentUser();
    }
  }, [user?.token]);
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
      // fetchCurrentUser chamará automaticamente via useEffect

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
      // Faça login automático após criar conta
      await signIn({ email, password });
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
    try {
      const currentUserData = await getCurrentUser();
      setUserData(currentUserData as GetMeResponse | null);
    } catch (err) {
      // failed to fetch current user (maybe no token)
      setUserData(null);
    }
  }

  async function updateUser(payload: UpdateProfilePayload) {
    try {
      const updated = await mutateUpdateProfile(payload);
      // API should return { user }
      setUserData(updated as GetMeResponse);
      toast.success("Perfil atualizado com sucesso");
    } catch (error: any) {
      console.error("updateUser error - full error:", error);
      console.error("updateUser error - response:", error?.response);
      console.error("updateUser error - data:", error?.response?.data);
      
      const status = error?.response?.status;
      const serverMessage = error?.response?.data?.message || error?.response?.data || error?.message;
      
      console.log("Final error message to show:", { status, serverMessage });
      
      if (serverMessage && typeof serverMessage === "string") {
        toast.error(`Erro: ${serverMessage}`);
      } else if (serverMessage && typeof serverMessage === "object") {
        toast.error(`Erro: ${JSON.stringify(serverMessage)}`);
      } else if (status) {
        toast.error(`Erro ao atualizar perfil (HTTP ${status})`);
      } else {
        toast.error("Erro ao atualizar perfil");
      }
      throw error;
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
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
