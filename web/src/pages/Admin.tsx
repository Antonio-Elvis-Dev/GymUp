import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  CheckCircle,
  XCircle,
  Building2,
  Clock,
  UserCheck,
} from "lucide-react";

import { toast } from "sonner";
import { fetchGymCheckIns, validateCheckIn } from "@/api/admin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const Admin = () => {
  // ID fixo para teste (Idealmente viria de um contexto ou seleção)
  const GYM_ID = "1f66b1d3-9fd1-4c5d-a7b4-254be15eb2be";
  const queryClient = useQueryClient();

  // 1. Buscando dados do servidor
  const { data: allCheckIns = [] } = useQuery({
    queryKey: ['gym-check-ins', GYM_ID],
    queryFn: () => fetchGymCheckIns(GYM_ID),
    enabled: !!GYM_ID,
    // refetchInterval: 5000, 
  });

  // 2. Filtrando apenas os pendentes (que não têm validated_at)
  const pendingCheckIns = allCheckIns.filter(checkIn => !checkIn.validated_at);

  const [gymForm, setGymForm] = useState({
    name: "",
    address: "",
    phone: "",
  });

  // 3. Mutação de Validação
  const { mutateAsync: validate, isPending: isValidating } = useMutation({
    mutationFn: validateCheckIn,
    onSuccess: () => {
      toast.success("Check-in validado com sucesso!");
      // Ao invalidar, o React Query busca os dados de novo e a lista atualiza sozinha
      queryClient.invalidateQueries({ queryKey: ['gym-check-ins'] });
    },
    onError: () => {
      toast.error("Erro ao validar check-in.");
    }
  });

  const handleApproveCheckIn = async (id: string) => {
    await validate(id);
  };

  const handleRejectCheckIn = (id: string) => {
    // Como não temos rota de rejeitar no backend ainda, apenas avisamos
    toast.info("Funcionalidade de rejeitar em desenvolvimento", {
        description: "O check-in expirará automaticamente se não validado."
    });
  };

  const handleAddGym = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a chamada API real para criar academia
    toast.success("Academia cadastrada (Simulação)", {
      description: `${gymForm.name} foi adicionada com sucesso`,
    });
    setGymForm({ name: "", address: "", phone: "" });
  };

  return (
    <div className="pb-20 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6">
        <h1 className="text-2xl font-bold mb-2">Painel Administrativo</h1>
        <p className="text-primary-foreground/80">
          Gerencie academias e validações
        </p>
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        <Tabs defaultValue="checkins" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="checkins">Validar Check-ins</TabsTrigger>
            <TabsTrigger value="gyms">Cadastrar Academia</TabsTrigger>
          </TabsList>

          <TabsContent value="checkins" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  Check-ins Pendentes
                  {pendingCheckIns.length > 0 && (
                    <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                      {pendingCheckIns.length}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingCheckIns.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Tudo em dia!
                    </h3>
                    <p className="text-muted-foreground">
                      Não há check-ins aguardando validação.
                    </p>
                  </div>
                ) : (
                  pendingCheckIns.map((checkIn) => (
                    <div
                      key={checkIn.id}
                      className="border border-border rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <img
                          src={checkIn.user.avatar || "https://github.com/shadcn.png"}
                          alt={checkIn.user.name}
                          className="w-12 h-12 rounded-full object-cover border"
                        />
                        <div>
                          <div className="font-bold text-lg">{checkIn.user.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {/* Formatação correta da data */}
                            {new Date(checkIn.created_at).toLocaleTimeString('pt-BR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            })}
                            <span className="mx-1">•</span>
                            {new Date(checkIn.created_at).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                          variant="default" // Mudado para destaque
                          size="sm"
                          onClick={() => handleApproveCheckIn(checkIn.id)}
                          disabled={isValidating}
                          className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Aprovar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectCheckIn(checkIn.id)}
                          className="flex-1 sm:flex-none text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Ignorar
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gyms" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Cadastrar Nova Academia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddGym} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="gym-name">Nome da Academia</Label>
                    <Input
                      id="gym-name"
                      placeholder="Ex: FitLife Academia"
                      value={gymForm.name}
                      onChange={(e) =>
                        setGymForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gym-address">Endereço</Label>
                    <Input
                      id="gym-address"
                      placeholder="Rua, número, bairro, cidade"
                      value={gymForm.address}
                      onChange={(e) =>
                        setGymForm((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gym-phone">Telefone</Label>
                    <Input
                      id="gym-phone"
                      placeholder="(11) 99999-9999"
                      value={gymForm.phone}
                      onChange={(e) =>
                        setGymForm((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Cadastrar Academia
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};