import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { Search, LayoutGrid, Heart, Phone, ArrowRight, Sparkles, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import sophAvatar from '@/assets/soph-avatar-transparent.png';
import logo25Icon from '@/assets/logo-25-icon.png';

interface OnboardingModalProps {
  onComplete: () => void;
}

// Partículas flutuantes (mesmo padrão da Home)
const OnboardingParticles = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-cyan-400/10"
        style={{
          width: `${Math.random() * 8 + 4}px`,
          height: `${Math.random() * 8 + 4}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `particleFloat ${25 + Math.random() * 15}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 10}s`,
        }}
      />
    ))}
  </div>
);

// Dados das telas
const slides = [
  {
    id: 'welcome',
    title: 'Bem-vindo ao App Importadoras',
    description: 'O App Importadoras reúne importadoras reais da 25 de Março, organizadas por categoria, permitindo comprar direto da fonte com mais segurança e menos risco de golpe.',
  },
  {
    id: 'how-to-use',
    icon: null,
    title: 'Como usar o App',
    features: [
      { icon: Search, text: 'Buscar fornecedores pelo nome ou produto' },
      { icon: LayoutGrid, text: 'Navegar por categorias de interesse' },
      { icon: Heart, text: 'Favoritar as melhores importadoras' },
      { icon: Phone, text: 'Acessar contatos confiáveis verificados' },
    ],
  },
  {
    id: 'soph',
    avatar: sophAvatar,
    title: 'Conheça a SOPH',
    subtitle: 'Sua sócia digital inclusa',
    features: [
      'Abrir MEI',
      'Registrar marca',
      'Criar logo e site',
      'Precificar corretamente',
    ],
    footer: 'Sempre utilizando ferramentas gratuitas, ajudando você a economizar e estruturar o negócio.',
  },
];

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const navigate = useNavigate();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, dragFree: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [canScrollPrev, setCanScrollPrev] = useState(false);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollNext(emblaApi.canScrollNext());
    setCanScrollPrev(emblaApi.canScrollPrev());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const handleComplete = () => {
    onComplete();
    navigate('/categorias');
  };

  const handleSkip = () => {
    onComplete();
    navigate('/home');
  };

  const isLastSlide = selectedIndex === slides.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#0a1628] via-[#0d2847] to-[#0a1a2e] animate-fade-in">
      {/* Noise overlay */}
      <div className="noise-overlay fixed inset-0 pointer-events-none z-0" />
      
      {/* Partículas */}
      <OnboardingParticles />
      
      {/* Container principal */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header: Botão Pular + Navegação */}
        <div className="flex items-center justify-between px-4 pt-6 pb-2">
          {/* Espaço vazio para balanceamento */}
          <div className="w-16" />
          
          {/* Navegação central: seta + indicadores + seta */}
          <div className="flex items-center gap-3">
            {/* Seta Esquerda */}
            <button
              onClick={scrollPrev}
              className={`w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
                canScrollPrev ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              aria-label="Anterior"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            
            {/* Indicadores de progresso */}
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? 'w-8 bg-cyan-400'
                    : index < selectedIndex
                    ? 'w-2 bg-cyan-400/60'
                    : 'w-2 bg-white/20'
                }`}
              />
            ))}
            
            {/* Seta Direita */}
            <button
              onClick={scrollNext}
              className={`w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
                canScrollNext ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              aria-label="Próximo"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
          
          {/* Botão Pular */}
          <button
            onClick={handleSkip}
            className="flex items-center gap-1 text-white/60 hover:text-white transition-colors duration-200 text-sm"
          >
            <span>Pular</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Carousel */}
        <div className="flex-1 overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="flex-[0_0_100%] min-w-0 h-full flex flex-col items-center justify-start pt-8 px-4 md:px-6 overflow-y-auto"
              >
                {/* Slide 1: Welcome */}
                {slide.id === 'welcome' && (
                  <div className="text-center max-w-sm md:max-w-md animate-fade-in">
                    <div className="mb-4 md:mb-6 inline-flex items-center justify-center w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                      <img 
                        src={logo25Icon} 
                        alt="App Importadoras 25" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-white/70 text-sm md:text-base leading-relaxed">
                      {slide.description}
                    </p>
                  </div>
                )}

                {/* Slide 2: How to use */}
                {slide.id === 'how-to-use' && slide.features && (
                  <div className="text-center max-w-sm md:max-w-md animate-fade-in">
                    <div className="mb-3 md:mb-4 inline-flex items-center justify-center w-14 h-14 md:w-20 md:h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                      <Sparkles className="w-7 h-7 md:w-10 md:h-10 text-cyan-400" />
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
                      {slide.title}
                    </h1>
                    <div className="space-y-3">
                      {slide.features.map((feature, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 md:p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                        >
                          <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                            <feature.icon className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                          </div>
                          <span className="text-white/80 text-left text-xs md:text-sm">
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Slide 3: SOPH */}
                {slide.id === 'soph' && (
                  <div className="text-center max-w-sm md:max-w-md animate-fade-in">
                    {/* Avatar da SOPH */}
                    <div className="mb-4 md:mb-6 relative">
                      <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden border-2 border-cyan-400/30 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
                        <div className="w-full h-full bg-gradient-to-br from-[#0d4a6e] to-[#0a2a3f] flex items-center justify-center">
                          <img
                            src={slide.avatar}
                            alt="SOPH"
                            className="w-full h-full object-cover scale-110"
                            style={{ objectPosition: 'center 25%' }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <h1 className="text-xl md:text-2xl font-bold text-white mb-1">
                      {slide.title}
                    </h1>
                    <p className="text-cyan-400 text-xs md:text-sm mb-4 md:mb-6">
                      {slide.subtitle}
                    </p>
                    
                    <p className="text-white/70 text-xs md:text-sm mb-3 md:mb-4">
                      A SOPH ensina passo a passo como:
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6">
                      {slide.features?.map((feature, i) => (
                        <div
                          key={i}
                          className="p-2 md:p-3 rounded-xl bg-white/5 border border-cyan-500/20 backdrop-blur-sm"
                        >
                          <span className="text-white/80 text-xs md:text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-white/50 text-[10px] md:text-xs leading-relaxed">
                      {slide.footer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Botão de ação */}
        <div className="p-4 md:p-6 pb-6 md:pb-8">
          {isLastSlide ? (
            <Button
              onClick={handleComplete}
              className="w-full py-5 md:py-6 text-sm md:text-base font-semibold bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-white rounded-xl shadow-[0_4px_20px_rgba(34,211,238,0.3)] hover:shadow-[0_6px_25px_rgba(34,211,238,0.4)] transition-all duration-300 hover:scale-[1.02]"
            >
              Escolha uma categoria e encontre seus primeiros fornecedores
              <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
            </Button>
          ) : (
            <Button
              onClick={scrollNext}
              className="w-full py-5 md:py-6 text-sm md:text-base font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
            >
              Próximo
              <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
