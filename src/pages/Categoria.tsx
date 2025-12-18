
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Fornecedor } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import SearchHeader from "@/components/categoria/SearchHeader";
import FornecedorGrid from "@/components/categoria/FornecedorGrid";
import EditFornecedorDialog from "@/components/categoria/EditFornecedorDialog";
import { useCategoriaData } from "@/hooks/useCategoriaData";

export default function Categoria() {
  const { id } = useParams<{ id: string }>();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingFornecedor, setEditingFornecedor] = useState<Partial<Fornecedor>>({});
  const { isAdmin } = useAuth();
  
  const {
    categoria,
    filteredFornecedores,
    loading,
    searchQuery,
    setSearchQuery,
    fetchFornecedores
  } = useCategoriaData(id);

  return (
    <div className="page-container fade-in min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d1f35] to-[#0a1a2e]">
      
      <SearchHeader 
        categoria={categoria} 
        loading={loading} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />
      
      <FornecedorGrid 
        fornecedores={filteredFornecedores} 
        loading={loading} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      {isAdmin && (
        <EditFornecedorDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          editingFornecedor={editingFornecedor}
          setEditingFornecedor={setEditingFornecedor}
          onSuccess={fetchFornecedores}
        />
      )}
    </div>
  );
}
