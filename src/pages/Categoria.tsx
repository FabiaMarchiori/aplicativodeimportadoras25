import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Fornecedor, Categoria as CategoriaType, supabase, mapFornecedor, mapCategoria } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import FloatingActionButton from "@/components/FloatingActionButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, ImageIcon, ArrowLeft, SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Categoria() {
  const { id } = useParams<{ id: string }>();
  const [categoria, setCategoria] = useState<CategoriaType | null>(null);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [filteredFornecedores, setFilteredFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [novoFornecedor, setNovoFornecedor] = useState({
    nome_loja: "",
    logo_url: "",
    Whatsapp: "",
    Instagram_url: "",
    Endereco: "",
    localizacao: "",
    foto_destaque: ""
  });
  const [uploading, setUploading] = useState(false);
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchCategoria();
      fetchFornecedores();
    }
  }, [id]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFornecedores(fornecedores);
    } else {
      const filtered = fornecedores.filter(fornecedor =>
        fornecedor.nome.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFornecedores(filtered);
    }
  }, [searchQuery, fornecedores]);

  const fetchCategoria = async () => {
    try {
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .eq("id", parseInt(id as string))
        .single();

      if (error) throw error;
      setCategoria(mapCategoria(data));
    } catch (error) {
      console.error("Erro ao carregar categoria:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar categoria",
        description: "Não foi possível carregar os detalhes da categoria.",
      });
    }
  };

  const fetchFornecedores = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .eq("categoria", id)
        .order("nome_loja");

      if (error) throw error;
      const mappedFornecedores = (data || []).map(mapFornecedor);
      setFornecedores(mappedFornecedores);
      setFilteredFornecedores(mappedFornecedores);
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar fornecedores",
        description: "Não foi possível carregar a lista de fornecedores.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFornecedor = async () => {
    if (!novoFornecedor.nome_loja) {
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
        .insert([{ 
          ...novoFornecedor, 
          categoria: id,
          logo_url: novoFornecedor.logo_url || "https://source.unsplash.com/random/300x300/?logo",
          foto_destaque: novoFornecedor.foto_destaque || "https://source.unsplash.com/random/800x400/?shop"
        }]);

      if (error) throw error;

      toast({
        title: "Fornecedor adicionado",
        description: "O fornecedor foi adicionado com sucesso!",
      });

      setDialogOpen(false);
      setNovoFornecedor({
        nome_loja: "",
        logo_url: "",
        Whatsapp: "",
        Instagram_url: "",
        Endereco: "",
        localizacao: "",
        foto_destaque: ""
      });
      fetchFornecedores();
    } catch (error) {
      console.error("Erro ao adicionar fornecedor:", error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar fornecedor",
        description: "Não foi possível adicionar o fornecedor. Tente novamente.",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      
      // Criar um nome de arquivo único
      const fileExt = file.name.split('.').pop();
      const fileName = `fornecedor-${Math.random().toString().substring(2, 10)}.${fileExt}`;
      const filePath = `fornecedores/${fileName}`;
      
      // Fazer upload do arquivo
      const { error: uploadError, data } = await supabase.storage
        .from('public')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Obter a URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
        
      if (urlData) {
        setNovoFornecedor({
          ...novoFornecedor,
          [field]: urlData.publicUrl
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

  return (
    <div className="page-container fade-in">
      <header className="mb-6">
        <div className="flex items-center mb-4">
          <Link to="/" className="text-primary mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold font-heading">
            {loading ? "Carregando..." : categoria?.categoria || "Categoria"}
          </h1>
        </div>
        
        <div className="relative">
          <Input
            type="text"
            placeholder="Buscar fornecedor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </header>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredFornecedores.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 slide-up">
          {filteredFornecedores.map((fornecedor) => (
            <Card key={fornecedor.id} className="overflow-hidden card-hover">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                    {fornecedor.logo_url ? (
                      <img
                        src={fornecedor.logo_url}
                        alt={`Logo ${fornecedor.nome}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-lg font-bold text-primary">
                        {fornecedor.nome.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold truncate flex-1">{fornecedor.nome}</h3>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button asChild className="w-full" variant="default">
                  <Link to={`/fornecedor/${fornecedor.id}`}>
                    Ver detalhes
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">Nenhum fornecedor encontrado</p>
          {searchQuery && (
            <Button variant="link" onClick={() => setSearchQuery("")}>
              Limpar busca
            </Button>
          )}
        </div>
      )}

      {isAdmin && (
        <>
          <FloatingActionButton onClick={() => setDialogOpen(true)} />
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Fornecedor</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Fornecedor*</Label>
                  <Input
                    id="nome"
                    value={novoFornecedor.nome_loja}
                    onChange={(e) => setNovoFornecedor({ ...novoFornecedor, nome_loja: e.target.value })}
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
                      {novoFornecedor.logo_url ? (
                        <div className="relative w-24 h-24">
                          <img 
                            src={novoFornecedor.logo_url} 
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
                        onChange={(e) => handleFileUpload(e, "logo_url")}
                        disabled={uploading}
                      />
                      <Label htmlFor="logo" className="w-full h-full absolute inset-0 cursor-pointer">
                        <span className="sr-only">Escolher logo</span>
                      </Label>
                    </div>
                    <Input
                      placeholder="Ou insira uma URL do logo"
                      value={novoFornecedor.logo_url}
                      onChange={(e) => setNovoFornecedor({ ...novoFornecedor, logo_url: e.target.value })}
                    />
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
                      {novoFornecedor.foto_destaque ? (
                        <div className="relative w-full h-32">
                          <img 
                            src={novoFornecedor.foto_destaque} 
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
                        onChange={(e) => handleFileUpload(e, "foto_destaque")}
                        disabled={uploading}
                      />
                      <Label htmlFor="destaque" className="w-full h-full absolute inset-0 cursor-pointer">
                        <span className="sr-only">Escolher imagem destaque</span>
                      </Label>
                    </div>
                    <Input
                      placeholder="Ou insira uma URL da imagem destaque"
                      value={novoFornecedor.foto_destaque}
                      onChange={(e) => setNovoFornecedor({ ...novoFornecedor, foto_destaque: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    placeholder="Ex: 5511999999999 (com código do país)"
                    value={novoFornecedor.Whatsapp}
                    onChange={(e) => setNovoFornecedor({ ...novoFornecedor, Whatsapp: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    placeholder="Ex: @nomeperfil (sem @)"
                    value={novoFornecedor.Instagram_url}
                    onChange={(e) => setNovoFornecedor({ ...novoFornecedor, Instagram_url: e.target.value.replace('@', '') })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    placeholder="Endereço completo"
                    value={novoFornecedor.Endereco}
                    onChange={(e) => setNovoFornecedor({ ...novoFornecedor, Endereco: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="localizacao">Localização (Google Maps)</Label>
                  <Input
                    id="localizacao"
                    placeholder="Link do Google Maps"
                    value={novoFornecedor.localizacao}
                    onChange={(e) => setNovoFornecedor({ ...novoFornecedor, localizacao: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleAddFornecedor} disabled={uploading}>
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Adicionar Fornecedor"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
