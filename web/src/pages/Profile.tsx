import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/gamification/Badge";
import { StatsCard } from "@/components/ui/stats-card";
import { mockUser, mockCheckInHistory } from "@/data/mockData";

import { fetchCheckInHistory } from "@/api/fetch-check-in-history";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  User,
  Trophy,
  Calendar,
  MapPin,
  Activity,
  History,
  Award,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getUserMetrics } from "@/api/get-user-metrics";
import { Skeleton } from "@/components/ui/skeleton";


export const Profile = () => {
  const { signOut, userData } = useAuth();
  const navigate = useNavigate();
  async function handleSignOut() {
    signOut();
  }
  const { data: history, isLoading } = useQuery({
    queryKey: ['check-in-history'],
    queryFn: () => fetchCheckInHistory(1),
  });
  const { data: metrics } = useQuery({
      queryKey: ['metrics'],
      queryFn: getUserMetrics,
    });
  
  const userAvatar = userData?.avatar || "https://github.com/shadcn.png";

  return (
    <div className="pb-20 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-gradient-success text-success-foreground p-6">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <img
                src={userAvatar}
                alt="Avatar"
                className="w-20 h-20 rounded-full border-4 border-success-foreground/20"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button className="flex flex-1 ">Editar</Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button
                  className="flex flex-1 bg-red-600"
                  onClick={() => handleSignOut()}
                >
                  Sair
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div>
            <h1 className="text-2xl font-bold">{userData?.name}</h1>
            <p className="text-success-foreground/80">{userData?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Trophy className="w-4 h-4" />
              <span className="font-semibold">
                {userData.xp.toLocaleString()} XP
              </span>
              <span className="text-success-foreground/60">•</span>
              <span>{userData.streak} dias seguidos</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatsCard
            title="Dias Ativos"
            value={mockUser.activeDays}
            icon={Calendar}
            variant="primary"
          />
          <StatsCard
            title="Academias"
            value={mockUser.gymsVisited}
            icon={MapPin}
            variant="secondary"
          />
          <StatsCard
            title="Check-ins"
            value={metrics.checkInsCount}
            icon={Activity}
            variant="success"
          />
          <StatsCard
            title="Conquistas"
            value={mockUser.badges.length}
            icon={Award}
          />
        </div>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Minhas Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <Badge
                type="first_checkin"
                unlocked={mockUser.badges.includes("first_checkin")}
              />
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

        {/* Check-in History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Histórico de Treinos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                 <Skeleton className="h-12 w-full" />
                 <Skeleton className="h-12 w-full" />
                 <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="space-y-6">
                {history?.map((checkIn) => (
                  <div 
                    key={checkIn.id} 
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold text-foreground">
                          {checkIn.gym.title}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">
                        {new Date(checkIn.created_at).toLocaleDateString('pt-BR', {
                          weekday: 'long',
                          day: '2-digit',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    <div>
                      {checkIn.validated_at ? (
                         <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full dark:bg-green-900/30 dark:text-green-400">
                           Validado
                         </span>
                      ) : (
                         <span className="px-3 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full dark:bg-yellow-900/30 dark:text-yellow-400">
                           Aguardando
                         </span>
                      )}
                    </div>
                  </div>
                ))}

                {history?.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">Nenhum treino registrado ainda.</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
