import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, Smartphone, Share } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export const PWAInstallPrompt = () => {
  const { isInstallable, isInstalled, showInstallPrompt, isIOS, isAndroid } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isInstalled || dismissed) {
      setShowPrompt(false);
      return;
    }

    // Show prompt after 3 seconds if installable
    const timer = setTimeout(() => {
      if (isInstallable || isIOS) {
        setShowPrompt(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isInstallable, isInstalled, dismissed, isIOS]);

  const handleInstall = async () => {
    if (isAndroid && isInstallable) {
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
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <Card className="border-primary/20 bg-background/95 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-primary" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">
                Instale o App 25 de Março
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {isIOS
                  ? "Adicione à sua tela inicial para acesso rápido"
                  : "Instale nosso app para uma melhor experiência"}
              </p>
              
              {isIOS ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Share className="w-4 h-4" />
                  <span>Toque em "Compartilhar" e depois "Adicionar à Tela Inicial"</span>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleInstall}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Instalar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDismiss}
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
              className="flex-shrink-0 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};