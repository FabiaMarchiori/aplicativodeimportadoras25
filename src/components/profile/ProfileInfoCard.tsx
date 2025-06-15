
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface ProfileInfoCardProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
}

export default function ProfileInfoCard({ 
  title, 
  icon: Icon, 
  children, 
  className = "" 
}: ProfileInfoCardProps) {
  return (
    <Card className={`bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5 text-[#F9C820]" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
}
