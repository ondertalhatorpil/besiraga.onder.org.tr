import React, { useEffect, useState, useRef } from 'react';
import { Play, Headphones, Globe, ChevronRight, Pause, Info } from 'lucide-react';

const PodcastPremium = () => {
  const [activeView, setActiveView] = useState('intro'); // 'intro' or 'languages'
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef(null);

  const languages = [
    { code: 'tr', name: 'Türkçe', sub: 'Rehberli Anlatım', flag: '🇹🇷' },
    { code: 'en', name: 'English', sub: 'Guided Tour', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', sub: 'جولة sمصحوبة بمرشد', flag: '🇸🇦' }
  ];

  // Scroll ve Parallax Efekti
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const progress = Math.max(0, Math.min(1, 1 - (rect.top / viewportHeight)));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLanguageSelect = (langCode) => {
    console.log(`Playing in: ${langCode}`);
    // Buraya player başlatma kodu gelecek
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-slate-950"
    >
      {/* --- BACKGROUND LAYERS --- */}
      
      {/* 1. Main Image with Parallax */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/foto.jpeg"
          alt="Atmospheric Background"
          className="w-full h-full object-cover opacity-60"
          style={{
            transform: `scale(${1 + scrollProgress * 0.15}) translateY(${scrollProgress * 50}px)`,
            transition: 'transform 0.1s linear',
            filter: 'brightness(0.8) contrast(1.1)'
          }}
        />
      </div>

      {/* 2. Cinemactic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80 z-0" />
      
      {/* 3. Grain Texture (Film Efekti) */}
      <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* --- CONTENT CONTAINER --- */}
      <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center justify-center h-full">
        
        {/* Dinamik İçerik Alanı */}
        <div className="relative w-full max-w-md mx-auto transition-all duration-700 ease-out">
            
            {/* VIEW 1: INTRO CARD */}
            <div 
              className={`transition-all duration-700 absolute inset-0 flex flex-col items-center text-center ${
                activeView === 'intro' 
                  ? 'opacity-100 translate-y-0 pointer-events-auto' 
                  : 'opacity-0 -translate-y-10 pointer-events-none'
              }`}
              style={{ position: activeView === 'intro' ? 'relative' : 'absolute' }}
            >
              {/* Ana Başlık */}
              <h2 className="text-5xl md:text-6xl font-serif text-white mb-6 leading-tight tracking-tight drop-shadow-lg">
                Tarihin Sesine <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-200 via-red-400 to-red-600">
                  Kulak Verin
                </span>
              </h2>

              {/* Büyük Play Butonu */}
              <button 
                onClick={() => setActiveView('languages')}
                className="group relative flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/50 backdrop-blur-md pl-2 pr-8 py-2 rounded-full transition-all duration-500 hover:scale-105"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:shadow-red-500/40 transition-all">
                  <Play className="w-6 h-6 text-white fill-current ml-1" />
                </div>
                <div className="text-left">
                  <span className="block text-xs text-red-400 font-medium tracking-wider uppercase">Başlat</span>
                  <span className="block text-lg text-white font-serif">Dinlemeye Başla</span>
                </div>
              </button>
            </div>


            {/* VIEW 2: LANGUAGE SELECTION */}
            <div 
              className={`w-full transition-all duration-700 ${
                activeView === 'languages' 
                  ? 'opacity-100 translate-y-0 pointer-events-auto' 
                  : 'opacity-0 translate-y-10 pointer-events-none'
              }`}
              style={{ position: activeView === 'languages' ? 'relative' : 'absolute' }}
            >
               {/* Geri Dön Butonu */}
               <button 
                  onClick={() => setActiveView('intro')}
                  className="mb-8 mx-auto flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm group"
                >
                  <span className="group-hover:-translate-x-1 transition-transform">←</span> Geri Dön
               </button>

              <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-2 overflow-hidden shadow-2xl">
                <div className="grid gap-2">
                  {languages.map((lang, idx) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      className="group relative flex items-center justify-between p-5 rounded-2xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5 text-left w-full overflow-hidden"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      {/* Hover Gradient Background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-transparent transition-all duration-500" />
                      
                      <div className="flex items-center gap-5 relative z-10">
                        <span className="text-4xl filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300 grayscale group-hover:grayscale-0">
                          {lang.flag}
                        </span>
                        <div>
                          <h4 className="text-white font-serif text-xl tracking-wide group-hover:text-amber-400 transition-colors">
                            {lang.name}
                          </h4>
                          <p className="text-slate-400 text-xs font-medium tracking-wider uppercase mt-1">
                            {lang.sub}
                          </p>
                        </div>
                      </div>

                      <div className="relative z-10 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-amber-500 group-hover:border-amber-500 transition-all duration-300">
                        <Headphones className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <p className="text-center text-slate-500 text-xs mt-6 flex items-center justify-center gap-2">
                <Info className="w-3 h-3" /> Kulaklık takmanız önerilir
              </p>
            </div>

        </div>
      </div>

      {/* Bottom Indicator */}
      <div className="absolute bottom-8 w-full flex justify-center animate-bounce opacity-30">
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-white to-transparent" />
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
        
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
        
        .animate-fade-in-down {
          animation: fadeInDown 1s ease-out forwards;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default PodcastPremium;