import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo: React.FC<LogoProps> = ({ className, size = "md" }) => {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className={cn("font-bold", sizeClasses[size], className)}>
      <span className="text-primary">Global</span>
      <span className="text-dark">Services</span>
    </div>
  );
};

export default Logo;
