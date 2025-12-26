
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, Share } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export const PWAInstallPrompt = () => {
  const { isInstallable, isInstalled, showInstallPrompt, isIOS, isAndroid, isDesktop, canInstall } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isInstalled || dismissed) {
      setShowPrompt(false);
      return;
    }

    // Show prompt after 3 seconds if installable
    const timer = setTimeout(() => {
      if (canInstall) {
        setShowPrompt(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [canInstall, isInstalled, dismissed]);

  const handleInstall = async () => {
    if (isInstallable) {
      const success = await showInstallPrompt();
      if (success) {
        setShowPrompt(false);
      }
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShowPrompt(false);
  };

  if (!showPrompt || isInstalled) {
    return null;
  }

  return (
    <>
      {/* Overlay escuro */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in" />
      
      {/* Modal centralizado */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-scale-in">
        <Card className="w-full max-w-md border-primary/20 bg-background shadow-2xl">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <img 
                  src="/icon-192x192.png" 
                  alt="Logo 25 de Março" 
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Instale o App 25 de Março
                </h3>
                <p className="text-muted-foreground">
                  {isIOS
                    ? "Adicione à sua tela inicial para acesso rápido e uma melhor experiência"
                    : "Instale nosso app para uma melhor experiência, acesso mais rápido e funcionalidades offline"}
                </p>
              </div>
              
              {isIOS ? (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                    <Share className="w-4 h-4" />
                    <span>Toque em "Compartilhar" e depois "Adicionar à Tela Inicial"</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button
                    size="lg"
                    onClick={handleInstall}
                    className="w-full flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Instalar App
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleDismiss}
                    className="w-full"
                  >
                    Agora não
                  </Button>
                </div>
              )}
            </div>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              className="absolute top-4 right-4 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
