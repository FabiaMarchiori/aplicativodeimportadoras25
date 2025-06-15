
import { Heart, Calendar, Shield } from "lucide-react";

interface ProfileStatsProps {
  isAdmin: boolean;
  createdAt: string;
}

export default function ProfileStats({ isAdmin, createdAt }: ProfileStatsProps) {
  const memberSince = new Date(createdAt).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long'
  });

  const stats = [
    {
      icon: Calendar,
      label: "Membro desde",
      value: memberSince,
      color: "text-[#5FB9C3]"
    },
    ...(isAdmin ? [{
      icon: Shield,
      label: "Status",
      value: "Administrador",
      color: "text-[#F9C820]"
    }] : [])
  ];

  return (
    <div className="grid grid-cols-1 gap-3">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="p-2 rounded-full bg-white/10">
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </div>
          <div className="flex-1">
            <p className="text-white/70 text-sm">{stat.label}</p>
            <p className="text-white font-medium">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
