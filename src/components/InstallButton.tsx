import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export const InstallButton = () => {
  const { isInstallable, isInstalled, showInstallPrompt, isIOS, canInstall } = usePWA();
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    if (!isInstallable) return;
    
    setIsInstalling(true);
    try {
      await showInstallPrompt();
    } finally {
      setIsInstalling(false);
    }
  };

  if (isInstalled) {
    return null;
  }

  if (isIOS) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2"
        disabled
      >
        <Smartphone className="w-4 h-4" />
        Adicionar à Tela Inicial
      </Button>
    );
  }

  if (!canInstall) {
    return null;
  }

  return (
    <Button 
      onClick={handleInstall}
      disabled={isInstalling}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <Download className="w-4 h-4" />
      {isInstalling ? 'Instalando...' : 'Instalar App'}
    </Button>
  );
};