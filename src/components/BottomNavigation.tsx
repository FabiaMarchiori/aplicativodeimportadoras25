
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#F9C820] shadow-md">
      <div className="flex justify-around items-center h-16">
        <NavItem 
          to="/" 
          icon={<Home className="nav-icon" />} 
          label="Início" 
          active={isActive('/')}
        />
        <NavItem 
          to="/categorias" 
          icon={<Grid className="nav-icon" />} 
          label="Categorias" 
          active={isActive('/categorias')}
        />
        <NavItem 
          to="/buscar" 
          icon={<Search className="nav-icon" />} 
          label="Buscar" 
          active={isActive('/buscar')}
        />
        <NavItem 
          to="/favoritos" 
          icon={<Heart className="nav-icon" />} 
          label="Favoritos" 
          active={isActive('/favoritos')}
        />
        <NavItem 
          to="/perfil" 
          icon={<User className="nav-icon" />} 
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
        "flex flex-col items-center justify-center px-2 py-1 rounded-md transition-colors group",
        active
          ? "text-[#5FB9C3] font-medium"  // Atualizado para a nova cor azul
          : "text-foreground hover:text-[#5FB9C3]"  // Atualizado para a nova cor azul
      )}
    >
      {icon}
      <span className="text-xs mt-1 font-medium">{label}</span>
    </Link>
  );
}
