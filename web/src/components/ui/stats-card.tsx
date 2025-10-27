import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  variant?: "default" | "primary" | "secondary" | "success";
  className?: string;
}

export const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  subtitle,
  variant = "default",
  className 
}: StatsCardProps) => {
  const variants = {
    default: "bg-card border-border",
    primary: "bg-gradient-primary text-primary-foreground border-primary/20",
    secondary: "bg-gradient-secondary text-secondary-foreground border-secondary/20", 
    success: "bg-gradient-success text-success-foreground border-success/20"
  };

  return (
    <div className={cn(
      "p-4 rounded-lg border shadow-sm",
      variants[variant],
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className={cn(
            "text-sm font-medium",
            variant === "default" ? "text-muted-foreground" : "text-current/80"
          )}>
            {title}
          </p>
          <p className={cn(
            "text-2xl font-bold",
            variant === "default" ? "text-foreground" : "text-current"
          )}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className={cn(
              "text-xs",
              variant === "default" ? "text-muted-foreground" : "text-current/70"
            )}>
              {subtitle}
            </p>
          )}
        </div>
        <Icon className={cn(
          "w-8 h-8",
          variant === "default" ? "text-muted-foreground" : "text-current/80"
        )} />
      </div>
    </div>
  );
};