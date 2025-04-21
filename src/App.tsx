
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import BottomNavigation from "./components/BottomNavigation";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Categorias from "./pages/Categorias";
import Categoria from "./pages/Categoria";
import DetalheFornecedor from "./pages/DetalheFornecedor";
import Busca from "./pages/Busca";
import Favoritos from "./pages/Favoritos";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="pb-16"> {/* Espaço para BottomNavigation */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
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
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
