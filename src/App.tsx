
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AdminBadge } from "./components/AdminBadge";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import BottomNavigation from "./components/BottomNavigation";
import PrivateRoute from "./components/PrivateRoute";
import Index from "./pages/Index";
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
import AcessoNegado from "./pages/AcessoNegado";
import StatusAssinatura from "./pages/StatusAssinatura";
import DebugAssinatura from "./pages/DebugAssinatura";
import AdminAssinaturas from "./pages/AdminAssinaturas";

// Atualizando o título do documento
document.title = "Lista de Importadora da 25 de Março";

const queryClient = new QueryClient();

function AppContent() {
  const { isAdmin } = useAuth();
  
  return (
    <>
      {isAdmin && <AdminBadge />}
      <PWAInstallPrompt />
      <div className="pb-16">
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/redefinir-senha" element={<ResetPassword />} />
          <Route path="/acesso-negado" element={<AcessoNegado />} />
          
          {/* Rota de redirecionamento */}
          <Route path="/" element={<Index />} />

          {/* Rotas privadas (protegidas) */}
          <Route path="/home" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          <Route path="/categorias" element={
            <PrivateRoute>
              <Categorias />
            </PrivateRoute>
          } />
          <Route path="/categoria/:id" element={
            <PrivateRoute>
              <Categoria />
            </PrivateRoute>
          } />
          <Route path="/fornecedor/:id" element={
            <PrivateRoute>
              <DetalheFornecedor />
            </PrivateRoute>
          } />
          <Route path="/buscar" element={
            <PrivateRoute>
              <Busca />
            </PrivateRoute>
          } />
          <Route path="/favoritos" element={
            <PrivateRoute>
              <Favoritos />
            </PrivateRoute>
          } />
          <Route path="/perfil" element={
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>
          } />
          <Route path="/assinatura" element={
            <PrivateRoute>
              <StatusAssinatura />
            </PrivateRoute>
          } />
          <Route path="/debug-assinatura" element={
            <PrivateRoute>
              <DebugAssinatura />
            </PrivateRoute>
          } />
          <Route path="/admin/assinaturas" element={
            <PrivateRoute>
              <AdminAssinaturas />
            </PrivateRoute>
          } />
          <Route path="*" element={
            <PrivateRoute>
              <NotFound />
            </PrivateRoute>
          } />
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
