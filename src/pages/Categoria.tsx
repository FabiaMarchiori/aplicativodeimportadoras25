import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Fornecedor, Categoria as CategoriaType, supabase, mapFornecedor, mapCategoria } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import FloatingActionButton from "@/components/FloatingActionButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Loader2, ImageIcon, ArrowLeft, SearchIcon, Phone, Instagram, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Categoria() {
  const { id } = useParams<{ id: string }>();
  const [categoria, setCategoria] = useState<CategoriaType | null>(null);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [filteredFornecedores, setFilteredFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingFornecedor, setEditingFornecedor] = useState<Partial<Fornecedor>>({});
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (id) {
      fetchCategoria();
      fetchFornecedores();
    }
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFornecedores(fornecedores);
    } else {
      const filtered = fornecedores.filter(fornecedor =>
        (fornecedor.nome_loja || fornecedor.nome || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFornecedores(filtered);
    }
  }, [searchQuery, fornecedores]);

  const fetchCategoria = async () => {
    try {
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .eq("categoria", id)
        .maybeSingle();

      if (error) throw error;
      if (data) setCategoria(mapCategoria(data));
      else setCategoria(null);
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `fornecedor-logo-${Date.now()}.${fileExt}`;
      const filePath = `fornecedores/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
        
      if (urlData) {
        setEditingFornecedor({
          ...editingFornecedor,
          logo_url: urlData.publicUrl
        });
      }
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: "Não foi possível fazer o upload da imagem."
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleUpdateFornecedor = async () => {
    if (!editingFornecedor.id) return;
    
    try {
      const { error } = await supabase
        .from("fornecedores")
        .update({
          nome_loja: editingFornecedor.nome_loja,
          logo_url: editingFornecedor.logo_url
        })
        .eq("id", editingFornecedor.id);

      if (error) throw error;

      toast({
        title: "Fornecedor atualizado",
        description: "As informações do fornecedor foram atualizadas com sucesso."
      });

      setEditDialogOpen(false);
      fetchFornecedores();
    } catch (error) {
      console.error("Erro ao atualizar fornecedor:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar fornecedor",
        description: "Não foi possível atualizar as informações do fornecedor."
      });
    }
  };

  return (
    <div className="page-container fade-in">
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Link to="/" className="text-primary mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold font-heading">
              {loading ? "Carregando..." : categoria?.categoria || "Categoria"}
            </h1>
          </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-2 mb-10">
          {filteredFornecedores.map((fornecedor) => (
            <Card
              key={fornecedor.id}
              className="overflow-hidden cursor-pointer group border-2 border-yellow-400 rounded-xl bg-white shadow transition-all hover:shadow-lg"
              onClick={() => navigate(`/fornecedor/${fornecedor.id}`)}
            >
              <img
                src={fornecedor.logo_url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"}
                alt={fornecedor.nome_loja || fornecedor.nome || ""}
                className="w-full h-44 object-cover"
              />
              <div className="p-3 flex flex-col items-center">
                <h3 className="text-base font-semibold text-yellow-700 text-center truncate">
                  {fornecedor.nome_loja || fornecedor.nome || "Sem nome"}
                </h3>
              </div>
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
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Fornecedor</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome_loja">Nome do Fornecedor</Label>
                <Input
                  id="nome_loja"
                  value={editingFornecedor.nome_loja || editingFornecedor.nome || ""}
                  onChange={(e) => setEditingFornecedor({ ...editingFornecedor, nome_loja: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Logo</Label>
                <div 
                  className={cn(
                    "border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2",
                    "hover:border-primary/50 transition-colors cursor-pointer"
                  )}
                >
                  {editingFornecedor.logo_url ? (
                    <div className="relative w-24 h-24">
                      <img 
                        src={editingFornecedor.logo_url} 
                        alt="Logo" 
                        className="w-full h-full object-cover rounded-full" 
                      />
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {uploadingLogo ? "Enviando..." : "Clique para enviar um logo"}
                      </p>
                    </>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="logo"
                    onChange={handleFileUpload}
                    disabled={uploadingLogo}
                  />
                  <Label htmlFor="logo" className="w-full h-full absolute inset-0 cursor-pointer">
                    <span className="sr-only">Escolher logo</span>
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateFornecedor} disabled={uploadingLogo}>
                {uploadingLogo ? (
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
