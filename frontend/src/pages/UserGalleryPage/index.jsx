import React, { useState, useEffect, useCallback } from 'react';
import { Upload, X, Plus, ChevronLeft, ChevronRight, Send, Camera, Quote, Maximize2 } from 'lucide-react';
import Header from '../../components/Header/HeaderController'; 

// Örnek veriler
const initialGalleryItems = [
  {
    id: 1,
    image: 'https://pbs.twimg.com/media/Gd4zOf6WgAsWgMs?format=jpg&name=small',
    message: 'Sebilin muhteşem detayları beni çok etkiledi. Osmanlı mimarisinin inceliği burada çok net görülüyor.',
  },
  {
    id: 2,
    image: 'https://pbs.twimg.com/media/GdiyWK_XYAA_y49?format=jpg&name=small',
    message: 'Cami içi görülmeye değer! Huzur dolu bir atmosfer.',
  },
  {
    id: 3,
    image: 'https://pbs.twimg.com/media/GdepXjiXEAATeY8?format=jpg&name=small',
    message: 'Medrese avlusunda tarihi hissettim. 280 yıllık bu yapı hala ayakta duruyor.',
  },
  {
    id: 4,
    image: 'https://pbs.twimg.com/media/GdI3sl-W8AAKNYy?format=jpg&name=small',
    message: 'Barok süslemeler harika, kesinlikle detaylı incelenmeli.',
  },
];

// --- MODAL (Görsel Yükleme) ---
const UploadModal = ({ setShowModal, setGalleryItems }) => {
  const [message, setMessage] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (previewImage && message) {
      const newItem = {
        id: Date.now(),
        image: previewImage,
        message: message,
      };
      setGalleryItems((prevItems) => [newItem, ...prevItems]);
      setShowModal(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-in p-4 sm:p-6">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5 shrink-0">
          <span className="text-white font-medium">Yeni Anı Ekle</span>
          <button 
            onClick={(e) => { e.stopPropagation(); setShowModal(false); }} 
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content (Scrollable on mobile) */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className={`relative w-full aspect-video rounded-xl border-2 border-dashed transition-all overflow-hidden group ${
              previewImage ? 'border-amber-500/50' : 'border-white/10 hover:border-white/30'
            }`}>
              {previewImage ? (
                <>
                  <img src={previewImage} alt="Önizleme" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setPreviewImage(null); }}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                  <Camera size={32} className="mb-2 opacity-50" />
                  <span className="text-sm">Fotoğraf Seçin</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                </label>
              )}
            </div>
            
            <div>
              <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Bu fotoğrafın hikayesi..."
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50 resize-none h-24 placeholder:text-slate-600"
              />
            </div>

            <button
              type="submit"
              disabled={!previewImage || !message}
              className="w-full py-3 bg-white text-black font-medium rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0"
            >
              <Send size={16} />
              <span>Paylaş</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};


// --- ANA SAYFA ---
const UserGalleryPage = () => {
  const [galleryItems, setGalleryItems] = useState(initialGalleryItems);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (galleryItems.length > initialGalleryItems.length) setCurrentIndex(0);
  }, [galleryItems]);

  const currentItem = galleryItems[currentIndex];

  const nextItem = useCallback((e) => {
    if(e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
  }, [galleryItems.length]);

  const prevItem = useCallback((e) => {
    if(e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  }, [galleryItems.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFullScreen) return;
      if (e.key === 'Escape') setIsFullScreen(false);
      if (e.key === 'ArrowRight') nextItem();
      if (e.key === 'ArrowLeft') prevItem();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen, nextItem, prevItem]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 font-sans selection:bg-amber-500/30">
      
      {/* Header */}
      <Header />

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow flex flex-col justify-center pt-24 pb-8 px-4 sm:px-6 relative">
        
        {/* ARKA PLAN - Sadece main içeriğe sınırlı */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="/images/foto.jpeg"
            alt="Arka Plan"
            className="w-full h-full object-cover opacity-20 blur-sm" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950" />
        </div>

        {/* İçerik */}
        <div className="relative z-10 container mx-auto max-w-6xl">
          
          {/* Başlık */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl md:text-5xl font-serif text-white mb-2">Ziyaretçi Gözünden</h1>
            <div className="h-1 w-12 bg-amber-500 mx-auto rounded-full"></div>
          </div>

          {/* --- GALERİ ALANI (SİNEMATİK) --- */}
          <div 
              className="relative w-full aspect-[4/5] sm:aspect-[4/3] md:aspect-[21/9] bg-black/50 rounded-2xl overflow-hidden shadow-2xl border border-white/5 group cursor-zoom-in"
              onClick={() => setIsFullScreen(true)}
          >
            
            {galleryItems.length > 0 && currentItem ? (
              <>
                {/* Ana Görsel */}
                <img
                  key={currentItem.id}
                  src={currentItem.image}
                  alt="Galeri Görseli"
                  className="w-full h-full object-cover animate-fade-in transition-transform duration-[10s] ease-linear transform hover:scale-105"
                />
                
                {/* Mobilde yazıların okunması için daha koyu gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100 pointer-events-none" />

                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/40 text-white/70 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm pointer-events-none">
                    <Maximize2 size={20} />
                </div>

                {/* İçerik (Metin) */}
                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 md:p-12 text-center md:text-left animate-slide-up pointer-events-none">
                  <div className="max-w-4xl mx-auto md:mx-0">
                     <Quote className="text-amber-500 w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-4 opacity-80 mx-auto md:mx-0" />
                     <p className="text-lg sm:text-xl md:text-3xl font-serif text-slate-100 leading-relaxed italic opacity-90 line-clamp-3 md:line-clamp-none">
                       "{currentItem.message}"
                     </p>
                  </div>
                </div>

                {/* Yön Tuşları */}
                <button onClick={prevItem} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-black/30 text-white/50 hover:bg-amber-500 hover:text-white hover:scale-110 transition-all backdrop-blur-sm border border-white/5 z-20">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={nextItem} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-black/30 text-white/50 hover:bg-amber-500 hover:text-white hover:scale-110 transition-all backdrop-blur-sm border border-white/5 z-20">
                  <ChevronRight size={24} />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                Henüz görsel yok.
              </div>
            )}
          </div>

          {/* --- THUMBNAIL ŞERİDİ --- */}
          <div className="mt-6 sm:mt-8 flex items-center justify-center gap-3 sm:gap-4">
              <button 
                onClick={() => setShowUploadModal(true)}
                className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-16 rounded-lg border border-dashed border-white/20 hover:border-amber-500 hover:bg-white/5 flex flex-col items-center justify-center text-slate-400 hover:text-amber-500 transition-all"
              >
                <Plus size={24} />
              </button>

              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide max-w-[calc(100%-80px)]">
                {galleryItems.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-14 sm:w-24 sm:h-16 md:w-32 md:h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                      currentIndex === index 
                        ? 'ring-2 ring-amber-500 opacity-100 scale-105' 
                        : 'opacity-40 hover:opacity-80'
                    }`}
                  >
                    <img src={item.image} alt="Thumbnail" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
          </div>
        </div>
      </main>

      {/* --- TAM EKRAN (LIGHTBOX) MODAL --- */}
      {isFullScreen && (
        <div 
            className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-xl flex items-center justify-center animate-fade-in"
            onClick={() => setIsFullScreen(false)}
        >
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                <img 
                    src={currentItem.image} 
                    alt="Tam Ekran"
                    className="max-w-full max-h-[70vh] sm:max-h-[80vh] object-contain shadow-2xl rounded-sm"
                    onClick={(e) => e.stopPropagation()} 
                />
                
                <div 
                    className="mt-6 w-full max-w-2xl text-center px-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Quote className="text-amber-500 w-6 h-6 mx-auto mb-2 opacity-80" />
                    <p className="text-slate-300 text-base sm:text-lg md:text-xl font-serif italic leading-relaxed">
                        "{currentItem.message}"
                    </p>
                </div>
            </div>

            {/* Kapatma Butonu */}
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    setIsFullScreen(false);
                }} 
                className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white hover:text-red-500 z-[2010] p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all cursor-pointer shadow-lg border border-white/10 backdrop-blur-md"
            >
                <X size={24} className="sm:w-8 sm:h-8" />
            </button>

            {/* Navigasyon Okları */}
            <button 
                onClick={prevItem} 
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all z-[2005]"
            >
                <ChevronLeft size={32} className="sm:w-12 sm:h-12" />
            </button>
            <button 
                onClick={nextItem} 
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all z-[2005]"
            >
                <ChevronRight size={32} className="sm:w-12 sm:h-12" />
            </button>
        </div>
      )}

      {/* MODAL (Yükleme) */}
      {showUploadModal && (
        <UploadModal 
          setShowModal={setShowUploadModal} 
          setGalleryItems={setGalleryItems} 
        />
      )}

      {/* STYLES */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slideUp 0.6s ease-out forwards; }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default UserGalleryPage;