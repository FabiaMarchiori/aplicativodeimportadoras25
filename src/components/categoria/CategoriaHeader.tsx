
import React from 'react';
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CategoriaHeader = () => {
  return (
    <header className="flex items-center mb-4 animate-[categoryFadeIn_0.4s_ease-out_forwards]">
      <Link to="/" className="text-slate-400 hover:text-cyan-400 mr-3 transition-colors duration-200">
        <ArrowLeft className="h-5 w-5" />
      </Link>
      <h1 className="text-2xl font-bold text-white font-heading">Categorias</h1>
    </header>
  );
};

export default CategoriaHeader;
