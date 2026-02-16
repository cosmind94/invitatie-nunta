"use client"
import { useState, useEffect, useRef } from 'react';
// @ts-ignore
import AOS from 'aos';
import 'aos/dist/aos.css';

const DecorativeDivider = () => (
  <div className="relative w-full py-16 flex justify-center" data-aos="fade-in">
    {/* w-4/5 o face să ocupe 80% din lățime, iar opacity-80 o face mai pronunțată */}
    <div className="h-[1px] w-4/5 max-w-[500px] bg-gradient-to-r from-transparent via-[#c5a059]/80 to-transparent"></div>
  </div>
);

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ zile: 0, ore: 0, min: 0, sec: 0 });
  useEffect(() => {
    const target = new Date("June 07, 2026 13:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;
      if (difference > 0) {
        setTimeLeft({
          zile: Math.floor(difference / (1000 * 60 * 60 * 24)),
          ore: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          min: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          sec: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center gap-6 text-[#c5a059]">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="flex flex-col items-center">
          <span className="font-italianno text-5xl md:text-7xl leading-none">{value}</span>
          <span className="text-[9px] uppercase font-sans font-bold tracking-widest opacity-70 mt-1">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [animateModal, setAnimateModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mounted, setMounted] = useState(false); 
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
 const [formData, setFormData] = useState({ nume: '', persoane: '2', telefon: '', status: 'prezent' });

  useEffect(() => {
    setMounted(true);
    // @ts-ignore
    AOS.init({ duration: 1800, once: false, easing: 'ease-out-back' });
  }, []);

  // Funcția care doar deschide plicul (clapa)
  // 1. Funcția care doar ridică clapeta plicului
  const handleEnvelopeClick = () => {
    if (!isOpening) {
      setIsOpening(true);
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true); // <--- ACEASTA ESTE LINIA CARE TREBUIE ADĂUGATĂ
      }
    }
  };
  // 2. Funcția care trece la pagina 2 (doar când se apasă butonul negru)
  
const handleOpenInvitation = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
    window.scrollTo(0, 0);
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) { audioRef.current.pause(); } 
      else { audioRef.current.play(); }
      setIsPlaying(!isPlaying);
    }
  };

  const openModal = () => { 
    setShowModal(true); 
    setIsSuccess(false);
    setPhoneError(false);
    setTimeout(() => setAnimateModal(true), 50); 
  };
  
  const closeModal = () => { 
    setAnimateModal(false); 
    setTimeout(() => { setShowModal(false); setIsSuccess(false); setIsLoading(null); }, 800); 
  };

  const validateAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^07\d{8}$/.test(formData.telefon)) {
      setPhoneError(true);
      return;
    }
    setPhoneError(false);
    setIsSuccess(true);
  };

 const handleFinalConfirm = async (number: string, recipientId: string) => {
    setIsLoading(recipientId);
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzEObGCs4bZn-r30QK3QG8TT33KbU299AYIQBI8kogWDmHvqPo0snZD0mSHxaT8phLC/exec';
    
    try {
      await fetch(scriptURL, { method: 'POST', mode: 'no-cors', body: JSON.stringify({ ...formData, destinatar: recipientId }) });
    } catch (error) { console.error("Sheet error:", error); }

    setTimeout(() => {
      const ePrezent = formData.status === 'prezent';
      const textStatus = ePrezent 
        ? `confirmă prezența pentru ${formData.persoane} persoane la nuntă.` 
        : `vă anunță cu regret că nu poate veni.`;

      const message = `Bună! Familia ${formData.nume} (${formData.telefon}) ${textStatus}`;
      window.open(`https://api.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(message)}`, '_blank');
      setIsLoading(null);
      closeModal();
    }, 1200);
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#fdfbf7] relative overflow-x-hidden">
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          const audio = audioRef.current;
          if (audio) {
            if (!audio.paused) {
              audio.pause();
              setIsPlaying(false);
            } else {
              audio.play().catch(() => {});
              setIsPlaying(true);
            }
          }
        }}
        className="fixed bottom-6 right-6 z-[100] p-2 rounded-full border border-[#c5a059]/20 bg-[#c5a059]/5 backdrop-blur-sm transition-all duration-300 hover:bg-[#c5a059]/15 group opacity-60 hover:opacity-100"
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c5a059" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c5a059" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        )}
      </button>
      
      <style jsx global>{`
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          20% { opacity: 0.4; }
          80% { opacity: 0.4; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        .particle {
          position: absolute;
          background: #c5a059;
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

      <audio ref={audioRef} src="/muzica.mp3" loop preload="auto" />

      {!isOpen ? (
        <div className="h-screen w-full flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-[#fdfbf7]">
          
          <div className="absolute inset-0 pointer-events-none">
  {/* Am crescut de la 15 la 25 de particule pentru acel extra de 10% și densitate vizibilă */}
  {[...Array(25)].map((_, i) => (
    <div key={i} className="particle" style={{
        width: (i % 3 + 2) + 'px', 
        height: (i % 3 + 2) + 'px',
        left: (i * 7) % 100 + '%', // Distribuție mai uniformă pe lățime
        top: (i * 11) % 100 + '%', // Încep din puncte diferite pe înălțime (sunt deja pe ecran)
        animation: `floatUp ${6 + (i % 4)}s linear infinite`, // Animație puțin mai rapidă
        animationDelay: `-${i * 0.5}s`, // DELAY NEGATIV: face particulele să fie deja în mișcare când se încarcă pagina
        opacity: 0.4
      }}
    />
  ))}
</div>

          <div data-aos="fade-in" className="relative z-10 w-full flex flex-col items-center">
            <div className={`transition-opacity duration-700 ${isOpening ? 'opacity-0' : 'opacity-100'}`}>
              <p className="font-italianno text-5xl text-[#c5a059] italic drop-shadow-sm mb-12">O poveste scrisă în stele...</p>
            </div>

            <div 
  onClick={handleEnvelopeClick}
  className={`relative cursor-pointer transition-all duration-[1500ms] ease-in-out ${isOpening ? 'translate-y-[15vh]' : ''}`}
  style={{ 
    width: '90vw', 
    maxWidth: '500px', 
    aspectRatio: '1.4/1', 
    margin: '0 auto',
    perspective: '3000px', // Creștem perspectiva
    transformStyle: 'preserve-3d', // OBLIGATORIU pentru desktop
    WebkitTransformStyle: 'preserve-3d'
  }}
>
              <div 
                className={`absolute bg-white shadow-2xl transition-all duration-[1800ms] ease-out ${isOpening ? '-translate-y-[70%]' : 'translate-y-0'}`} 
                style={{ width: '92%', left: '4%', top: '5%', height: '90%', border: '1px solid #f0f0f0', zIndex: 10, opacity: 1, transitionDelay: isOpening ? '1200ms' : '0ms' }}
              >
                <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                  <p className="font-italianno text-3xl text-gray-800">Vă invităm cu drag</p>
                  <div className="w-12 h-px bg-[#c5a059]/30 my-3"></div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#c5a059] font-bold mb-8">Cătălin & Geanina</p>
                  <button
  onClick={handleOpenInvitation}
  className="mt-6 bg-[#1a1a1a] text-[#c5a059] px-10 py-4 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:scale-105 active:scale-95 transition-all shadow-xl relative z-50 border border-[#c5a059]/20"
>
  DESCHIDE
</button>
                </div>
              </div>

              <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
                <img src="/plic-corp.png" alt="Plic" className="w-full h-full object-fill" />
              </div>

              <div 
  className="absolute top-0 left-0 w-full origin-top"
  style={{ 
    transform: isOpening ? 'rotateX(180deg)' : 'rotateX(0deg)', 
    transition: 'transform 1400ms ease-in-out',
    transformStyle: 'preserve-3d', 
    WebkitTransformStyle: 'preserve-3d',
    height: '55%', 
    zIndex: isOpening ? 5 : 30
  }}
>
  {/* FAȚA (0-90 grade) */}
  <div 
    className="absolute inset-0" 
    style={{ 
  backfaceVisibility: 'hidden', 
  WebkitBackfaceVisibility: 'hidden' 
}}
  >
    <img src="/plic-clapa.png" className="w-full h-full object-fill" alt="Capac" />
    
    {/* Text și Sigiliu cu Fade curat */}
    <div 
      className="absolute inset-0 transition-opacity duration-[500ms]"
      style={{ opacity: isOpening ? 0 : 1 }}
    >
      <div className="absolute inset-0 flex items-center justify-center pb-8">
        <div style={{ width: '80%' }} className="text-center">
          <span className="font-italianno text-[#c5a059] text-2xl md:text-4xl italic drop-shadow-md">
            Apasă pentru a vedea invitația
          </span>
        </div>
      </div>
      <img src="/sigiliu.png" className="absolute left-1/2 -translate-x-1/2 bottom-[-15%] w-[16%] aspect-square shadow-xl" alt="Sigiliu" />
    </div>
  </div>

  {/* SPATELE (90-180 grade) */}
  <div 
    className="absolute inset-0" 
    style={{ 
      backfaceVisibility: 'hidden', 
      WebkitBackfaceVisibility: 'hidden',
      transform: 'rotateX(-180deg)', // Inversat pentru a deveni vizibil la rotația părintelui
      zIndex: 1
    }}
  >
    <img 
      src="/plic-clapa.png" 
      className="w-full h-full object-fill" 
      style={{ transform: 'scaleY(-1)', filter: 'brightness(0.95)' }} 
      alt="Interior" 
    />
  </div>
</div>
            </div>

            <div className={`mt-14 text-center transition-all duration-1000 ${isOpening ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <h1 className="font-italianno text-6xl text-[#1a1a1a]">Cătălin <span className="text-[#c5a059] mx-1">&</span> Geanina</h1>
              <div className="flex justify-center my-4">
                <div className="h-px bg-gradient-to-r from-transparent via-[#c5a059] to-transparent" style={{ width: '150px' }} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-1000">
          
          <div className="relative w-full h-[50svh] md:h-[65vh] overflow-hidden bg-[#fdfbf7]">
            <img src="/miri1.jpeg" alt="Miri" className="w-full h-full object-cover object-top" />
          </div>
          <section className="relative z-10 bg-[#fdfbf7] -mt-16 text-center pb-10">
            <div className="px-6 pt-12">
              <h1 className="font-italianno text-7xl md:text-8xl text-[#1a1a1a] leading-[1.1] md:leading-none mb-4 italic" data-aos="fade-up">
                <span className="block md:inline">Cătălin</span> <span className="block md:inline md:mx-4 text-[#c5a059]">&</span> <span className="block md:inline">Geanina</span>
              </h1>
              <p className="uppercase text-[10px] font-bold text-[#c5a059] tracking-[0.6em] italic" data-aos="fade-up" data-aos-delay="150">07 IUNIE 2026</p>
            </div>
            <DecorativeDivider />
            <div className="max-w-4xl mx-auto px-6 space-y-24 overflow-hidden">
  <div data-aos="fade-right" data-aos-delay="400">
    <p className="text-[9px] font-sans uppercase text-[#c5a059] mb-4 font-bold tracking-[0.3em]">Vă invităm să ne fiți alături de părinții noștri</p>
    <div className="font-italianno text-4xl md:text-5xl text-[#333] space-y-1">
      <p>Ioan & Lilia Ojog</p>
      <p>Ioan & Elena Mihai</p>
    </div>
  </div>

  <div data-aos="fade-left" data-aos-delay="600">
    <p className="text-[9px] font-sans uppercase text-[#c5a059] mb-4 font-bold tracking-[0.3em]">Și nașii noștri dragi</p>
    <p className="font-italianno text-4xl md:text-5xl text-[#333]">Bogdan & Isabela Cîrligeanu</p>
  </div>
</div>
            <DecorativeDivider />
          </section>
          <section className="py-0 text-center" data-aos="fade-up" data-aos-delay="800">
            <div className="max-w-4xl mx-auto px-6">
              <p className="font-italianno text-4xl md:text-5xl text-gray-500 mb-12 italic">Două inimi, un singur drum, o poveste ce începe în...</p>
              <CountdownTimer />
            </div>
            <DecorativeDivider />
          </section>
          <section className="py-10 text-center px-6" data-aos="fade-up">
            <div className="max-w-3xl mx-auto">
              <p className="font-italianno text-3xl md:text-4xl text-gray-600 italic leading-relaxed">
  Iubirea nu înseamnă să te uiți unul la celălalt, ci să privești în aceeași direcție.<br />
  Vă invităm să fiți martorii momentului în care direcțiile noastre devin una singură.
</p>
            </div>
            <DecorativeDivider />
          </section>
          <section className="py-0 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-12" data-aos="fade-up">
              <p className="text-[11px] font-sans font-bold uppercase tracking-[0.4em] text-[#c5a059]">Unde ne vom întâlni</p>
              <div className="flex justify-center mt-2"><div className="h-px bg-[#c5a059]/30 w-12"></div></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
              {[
                { t: "Cununia Civilă", h: "13:00", l: "PONTON LAC, FOREST EVENTS, CUCORĂNI", url: "https://maps.app.goo.gl/tcgwnEeBQHGVcSX48" },
                { t: "Cununia Religioasă", h: "15:00", l: "BISERICA SF. APOSTOLI PETRU ȘI PAVEL", extra: "Cartier Cișmea", url: "https://maps.app.goo.gl/9FLhWNRffKfG1yNv8" },
                { t: "Petrecerea", h: "18:00", l: "SALA MARA, RESTAURANT FOREST EVENTS", url: "https://maps.app.goo.gl/tcgwnEeBQHGVcSX48" }
              ].map((item, i) => (
                <div key={i} data-aos="zoom-in" className="p-10 bg-white border border-[#c5a059]/10 rounded-3xl shadow-sm flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-[#c5a059] uppercase text-[10px] mb-6 font-bold tracking-[0.2em]">{item.t}</h3>
                    <p className="font-italianno text-6xl mb-4 text-gray-700">{item.h}</p>
                    <p className="text-[11px] uppercase text-gray-700 italic leading-relaxed">{item.l}</p>
                    {item.extra && <p className="text-[11px] uppercase text-gray-700 italic mt-1 font-normal">{item.extra}</p>}
                  </div>
                  <div className="mt-10">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold border-b border-[#c5a059]/30 pb-1 text-[#c5a059] uppercase tracking-widest transition-all hover:text-[#1a1a1a]">Vezi pe hartă</a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <DecorativeDivider />

{/* SECTIUNE POZA NOUA ALB-NEGRU */}
<section className="w-full px-6 mb-0" data-aos="fade-up">
  <div className="max-w-5xl mx-auto overflow-hidden rounded-3xl shadow-lg">
    <img 
      src="/miri2.jpeg" 
      alt="Miri" 
      className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out"
    />
  </div>
</section>



          <section className="py-10 px-6 text-center">
            <DecorativeDivider />
            <div className="max-w-md mx-auto space-y-16" data-aos="fade-up">
              <div className="border-y border-[#c5a059]/20 py-12">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-6 font-bold">Vă rugăm să ne confirmați prezența până la:</p>
                <p className="uppercase text-[10px] font-bold text-[#c5a059] tracking-[0.6em] italic">07 MAI 2026</p>
              </div>
              <button onClick={openModal} className="bg-[#1a1a1a] text-[#c5a059] border border-[#c5a059]/30 px-12 py-4 rounded-lg text-[11px] uppercase font-bold tracking-[0.3em] shadow-xl transition-all duration-500 hover:bg-[#c5a059] hover:text-[#1a1a1a]">Confirmă prezența</button>
            </div>
            <footer className="pt-32 pb-10">
                <p className="font-italianno text-5xl text-[#c5a059] italic" data-aos="fade-up">Vă așteptăm cu drag!</p>
            </footer>
          </section>
        </div>
      )}

      {showModal && (
        <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-opacity duration-700 ${animateModal ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-[#fdfbf7] w-full max-w-md rounded-2xl p-8 transform transition-all duration-700">
            {!isSuccess ? (
              <form className="space-y-6" onSubmit={validateAndProceed}>
                <h3 className="font-italianno text-5xl text-center text-gray-800 italic">Confirmă</h3>
                <div className="space-y-1">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1">Numele Familiei</p>
                  <input type="text" className="w-full p-4 bg-white border border-gray-100 rounded-xl outline-none focus:border-[#c5a059]" value={formData.nume} onChange={(e) => setFormData({...formData, nume: e.target.value})} placeholder="Nume și Prenume" required />
                </div>
                {/* AFISĂM NR. PERSOANE DOAR DACĂ STATUSUL ESTE 'PREZENT' */}
{formData.status === 'prezent' && (
  <div className="space-y-1 animate-in fade-in zoom-in duration-300">
    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1">Număr Persoane</p>
    <select 
      className="w-full p-4 bg-white border border-gray-100 rounded-xl outline-none" 
      value={formData.persoane} 
      onChange={(e) => setFormData({...formData, persoane: e.target.value})}
    >
      {[1, 2, 3, 4, 5, 6].map(n => (
        <option key={n} value={n}>{n} {n === 1 ? 'Persoană' : 'Persoane'}</option>
      ))}
    </select>
  </div>
)}
                <div className="space-y-1">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1">Telefon</p>
                  <input type="tel" className={`w-full p-4 bg-white border rounded-xl outline-none transition-colors ${phoneError ? 'border-red-500 bg-red-50' : 'border-gray-100 focus:border-[#c5a059]'}`} value={formData.telefon} onChange={(e) => setFormData({...formData, telefon: e.target.value})} placeholder="07xxxxxxxx" required />
                  {phoneError && <p className="text-[9px] text-red-500 font-bold uppercase mt-1 ml-1">Introdu un număr valid (10 cifre)</p>}
                </div>
               <div className="space-y-1 pt-2">
  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1">Vei fi alături de noi?</p>
  <div className="grid grid-cols-2 gap-3">
    <button 
      type="button"
      onClick={() => setFormData({...formData, status: 'prezent'})}
      className={`p-4 rounded-xl text-[10px] font-bold uppercase transition-all border ${
        formData.status === 'prezent' 
        ? 'bg-[#c5a059] text-[#1a1a1a] border-[#c5a059]' 
        : 'bg-white text-gray-400 border-gray-100'
      }`}
    >
      Da, abia aștept!
    </button>
    <button 
      type="button"
      onClick={() => setFormData({...formData, status: 'absent'})}
      className={`p-4 rounded-xl text-[10px] font-bold uppercase transition-all border ${
        formData.status === 'absent' 
        ? 'bg-[#c5a059] text-[#1a1a1a] border-[#c5a059]' 
        : 'bg-white text-gray-400 border-gray-100'
      }`}
    >
      Din păcate, nu pot
    </button>
  </div>
</div>
                <button type="submit" className="w-full bg-[#1a1a1a] text-[#c5a059] py-5 rounded-xl text-[11px] font-bold uppercase tracking-[0.3em] transition-all duration-500 hover:bg-[#c5a059] hover:text-[#1a1a1a]">Confirmă</button>
              </form>
            ) : (
              <div className="text-center space-y-8 py-10">
                <h3 className="font-italianno text-5xl text-gray-800 italic">Cui trimiți mesajul?</h3>
                <div className="grid grid-cols-1 gap-4">
                  {[ {id: "Catalin", num: "40741611625", label: "Cătălin"}, {id: "Geanina", num: "40755883557", label: "Geanina"} ].map((mir) => (
                    <button key={mir.id} onClick={() => handleFinalConfirm(mir.num, mir.id)} disabled={isLoading !== null} className="relative bg-[#1a1a1a] text-[#c5a059] p-5 rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] transition-all duration-500 hover:bg-[#c5a059] hover:text-[#1a1a1a] flex items-center justify-center min-h-[50px]">
                      {isLoading === mir.id ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : `Trimite lui ${mir.label}`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}