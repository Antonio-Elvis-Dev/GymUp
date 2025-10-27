import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";
import z from 'zod'
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from "@tanstack/react-query";
import { RegisterPayLoad, registerUser } from "@/api/register";
import { toast } from "sonner";

interface LoginProps {
  onLogin: () => void;
}

const registerFormSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  email: z.string().email('A senha deve ter pelo menos 6 caracteres.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem.',
  path: ['confirmPassword']
})

type RegisterForm = z.infer<typeof registerFormSchema>

export const Login = () => {

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerFormSchema),
    mode: 'onBlur',
  })

  const { mutateAsync: handleRegister, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success('Registro efetuado com sucesso! Faça login para continuar.')
      navigate('/sign-in')
    },
    onError: (error) => {
      const errorMessage = "Falha no registro. Tente novamente."
      toast.error(errorMessage)
    }
  })
  async function onSubmit(data: RegisterForm) {
    // Prepara o payload removendo a confirmação de senha
    const { confirmPassword, ...registerData } = data

    // O type 'registerData' agora é inferido corretamente como 'RegisterPayload'
    await handleRegister(registerData as RegisterPayLoad)
    // Nota: O 'try/catch' é opcional aqui, pois 'onError' do useMutation já lida com o erro.
  }

  const isDisabled = isSubmitting || isPending

  
  const [isLogin, setIsLogin] = useState(true);
 



  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">GymUP</h1>
          </div>
          <CardTitle>{isLogin ? "Entrar" : "Criar Conta"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Acesse sua conta para continuar treinando"
              : "Crie sua conta e comece a ganhar XP"
            }
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  {...register('name')}
                  required={!isLogin}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register('email')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                 {...register('password')}
                required
              />
            </div>
             {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                 {...register('confirmPassword')}
                required
              />
            </div>
             )}

            <Button type="submit" className="w-full">
              {isLogin ? "Entrar" : "Criar Conta"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline"
              >
                {isLogin
                  ? "Não tem conta? Criar agora"
                  : "Já tem conta? Fazer login"
                }
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};