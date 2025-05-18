import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

const AuthCard = ({ children, className }: AuthCardProps) => {
  return (
    <div className={cn("w-full max-w-md p-8 rounded-lg shadow-md bg-card text-card-foreground", className)}>
      {children}
    </div>
  );
};

export default AuthCard;