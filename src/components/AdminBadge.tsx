
import { ShieldCheck } from "lucide-react";

export function AdminBadge() {
  return (
    <div className="fixed top-4 right-4 z-50 bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2 shadow-md">
      <ShieldCheck className="w-4 h-4" />
      <span className="text-sm font-medium">Modo Administrador</span>
    </div>
  );
}
