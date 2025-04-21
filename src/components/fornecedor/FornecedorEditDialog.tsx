
import { useState } from "react";
import { Loader2, ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Fornecedor } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { uploadFornecedorImage } from "@/utils/uploadUtils";

interface FornecedorEditDialogProps {
  fornecedor: Fornecedor;
  isOpen: boolean;
  onClose: () => void;
  onSave: (fornecedor: Partial<Fornecedor>) => Promise<void>;
}

export function FornecedorEditDialog({ 
  fornecedor, 
  isOpen, 
  onClose, 
  onSave 
}: FornecedorEditDialogProps) {
  const [fornecedorEdit, setFornecedorEdit] = useState<Partial<Fornecedor>>(fornecedor);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'destaque') => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const publicUrl = await uploadFornecedorImage(file, fornecedor.id.toString(), field);
      
      if (publicUrl) {
        setFornecedorEdit({
          ...fornecedorEdit,
          [field === 'logo' ? 'logo_url' : 'foto_destaque']: publicUrl
        });
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    await onSave(fornecedorEdit);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              onChange={(e) => setFornecedorEdit({ 
                ...fornecedorEdit, 
                Instagram_url: e.target.value.replace('@', '') 
              })}
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

          <ImageUploadField
            label="Logo"
            id="logo"
            imageUrl={fornecedorEdit.logo_url}
            onUpload={(e) => handleFileUpload(e, 'logo')}
            uploading={uploading}
          />

          <ImageUploadField
            label="Imagem Destaque"
            id="destaque"
            imageUrl={fornecedorEdit.foto_destaque}
            onUpload={(e) => handleFileUpload(e, 'destaque')}
            uploading={uploading}
            isWide
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} disabled={uploading}>
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
}

interface ImageUploadFieldProps {
  label: string;
  id: string;
  imageUrl?: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  isWide?: boolean;
}

function ImageUploadField({ label, id, imageUrl, onUpload, uploading, isWide }: ImageUploadFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-col gap-2">
        <div 
          className={cn(
            "border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center gap-2",
            "hover:border-primary/50 transition-colors cursor-pointer"
          )}
        >
          {imageUrl ? (
            <div className={cn(
              "relative",
              isWide ? "w-full h-32" : "w-24 h-24"
            )}>
              <img 
                src={imageUrl} 
                alt="Preview" 
                className={cn(
                  "w-full h-full object-cover",
                  isWide ? "rounded" : "rounded-full"
                )}
              />
            </div>
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {uploading ? "Enviando..." : `Clique para enviar ${label.toLowerCase()}`}
              </p>
            </>
          )}
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id={id}
            onChange={onUpload}
            disabled={uploading}
          />
          <Label htmlFor={id} className="w-full h-full absolute inset-0 cursor-pointer">
            <span className="sr-only">Escolher {label.toLowerCase()}</span>
          </Label>
        </div>
      </div>
    </div>
  );
}
