
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
        "bg-transparent hover:bg-transparent border-none transition-all duration-200 ease-out",
        "hover:shadow-[0_0_10px_rgba(34,211,238,0.35)]",
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
          "transition-all duration-200 ease-out",
          isFavorito 
            ? "text-cyan-400 fill-cyan-400" 
            : "text-cyan-400 fill-transparent hover:fill-cyan-400/30"
        )} 
      />
    </Button>
  );
}
