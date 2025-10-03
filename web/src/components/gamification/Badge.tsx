import { Award, Calendar, Target, Trophy } from "lucide-react";

interface BadgeProps {
  type: "streak_7" | "streak_30" | "streak_100" | "first_checkin" | "gym_explorer";
  unlocked: boolean;
  size?: "sm" | "md" | "lg";
}

const badgeConfig = {
  streak_7: {
    icon: Calendar,
    name: "7 Dias",
    description: "7 dias seguidos",
    color: "text-success"
  },
  streak_30: {
    icon: Target,
    name: "30 Dias", 
    description: "30 dias seguidos",
    color: "text-secondary"
  },
  streak_100: {
    icon: Trophy,
    name: "100 Dias",
    description: "100 dias seguidos", 
    color: "text-warning"
  },
  first_checkin: {
    icon: Award,
    name: "Primeiro Check-in",
    description: "Bem-vindo!",
    color: "text-info"
  },
  gym_explorer: {
    icon: Target,
    name: "Explorador",
    description: "3+ academias",
    color: "text-primary"
  }
};

export const Badge = ({ type, unlocked, size = "md" }: BadgeProps) => {
  const config = badgeConfig[type];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className={`
          ${sizeClasses[size]} 
          rounded-full border-2 
          flex items-center justify-center
          transition-all duration-200
          ${unlocked 
            ? `${config.color} border-current bg-card shadow-md` 
            : "text-muted-foreground border-muted bg-accent"
          }
        `}
      >
        <Icon className={iconSizes[size]} />
      </div>
      
      <div className="text-center">
        <div className={`text-xs font-medium ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
          {config.name}
        </div>
        <div className="text-xs text-muted-foreground">
          {config.description}
        </div>
      </div>
    </div>
  );
};