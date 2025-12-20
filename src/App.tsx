// Build trigger - força regeneração do deploy - 2024-12-20-v6
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import Mentoria from "./pages/Mentoria";
import MentoriaEmbedded from "./pages/MentoriaEmbedded";
import MentoriaChat from "./pages/MentoriaChat";

// Atualizando o título do documento
document.title = "Lista de Importadora da 25 de Março";

const queryClient = new QueryClient();

function AppContent() {
  const { isAdmin } = useAuth();
  const location = useLocation();
  
  // Rotas públicas que NÃO devem ter BottomNavigation nem wrapper pb-16
  const publicRoutes = ['/login', '/reset-password', '/redefinir-senha', '/acesso-negado'];
  const isPublicRoute = publicRoutes.includes(location.pathname);
  
  // Rotas públicas: renderizar ISOLADO (sem wrapper, sem BottomNavigation)
  if (isPublicRoute) {
    return (
      <>
        {isAdmin && <AdminBadge />}
        <PWAInstallPrompt />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/redefinir-senha" element={<ResetPassword />} />
          <Route path="/acesso-negado" element={<AcessoNegado />} />
        </Routes>
      </>
    );
  }

  // Rotas privadas: com wrapper pb-16 e BottomNavigation
  return (
    <>
      {isAdmin && <AdminBadge />}
      <PWAInstallPrompt />
      <div className="pb-16">
        <Routes>
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
          <Route path="/mentoria" element={
            <PrivateRoute>
              <Mentoria />
            </PrivateRoute>
          } />
          <Route path="/mentoria-embedded" element={
            <PrivateRoute>
              <MentoriaEmbedded />
            </PrivateRoute>
          } />
          <Route path="/mentoria/chat" element={
            <PrivateRoute>
              <MentoriaChat />
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
