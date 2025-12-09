
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddCategoryDialog = ({ open, onOpenChange, onSuccess }: AddCategoryDialogProps) => {
  const [novaCategoria, setNovaCategoria] = useState({ categoria: "", imagem_url: "" });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

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
        .insert({ 
          categoria: novaCategoria.categoria,
          imagem_url: novaCategoria.imagem_url || "https://source.unsplash.com/random/300x200/?shop" 
        } as any);

      if (error) throw error;

      toast({
        title: "Categoria adicionada",
        description: "A categoria foi adicionada com sucesso!",
      });

      onOpenChange(false);
      setNovaCategoria({ categoria: "", imagem_url: "" });
      onSuccess();
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
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
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
  );
};

export default AddCategoryDialog;
