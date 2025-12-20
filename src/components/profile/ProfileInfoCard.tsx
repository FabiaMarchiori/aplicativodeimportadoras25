import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ReactNode, CSSProperties } from "react";

interface ProfileInfoCardProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function ProfileInfoCard({ 
  title, 
  icon: Icon, 
  children, 
  className = "",
  style
}: ProfileInfoCardProps) {
  return (
    <Card 
      className={`
        bg-white/10 
        backdrop-blur-md 
        border border-white/10 
        rounded-2xl 
        shadow-lg
        hover:bg-white/15 
        hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]
        transition-all duration-300
        ${className}
      `}
      style={style}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5 text-cyan-400" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
}
