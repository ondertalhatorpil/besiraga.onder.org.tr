import { useEffect, useState } from 'react';

const Hero = () => {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setScroll(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Mobile View - Full Screen Video with Title Overlay */}
      <div className="block md:hidden w-full h-screen relative overflow-hidden">
        {/* Video Background */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/video/drone.mp4" type="video/mp4" />
          Tarayıcınız video etiketini desteklemiyor.
        </video>

        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50"></div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
          {/* Title */}

          {/* Scroll indicator */}
          <div className="absolute bottom-8 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs text-white tracking-widest drop-shadow-lg">KEŞFET</span>
            <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Desktop/Tablet View - Original Design */}
      <div 
        className="hidden md:flex w-full min-h-screen items-center justify-center relative transition-all duration-300 overflow-hidden bg-gradient-to-b from-stone-50 to-amber-50/30"
        style={{
          transform: `scale(${1 + scroll * 0.0005})`,
          opacity: 1 - scroll * 0.0015,
          willChange: 'transform, opacity'
        }}
      >
        {/* SVG Pattern - Door Style - Right Bottom Corner */}
        <img
          src="https://www.onder.org.tr/build/assets/search-bg-842c8fc7.svg"
          alt=""
          className="absolute -right-10 -bottom-10 w-[450px] h-[450px] sm:w-[500px] sm:h-[500px] md:w-[550px] md:h-[550px] lg:w-[600px] lg:h-[600px] opacity-[0.12] pointer-events-none"
          style={{
            filter: 'sepia(0.3) saturate(0.8)'
          }}
        />

        {/* Subtle decorative elements */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-amber-800 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-900 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl w-full text-center flex flex-col gap-10 sm:gap-12 md:gap-14 px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Title Section */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-7xl font-bold leading-[1.1] m-0 font-['Maven_Pro',sans-serif] pt-28">
            <span className="text-gray-900 block mb-2">Osmanlı Mimarisinin İncisi,</span>
            <span 
              className="bg-[#D12A2C] bg-clip-text text-transparent font-bold block"
              style={{
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Beşirağa Külliyesi
            </span>
          </h1>

          {/* Drone Video Section - Tablet & Desktop */}
          <div className="w-full px-8 lg:px-12">
            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                controls
              >
                <source src="video/drone.mp4" type="video/mp4" />
                Tarayıcınız video etiketini desteklemiyor.
              </video>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="flex flex-col items-center gap-2 mt-8 animate-bounce">
            <span className="text-xs text-gray-500 tracking-widest">KEŞFET</span>
            <svg className="w-6 h-6 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;