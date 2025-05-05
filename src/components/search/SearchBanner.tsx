
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const SearchBanner = () => {
  return (
    <div className="mb-6 overflow-hidden rounded-lg">
      <AspectRatio ratio={16 / 5} className="bg-muted">
        <img 
          src="/lovable-uploads/4c5afb76-8ad2-49aa-b0ab-9c672bc8e692.png" 
          alt="Importadoras da 25 de Março" 
          className="w-full h-full object-cover"
        />
      </AspectRatio>
    </div>
  );
};

export default SearchBanner;
