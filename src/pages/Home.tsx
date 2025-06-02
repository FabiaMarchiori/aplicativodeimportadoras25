
import { useAuth } from "@/contexts/AuthContext";
import FloatingActionButton from "@/components/FloatingActionButton";
import { useState } from "react";
import AddCategoryDialog from "@/components/home/AddCategoryDialog";
import WelcomeSection from "@/components/home/WelcomeSection";
import DestaquesSemana from "@/components/home/DestaquesSemana";
import FavoritosRecentes from "@/components/home/FavoritosRecentes";
import BonusSection from "@/components/home/BonusSection";
import CategoriasCarousel from "@/components/home/CategoriasCarousel";
import PromoBanner from "@/components/home/PromoBanner";

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isAdmin } = useAuth();

  return (
    <div className="page-container fade-in">
      <WelcomeSection />
      <DestaquesSemana />
      <FavoritosRecentes />
      <BonusSection />
      <CategoriasCarousel />
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
