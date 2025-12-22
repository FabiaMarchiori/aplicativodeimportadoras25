import { Home, Search, Heart, User, Grid, Bot } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function BottomNavigation() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#050d1a] border-t border-white/10 shadow-[0_-4px_30px_rgba(6,182,212,0.1)]">
      <div className="flex justify-around items-center h-20">
        <NavItem 
          to="/" 
          icon={<Home className="h-6 w-6" />} 
          label="Início" 
          active={isActive('/')}
        />
        <NavItem 
          to="/categorias" 
          icon={<Grid className="h-6 w-6" />} 
          label="Categorias" 
          active={isActive('/categorias')}
        />
        <NavItem 
          to="/buscar" 
          icon={<Search className="h-6 w-6" />} 
          label="Buscar" 
          active={isActive('/buscar')}
        />
        <NavItem 
          to="/mentoria" 
          icon={<Bot className="h-7 w-7" />} 
          label="Soph" 
          active={isActive('/mentoria')}
          highlighted
        />
        <NavItem 
          to="/favoritos" 
          icon={<Heart className="h-6 w-6" />} 
          label="Favoritos" 
          active={isActive('/favoritos')}
        />
        <NavItem 
          to="/perfil" 
          icon={<User className="h-6 w-6" />} 
          label="Perfil" 
          active={isActive('/perfil')}
        />
      </div>
    </nav>
  );
}

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  highlighted?: boolean;
};

function NavItem({ to, icon, label, active, highlighted }: NavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center justify-center px-2 py-2 rounded-lg",
        "transition-all duration-300 ease-out",
        "active:opacity-70 active:scale-95",
        active
          ? "text-white"
          : "text-white/70 hover:text-white"
      )}
    >
      <div className={cn(
        "transition-all duration-300 ease-out",
        highlighted && "text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]",
        active && !highlighted && "drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]",
        !active && !highlighted && "hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-[11px] mt-1.5 transition-all duration-300",
        active ? "font-semibold text-white" : "font-medium",
        highlighted && "text-cyan-300"
      )}>
        {label}
      </span>
    </Link>
  );
}
