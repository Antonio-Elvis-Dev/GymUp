import { Flame } from "lucide-react";

interface StreakDisplayProps {
  days: number;
  size?: "sm" | "md" | "lg";
}

export const StreakDisplay = ({ days, size = "md" }: StreakDisplayProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base", 
    lg: "text-lg"
  };

  return (
    <div className="flex items-center gap-2">
      <Flame className={`${sizeClasses[size]} text-warning`} />
      <div>
        <span className={`font-bold text-foreground ${textSizes[size]}`}>
          {days}
        </span>
        <span className="text-muted-foreground text-sm ml-1">
          dias seguidos
        </span>
      </div>
    </div>
  );
};