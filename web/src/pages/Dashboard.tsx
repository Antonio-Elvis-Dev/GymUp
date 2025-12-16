import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/gamification/Badge";
import { XPDisplay } from "@/components/gamification/XPDisplay";
import { StreakDisplay } from "@/components/gamification/StreakDisplay";
import { StatsCard } from "@/components/ui/stats-card";
import { mockUser, mockLeaderboard, mockGymLeaderboard } from "@/data/mockData";
import {
  CheckCircle,
  Trophy,
  Users,
  Building2,
  Target,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createCheckIn } from "@/api/check-in";
import { fetchNearbyGyms, Gym } from "@/api/fetch-nearby-gyms";
import { fetchLeaderboard } from "@/api/fetch-leaderboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserMetrics } from "@/api/get-user-metrics";

export const Dashboard = () => {
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  const { userData, fetchCurrentUser } = useAuth();
  const [selectedGymId, setSelectedGymId] = useState<string | null>(null);
  const [nearbyGyms, setNearbyGyms] = useState<Gym[]>([]);

  const [coords, setCoords] = useState<{ lat: number; long: number } | null>(
    null
  );

  const { data: leaderboardUsers } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => fetchLeaderboard(1), // Página 1 por padrão
  });
 
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords = {
          lat: position.coords.latitude,
          long: position.coords.longitude,
        };

        setCoords(userCoords);

        fetchNearbyGyms({
          userLatitude: userCoords.lat,
          userLongitude: userCoords.long,
        }).then(gyms => {
          setNearbyGyms(gyms);

          // Seleciona a primeira automaticamente (opcional)
          if (gyms.length > 0) {
            setSelectedGymId(gyms[0].id);
          }
        });
      },
      (error) => {
        console.error("Error ao obter localização", error);
        toast.error("Precisamos da sua localização para o check-in!");
      }
    );
  }, []);

  const { mutateAsync: doCheckIn, isPending } = useMutation({
    mutationFn: createCheckIn,
    onSuccess: () => {
      toast.success("Check-in realizado!", {
        description: "+50 XP adicionados. Continue assim!",
      });
      fetchCurrentUser(); // Atualiza os dados do usuário (XP e Streak) na hora
    },
    onError: (error: any) => {
      toast.error("Erro ao fazer check-in", {
        description: error.response?.data?.message || "Tente novamente.",
      });
    },
  });

  async function handleCheckIn() {
    if (!coords || !selectedGymId) {
      return toast.error("Nenhuma academia próxima encontrada.");
    }

    await doCheckIn({
      gymId: selectedGymId, // Usa o ID da academia encontrada
      userLatitude: coords.lat,
      userLongitude: coords.long
    });
  }

  const userAvatar = userData?.avatar || "https://github.com/shadcn.png";

  const { data: metrics } = useQuery({
    queryKey: ['metrics'],
    queryFn: getUserMetrics,
  });

  return (
    <div className="pb-20 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Olá, {userData?.name}!</h1>
            <p className="text-primary-foreground/80">
              Pronto para treinar hoje?
            </p>
          </div>
          <img
            src={userAvatar}
            alt="Avatar"
            className="w-12 h-12 rounded-full border-2 border-primary-foreground/20"
          />
        </div>

        <div className="space-y-4">
          <XPDisplay currentXP={userData?.xp} size="lg" />
          <div className="flex items-center justify-between">
            <StreakDisplay days={userData?.streak} />
            <div className="text-right">
              <div className="text-sm text-primary-foreground/80">
                Academia atual
              </div>
              <div className="font-medium">FitLife Academia</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Check-in Button */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <CheckCircle
                className={`w-16 h-16 mx-auto ${hasCheckedIn ? "text-success" : "text-muted-foreground"
                  }`}
              />
              <div>
                <h3 className="text-lg font-semibold">
                  {hasCheckedIn ? "Check-in realizado!" : "Fazer Check-in"}
                </h3>
                <p className="text-muted-foreground">
                  {hasCheckedIn
                    ? "Bom treino! Você ganhou 50 XP"
                    : "Ganhe 50 XP pelo treino de hoje"}
                </p>
              </div>
              {!hasCheckedIn && (
                <Button onClick={handleCheckIn} size="lg" className="w-full">
                  Check-in na FitLife Academia
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatsCard
            title="Check-ins"
            value={metrics?.checkInsCount ?? 0} // Usa o dado real ou 0
            icon={Calendar}
            subtitle="Total realizado"
          />
          <StatsCard
            title="Academias"
            value={mockUser.gymsVisited}
            icon={Building2}
            subtitle="Visitadas"
          />
        </div>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <Badge
                type="streak_7"
                unlocked={mockUser.badges.includes("streak_7")}
              />
              <Badge
                type="streak_30"
                unlocked={mockUser.badges.includes("streak_30")}
              />
              <Badge
                type="streak_100"
                unlocked={mockUser.badges.includes("streak_100")}
              />
              <Badge
                type="gym_explorer"
                unlocked={mockUser.badges.includes("gym_explorer")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Leaderboards */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Ranking Usuários</TabsTrigger>
            <TabsTrigger value="gyms">Ranking Academias</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Ranking Global
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboardUsers?.map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className={`font-bold w-6 text-center ${index === 0 ? "text-yellow-500 text-xl" :
                          index === 1 ? "text-gray-400 text-lg" :
                            index === 2 ? "text-amber-600 text-lg" : "text-muted-foreground"
                          }`}>
                          {index + 1}º
                        </span>

                        <Avatar className="h-10 w-10 border-2 border-background">
                          {/* Lógica para mostrar avatar real ou fallback */}
                          <AvatarImage src={user.avatar ?? undefined} />
                          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.streak} dias ofensiva 🔥</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-primary">{user.xp} XP</span>
                      </div>
                    </div>
                  ))}

                  {(!leaderboardUsers || leaderboardUsers.length === 0) && (
                    <p className="text-center text-muted-foreground py-4">Ainda sem ranking.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gyms" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Top Academias
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockGymLeaderboard.map((gym, index) => (
                  <div key={gym.id} className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0
                        ? "bg-warning text-warning-foreground"
                        : index === 1
                          ? "bg-muted text-muted-foreground"
                          : index === 2
                            ? "bg-warning/60 text-warning-foreground"
                            : "bg-accent text-accent-foreground"
                        }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{gym.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {gym.totalXP} XP • {gym.members}{" "}
                        membros
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
