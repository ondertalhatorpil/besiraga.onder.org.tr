import React, { useEffect, useState, useRef } from 'react';

const ConceptLaunch = () => {
  const [isInView, setIsInView] = useState(false);
  const [scale, setScale] = useState(1);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Section'ın görünür olup olmadığını kontrol et
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Sadece görünür olduktan sonra scroll'u dinle
    if (!isInView) return;

    const handleScroll = () => {
      const scrolled = window.scrollY;
      const newScale = 1 + (scrolled * 0.003); // Büyüme hızı
      setScale(Math.min(newScale, 20)); // Maximum 20 kat büyüme
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isInView]);

  return (
    <div 
      ref={sectionRef}
      className="w-full min-h-screen flex items-center justify-center flex-col px-8 py-8"
      
    >
      <div className="max-w-7xl w-full flex flex-col gap-12">
        
        {/* Title Section */}
        <div>
          <h1 className="text-[2.5rem] md:text-[4.5rem] lg:text-[4.5rem] font-semibold leading-[1.2] m-0 font-['Maven_Pro',sans-serif]"
              style={{ 
                color: isInView && scale > 2 ? '#111827' : '#111827'
              }}>
            Beşirağa Külliyesi'nde
            <br />
            Zaman Yolculuğu <span 
              className="inline"
              style={{ 
                color: '#D12A2C'
              }}>
              280 Yıllık
              <br />
              Bir Miras
            </span>
          </h1>
        </div>

        {/* Description Section */}
        <div className="max-w-[900px]">
          <p className="text-[1.1rem] md:text-[1.3rem] leading-[1.6] m-0 font-normal font-['Inter',sans-serif] text-[#D12A2C]">
            1744 yılından günümüze, Hacı Beşir Ağa'nın emaneti olan bu eşsiz külliye, 
            Osmanlı mimarisinde Batı barok üslubunun ilk örneklerinden biri olarak 
            tarihe tanıklık ediyor. Cami, medrese, kütüphane, sebil ve tekke ile 
            bir bütün olarak tasarlanan bu mimari şaheser, İstanbul'un kültürel 
            zenginliğinin bir parçası.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConceptLaunch;