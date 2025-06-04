
import { ShieldCheck, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function AdminBadge() {
  const { user } = useAuth();
  
  // Check if this is the default admin (security risk)
  const isDefaultAdmin = user?.email === 'admin@admin.com';
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2 shadow-md">
        <ShieldCheck className="w-4 h-4" />
        <span className="text-sm font-medium">Modo Administrador</span>
      </div>
      
      {isDefaultAdmin && (
        <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full flex items-center gap-2 shadow-md">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs font-medium">Admin padrão - Alterar em produção</span>
        </div>
      )}
    </div>
  );
}
