import { InstallButton } from '@/components/InstallButton';

export const PWAHeader = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-background border-b">
      <div className="flex items-center gap-3">
        <img 
          src="/lovable-uploads/18b0e626-711a-4180-a57e-9324cfdc8c24.png" 
          alt="Logo 25 de Março" 
          className="w-8 h-8 rounded-lg"
        />
        <h1 className="text-lg font-semibold">25 de Março</h1>
      </div>
      
      <InstallButton />
    </div>
  );
};