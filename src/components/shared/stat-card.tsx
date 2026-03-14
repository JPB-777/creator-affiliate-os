import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: "default" | "success" | "destructive" | "warning" | "primary";
  subtitle?: string;
}

const colorMap = {
  default: {
    border: "border-t-border",
    iconBg: "bg-muted",
    iconText: "text-muted-foreground",
    valueText: "",
  },
  primary: {
    border: "border-t-primary",
    iconBg: "bg-primary/10",
    iconText: "text-primary",
    valueText: "",
  },
  success: {
    border: "border-t-success",
    iconBg: "bg-success/10",
    iconText: "text-success",
    valueText: "text-success",
  },
  destructive: {
    border: "border-t-destructive",
    iconBg: "bg-destructive/10",
    iconText: "text-destructive",
    valueText: "text-destructive",
  },
  warning: {
    border: "border-t-warning",
    iconBg: "bg-warning/10",
    iconText: "text-warning",
    valueText: "text-warning",
  },
};

export function StatCard({ label, value, icon, color = "default", subtitle }: StatCardProps) {
  const c = colorMap[color];

  return (
    <div
      className={cn(
        "rounded-xl bg-card ring-1 ring-foreground/10 border-t-2 p-5",
        c.border
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", c.iconBg)}>
          <div className={cn("[&>svg]:h-4 [&>svg]:w-4", c.iconText)}>{icon}</div>
        </div>
      </div>
      <div className={cn("mt-2 text-3xl font-bold font-mono tabular-nums", c.valueText)}>
        {value}
      </div>
      {subtitle && (
        <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
