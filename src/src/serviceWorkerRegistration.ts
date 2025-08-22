// src/serviceWorkerRegistration.ts
export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").then((registration) => {
        console.log("SW registered successfully");
        
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // Nova versão detectada
                  console.log("New SW version available");
                  
                  // Notificar o SW para ativar imediatamente
                  installingWorker.postMessage({ type: 'SKIP_WAITING' });
                  
                  // Recarregar após um pequeno delay
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                } else {
                  console.log("SW installed for the first time");
                }
              }
            });
          }
        });
      }).catch((error) => {
        console.error("Erro ao registrar o service worker:", error);
      });
    });
  }
}
