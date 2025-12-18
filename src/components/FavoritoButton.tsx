
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FavoritoButtonProps {
  isFavorito: boolean;
  onToggle: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FavoritoButton({ 
  isFavorito, 
  onToggle, 
  size = "md", 
  className 
}: FavoritoButtonProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-10 w-10"
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        sizeClasses[size],
        "bg-transparent hover:bg-transparent border-none transition-all duration-300",
        "hover:shadow-[0_0_12px_rgba(90,215,255,0.4)]",
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      <Heart 
        size={iconSizes[size]} 
        className={cn(
          "transition-all duration-300",
          isFavorito 
            ? "text-[#5AD7FF] fill-[#5AD7FF]/60" 
            : "text-[#5AD7FF] fill-transparent hover:text-[#7EEDFF]"
        )} 
      />
    </Button>
  );
}
