
import React from 'react';
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CategoriaHeader = () => {
  return (
    <header className="flex items-center mb-6">
      <Link to="/" className="text-primary mr-2">
        <ArrowLeft className="h-5 w-5" />
      </Link>
      <h1 className="text-2xl font-bold text-primary font-heading">Categorias</h1>
    </header>
  );
};

export default CategoriaHeader;
