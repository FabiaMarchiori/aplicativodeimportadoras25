
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Categoria, supabase, mapCategoria } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import FloatingActionButton from "@/components/FloatingActionButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ImageIcon, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [novaCategoria, setNovaCategoria] = useState({ categoria: "", imagem_url: "" });
  const [uploading, setUploading] = useState(false);
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("categoria");
      if (error) throw error;
      const mappedCategorias = (data || []).map(mapCategoria);
      setCategorias(mappedCategorias);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar categorias",
        description: "Não foi possível carregar as categorias. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategoria = async () => {
    if (!novaCategoria.categoria) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "O nome da categoria é obrigatório",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("categorias")
        .insert([{ 
          categoria: novaCategoria.categoria,
          imagem_url: novaCategoria.imagem_url || "https://source.unsplash.com/random/300x200/?shop" 
        }]);

      if (error) throw error;

      toast({
        title: "Categoria adicionada",
        description: "A categoria foi adicionada com sucesso!",
      });

      setDialogOpen(false);
      setNovaCategoria({ categoria: "", imagem_url: "" });
      fetchCategorias();
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar categoria",
        description: "Não foi possível adicionar a categoria. Tente novamente.",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `categoria-${Math.random().toString().substring(2, 10)}.${fileExt}`;
      const filePath = `categorias/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
      if (urlData) {
        setNovaCategoria({
          ...novaCategoria,
          imagem_url: urlData.publicUrl
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
      <header className="flex items-center mb-6">
        <Link to="/" className="text-primary mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-primary font-heading">Categorias</h1>
      </header>
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categorias.map((categoriaObj) => (
            <div
              key={categoriaObj.id}
              className="card-hover rounded-lg overflow-hidden cursor-pointer"
              onClick={() => navigate(`/categoria/${encodeURIComponent(categoriaObj.categoria)}`)}
            >
              <div className="aspect-square bg-muted relative overflow-hidden rounded-lg">
                <img
                  src={categoriaObj.imagem_url || "https://source.unsplash.com/random/300x200/?shop"}
                  alt={categoriaObj.categoria}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <h3 className="text-white font-semibold truncate">{categoriaObj.categoria}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isAdmin && (
        <>
          <FloatingActionButton onClick={() => setDialogOpen(true)} />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Categoria</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="categoria">Nome da Categoria</Label>
                  <Input
                    id="categoria"
                    value={novaCategoria.categoria}
                    onChange={(e) => setNovaCategoria({ ...novaCategoria, categoria: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Imagem</Label>
                  <div className="flex flex-col gap-2">
                    <div 
                      className={cn(
                        "border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2",
                        "hover:border-primary/50 transition-colors cursor-pointer"
                      )}
                    >
                      {novaCategoria.imagem_url ? (
                        <div className="relative w-full h-32">
                          <img 
                            src={novaCategoria.imagem_url} 
                            alt="Preview" 
                            className="w-full h-full object-cover rounded" 
                          />
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {uploading ? "Enviando..." : "Clique para enviar uma imagem"}
                          </p>
                        </>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="imagem"
                        onChange={handleFileUpload}
                        disabled={uploading}
                      />
                      <Label htmlFor="imagem" className="w-full h-full absolute inset-0 cursor-pointer">
                        <span className="sr-only">Escolher imagem</span>
                      </Label>
                    </div>
                    <Input
                      placeholder="Ou insira uma URL da imagem"
                      value={novaCategoria.imagem_url}
                      onChange={(e) => setNovaCategoria({ ...novaCategoria, imagem_url: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleAddCategoria} disabled={uploading}>
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Adicionar"
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
// File is getting long; consider refactoring for maintainability.
