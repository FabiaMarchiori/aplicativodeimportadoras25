import { useAuth } from "@/contexts/AuthContext";
import FloatingActionButton from "@/components/FloatingActionButton";
import { useState } from "react";
import AddCategoryDialog from "@/components/home/AddCategoryDialog";
import HeroSection from "@/components/home/HeroSection";
import QuickActions from "@/components/home/QuickActions";
import BenefitsSection from "@/components/home/BenefitsSection";
import { useOnboarding } from "@/hooks/useOnboarding";
import OnboardingModal from "@/components/onboarding/OnboardingModal";

// Partículas sofisticadas para background
const ParticlesBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-cyan-400/10"
        style={{
          width: `${Math.random() * 8 + 4}px`,
          height: `${Math.random() * 8 + 4}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `particleFloat ${25 + Math.random() * 15}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 10}s`,
        }}
      />
    ))}
  </div>
);

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isAdmin, user } = useAuth();
  const { showOnboarding, completeOnboarding, isLoading } = useOnboarding();

  console.log("Componente Home renderizado");
  console.log("Usuário:", user);
  console.log("É admin:", isAdmin);

  // Não renderiza nada enquanto verifica o status do onboarding
  if (isLoading) {
    return (
      <div className="min-h-screen bg-home-gradient flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-home-gradient relative">
      {/* Onboarding Modal - aparece apenas no primeiro acesso */}
      {showOnboarding && (
        <OnboardingModal onComplete={completeOnboarding} />
      )}

      {/* Noise overlay sutil */}
      <div className="noise-overlay fixed inset-0 pointer-events-none z-0" />
      
      {/* Partículas sofisticadas */}
      <ParticlesBackground />
      
      {/* Conteúdo */}
      <div className="relative z-10 pb-24">
        <HeroSection />
        <div className="px-4">
          <QuickActions />
          <BenefitsSection />
        </div>
      </div>

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
