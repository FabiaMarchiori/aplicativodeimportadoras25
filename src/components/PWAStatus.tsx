import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Download, CheckCircle, Globe } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { InstallButton } from '@/components/InstallButton';

export const PWAStatus = () => {
  const { isInstalled, isInstallable, isIOS, isAndroid } = usePWA();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          Status do Aplicativo
        </CardTitle>
        <CardDescription>
          Informações sobre a instalação do aplicativo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status de instalação */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isInstalled ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Globe className="w-5 h-5 text-blue-600" />
            )}
            <span className="text-sm">
              {isInstalled ? 'Aplicativo Instalado' : 'Usando no Navegador'}
            </span>
          </div>
          <Badge variant={isInstalled ? 'default' : 'secondary'}>
            {isInstalled ? 'Instalado' : 'Web'}
          </Badge>
        </div>

        {/* Dispositivo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-gray-600" />
            <span className="text-sm">Dispositivo</span>
          </div>
          <Badge variant="outline">
            {isIOS ? 'iOS' : isAndroid ? 'Android' : 'Desktop'}
          </Badge>
        </div>

        {/* Botão de instalação */}
        {!isInstalled && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  Instalar aplicativo
                </p>
                <p className="text-xs text-muted-foreground">
                  {isIOS 
                    ? 'Toque em "Compartilhar" e depois "Adicionar à Tela Inicial"'
                    : 'Instale para acesso mais rápido e melhor experiência'
                  }
                </p>
              </div>
              <InstallButton />
            </div>
          </div>
        )}

        {/* Recursos do PWA */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Recursos do App</h4>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-600" />
              <span>Funciona offline</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-600" />
              <span>Atualizações automáticas</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-600" />
              <span>Interface nativa</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-600" />
              <span>Acesso rápido</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};