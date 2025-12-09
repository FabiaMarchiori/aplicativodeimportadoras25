
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase, Categoria } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import ImageUploader from "./ImageUploader";

interface EditCategoriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  categoria: Categoria | null;
}

const EditCategoriaDialog = ({ open, onOpenChange, onSuccess, categoria }: EditCategoriaDialogProps) => {
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setEditingCategoria(categoria);
  }, [categoria]);

  const handleUpdateCategoria = async () => {
    if (!editingCategoria) return;
    
    try {
      const { error } = await supabase
        .from("categorias")
        .update({
          categoria: editingCategoria.categoria,
          imagem_url: editingCategoria.imagem_url
        } as any)
        .eq("id", editingCategoria.id as any);

      if (error) throw error;

      toast({
        title: "Categoria atualizada",
        description: "A categoria foi atualizada com sucesso!"
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar categoria",
        description: "Não foi possível atualizar a categoria. Tente novamente."
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editingCategoria) return;

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
        setEditingCategoria({
          ...editingCategoria,
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

  if (!editingCategoria) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Categoria</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-categoria">Nome da Categoria</Label>
            <Input
              id="edit-categoria"
              value={editingCategoria.categoria}
              onChange={(e) => setEditingCategoria({...editingCategoria, categoria: e.target.value})}
            />
          </div>
          <ImageUploader 
            imageUrl={editingCategoria.imagem_url || ""}
            uploading={uploading}
            onFileUpload={handleFileUpload}
            onUrlChange={(url) => setEditingCategoria({...editingCategoria, imagem_url: url})}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleUpdateCategoria} disabled={uploading}>
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
  );
};

export default EditCategoriaDialog;
