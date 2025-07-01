
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Crown, 
  Search, 
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Loader2
} from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Assinatura = Database['public']['Tables']['assinaturas']['Row'];
type WebhookLog = Database['public']['Tables']['webhook_logs']['Row'];

export default function AdminAssinaturas() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'assinaturas' | 'webhooks'>('assinaturas');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!isAdmin) {
      navigate('/home');
      return;
    }

    fetchData();
  }, [user, isAdmin, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Buscar assinaturas
      const { data: assinaturasData, error: assinaturasError } = await supabase
        .from('assinaturas')
        .select('*')
        .order('created_at', { ascending: false });

      if (assinaturasError) {
        console.error('Erro ao buscar assinaturas:', assinaturasError);
      } else {
        setAssinaturas(assinaturasData || []);
      }

      // Buscar logs de webhooks
      const { data: webhookData, error: webhookError } = await supabase
        .from('webhook_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (webhookError) {
        console.error('Erro ao buscar logs de webhook:', webhookError);
      } else {
        setWebhookLogs(webhookData || []);
      }
    } catch (error) {
      console.error('Erro geral:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ativa: { color: 'bg-green-500', icon: CheckCircle, text: 'Ativa' },
      inativa: { color: 'bg-gray-500', icon: XCircle, text: 'Inativa' },
      cancelada: { color: 'bg-red-500', icon: XCircle, text: 'Cancelada' },
      expirada: { color: 'bg-orange-500', icon: AlertTriangle, text: 'Expirada' },
      reembolsada: { color: 'bg-purple-500', icon: RefreshCw, text: 'Reembolsada' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inativa;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const filteredAssinaturas = assinaturas.filter(assinatura =>
    assinatura.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assinatura.nome_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assinatura.plano.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: assinaturas.length,
    ativas: assinaturas.filter(a => a.status === 'ativa').length,
    canceladas: assinaturas.filter(a => a.status === 'cancelada').length,
    expiradas: assinaturas.filter(a => a.status === 'expirada').length,
  };

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1981A7] via-[#4A9DB8] to-[#5FB9C3] p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Administração de Assinaturas
          </h1>
          <p className="text-white/80">
            Gerencie assinaturas e monitore webhooks da Kiwify
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-[#1981A7]">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-[#1981A7]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ativas</p>
                  <p className="text-2xl font-bold text-green-600">{stats.ativas}</p>
                </div>
                <Crown className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Canceladas</p>
                  <p className="text-2xl font-bold text-red-600">{stats.canceladas}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expiradas</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.expiradas}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <Button
              variant={activeTab === 'assinaturas' ? 'default' : 'outline'}
              onClick={() => setActiveTab('assinaturas')}
              className={activeTab === 'assinaturas' 
                ? 'bg-white text-[#1981A7]' 
                : 'border-white text-white hover:bg-white/10'
              }
            >
              Assinaturas
            </Button>
            <Button
              variant={activeTab === 'webhooks' ? 'default' : 'outline'}
              onClick={() => setActiveTab('webhooks')}
              className={activeTab === 'webhooks' 
                ? 'bg-white text-[#1981A7]' 
                : 'border-white text-white hover:bg-white/10'
              }
            >
              Webhooks
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <span className="ml-2 text-white">Carregando...</span>
          </div>
        ) : (
          <>
            {activeTab === 'assinaturas' && (
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-[#1981A7]">
                      Assinaturas ({filteredAssinaturas.length})
                    </CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <Input
                          placeholder="Buscar por email, nome ou plano..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      <Button onClick={fetchData} size="sm">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredAssinaturas.map((assinatura) => (
                      <div key={assinatura.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-[#1981A7]">
                              {assinatura.nome_cliente || 'Nome não informado'}
                            </h3>
                            <p className="text-sm text-gray-600">{assinatura.email}</p>
                          </div>
                          {getStatusBadge(assinatura.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Plano</p>
                            <p className="font-medium">{assinatura.plano}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Valor</p>
                            <p className="font-medium">
                              {assinatura.valor 
                                ? `R$ ${assinatura.valor.toFixed(2)}` 
                                : 'Não informado'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Expira em</p>
                            <p className="font-medium">
                              {assinatura.data_expiracao 
                                ? new Date(assinatura.data_expiracao).toLocaleDateString('pt-BR')
                                : 'Sem expiração'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {filteredAssinaturas.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Nenhuma assinatura encontrada</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'webhooks' && (
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-[#1981A7]">
                      Logs de Webhooks ({webhookLogs.length})
                    </CardTitle>
                    <Button onClick={fetchData} size="sm">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {webhookLogs.map((log) => (
                      <div key={log.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-[#1981A7]">
                              {log.evento}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {new Date(log.created_at || '').toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <Badge 
                            className={log.status === 'processed' ? 'bg-green-500' : 
                                     log.status === 'error' ? 'bg-red-500' : 'bg-blue-500'}
                          >
                            {log.status}
                          </Badge>
                        </div>
                        
                        {log.error_message && (
                          <div className="bg-red-50 p-3 rounded-lg mb-2">
                            <p className="text-sm text-red-600">{log.error_message}</p>
                          </div>
                        )}
                        
                        <details className="text-sm">
                          <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                            Ver payload
                          </summary>
                          <pre className="mt-2 bg-gray-50 p-3 rounded-lg overflow-x-auto text-xs">
                            {JSON.stringify(log.payload, null, 2)}
                          </pre>
                        </details>
                      </div>
                    ))}
                    
                    {webhookLogs.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Nenhum log de webhook encontrado</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
