import { ReactNode } from "react";
type AuthLayoutProps = {
  children: ReactNode;
  containerClass?: string;
};
export function AuthLayout({
  children,
  containerClass = ""
}: AuthLayoutProps) {
  return <div className={`relative flex flex-col items-center justify-center min-h-screen p-4 fade-in overflow-hidden ${containerClass}`}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float-slow" />
        <div className="absolute top-40 right-16 w-16 h-16 bg-white/5 rounded-lg rotate-45 animate-float-medium" />
        <div className="absolute bottom-32 left-20 w-12 h-12 bg-white/10 rounded-full animate-float-fast" />
        <div className="absolute bottom-20 right-32 w-24 h-24 bg-white/5 rounded-lg rotate-12 animate-float-slow" />
        <div className="absolute top-1/2 left-4 w-8 h-8 bg-white/10 rounded-full animate-float-medium" />
        <div className="absolute top-1/3 right-8 w-14 h-14 bg-white/5 rounded-lg rotate-30 animate-float-fast" />
        
        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 via-transparent to-white/10" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-white/10 via-transparent to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 animate-slide-up">
          
          <h1 className="text-3xl font-bold text-white mb-2">Importadoras da 25 de Março</h1>
          <p className="text-white/90 text-lg">Seu diretório de fornecedores</p>
          <div className="mt-4 w-16 h-1 bg-white/30 mx-auto rounded-full" />
        </div>
        {children}
      </div>
    </div>;
}