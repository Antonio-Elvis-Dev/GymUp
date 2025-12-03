import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/gamification/Badge";
import { XPDisplay } from "@/components/gamification/XPDisplay";
import { StreakDisplay } from "@/components/gamification/StreakDisplay";
import { StatsCard } from "@/components/ui/stats-card";
import { mockLeaderboard, mockGymLeaderboard } from "@/data/mockData";
import { 
  CheckCircle, 
  Trophy, 
  Users, 
  Building2, 
  Target,
  Calendar
} from "lucide-react";
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth";

export const Dashboard = () => {
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  const handleCheckIn = () => {
    setHasCheckedIn(true);
    toast("Check-in realizado!",{

      description: "+50 XP adicionados. Continue assim!",
    });
  };
  const { userData } = useAuth();
  return (
    <div className="pb-20 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground p-6">
        <div className="flex items-center justify-between gap-6 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Olá, {userData?.name ?? "Usuário"}!</h1>
            <p className="text-primary-foreground/80">Pronto para treinar hoje?</p>
          </div>
          <div className="flex flex-col items-center">
            {userData?.avatar ? (
              <img 
                src={userData.avatar} 
                alt="Avatar"
                className="w-24 h-24 rounded-full border-4 border-primary-foreground/30 object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-primary-foreground/30 bg-primary-foreground/10 flex items-center justify-center">
                <svg className="w-12 h-12 text-primary-foreground/50" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <div className="text-center mt-2">
              <div className="text-sm text-primary-foreground/80">Academia atual:</div>
              <div className="font-medium">FitLife Academia</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <XPDisplay currentXP={0} size="lg" />
          <StreakDisplay days={0} />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Check-in Button */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <CheckCircle className={`w-16 h-16 mx-auto ${hasCheckedIn ? 'text-success' : 'text-muted-foreground'}`} />
              <div>
                <h3 className="text-lg font-semibold">
                  {hasCheckedIn ? "Check-in realizado!" : "Fazer Check-in"}
                </h3>
                <p className="text-muted-foreground">
                  {hasCheckedIn ? "Bom treino! Você ganhou 50 XP" : "Ganhe 50 XP pelo treino de hoje"}
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
            value={0}
            icon={Calendar}
            subtitle="Total"
          />
          <StatsCard
            title="Academias"
            value={0}
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
              <Badge type="streak_7" unlocked={false} />
              <Badge type="streak_30" unlocked={false} />
              <Badge type="streak_100" unlocked={false} />
              <Badge type="gym_explorer" unlocked={false} />
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
                  <Users className="w-5 h-5" />
                  Top Usuários
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockLeaderboard.slice(0, 5).map((user, index) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-warning text-warning-foreground' :
                      index === 1 ? 'bg-muted text-muted-foreground' :
                      index === 2 ? 'bg-warning/60 text-warning-foreground' :
                      'bg-accent text-accent-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.xp.toLocaleString()} XP</div>
                    </div>
                  </div>
                ))}
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
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-warning text-warning-foreground' :
                      index === 1 ? 'bg-muted text-muted-foreground' :
                      index === 2 ? 'bg-warning/60 text-warning-foreground' :
                      'bg-accent text-accent-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{gym.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {gym.totalXP.toLocaleString()} XP • {gym.members} membros
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