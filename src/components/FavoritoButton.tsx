
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
        "bg-white/80 hover:bg-white/90 border border-gray-200 transition-all duration-200",
        isFavorito && "text-red-500 hover:text-red-600",
        !isFavorito && "text-gray-400 hover:text-red-400",
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
          "transition-all duration-200",
          isFavorito && "fill-current"
        )} 
      />
    </Button>
  );
}
