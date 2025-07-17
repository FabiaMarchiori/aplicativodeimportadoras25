
import { useAuth } from "@/contexts/AuthContext";
import FloatingActionButton from "@/components/FloatingActionButton";
import { useState } from "react";
import AddCategoryDialog from "@/components/home/AddCategoryDialog";
import HeroSection from "@/components/home/HeroSection";
import QuickActions from "@/components/home/QuickActions";
import BenefitsSection from "@/components/home/BenefitsSection";
import FavoritosRecentes from "@/components/home/FavoritosRecentes";
import PromoBanner from "@/components/home/PromoBanner";

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isAdmin, user } = useAuth();

  console.log("Componente Home renderizado");
  console.log("Usuário:", user);
  console.log("É admin:", isAdmin);

  return (
    <div className="page-container fade-in">
      <HeroSection />
      <QuickActions />
      <BenefitsSection />
      <FavoritosRecentes />
      <PromoBanner />

      {isAdmin && (
        <>
          <FloatingActionButton onClick={() => setDialogOpen(true)} />
          <AddCategoryDialog 
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSuccess={() => window.location.reload()}
          />
        </>
      )}
    </div>
  );
}
