import { Trophy } from "lucide-react";

interface XPDisplayProps {
  currentXP: number;
  maxXP?: number;
  size?: "sm" | "md" | "lg";
}

export const XPDisplay = ({ currentXP, maxXP = 1000, size = "md" }: XPDisplayProps) => {
  const percentage = (currentXP / maxXP) * 100;
  
  const sizeClasses = {
    sm: "h-2",
    md: "h-3", 
    lg: "h-4"
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-primary" />
          <span className={`font-bold text-foreground ${textSizes[size]}`}>
            {currentXP} XP
          </span>
        </div>
        {maxXP && (
          <span className="text-muted-foreground text-sm">
            {maxXP}
          </span>
        )}
      </div>
      
      {maxXP && (
        <div className="w-full bg-accent rounded-full overflow-hidden">
          <div 
            className={`bg-gradient-primary ${sizeClasses[size]} transition-all duration-300 ease-out`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};