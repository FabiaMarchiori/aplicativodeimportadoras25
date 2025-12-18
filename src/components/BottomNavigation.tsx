import { Home, Search, Heart, User, Grid } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export default function BottomNavigation() {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#050d1a] border-t border-cyan-500/20 shadow-[0_-2px_20px_rgba(6,182,212,0.08)]">
      <div className="flex justify-around items-center h-16">
        <NavItem 
          to="/" 
          icon={<Home className="h-5 w-5" />} 
          label="Início" 
          active={isActive('/')}
        />
        <NavItem 
          to="/categorias" 
          icon={<Grid className="h-5 w-5" />} 
          label="Categorias" 
          active={isActive('/categorias')}
        />
        <NavItem 
          to="/buscar" 
          icon={<Search className="h-5 w-5" />} 
          label="Buscar" 
          active={isActive('/buscar')}
        />
        <NavItem 
          to="/favoritos" 
          icon={<Heart className="h-5 w-5" />} 
          label="Favoritos" 
          active={isActive('/favoritos')}
        />
        <NavItem 
          to="/perfil" 
          icon={<User className="h-5 w-5" />} 
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
};

function NavItem({ to, icon, label, active }: NavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center justify-center px-3 py-1 rounded-lg",
        "transition-all duration-300 ease-out",
        "active:opacity-70 active:scale-95",
        active
          ? "text-cyan-400"
          : "text-slate-400 hover:text-slate-200"
      )}
    >
      <div className={cn(
        "transition-all duration-300 ease-out",
        active 
          ? "scale-105 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]" 
          : "hover:scale-105 hover:drop-shadow-[0_0_6px_rgba(148,163,184,0.4)]"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-[10px] mt-1 transition-all duration-300",
        active 
          ? "font-semibold text-cyan-300" 
          : "font-medium text-slate-500"
      )}>
        {label}
      </span>
    </Link>
  );
}
