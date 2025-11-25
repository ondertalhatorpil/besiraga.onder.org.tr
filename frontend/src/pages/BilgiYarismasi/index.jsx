import React, { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw, Trophy, ArrowRight, HelpCircle, Clock, BookOpen } from 'lucide-react';
import Header from '../../components/Header/HeaderController'; 

const quizData = [
  {
    id: 1,
    question: "Beşir Ağa Külliyesi, hangi mimari üslûbun Türk sanatındaki ilk uygulamalarından biri olarak kabul edilir?",
    type: 'multiple-choice',
    options: [
      { text: "Selçuklu Mimarisi", isCorrect: false, rationale: "Selçuklu mimarisi, külliyenin yapıldığı 18. yüzyıldan çok daha erken bir döneme aittir." },
      { text: "Lale Devri Klasisizmi", isCorrect: false, rationale: "Lale Devri bu döneme yakın olmakla birlikte, metin külliyenin belirgin bir Batı etkisindeki üslûbunu vurgulamaktadır." },
      { text: "Batı'nın Barok Üslûbu", isCorrect: true, rationale: "Metinde, külliyenin 'Batı'nın barok üslûbu burada tesirini göstererek ilk uygulamalarından birini vermiştir' ifadesi yer almaktadır." },
      { text: "Neoklasik Üslûp", isCorrect: false, rationale: "Neoklasik üslûp, genellikle Barok dönemden daha sonra, 19. yüzyılda etkili olmuştur." }
    ]
  },
  {
    id: 2,
    question: "Beşir Ağa Sebili'nin İstanbul'daki diğer sebillere göre en belirgin ve zıt mimari özelliği nedir?",
    type: 'multiple-choice',
    options: [
      { text: "Pencerelerinin dışarı kavisli olması", isCorrect: false, rationale: "Metin, bu özelliğin 'genellikle' sebillerde görüldüğünü ancak burada tam tersi olduğunu belirtir." },
      { text: "Pencerelerinin içeri kavisli olması", isCorrect: true, rationale: "Metin açıkça 'Genellikle sebillerde pencerelerin dışarı kavisli olmasına karşılık burada tam tersine pencereler içeri kavislidir' der." },
      { text: "Tamamen ahşaptan yapılmış olması", isCorrect: false, rationale: "Metinde sebilin 'mermerden yapılmış' olduğu belirtilmektedir." },
      { text: "Üzerinde bir kitâbe bulunmaması", isCorrect: false, rationale: "Metin, sebilin üzerinde Rahmî mahlaslı şairin 'uzun manzum tarihi' bulunduğunu ifade eder." }
    ]
  },
  {
    id: 3,
    question: "Metne göre, Külliye'nin Kütüphanesine giriş nereden sağlanmaktadır?",
    type: 'multiple-choice',
    options: [
      { text: "Doğrudan sokaktan", isCorrect: false, rationale: "Kütüphanenin girişi daha korunaklı bir yerden, başka bir yapının içinden sağlanmaktadır." },
      { text: "Medrese avlusundan", isCorrect: false, rationale: "Medrese avlusundan giriş, kütüphane için değil medrese hücreleri için söz konusudur." },
      { text: "Sadece caminin içinden geçilerek", isCorrect: true, rationale: "Metinde kütüphane için 'içeriye sadece camiden geçilerek girilmektedir' denilmektedir." },
      { text: "Tekke binasının içinden", isCorrect: false, rationale: "Tekke, metne göre kütüphaneye bitişik değil, 'başlı başına ayrı bir bina' olarak tanımlanmıştır." }
    ]
  },
  {
    id: 4,
    question: "Beşir Ağa Camii'nin minaresi ile ilgili metinde hangi bilgi verilmiştir?",
    type: 'multiple-choice',
    options: [
      { text: "Caminin ana duvarına bitişiktir.", isCorrect: false, rationale: "Metin, minarenin camiden 'ayrı olarak' yapıldığını belirterek bu seçeneği yanlışlar." },
      { text: "Çok uzun ve ince bir yapıdadır.", isCorrect: false, rationale: "Metin, tam tersine minarenin 'Çok kısa olan taş minare' olduğunu ifade eder." },
      { text: "Camiden ayrı olarak yapılmıştır ve sekiz köşelidir.", isCorrect: true, rationale: "Metin 'Çok kısa olan taş minare camiden ayrı olarak yapılmıştır. Gövdesi... sekiz köşelidir.' diyerek bu bilgiyi doğrular." },
      { text: "Barok üslûpta zengin süslemelere sahiptir.", isCorrect: false, rationale: "Metin minarenin süslemelerinden bahsetmez, ancak caminin içinin aksine minberin 'sade ve gösterişsiz' olduğunu belirtir." }
    ]
  },
  {
    id: 5,
    question: "Külliye, 19. yüzyılda hangi padişah tarafından tamir ettirilmiştir?",
    type: 'multiple-choice',
    options: [
      { text: "Sultan I. Mahmud", isCorrect: false, rationale: "Sultan I. Mahmud, külliyenin tamir edildiği değil, inşa edildiği (1744-1745) dönemin padişahıdır." },
      { text: "Sultan II. Bayezid", isCorrect: false, rationale: "Sultan II. Bayezid, metinde sadece sıbyan mektebinin asıl vakfı ile ilgili olarak anılmıştır." },
      { text: "Hacı Beşir Ağa'nın kendisi", isCorrect: false, rationale: "Hacı Beşir Ağa külliyeyi yaptıran kişidir, 19. yüzyıldaki tamiratı yaptıran değildir." },
      { text: "Sultan II. Mahmud", isCorrect: true, rationale: "Metin 'Cami... Sultan II. Mahmud tarafından herhalde 1826-1839 yılları arasında tamir ettirilmiştir' bilgisini verir." }
    ]
  },
  {
    id: 6,
    question: "Doğru / Yanlış: Metne göre Beşir Ağa Külliyesi; cami, medrese ve tekkeyi birbirinden tamamen bağımsız ve ayrı binalar olarak tasarlamıştır.",
    type: 'true-false',
    options: [
      { text: "Doğru", isCorrect: false, rationale: "Bu ifade, metnin son paragrafındaki 'nâdir rastlanır bir özellik olarak cami, medrese ve tekkenin bir kitle halinde birleştirildiği görülür' bilgisiyle çelişmektedir." },
      { text: "Yanlış", isCorrect: true, rationale: "Metin tam tersine 'cami, medrese ve tekkenin bir kitle halinde birleştirildiği görülür' diyerek bunun nadir bir özellik olduğunu vurgular." }
    ]
  },
  {
    id: 7,
    question: "Doğru / Yanlış: Kütüphanenin tavan ve tonozları, klasik Türk sanatına uygun, sade ve süslemesiz bir şekilde bırakılmıştır.",
    type: 'true-false',
    options: [
      { text: "Doğru", isCorrect: false, rationale: "Bu iddia, metindeki 'çok zengin şekilde barok üslûpta kabartma (malakârî) süsleme ile bezendiği görülmektedir' açıklamasına tamamen aykırıdır." },
      { text: "Yanlış", isCorrect: true, rationale: "Metin, kütüphanenin 'çok zengin' ve 'klasik Türk sanatına bütünüyle yabancı' Barok süslemelere (malakârî) sahip olduğunu vurgular." }
    ]
  },
  {
    id: 8,
    question: "Doğru / Yanlış: Külliyenin kurucusu Hacı Beşir Ağa, aynı zamanda hattat Beşir Ağa olarak da bilinen ünlü bir hattattır.",
    type: 'true-false',
    options: [
      { text: "Doğru", isCorrect: false, rationale: "Metin 'Hacı Beşir Ağa ile... hattat Beşir Ağa genellikle birbirine karıştırılır' diyerek bu iki kişinin aynı kişi olmadığını, karıştırıldığını belirtir." },
      { text: "Yanlış", isCorrect: true, rationale: "Metin, bu iki ismin farklı kişiler olduğunu ve sıkça birbirine karıştırıldığını açıkça belirtmektedir." }
    ]
  },
  {
    id: 9,
    question: "Doğru / Yanlış: Külliyeye ait sıbyan mektebinin (ilkokul) nerede olduğu tam olarak bilinmemekte, hatta külliyeden ayrı bir yerde olabileceği düşünülmektedir.",
    type: 'true-false',
    options: [
      { text: "Doğru", isCorrect: true, rationale: "Metin 'Görünürde böyle bir mekân tesbit edilememektedir' ve 'mektebin külliyeden ayrı olarak... inşa edilmiş olduğu ihtimali hatıra gelmektedir' diyerek bu belirsizliği doğrular." },
      { text: "Yanlış", isCorrect: false, rationale: "Metin, mektebin yerinin tam olarak saptanamadığını ve görünürde olmadığını açıkça ifade eder." }
    ]
  },
  {
    id: 10,
    question: "Doğru / Yanlış: Beşir Ağa Camii, 'fevkanî' bir yapıdır; yani meyilli bir arazi üzerine kurulduğu için yüksekte kalmış ve altındaki boşluğa dükkânlar yerleştirilmiştir.",
    type: 'true-false',
    options: [
      { text: "Doğru", isCorrect: true, rationale: "Metin 'Beşir Ağa Camii... fevkanîdir' ve 'Külliye meyilli bir arazi üzerinde kurulduğundan cami yüksekte kalmıştır. Altındaki boşlukta dükkânlar bulunur.' diyerek bu bilgiyi teyit eder." },
      { text: "Yanlış", isCorrect: false, rationale: "Bu ifade, metindeki 'fevkanî' tanımı ve altındaki dükkânlar bilgisiyle tam olarak örtüşmektedir." }
    ]
  }
];

const getOptionClasses = (option, selectedOption, isAnswered) => {
  // Mobile: p-4 text-base | Desktop: md:p-6 md:text-lg
  const baseClasses = "w-full text-left p-4 md:p-6 rounded-2xl border transition-all duration-300 text-base md:text-lg font-medium relative overflow-hidden group";
  
  if (!isAnswered) {
    // Normal Durum: Dark Glass
    return `${baseClasses} bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-amber-500/50 hover:text-amber-100 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] cursor-pointer`;
  }
  
  if (option.isCorrect) {
    // Doğru Cevap: Emerald Green
    return `${baseClasses} border-emerald-500/50 bg-emerald-900/40 text-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.2)]`;
  }
  
  if (option === selectedOption && !option.isCorrect) {
    // Yanlış Seçim: Rose Red
    return `${baseClasses} border-rose-500/50 bg-rose-900/40 text-rose-100`;
  }
  
  // Diğer Seçenekler (Pasif)
  return `${baseClasses} border-white/5 bg-white/5 text-slate-600 opacity-50`;
};

export default function BilgiYarismasi() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const totalQuestions = quizData.length;
  const currentQuestion = quizData[currentQuestionIndex];

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleOptionClick = (option) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    if (option.isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRestartQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30 relative overflow-hidden">
      
      <div className="fixed inset-0 z-0">
        <img 
          src="/images/foto.jpeg"
          alt="Beşirağa Külliyesi Arka Plan"
          className="w-full h-full object-cover opacity-70 animate-slow-zoom" 
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-slate-950/95" />

        <div 
          className="absolute inset-0 opacity-10 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} 
        />
      </div>
      
      <div className="relative z-10">
        <Header />

        {!quizStarted ? (
          // Mobile: pt-28 | Desktop: md:pt-44
          <main className="container mx-auto px-4 pt-28 md:pt-44 pb-10 flex flex-col items-center justify-center min-h-[85vh]">
      
            {/* Mobile: text-4xl | Desktop: md:text-6xl */}
            <h1 className="text-4xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-red-200 via-red-400 to-red-600 mb-4 md:mb-6 text-center leading-tight drop-shadow-sm">
              Tarih Bilgini
            </h1>
            
            <p className="text-slate-300 text-base md:text-xl text-center max-w-xl mb-8 md:mb-12 leading-relaxed drop-shadow-md px-4">
              Beşir Ağa Külliyesi'nin gizli kalmış detaylarını ve mimari sırlarını ne kadar iyi biliyorsunuz?
            </p>

            <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12 w-full max-w-md">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 text-center backdrop-blur-md hover:bg-white/10 transition-colors">
                <HelpCircle className="w-6 h-6 md:w-8 md:h-8 text-red-500 mx-auto mb-2 md:mb-3" />
                <div className="text-xl md:text-2xl font-serif text-white">{totalQuestions}</div>
                <div className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider">Soru</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 text-center backdrop-blur-md hover:bg-white/10 transition-colors">
                <Clock className="w-6 h-6 md:w-8 md:h-8 text-red-500 mx-auto mb-2 md:mb-3" />
                <div className="text-xl md:text-2xl font-serif text-white">~3</div>
                <div className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider">Dakika</div>
              </div>
            </div>

            <button 
              onClick={handleStartQuiz}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-3 md:px-10 md:py-4 bg-red-600 text-white text-base md:text-lg font-bold rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_50px_rgba(220,38,38,0.5)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span>Yarışmaya Başla</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </main>
        ) : (
          <main className="container mx-auto px-4 py-24 md:py-32 max-w-4xl min-h-screen flex flex-col justify-center">
             
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
              
              {showResults ? (
                // Sonuç Ekranı: Mobile p-8, Desktop p-20
                <div className="p-8 md:p-20 text-center animate-fade-in">
                  <div className="inline-flex p-4 md:p-6 rounded-full bg-amber-500/10 mb-6 md:mb-8 ring-1 ring-amber-500/30">
                    <Trophy className="w-16 h-16 md:w-20 md:h-20 text-amber-500" />
                  </div>
                  
                  <h2 className="text-3xl md:text-5xl font-serif text-white mb-4 md:mb-6">
                    {score === totalQuestions ? "Muhteşem!" : score > totalQuestions / 2 ? "Tebrikler!" : "Tamamlandı"}
                  </h2>
                  
                  <p className="text-slate-400 text-lg md:text-xl mb-8 md:mb-10">
                    Toplam Skorunuz: <span className="text-amber-400 font-bold text-2xl ml-2">{score} / {totalQuestions}</span>
                  </p>
                  
                  <div className="w-full max-w-md mx-auto bg-slate-800 rounded-full h-3 mb-10 md:mb-12 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-amber-600 h-full transition-all duration-1000 ease-out"
                      style={{ width: `${(score / totalQuestions) * 100}%` }}
                    />
                  </div>
                  
                  <button
                    onClick={handleRestartQuiz}
                    className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full transition-all hover:scale-105 text-sm md:text-base"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Yeniden Başlat</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* Üst Bar: Mobile padding azaltıldı */}
                  <div className="px-5 py-4 md:px-8 md:py-6 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
                    <div className="text-slate-400 font-medium font-serif text-sm md:text-base">
                      Soru <span className="text-white text-base md:text-lg">{currentQuestionIndex + 1}</span> 
                      <span className="opacity-50 mx-1">/</span> 
                      {totalQuestions}
                    </div>
                    <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 px-3 py-1 md:px-4 md:py-1 rounded-full border border-amber-500/20">
                      <Trophy className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="font-bold text-sm md:text-base">{score}</span>
                    </div>
                  </div>
                  
                  {/* İlerleme Çubuğu */}
                  <div className="w-full bg-slate-800 h-1">
                    <div
                      className="bg-amber-500 h-1 shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all duration-500 ease-out"
                      style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                    />
                  </div>

                  {/* İçerik Alanı: Mobile p-6, Desktop p-12 */}
                  <div className="p-6 md:p-12">
                    {/* Soru Metni: Mobile text-xl, Desktop text-3xl */}
                    <h2 className="text-xl md:text-3xl font-serif text-white mb-6 md:mb-10 leading-relaxed drop-shadow-sm">
                      {currentQuestion.question}
                    </h2>
                    
                    {/* Seçenekler */}
                    <div className="space-y-3 md:space-y-4">
                      {currentQuestion.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOptionClick(option)}
                          disabled={isAnswered}
                          className={getOptionClasses(option, selectedOption, isAnswered)}
                        >
                           <div className="flex items-start gap-3 md:gap-4">
                              {/* Şık Harfi (A, B, C...) */}
                              <span className={`flex-shrink-0 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full text-xs md:text-sm font-bold border ${
                                isAnswered 
                                  ? (option.isCorrect ? 'border-emerald-500 bg-emerald-500 text-white' : (option === selectedOption ? 'border-rose-500 bg-rose-500 text-white' : 'border-slate-600 text-slate-500'))
                                  : 'border-white/20 text-slate-400 group-hover:border-amber-500 group-hover:text-amber-500'
                              } transition-colors`}>
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span className="mt-0.5">{option.text}</span>
                              
                              {/* İkon (Cevaplandıysa) */}
                              {isAnswered && option.isCorrect && <CheckCircle className="ml-auto text-emerald-400 w-5 h-5 md:w-6 md:h-6" />}
                              {isAnswered && option === selectedOption && !option.isCorrect && <XCircle className="ml-auto text-rose-400 w-5 h-5 md:w-6 md:h-6" />}
                           </div>
                        </button>
                      ))}
                    </div>

                    {/* Açıklama Kartı (Feedback) */}
                    {isAnswered && (
                      <div className={`mt-6 md:mt-8 p-4 md:p-6 rounded-2xl border animate-fade-in-up ${
                        selectedOption.isCorrect 
                          ? 'bg-emerald-900/30 border-emerald-500/30' 
                          : 'bg-rose-900/30 border-rose-500/30'
                      }`}>
                        <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                           <BookOpen className={`w-4 h-4 md:w-5 md:h-5 ${selectedOption.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`} />
                           <h3 className={`text-base md:text-lg font-bold font-serif ${selectedOption.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                             {selectedOption.isCorrect ? 'Doğru Cevap' : 'Yanlış Cevap'}
                           </h3>
                        </div>
                        <p className="text-slate-200 leading-relaxed pl-6 md:pl-8 text-sm md:text-base">
                          {selectedOption.rationale}
                        </p>
                      </div>
                    )}

                    {/* Sonraki Butonu */}
                    {isAnswered && (
                      <div className="mt-6 md:mt-8 flex justify-end animate-fade-in">
                        <button
                          onClick={handleNextQuestion}
                          className="flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-3 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-200 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200 text-sm md:text-base"
                        >
                          <span>{currentQuestionIndex < totalQuestions - 1 ? 'Sonraki Soru' : 'Sonuçları Gör'}</span>
                          <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </main>
        )}
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');

        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }

        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s linear infinite alternate;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}