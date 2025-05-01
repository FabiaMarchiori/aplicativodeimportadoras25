
import { useState } from "react";
import { Fornecedor, supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type EditFornecedorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingFornecedor: Partial<Fornecedor>;
  setEditingFornecedor: (fornecedor: Partial<Fornecedor>) => void;
  onSuccess: () => void;
};

export default function EditFornecedorDialog({
  open,
  onOpenChange,
  editingFornecedor,
  setEditingFornecedor,
  onSuccess
}: EditFornecedorDialogProps) {
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const { toast } = useToast();

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

      onOpenChange(false);
      onSuccess();
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
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
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
  );
}
