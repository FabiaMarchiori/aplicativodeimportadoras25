
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import ImageUploader from "./ImageUploader";
import { safeLog } from "@/utils/safeLogger";
import { z } from "zod";

interface AddCategoriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

// Schema de validação para categoria
const categoriaSchema = z.object({
  categoria: z.string()
    .min(1, 'Nome da categoria é obrigatório')
    .max(100, 'Nome da categoria muito longo (máx. 100 caracteres)')
    .regex(/^[a-zA-ZÀ-ÿ0-9\s\-_&]+$/, 'Nome contém caracteres inválidos'),
  imagem_url: z.string().url('URL de imagem inválida').optional().or(z.literal(''))
});

const AddCategoriaDialog = ({ open, onOpenChange, onSuccess }: AddCategoriaDialogProps) => {
  const [novaCategoria, setNovaCategoria] = useState({ categoria: "", imagem_url: "" });
  const [uploading, setUploading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const { toast } = useToast();

  const handleAddCategoria = async () => {
    setValidationError("");
    
    // Validar dados
    const validationResult = categoriaSchema.safeParse(novaCategoria);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]?.message || 'Dados inválidos';
      setValidationError(firstError);
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description: firstError,
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("categorias")
        .insert({ 
          categoria: novaCategoria.categoria.trim(),
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
      safeLog.error("Erro ao adicionar categoria", error);
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
      safeLog.error('Erro ao fazer upload da imagem', error);
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
              onChange={(e) => {
                setNovaCategoria({ ...novaCategoria, categoria: e.target.value });
                setValidationError("");
              }}
              maxLength={100}
              placeholder="Ex: Eletrônicos"
            />
            {validationError && (
              <span className="text-xs text-red-500">{validationError}</span>
            )}
          </div>
          <ImageUploader 
            imageUrl={novaCategoria.imagem_url}
            uploading={uploading}
            onFileUpload={handleFileUpload}
            onUrlChange={(url) => setNovaCategoria({ ...novaCategoria, imagem_url: url })}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleAddCategoria} disabled={uploading || !novaCategoria.categoria.trim()}>
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

export default AddCategoriaDialog;
