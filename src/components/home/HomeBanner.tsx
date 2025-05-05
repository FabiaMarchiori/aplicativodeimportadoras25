
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const HomeBanner = () => {
  return (
    <div className="bg-white shadow-md mb-8 rounded-md overflow-hidden">
      <div className="w-full">
        <AspectRatio ratio={16 / 5} className="bg-muted">
          <img 
            src="/lovable-uploads/335dae59-b826-4bb7-9190-7b17674eca53.png" 
            alt="Importadoras da 25 de Março" 
            className="w-full h-full object-cover" 
          />
        </AspectRatio>
      </div>
    </div>
  );
};

export default HomeBanner;
