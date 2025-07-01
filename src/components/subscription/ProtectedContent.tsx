
import React from 'react';
import SubscriptionGuard from './SubscriptionGuard';

interface ProtectedContentProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const ProtectedContent: React.FC<ProtectedContentProps> = ({ 
  children, 
  title = "Conteúdo Premium",
  description = "Este conteúdo está disponível apenas para assinantes premium."
}) => {
  return (
    <SubscriptionGuard
      fallback={
        <div className="text-center p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
          <h3 className="text-xl font-bold text-amber-800 mb-2">{title}</h3>
          <p className="text-amber-700 mb-4">{description}</p>
          <a
            href="https://pay.kiwify.com.br/qGIyN9H"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-[#F9C820] text-[#1981A7] font-semibold rounded-lg hover:bg-[#F9C820]/90 transition-colors"
          >
            Assinar Agora
          </a>
        </div>
      }
    >
      {children}
    </SubscriptionGuard>
  );
};

export default ProtectedContent;
