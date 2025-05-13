
import { useState, useEffect } from "react";
import { Categoria, supabase, mapCategoria } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import FloatingActionButton from "@/components/FloatingActionButton";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import HomeBanner from "@/components/home/HomeBanner";
import CategoryCard from "@/components/home/CategoryCard";
import AddCategoryDialog from "@/components/home/AddCategoryDialog";

export default function Home() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isAdmin } = useAuth();
  const { toast } = useToast();

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

  useEffect(() => {
    fetchCategorias();
  }, []);

  return (
    <div className="page-container fade-in">
      <HomeBanner />
      
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categorias.map((categoria) => (
            <CategoryCard key={categoria.id} categoria={categoria} />
          ))}
        </div>
      )}

      {isAdmin && (
        <>
          <FloatingActionButton onClick={() => setDialogOpen(true)} />
          <AddCategoryDialog 
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSuccess={fetchCategorias}
          />
        </>
      )}
    </div>
  );
}
