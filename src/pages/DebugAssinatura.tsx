import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const DebugAssinatura = () => {
  const { user, profile } = useAuth();
  const [assinaturas, setAssinaturas] = useState<any[]>([]);
  const [authUser, setAuthUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDebugData = async () => {
    setLoading(true);
    
    // Buscar dados do auth
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    setAuthUser(currentUser);

    if (!user) {
      setLoading(false);
      return;
    }

    // Buscar todas as assinaturas relacionadas ao usuário
    const { data: assinaturasPorId } = await supabase
      .from('assinaturas')
      .select('*')
      .eq('user_id', user.id);

    const { data: assinaturasPorEmail } = await supabase
      .from('assinaturas')
      .select('*')
      .eq('email', user.email);

    const todasAssinaturas = [
      ...(assinaturasPorId || []).map(a => ({ ...a, foundBy: 'user_id' })),
      ...(assinaturasPorEmail || []).map(a => ({ ...a, foundBy: 'email' }))
    ];

    // Remover duplicatas
    const uniqueAssinaturas = todasAssinaturas.filter((a, index, self) =>
      index === self.findIndex((t) => t.id === a.id)
    );

    setAssinaturas(uniqueAssinaturas);
    setLoading(false);
  };

  useEffect(() => {
    fetchDebugData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="container max-w-4xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Debug de Assinatura</h1>
          <Button onClick={fetchDebugData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>

        {/* Auth Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informações de Autenticação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 font-mono text-sm">
            <div>
              <strong>Auth UID:</strong> {authUser?.id || 'N/A'}
            </div>
            <div>
              <strong>Auth Email:</strong> {authUser?.email || 'N/A'}
            </div>
            <div>
              <strong>Context User ID:</strong> {user?.id || 'N/A'}
            </div>
            <div>
              <strong>Context User Email:</strong> {user?.email || 'N/A'}
            </div>
            <div className="flex items-center gap-2">
              <strong>IDs Match:</strong> 
              <Badge variant={authUser?.id === user?.id ? 'default' : 'destructive'}>
                {authUser?.id === user?.id ? 'SIM' : 'NÃO'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle>Perfil do Usuário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 font-mono text-sm">
            <div>
              <strong>Profile ID:</strong> {profile?.id || 'N/A'}
            </div>
            <div>
              <strong>Profile Email:</strong> {profile?.email || 'N/A'}
            </div>
            <div className="flex items-center gap-2">
              <strong>É Admin:</strong>
              <Badge variant={profile?.is_admin ? 'default' : 'secondary'}>
                {profile?.is_admin ? 'SIM' : 'NÃO'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Assinaturas */}
        <Card>
          <CardHeader>
            <CardTitle>
              Assinaturas Encontradas ({assinaturas.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assinaturas.length === 0 ? (
              <p className="text-muted-foreground">Nenhuma assinatura encontrada</p>
            ) : (
              <div className="space-y-4">
                {assinaturas.map((assinatura, index) => (
                  <div 
                    key={assinatura.id} 
                    className="p-4 border rounded-lg space-y-2 font-mono text-sm"
                  >
                    <div className="flex justify-between items-start">
                      <strong>Assinatura #{index + 1}</strong>
                      <div className="flex gap-2">
                        <Badge variant={assinatura.status === 'ativa' ? 'default' : 'secondary'}>
                          {assinatura.status}
                        </Badge>
                        <Badge variant="outline">
                          {assinatura.foundBy}
                        </Badge>
                      </div>
                    </div>
                    <div><strong>ID:</strong> {assinatura.id}</div>
                    <div><strong>User ID:</strong> {assinatura.user_id || 'NULL'}</div>
                    <div><strong>Email:</strong> {assinatura.email}</div>
                    <div><strong>Plano:</strong> {assinatura.plano}</div>
                    <div><strong>Valor:</strong> R$ {assinatura.valor}</div>
                    <div><strong>Data Início:</strong> {assinatura.data_inicio}</div>
                    <div><strong>Data Expiração:</strong> {assinatura.data_expiracao || 'SEM EXPIRAÇÃO'}</div>
                    <div>
                      <strong>Match com user_id:</strong>{' '}
                      <Badge variant={assinatura.user_id === user?.id ? 'default' : 'destructive'}>
                        {assinatura.user_id === user?.id ? 'SIM' : 'NÃO'}
                      </Badge>
                    </div>
                    <div>
                      <strong>Match com email:</strong>{' '}
                      <Badge variant={assinatura.email === user?.email ? 'default' : 'destructive'}>
                        {assinatura.email === user?.email ? 'SIM' : 'NÃO'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DebugAssinatura;
