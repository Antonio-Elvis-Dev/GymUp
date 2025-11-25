import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dumbbell } from "lucide-react";
import z from "zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";

const registerFormSchema = z.object({
  email: z.string().email("A e-mail deve ter pelo menos 6 caracteres."),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
});

type RegisterForm = z.infer<typeof registerFormSchema>;

export const Login = () => {
  const { signIn } = useAuth();

  const [searchParams] = useSearchParams();
  const navigation = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterForm>({
    defaultValues: {
      email: searchParams.get("email") ?? "",
      password: searchParams.get("password") ?? "",
    },
  });

  async function handleSignIn(data: RegisterForm) {
    signIn(data);
  }

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
          <CardTitle>Entrar</CardTitle>
          <CardDescription>
            {" "}
            Crie sua conta e comece a ganhar XP
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register("email")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Entrar
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigation(`/sign-up`)}
                className="text-sm text-primary hover:underline"
              >
                Não tem conta? Criar agora
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
