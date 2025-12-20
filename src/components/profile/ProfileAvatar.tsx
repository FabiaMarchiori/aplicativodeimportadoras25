import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  user: any;
  size?: "sm" | "md" | "lg";
}

export default function ProfileAvatar({ user, size = "lg" }: ProfileAvatarProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-20 h-20", 
    lg: "w-24 h-24"
  };

  const iconSizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };

  return (
    <div className="relative p-1 rounded-full bg-white/10 backdrop-blur-md">
      {/* Glow ciano */}
      <div className="absolute -inset-1 bg-cyan-400/30 rounded-full blur-md"></div>
      
      <Avatar className={`relative ${sizeClasses[size]} border-2 border-white/30 shadow-lg`}>
        <AvatarImage src="" alt={user?.email} />
        <AvatarFallback className="bg-gradient-to-br from-[#0b2a3f] to-[#0e3a52]">
          <User className={`${iconSizes[size]} text-white drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]`} />
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
