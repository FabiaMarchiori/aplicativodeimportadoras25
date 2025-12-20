// Build refresh - força recompilação - 2024-12-20-v2
import { ReactNode, useMemo } from "react";

type AuthLayoutProps = {
  children: ReactNode;
  containerClass?: string;
};

export function AuthLayout({
  children,
  containerClass = ""
}: AuthLayoutProps) {
  // Gerar bolhas de fundo apenas uma vez
  const bubbles = useMemo(() => 
    [...Array(10)].map((_, i) => ({
      width: Math.random() * 120 + 60,
      height: Math.random() * 120 + 60,
      left: Math.random() * 100,
      top: Math.random() * 100,
    })), []
  );

  return (
    <div className={`relative flex flex-col items-center justify-center min-h-screen p-4 fade-in overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0d1f35] to-[#0a1a2e] ${containerClass}`}>
      {/* Bolhas sutis de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {bubbles.map((bubble, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-400/[0.06]"
            style={{
              width: `${bubble.width}px`,
              height: `${bubble.height}px`,
              left: `${bubble.left}%`,
              top: `${bubble.top}%`,
              filter: 'blur(40px)',
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-white mb-2">Importadoras da 25 de Março</h1>
          <p className="text-white/70 text-lg">Seu Aplicativo de fornecedores</p>
          <div className="mt-4 w-16 h-1 bg-gradient-to-r from-cyan-400 to-cyan-500 mx-auto rounded-full" />
        </div>
        {children}
      </div>
    </div>
  );
}
