
import { useAuth } from "@/contexts/AuthContext";
import FloatingActionButton from "@/components/FloatingActionButton";
import { useState } from "react";
import AddCategoryDialog from "@/components/home/AddCategoryDialog";
import HeroSection from "@/components/home/HeroSection";
import QuickActions from "@/components/home/QuickActions";
import BenefitsSection from "@/components/home/BenefitsSection";
import DestaquesSemana from "@/components/home/DestaquesSemana";
import FavoritosRecentes from "@/components/home/FavoritosRecentes";
import CategoriasCarousel from "@/components/home/CategoriasCarousel";
import BonusSection from "@/components/home/BonusSection";
import PromoBanner from "@/components/home/PromoBanner";

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isAdmin } = useAuth();

  return (
    <div className="page-container fade-in">
      <HeroSection />
      <QuickActions />
      <BenefitsSection />
      <DestaquesSemana />
      <FavoritosRecentes />
      <CategoriasCarousel />
      <BonusSection />
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
