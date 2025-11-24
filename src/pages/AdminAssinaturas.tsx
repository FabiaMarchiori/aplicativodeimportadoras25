
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
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
  Loader2,
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Database } from '@/integrations/supabase/types';

type Assinatura = Database['public']['Tables']['assinaturas']['Row'];
type WebhookLog = Database['public']['Tables']['webhook_logs']['Row'];

export default function AdminAssinaturas() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assinaturas' | 'webhooks'>('dashboard');
  const [selectedSubscription, setSelectedSubscription] = useState<Assinatura | null>(null);
  const [actionType, setActionType] = useState<'cancelar' | 'reativar' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleCancelSubscription = async (assinatura: Assinatura) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('assinaturas')
        .update({ 
          status: 'cancelada',
          updated_at: new Date().toISOString()
        })
        .eq('id', assinatura.id);

      if (error) throw error;

      // Atualizar estado local
      setAssinaturas(prev => 
        prev.map(a => a.id === assinatura.id 
          ? { ...a, status: 'cancelada' as const, updated_at: new Date().toISOString() }
          : a
        )
      );

      toast({
        title: "Assinatura cancelada",
        description: "A assinatura foi cancelada com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      toast({
        title: "Erro",
        description: "Erro ao cancelar assinatura. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setSelectedSubscription(null);
      setActionType(null);
    }
  };

  const handleReactivateSubscription = async (assinatura: Assinatura) => {
    setIsProcessing(true);
    try {
      // Calcular nova data de expiração (30 dias a partir de hoje)
      const newExpirationDate = new Date();
      newExpirationDate.setDate(newExpirationDate.getDate() + 30);

      const { error } = await supabase
        .from('assinaturas')
        .update({ 
          status: 'ativa',
          data_expiracao: newExpirationDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', assinatura.id);

      if (error) throw error;

      // Atualizar estado local
      setAssinaturas(prev => 
        prev.map(a => a.id === assinatura.id 
          ? { 
              ...a, 
              status: 'ativa' as const, 
              data_expiracao: newExpirationDate.toISOString(),
              updated_at: new Date().toISOString() 
            }
          : a
        )
      );

      toast({
        title: "Assinatura reativada",
        description: "A assinatura foi reativada com sucesso e expira em 30 dias.",
      });
    } catch (error) {
      console.error('Erro ao reativar assinatura:', error);
      toast({
        title: "Erro",
        description: "Erro ao reativar assinatura. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setSelectedSubscription(null);
      setActionType(null);
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

  // Calcular dados para os gráficos
  const getMonthlyRevenue = () => {
    const monthlyData: { [key: string]: number } = {};
    
    assinaturas.forEach(assinatura => {
      if (assinatura.valor && assinatura.data_inicio) {
        const date = new Date(assinatura.data_inicio);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + Number(assinatura.valor);
      }
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, revenue]) => ({
        month: new Date(month + '-01').toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        receita: revenue
      }))
      .slice(-6); // Últimos 6 meses
  };

  const getChurnData = () => {
    const monthlyData: { [key: string]: { novos: number; cancelados: number } } = {};
    
    assinaturas.forEach(assinatura => {
      if (assinatura.data_inicio) {
        const date = new Date(assinatura.data_inicio);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { novos: 0, cancelados: 0 };
        }
        monthlyData[monthKey].novos++;
      }
      
      if (assinatura.status === 'cancelada' && assinatura.updated_at) {
        const date = new Date(assinatura.updated_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { novos: 0, cancelados: 0 };
        }
        monthlyData[monthKey].cancelados++;
      }
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        novos: data.novos,
        cancelados: data.cancelados,
        taxa: data.novos > 0 ? ((data.cancelados / data.novos) * 100).toFixed(1) : '0'
      }))
      .slice(-6); // Últimos 6 meses
  };

  const getStatusDistribution = () => {
    return [
      { name: 'Ativas', value: stats.ativas, color: '#10b981' },
      { name: 'Canceladas', value: stats.canceladas, color: '#ef4444' },
      { name: 'Expiradas', value: stats.expiradas, color: '#f59e0b' },
      { name: 'Inativas', value: assinaturas.filter(a => a.status === 'inativa').length, color: '#6b7280' }
    ].filter(item => item.value > 0);
  };

  const monthlyRevenue = getMonthlyRevenue();
  const churnData = getChurnData();
  const statusDistribution = getStatusDistribution();
  const totalRevenue = monthlyRevenue.reduce((sum, item) => sum + item.receita, 0);
  const avgChurnRate = churnData.length > 0 
    ? (churnData.reduce((sum, item) => sum + parseFloat(item.taxa), 0) / churnData.length).toFixed(1)
    : '0';

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
              variant={activeTab === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setActiveTab('dashboard')}
              className={activeTab === 'dashboard' 
                ? 'bg-white text-[#1981A7]' 
                : 'border-white text-white hover:bg-white/10'
              }
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
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
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Métricas de Receita */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-white/95 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Receita Total (6 meses)</p>
                          <p className="text-2xl font-bold text-green-600">
                            R$ {totalRevenue.toFixed(2)}
                          </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/95 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Taxa de Churn Média</p>
                          <p className="text-2xl font-bold text-orange-600">{avgChurnRate}%</p>
                        </div>
                        <TrendingDown className="h-8 w-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/95 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Receita Mensal Média</p>
                          <p className="text-2xl font-bold text-blue-600">
                            R$ {monthlyRevenue.length > 0 
                              ? (totalRevenue / monthlyRevenue.length).toFixed(2)
                              : '0.00'
                            }
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Gráficos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Gráfico de Receita Mensal */}
                  <Card className="bg-white/95 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-[#1981A7]">Receita Mensal</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyRevenue}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="month" stroke="#6b7280" />
                          <YAxis stroke="#6b7280" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                            formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Receita']}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="receita" 
                            stroke="#10b981" 
                            strokeWidth={2}
                            dot={{ fill: '#10b981', r: 4 }}
                            name="Receita"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Gráfico de Churn */}
                  <Card className="bg-white/95 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-[#1981A7]">Análise de Churn</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={churnData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="month" stroke="#6b7280" />
                          <YAxis stroke="#6b7280" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="novos" 
                            stroke="#10b981" 
                            strokeWidth={2}
                            dot={{ fill: '#10b981', r: 4 }}
                            name="Novos"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="cancelados" 
                            stroke="#ef4444" 
                            strokeWidth={2}
                            dot={{ fill: '#ef4444', r: 4 }}
                            name="Cancelados"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Gráfico de Distribuição de Status */}
                  <Card className="bg-white/95 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-[#1981A7]">Distribuição por Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={statusDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {statusDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Tabela de Taxa de Churn Mensal */}
                  <Card className="bg-white/95 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-[#1981A7]">Taxa de Churn Mensal</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {churnData.map((data, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{data.month}</p>
                              <p className="text-sm text-gray-600">
                                {data.novos} novos, {data.cancelados} cancelados
                              </p>
                            </div>
                            <div className="text-right">
                              <p className={`text-lg font-bold ${
                                parseFloat(data.taxa) > 20 ? 'text-red-600' : 
                                parseFloat(data.taxa) > 10 ? 'text-orange-600' : 
                                'text-green-600'
                              }`}>
                                {data.taxa}%
                              </p>
                              <p className="text-xs text-gray-500">churn</p>
                            </div>
                          </div>
                        ))}
                        {churnData.length === 0 && (
                          <div className="text-center py-8">
                            <p className="text-gray-500">Sem dados disponíveis</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

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
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
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

                        <div className="flex gap-2 pt-4 border-t">
                          {assinatura.status === 'ativa' ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setSelectedSubscription(assinatura);
                                setActionType('cancelar');
                              }}
                              className="flex items-center gap-2"
                            >
                              <XCircle className="h-4 w-4" />
                              Cancelar Assinatura
                            </Button>
                          ) : (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                setSelectedSubscription(assinatura);
                                setActionType('reativar');
                              }}
                              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                              disabled={assinatura.status === 'reembolsada'}
                            >
                              <CheckCircle className="h-4 w-4" />
                              Reativar Assinatura
                            </Button>
                          )}
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

      <AlertDialog 
        open={!!selectedSubscription && !!actionType} 
        onOpenChange={(open) => {
          if (!open) {
            setSelectedSubscription(null);
            setActionType(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'cancelar' ? 'Cancelar Assinatura?' : 'Reativar Assinatura?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'cancelar' ? (
                <>
                  Você está prestes a cancelar a assinatura de{' '}
                  <strong>{selectedSubscription?.nome_cliente || selectedSubscription?.email}</strong>.
                  <br />
                  Esta ação pode ser revertida posteriormente.
                </>
              ) : (
                <>
                  Você está prestes a reativar a assinatura de{' '}
                  <strong>{selectedSubscription?.nome_cliente || selectedSubscription?.email}</strong>.
                  <br />
                  A nova data de expiração será definida para 30 dias a partir de hoje.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedSubscription) {
                  if (actionType === 'cancelar') {
                    handleCancelSubscription(selectedSubscription);
                  } else {
                    handleReactivateSubscription(selectedSubscription);
                  }
                }
              }}
              disabled={isProcessing}
              className={actionType === 'cancelar' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                actionType === 'cancelar' ? 'Sim, Cancelar' : 'Sim, Reativar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
