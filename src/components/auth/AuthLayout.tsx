// Build refresh - força recompilação - 2024-12-20-v10
import { ReactNode, useMemo } from "react";

type AuthLayoutProps = {
  children: ReactNode;
  containerClass?: string;
};

export function AuthLayout({
  children,
  containerClass = ""
}: AuthLayoutProps) {
  // Gerar bolhas flutuantes animadas
  const bubbles = useMemo(() => 
    [...Array(12)].map((_, i) => ({
      size: Math.random() * 100 + 40,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
    })), []
  );

  // Gerar quadrados decorativos animados
  const squares = useMemo(() => 
    [...Array(8)].map((_, i) => ({
      size: Math.random() * 20 + 10,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 20 + Math.random() * 15,
      rotation: Math.random() * 360,
    })), []
  );

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-[#0B1F33] via-[#0d2540] to-[#0a1a2e]"
      style={{ position: 'relative' }}
    >
      {/* Bolhas flutuantes animadas - fixas no fundo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {bubbles.map((bubble, i) => (
          <div
            key={`bubble-${i}`}
            className="absolute rounded-full bg-cyan-400/[0.08]"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.left}%`,
              top: `${bubble.top}%`,
              filter: 'blur(30px)',
              animation: `particleFloat ${bubble.duration}s ease-in-out infinite`,
              animationDelay: `${bubble.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Quadrados decorativos flutuantes - fixos no fundo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {squares.map((square, i) => (
          <div
            key={`square-${i}`}
            className="absolute border border-cyan-400/20"
            style={{
              width: `${square.size}px`,
              height: `${square.size}px`,
              left: `${square.left}%`,
              top: `${square.top}%`,
              transform: `rotate(${square.rotation}deg)`,
              animation: `particleFloat ${square.duration}s ease-in-out infinite`,
              animationDelay: `${square.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Efeito de glow central sutil - fixo no fundo */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/[0.03] rounded-full blur-[100px] pointer-events-none" />
      
      {/* Conteúdo - alinhado ao topo com padding mínimo */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4 pt-4 pb-8 fade-in" style={{ marginTop: 0, paddingTop: '16px' }}>
        <div className="text-center mb-6 animate-fade-in">
          <h1 className="text-3xl font-bold text-white mb-2">Importadoras da 25 de Março</h1>
          <p className="text-white/70 text-lg">Seu Aplicativo de fornecedores</p>
          <div className="mt-4 w-16 h-1 bg-gradient-to-r from-cyan-400 to-cyan-500 mx-auto rounded-full" />
        </div>
        {children}
      </div>
    </div>
  );
}
