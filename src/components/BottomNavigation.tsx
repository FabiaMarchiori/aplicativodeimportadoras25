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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#F9C820] shadow-lg">
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
        "flex flex-col items-center justify-center px-3 py-1 rounded-lg transition-all duration-200",
        active
          ? "text-[#111827] nav-active-glow"
          : "text-[#111827]/70 hover:text-[#111827]"
      )}
    >
      <div className={cn(
        "transition-transform duration-200",
        active && "scale-110"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-xs mt-1",
        active ? "font-semibold" : "font-medium"
      )}>
        {label}
      </span>
    </Link>
  );
}
