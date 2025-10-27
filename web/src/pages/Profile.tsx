import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/gamification/Badge";
import { StatsCard } from "@/components/ui/stats-card";
import { mockUser, mockCheckInHistory } from "@/data/mockData";
import { 
  User, 
  Trophy, 
  Calendar, 
  MapPin, 
  Activity,
  History,
  Award
} from "lucide-react";

export const Profile = () => {
  return (
    <div className="pb-20 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-gradient-success text-success-foreground p-6">
        <div className="flex items-center gap-4">
          <img 
            src={mockUser.avatar} 
            alt="Avatar"
            className="w-20 h-20 rounded-full border-4 border-success-foreground/20"
          />
          <div>
            <h1 className="text-2xl font-bold">{mockUser.name}</h1>
            <p className="text-success-foreground/80">{mockUser.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Trophy className="w-4 h-4" />
              <span className="font-semibold">{mockUser.xp.toLocaleString()} XP</span>
              <span className="text-success-foreground/60">•</span>
              <span>{mockUser.streak} dias seguidos</span>
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
            value={mockUser.totalCheckIns}
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
              <Badge type="first_checkin" unlocked={mockUser.badges.includes("first_checkin")} />
              <Badge type="streak_7" unlocked={mockUser.badges.includes("streak_7")} />
              <Badge type="streak_30" unlocked={mockUser.badges.includes("streak_30")} />
              <Badge type="streak_100" unlocked={mockUser.badges.includes("streak_100")} />
              <Badge type="gym_explorer" unlocked={mockUser.badges.includes("gym_explorer")} />
            </div>
          </CardContent>
        </Card>

        {/* Check-in History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Histórico de Check-ins
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockCheckInHistory.map((checkIn) => (
              <div key={checkIn.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <div className="font-medium text-sm">{checkIn.gym}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(checkIn.date).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-success">
                    +{checkIn.xpEarned} XP
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};