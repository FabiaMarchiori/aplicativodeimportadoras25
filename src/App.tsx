
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AdminBadge } from "./components/AdminBadge";
import BottomNavigation from "./components/BottomNavigation";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Categorias from "./pages/Categorias";
import Categoria from "./pages/Categoria";
import DetalheFornecedor from "./pages/DetalheFornecedor";
import Busca from "./pages/Busca";
import Favoritos from "./pages/Favoritos";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";

// Atualizando o título do documento
document.title = "Lista de Importadora da 25 de Março";

const queryClient = new QueryClient();

function AppContent() {
  const { isAdmin } = useAuth();
  
  return (
    <>
      {isAdmin && <AdminBadge />}
      <div className="pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/categoria/:id" element={<Categoria />} />
          <Route path="/fornecedor/:id" element={<DetalheFornecedor />} />
          <Route path="/buscar" element={<Busca />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <BottomNavigation />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
