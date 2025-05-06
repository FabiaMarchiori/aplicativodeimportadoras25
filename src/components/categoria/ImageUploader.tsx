
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  imageUrl: string;
  uploading: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlChange: (url: string) => void;
}

const ImageUploader = ({ imageUrl, uploading, onFileUpload, onUrlChange }: ImageUploaderProps) => {
  return (
    <div className="space-y-2">
      <Label>Imagem</Label>
      <div className="flex flex-col gap-2">
        <div 
          className={cn(
            "border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2",
            "hover:border-primary/50 transition-colors cursor-pointer"
          )}
        >
          {imageUrl ? (
            <div className="relative w-full h-32">
              <img 
                src={imageUrl} 
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
            id="categoria-imagem"
            onChange={onFileUpload}
            disabled={uploading}
          />
          <Label htmlFor="categoria-imagem" className="w-full h-full absolute inset-0 cursor-pointer">
            <span className="sr-only">Escolher imagem</span>
          </Label>
        </div>
        <Input
          placeholder="Ou insira uma URL da imagem"
          value={imageUrl}
          onChange={(e) => onUrlChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ImageUploader;
