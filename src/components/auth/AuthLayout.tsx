
import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
  containerClass?: string;
};

export function AuthLayout({ children, containerClass = "" }: AuthLayoutProps) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 fade-in ${containerClass}`}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Importadoras da 25 de Março</h1>
          <p className="text-white opacity-90">Seu diretório de fornecedores</p>
        </div>
        {children}
      </div>
    </div>
  );
}
