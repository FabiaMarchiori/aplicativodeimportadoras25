
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Fornecedor, supabase, mapFornecedor } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { FornecedorHeader } from "@/components/fornecedor/FornecedorHeader";
import FornecedorDetalhesCard from "@/components/fornecedor/FornecedorDetalhesCard";
import { FornecedorEditDialog } from "@/components/fornecedor/FornecedorEditDialog";

const DetalheFornecedor = () => {
  const { id } = useParams<{ id: string }>();
  const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (id) {
      fetchFornecedor();
    }
    // eslint-disable-next-line
  }, [id]);

  const fetchFornecedor = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .eq("id", Number(id))
        .maybeSingle();

      if (error) throw error;
      setFornecedor(data ? mapFornecedor(data) : null);
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

  const handleEditSave = async (updatedFornecedor: Partial<Fornecedor>) => {
    try {
      const { error } = await supabase
        .from("fornecedores")
        .update({
          nome_loja: updatedFornecedor.nome_loja || updatedFornecedor.nome,
          categoria: updatedFornecedor.categoria,
          Whatsapp: updatedFornecedor.Whatsapp,
          Instagram_url: updatedFornecedor.Instagram_url,
          Endereco: updatedFornecedor.Endereco,
          logo_url: updatedFornecedor.logo_url,
          foto_destaque: updatedFornecedor.foto_destaque,
          mockup_url: updatedFornecedor.mockup_url,
          localizacao: updatedFornecedor.localizacao
        })
        .eq("id", fornecedor?.id || 0);

      if (error) throw error;

      toast({
        title: "Fornecedor atualizado",
        description: "As informações do fornecedor foram atualizadas com sucesso."
      });

      setEditDialogOpen(false);
      fetchFornecedor();
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
    <div className="min-h-screen pb-24 relative overflow-hidden">
      {/* Gradient Background - mesmo da Home */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d2847] to-[#0f3460] -z-10" />
      
      {/* Decorative elements */}
      <div className="fixed top-20 right-10 w-64 h-64 bg-[#3CBBC7]/10 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-40 left-10 w-80 h-80 bg-[#3CBBC7]/5 rounded-full blur-3xl -z-10" />

      <div className="relative z-10 px-4 pt-2 pb-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-[#3CBBC7]" />
          </div>
        ) : fornecedor ? (
          <>
            <FornecedorHeader 
              fornecedor={fornecedor} 
              isAdmin={isAdmin} 
              onEditClick={() => setEditDialogOpen(true)} 
            />
            <FornecedorDetalhesCard 
              fornecedor={fornecedor} 
              isAdmin={isAdmin}
              onEditClick={() => setEditDialogOpen(true)}
            />

            {isAdmin && (
              <FornecedorEditDialog
                fornecedor={fornecedor}
                isOpen={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                onSave={handleEditSave}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-white/70">Fornecedor não encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetalheFornecedor;
