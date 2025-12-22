
import { useEffect, useState, useMemo } from "react";
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

  // Gerar bolhas flutuantes animadas
  const bubbles = useMemo(() => 
    [...Array(12)].map((_, i) => ({
      size: Math.random() * 100 + 40,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
    })), []
  );

  // Gerar quadrados decorativos animados
  const squares = useMemo(() => 
    [...Array(8)].map((_, i) => ({
      size: Math.random() * 20 + 10,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 20 + Math.random() * 15,
      rotation: Math.random() * 360,
    })), []
  );

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
    <div className="min-h-screen pb-24 bg-gradient-to-br from-[#0a1628] via-[#0d2847] to-[#0f3460] relative overflow-x-hidden">
      
      {/* Bolhas flutuantes animadas - Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        {bubbles.map((bubble, i) => (
          <div
            key={`bubble-${i}`}
            className="rounded-full bg-cyan-400/[0.08]"
            style={{
              position: 'absolute',
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.left}%`,
              top: `${bubble.top}%`,
              filter: 'blur(30px)',
              animation: `particleFloat ${bubble.duration}s ease-in-out infinite`,
              animationDelay: `${bubble.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Quadrados decorativos flutuantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        {squares.map((square, i) => (
          <div
            key={`square-${i}`}
            className="border border-cyan-400/20"
            style={{
              position: 'absolute',
              width: `${square.size}px`,
              height: `${square.size}px`,
              left: `${square.left}%`,
              top: `${square.top}%`,
              transform: `rotate(${square.rotation}deg)`,
              animation: `particleFloat ${square.duration}s ease-in-out infinite`,
              animationDelay: `${square.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Efeito de glow central sutil */}
      <div 
        className="absolute pointer-events-none"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(600px, 100vw)',
          height: 'min(600px, 100vh)',
          background: 'rgba(34, 211, 238, 0.03)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          zIndex: 0,
        }}
      />
      
      {/* Conteúdo principal */}
      <div className="px-4 pt-4 pb-6 relative w-full max-w-full" style={{ zIndex: 1 }}>
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
