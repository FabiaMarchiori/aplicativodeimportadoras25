
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Fornecedor, supabase, mapFornecedor } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Loader2, ImageIcon, ArrowLeft, MapPin, Phone, Instagram, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DetalheFornecedor() {
  const { id } = useParams<{ id: string }>();
  const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fornecedorEdit, setFornecedorEdit] = useState<Partial<Fornecedor>>({});
  const [uploading, setUploading] = useState(false);
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchFornecedor();
    }
  }, [id]);

  const fetchFornecedor = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .eq("id", Number(id))
        .single();

      if (error) throw error;
      const mappedFornecedor = mapFornecedor(data);
      setFornecedor(mappedFornecedor);
      setFornecedorEdit(mappedFornecedor);
    } catch (error) {
      console.error("Erro ao carregar fornecedor:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar fornecedor",
        description: "Não foi possível carregar os detalhes do fornecedor.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!fornecedorEdit.nome) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "O nome do fornecedor é obrigatório",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("fornecedores")
        .update({
          nome_loja: fornecedorEdit.nome,
          Whatsapp: fornecedorEdit.Whatsapp,
          Instagram_url: fornecedorEdit.Instagram_url,
          Endereco: fornecedorEdit.Endereco,
          logo_url: fornecedorEdit.logo_url,
          foto_destaque: fornecedorEdit.foto_destaque,
          localizacao: fornecedorEdit.localizacao
        })
        .eq("id", Number(id));

      if (error) throw error;

      toast({
        title: "Fornecedor atualizado",
        description: "As informações foram atualizadas com sucesso!",
      });

      setDialogOpen(false);
      fetchFornecedor();
    } catch (error) {
      console.error("Erro ao atualizar fornecedor:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar fornecedor",
        description: "Não foi possível atualizar as informações. Tente novamente.",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `fornecedor-${id}-${field}-${Math.random().toString().substring(2, 10)}.${fileExt}`;
      const filePath = `fornecedores/${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('public')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
        
      if (urlData) {
        setFornecedorEdit({
          ...fornecedorEdit,
          [field === 'logo' ? 'logo_url' : 'foto_destaque']: urlData.publicUrl
        });
      }
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: "Não foi possível fazer o upload da imagem. Tente novamente.",
      });
    } finally {
      setUploading(false);
    }
  };

  const formatWhatsAppLink = (number: string) => {
    const cleaned = number?.replace(/\D/g, '');
    return `https://wa.me/${cleaned}`;
  };

  const formatInstagramLink = (username: string) => {
    const cleaned = username?.replace('@', '');
    return `https://instagram.com/${cleaned}`;
  };

  return (
    <div className="page-container fade-in pb-24">
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : fornecedor ? (
        <>
          <header className="mb-6">
            <div className="flex items-center mb-4">
              <Link to={`/categoria/${fornecedor.categoria_id}`} className="text-primary mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold font-heading">
                Detalhes do Fornecedor
              </h1>
            </div>
          </header>
          
          <div className="relative rounded-xl overflow-hidden mb-6">
            <img
              src={fornecedor.foto_destaque || "https://source.unsplash.com/random/800x400/?shop"}
              alt={fornecedor.nome}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            <div className="absolute bottom-0 left-0 p-4 w-full flex items-end">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-white p-1 mr-3">
                <img
                  src={fornecedor.logo_url || "https://source.unsplash.com/random/100x100/?logo"}
                  alt={`Logo ${fornecedor.nome}`}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h2 className="text-white text-xl sm:text-2xl font-bold">{fornecedor.nome}</h2>
            </div>
            
            {isAdmin && (
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                onClick={() => setDialogOpen(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Contato</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {fornecedor.Whatsapp && (
                    <a
                      href={formatWhatsAppLink(fornecedor.Whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-emerald-500/10 text-emerald-600 rounded-lg hover:bg-emerald-500/20 transition-colors"
                    >
                      <Phone className="h-5 w-5 mr-3" />
                      <span>Conversar no WhatsApp</span>
                    </a>
                  )}
                  
                  {fornecedor.Instagram_url && (
                    <a
                      href={formatInstagramLink(fornecedor.Instagram_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-purple-500/10 text-purple-600 rounded-lg hover:bg-purple-500/20 transition-colors"
                    >
                      <Instagram className="h-5 w-5 mr-3" />
                      <span>Ver no Instagram</span>
                    </a>
                  )}
                  
                  {fornecedor.localizacao && (
                    <a
                      href={fornecedor.localizacao}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      <MapPin className="h-5 w-5 mr-3" />
                      <span>Abrir no Google Maps</span>
                    </a>
                  )}
                </div>
              </Card>
              
              {fornecedor.Endereco && (
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Endereço</h3>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">{fornecedor.Endereco}</p>
                  </div>
                </Card>
              )}
            </div>
            
            <Card className="p-6 h-fit">
              <h3 className="font-semibold text-lg mb-4">Instagram</h3>
              
              {fornecedor.Instagram_url ? (
                <div className="relative overflow-hidden rounded-lg border border-border bg-card">
                  <div className="p-3 border-b border-border flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-muted mr-2">
                      <img
                        src={fornecedor.logo_url || "https://source.unsplash.com/random/100x100/?logo"}
                        alt="Instagram Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium">@{fornecedor.Instagram_url}</span>
                  </div>
                  <div className="aspect-square bg-muted">
                    <img
                      src={fornecedor.foto_destaque || "https://source.unsplash.com/random/600x600/?shop"}
                      alt="Instagram Post"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-4 mb-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">{fornecedor.nome}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ver mais no Instagram
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Instagram className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Instagram não disponível</p>
                </div>
              )}
              
              {fornecedor.Instagram_url && (
                <div className="mt-4">
                  <Button asChild variant="outline" className="w-full">
                    <a href={formatInstagramLink(fornecedor.Instagram_url)} target="_blank" rel="noopener noreferrer">
                      Ver perfil completo
                    </a>
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Fornecedor não encontrado</p>
          <Button variant="link" asChild className="mt-2">
            <Link to="/">Voltar para o início</Link>
          </Button>
        </div>
      )}
      
      {isAdmin && fornecedor && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar Fornecedor</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Fornecedor*</Label>
                <Input
                  id="nome"
                  value={fornecedorEdit.nome || ""}
                  onChange={(e) => setFornecedorEdit({ ...fornecedorEdit, nome: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  placeholder="Ex: 5511999999999 (com código do país)"
                  value={fornecedorEdit.Whatsapp || ""}
                  onChange={(e) => setFornecedorEdit({ ...fornecedorEdit, Whatsapp: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  placeholder="Ex: nomeperfil (sem @)"
                  value={fornecedorEdit.Instagram_url || ""}
                  onChange={(e) => setFornecedorEdit({ ...fornecedorEdit, Instagram_url: e.target.value.replace('@', '') })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  placeholder="Endereço completo"
                  value={fornecedorEdit.Endereco || ""}
                  onChange={(e) => setFornecedorEdit({ ...fornecedorEdit, Endereco: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="localizacao">Localização (Google Maps)</Label>
                <Input
                  id="localizacao"
                  placeholder="Link do Google Maps"
                  value={fornecedorEdit.localizacao || ""}
                  onChange={(e) => setFornecedorEdit({ ...fornecedorEdit, localizacao: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex flex-col gap-2">
                  <div 
                    className={cn(
                      "border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center gap-2",
                      "hover:border-primary/50 transition-colors cursor-pointer"
                    )}
                  >
                    {fornecedorEdit.logo_url ? (
                      <div className="relative w-24 h-24">
                        <img 
                          src={fornecedorEdit.logo_url} 
                          alt="Preview" 
                          className="w-full h-full object-cover rounded-full" 
                        />
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {uploading ? "Enviando..." : "Clique para enviar um logo"}
                        </p>
                      </>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="logo"
                      onChange={(e) => handleFileUpload(e, "logo")}
                      disabled={uploading}
                    />
                    <Label htmlFor="logo" className="w-full h-full absolute inset-0 cursor-pointer">
                      <span className="sr-only">Escolher logo</span>
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Imagem Destaque</Label>
                <div className="flex flex-col gap-2">
                  <div 
                    className={cn(
                      "border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center gap-2",
                      "hover:border-primary/50 transition-colors cursor-pointer"
                    )}
                  >
                    {fornecedorEdit.foto_destaque ? (
                      <div className="relative w-full h-32">
                        <img 
                          src={fornecedorEdit.foto_destaque} 
                          alt="Preview" 
                          className="w-full h-full object-cover rounded" 
                        />
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {uploading ? "Enviando..." : "Clique para enviar imagem destaque"}
                        </p>
                      </>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="destaque"
                      onChange={(e) => handleFileUpload(e, "destaque")}
                      disabled={uploading}
                    />
                    <Label htmlFor="destaque" className="w-full h-full absolute inset-0 cursor-pointer">
                      <span className="sr-only">Escolher imagem destaque</span>
                    </Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSaveEdit} disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default DetalheFornecedor;
