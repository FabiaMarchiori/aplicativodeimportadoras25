// src/serviceWorkerRegistration.ts
export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js").then((registration) => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          installingWorker?.addEventListener("statechange", () => {
            if (installingWorker.state === "installed") {
              if (navigator.serviceWorker.controller) {
                // Nova versão detectada – recarrega automaticamente
                window.location.reload();
              }
            }
          });
        };
      }).catch((error) => {
        console.error("Erro ao registrar o service worker:", error);
      });
    });
  }
}
