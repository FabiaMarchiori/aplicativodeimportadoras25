
import { useState, useEffect } from "react";
import { Categoria, supabase, mapCategoria } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import FloatingActionButton from "@/components/FloatingActionButton";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import CategoriaBanner from "@/components/categoria/CategoriaBanner";
import CategoriaHeader from "@/components/categoria/CategoriaHeader";
import CategoriaGrid from "@/components/categoria/CategoriaGrid";
import AddCategoriaDialog from "@/components/categoria/AddCategoriaDialog";
import EditCategoriaDialog from "@/components/categoria/EditCategoriaDialog";

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const { isAdmin } = useAuth();
  const { toast } = useToast();

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

  const handleEditCategoria = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setEditDialogOpen(true);
  };

  return (
    <div className="page-container fade-in">
      <CategoriaBanner />
      <CategoriaHeader />
      
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <CategoriaGrid 
          categorias={categorias} 
          onEdit={handleEditCategoria} 
        />
      )}

      {isAdmin && (
        <>
          <FloatingActionButton onClick={() => setAddDialogOpen(true)} />
          
          <AddCategoriaDialog
            open={addDialogOpen}
            onOpenChange={setAddDialogOpen}
            onSuccess={fetchCategorias}
          />
          
          <EditCategoriaDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSuccess={fetchCategorias}
            categoria={editingCategoria}
          />
        </>
      )}
    </div>
  );
}
