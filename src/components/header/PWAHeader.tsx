import { InstallButton } from '@/components/InstallButton';

export const PWAHeader = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-background border-b">
      <div className="flex items-center gap-3">
        <img 
          src="/icon-192x192.png" 
          alt="Logo" 
          className="w-8 h-8 rounded-lg"
        />
        <h1 className="text-lg font-semibold">25 de Março</h1>
      </div>
      
      <InstallButton />
    </div>
  );
};