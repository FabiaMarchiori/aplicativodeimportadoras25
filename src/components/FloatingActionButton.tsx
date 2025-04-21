
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
}

export default function FloatingActionButton({ 
  onClick, 
  className 
}: FloatingActionButtonProps) {
  return (
    <Button
      className={cn(
        "fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg flex items-center justify-center p-0 text-primary-foreground",
        "bg-primary hover:bg-primary/90 transition-all duration-300",
        className
      )}
      onClick={onClick}
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
}
