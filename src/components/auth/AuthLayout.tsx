// Build refresh - força recompilação - 2024-12-20-v12 - PORTAL APPROACH
import { ReactNode, useMemo } from "react";
import { createPortal } from "react-dom";

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

  const content = (
    <div 
      className={`auth-layout-root ${containerClass}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        overflowY: 'auto',
        background: 'linear-gradient(to bottom right, #0B1F33, #0d2540, #0a1a2e)',
      }}
    >
      {/* Bolhas flutuantes animadas */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {bubbles.map((bubble, i) => (
          <div
            key={`bubble-${i}`}
            className="rounded-full bg-cyan-400/[0.08]"
            style={{
              position: 'absolute',
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

      {/* Quadrados decorativos flutuantes */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {squares.map((square, i) => (
          <div
            key={`square-${i}`}
            className="border border-cyan-400/20"
            style={{
              position: 'absolute',
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

      {/* Efeito de glow central sutil */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'rgba(34, 211, 238, 0.03)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />
      
      {/* Conteúdo - alinhado ao topo */}
      <div 
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '28rem',
          margin: '0 auto',
          padding: '16px 16px 32px 16px',
        }}
        className="fade-in"
      >
        <div className="text-center mb-6 animate-fade-in">
          <h1 className="text-3xl font-bold text-white mb-2">Importadoras da 25 de Março</h1>
          <p className="text-white/70 text-lg">Seu Aplicativo de fornecedores</p>
          <div className="mt-4 w-16 h-1 bg-gradient-to-r from-cyan-400 to-cyan-500 mx-auto rounded-full" />
        </div>
        {children}
      </div>
    </div>
  );

  // Renderiza diretamente no body para ignorar qualquer wrapper
  return createPortal(content, document.body);
}
