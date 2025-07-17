import { useEffect, useState } from 'react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstall, setShowInstall] = useState(false)
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)

  useEffect(() => {
    const isIOS = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())
    const isInStandaloneMode = 'standalone' in window.navigator && (window.navigator as any).standalone

    if (isIOS && !isInStandaloneMode) {
      setShowIOSInstructions(true)
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      console.log('App instalado')
    } else {
      console.log('Instalação recusada')
    }
    setDeferredPrompt(null)
    setShowInstall(false)
  }

  if (!showInstall && !showIOSInstructions) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
        <h2 className="text-lg font-semibold mb-3">Instale o App 25 de Março</h2>
        {showInstall && (
          <>
            <p className="text-gray-600 mb-4">
              Instale nosso app para melhor experiência, acesso mais rápido e funcionalidades offline.
            </p>
            <button
              onClick={handleInstallClick}
              className="bg-[#9C27B0] hover:bg-purple-700 text-white py-2 px-4 rounded-md w-full mb-2"
            >
              Instalar App
            </button>
            <button
              onClick={() => setShowInstall(false)}
              className="text-gray-500 text-sm underline"
            >
              Agora não
            </button>
          </>
        )}
        {showIOSInstructions && (
          <>
            <p className="text-gray-600 mb-4">
              Para instalar este app no seu iPhone ou iPad:<br />
              Toque no botão <strong>Compartilhar</strong> e depois em <strong>"Adicionar à Tela de Início"</strong>.
            </p>
            <button
              onClick={() => setShowIOSInstructions(false)}
              className="text-gray-500 text-sm underline"
            >
              Entendi
            </button>
          </>
        )}
      </div>
    </div>
  )
}