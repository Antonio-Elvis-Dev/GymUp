import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockPendingCheckIns } from "@/data/mockData";
import {
  Plus,
  CheckCircle,
  XCircle,
  Building2,
  Clock,
  UserCheck,
  MapPin,
} from "lucide-react";

import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export const Admin = () => {
  const [pendingCheckIns, setPendingCheckIns] = useState(mockPendingCheckIns);
  
  // 1. AJUSTADO: Estado agora reflete o Zod Schema do Back-end
  const [gymForm, setGymForm] = useState({
    title: "",
    description: "",
    phone: "",
    latitude: "",
    longitude: "",
  });

  const handleApproveCheckIn = (id: string) => {
    setPendingCheckIns((prev) => prev.filter((item) => item.id !== id));
    toast("Check-in aprovado", {
      description: "O usuário recebeu os pontos XP",
    });
  };

  const handleRejectCheckIn = (id: string) => {
    setPendingCheckIns((prev) => prev.filter((item) => item.id !== id));
    toast("Check-in rejeitado", {
      description: "O check-in foi removido da lista",
    });
  };

  // 2. AJUSTADO: Função de envio
  const handleAddGym = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Conversão dos dados para o formato que o Back-end espera (Number para lat/long)
      const dataToSend = {
        title: gymForm.title,
        description: gymForm.description,
        phone: gymForm.phone === "" ? null : gymForm.phone, // Trata string vazia como null se necessário
        latitude: Number(gymForm.latitude),
        longitude: Number(gymForm.longitude),
      };

      // AQUI ENTRARIA SUA CHAMADA PARA A API
      // await api.post('/gyms', dataToSend);

      console.log("Enviando para o back-end:", dataToSend); 

      toast("Academia cadastrada", {
        description: `${gymForm.title} foi adicionada com sucesso`,
      });

      // Limpar formulário
      setGymForm({
        title: "",
        description: "",
        phone: "",
        latitude: "",
        longitude: "",
      });

    } catch (error) {
      toast("Erro ao cadastrar", {
        description: "Verifique os dados informados.",
      });
    }
  };

  return (
    <div className="pb-20 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-gradient-secondary text-secondary-foreground p-6">
        <h1 className="text-2xl font-bold mb-2">Painel Administrativo</h1>
        <p className="text-secondary-foreground/80">
          Gerencie academias e validações
        </p>
      </div>

      <div className="p-4">
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
                    <span className="bg-warning text-warning-foreground text-xs px-2 py-1 rounded-full">
                      {pendingCheckIns.length}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingCheckIns.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Tudo em dia!
                    </h3>
                    <p className="text-muted-foreground">
                      Não há check-ins pendentes de validação
                    </p>
                  </div>
                ) : (
                  pendingCheckIns.map((checkIn) => (
                    <div
                      key={checkIn.id}
                      className="border border-border rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={checkIn.avatar}
                          alt={checkIn.user}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{checkIn.user}</div>
                          <div className="text-sm text-muted-foreground">
                            {checkIn.gym}
                          </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {checkIn.timestamp}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApproveCheckIn(checkIn.id)}
                          className="flex-1"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Aprovar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectCheckIn(checkIn.id)}
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Rejeitar
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
                  
                  {/* TITLE */}
                  <div className="space-y-2">
                    <Label htmlFor="gym-title">Nome da Academia</Label>
                    <Input
                      id="gym-title"
                      placeholder="Ex: FitLife Academia"
                      value={gymForm.title}
                      onChange={(e) =>
                        setGymForm((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  {/* DESCRIPTION */}
                  <div className="space-y-2">
                    <Label htmlFor="gym-description">Descrição</Label>
                    <Input
                      id="gym-description"
                      placeholder="Fale um pouco sobre a academia..."
                      value={gymForm.description}
                      onChange={(e) =>
                        setGymForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  {/* PHONE */}
                  <div className="space-y-2">
                    <Label htmlFor="gym-phone">Telefone</Label>
                    <Input
                      id="gym-phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={gymForm.phone}
                      onChange={(e) =>
                        setGymForm((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* LATITUDE & LONGITUDE */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gym-latitude" className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> Latitude
                      </Label>
                      <Input
                        id="gym-latitude"
                        type="number"
                        step="any" // Permite decimais
                        placeholder="-23.55052"
                        value={gymForm.latitude}
                        onChange={(e) =>
                          setGymForm((prev) => ({
                            ...prev,
                            latitude: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gym-longitude" className="flex items-center gap-1">
                         Longitude
                      </Label>
                      <Input
                        id="gym-longitude"
                        type="number"
                        step="any" // Permite decimais
                        placeholder="-46.63330"
                        value={gymForm.longitude}
                        onChange={(e) =>
                          setGymForm((prev) => ({
                            ...prev,
                            longitude: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
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