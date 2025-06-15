
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
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-[#5FB9C3] to-[#F9C820] rounded-full opacity-75 blur-sm animate-pulse"></div>
      <Avatar className={`relative ${sizeClasses[size]} border-3 border-white shadow-lg`}>
        <AvatarImage src="" alt={user?.email} />
        <AvatarFallback className="bg-gradient-to-br from-[#5FB9C3] to-[#1981A7] text-white">
          <User className={iconSizes[size]} />
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
