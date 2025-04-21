
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Fornecedor, supabase, mapFornecedor } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin } from "lucide-react";
import { FornecedorHeader } from "@/components/fornecedor/FornecedorHeader";
import { FornecedorContato } from "@/components/fornecedor/FornecedorContato";
import { FornecedorInstagram } from "@/components/fornecedor/FornecedorInstagram";
import { FornecedorEditDialog } from "@/components/fornecedor/FornecedorEditDialog";

export default function DetalheFornecedor() {
  const { id } = useParams<{ id: string }>();
  const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
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

  const handleSaveEdit = async (fornecedorEdit: Partial<Fornecedor>) => {
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

  return (
    <div className="page-container fade-in pb-24">
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : fornecedor ? (
        <>
          <FornecedorHeader 
            fornecedor={fornecedor} 
            isAdmin={isAdmin} 
            onEditClick={() => setDialogOpen(true)} 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FornecedorContato fornecedor={fornecedor} />
              
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
            
            <FornecedorInstagram fornecedor={fornecedor} />
          </div>

          {isAdmin && (
            <FornecedorEditDialog
              fornecedor={fornecedor}
              isOpen={dialogOpen}
              onClose={() => setDialogOpen(false)}
              onSave={handleSaveEdit}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Fornecedor não encontrado</p>
          <Button variant="link" asChild className="mt-2">
            <Link to="/">Voltar para o início</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
