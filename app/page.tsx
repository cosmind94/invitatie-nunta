"use client"
import { useState, useEffect, useRef } from 'react';
// @ts-ignore
import AOS from 'aos';
import 'aos/dist/aos.css';

const DecorativeDivider = () => (
  <div className="relative w-full py-20 flex justify-center" data-aos="fade-in">
    <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-[#c5a059]/50 to-transparent"></div>
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
  const [showModal, setShowModal] = useState(false);
  const [animateModal, setAnimateModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [formData, setFormData] = useState({ nume: '', persoane: '2', telefon: '' });

  useEffect(() => {
    // @ts-ignore
    AOS.init({ duration: 1800, once: false, easing: 'ease-out-back' });
  }, []);

  const handleOpenInvitation = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
    setIsOpen(true);
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
    const scriptURL = 'https://script.google.com/macros/s/AKfycbywyIuFGLdlni4OTmIBbIAqqiCvwy_2hfvFiz8tjdIwRReYGZIg1TCV1mMR4OIsrrUi/exec';
    
    try {
      await fetch(scriptURL, { method: 'POST', mode: 'no-cors', body: JSON.stringify({ ...formData, destinatar: recipientId }) });
    } catch (error) { console.error("Sheet error:", error); }

    setTimeout(() => {
      const message = `Bună! Familia ${formData.nume} (${formData.telefon}) confirmă prezența pentru ${formData.persoane} persoane la nuntă.`;
      window.open(`https://api.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(message)}`, '_blank');
      setIsLoading(null);
      closeModal();
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-[#fdfbf7] relative overflow-x-hidden">
      <audio ref={audioRef} src="/muzica.mp3" loop preload="auto" />

      <button 
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-[120] bg-[#1a1a1a] border border-[#c5a059] p-3 rounded-full shadow-2xl text-[#c5a059] transition-all duration-500 hover:bg-[#c5a059] hover:text-[#1a1a1a]"
      >
        {isPlaying ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
        )}
      </button>

      {!isOpen ? (
        <div className="h-screen flex flex-col items-center justify-center p-6 text-center">
          <div data-aos="fade-in">
            <p className="font-italianno text-4xl text-gray-400 mb-8 italic">O poveste scrisă în stele...</p>
            <div onClick={handleOpenInvitation} className="relative cursor-pointer transition-all hover:scale-105 max-w-[320px] mx-auto group">
              <img src="/plic.png" alt="Plic" className="w-full h-auto drop-shadow-2xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-[#1a1a1a] text-[#c5a059] px-10 py-3 rounded-full text-[10px] uppercase font-bold border border-[#c5a059]/40 tracking-[0.3em] transition-all duration-500 group-hover:bg-[#c5a059] group-hover:text-[#1a1a1a]">Deschide</span>
              </div>
            </div>
            <h1 className="font-italianno text-6xl text-[#c5a059] mt-10">Cătălin & Geanina</h1>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-1000">
          {/* HEADER RESTRÂNS pentru vizibilitate imediată pe mobile */}
          <div className="relative w-full h-[45vh] md:h-[65vh] overflow-hidden">
            <img src="/miri1.jpeg" alt="Miri" className="w-full h-full object-cover object-top" />
          </div>

          <section className="relative z-10 bg-[#fdfbf7] -mt-16 text-center pb-10">
            <div className="px-6 pt-12">
              <h1 className="font-italianno text-7xl md:text-8xl text-[#1a1a1a] leading-[1.1] md:leading-none mb-4 italic" data-aos="fade-up">
                <span className="block md:inline">Cătălin</span> 
                <span className="block md:inline md:mx-4 text-[#c5a059]">&</span> 
                <span className="block md:inline">Geanina</span>
              </h1>
              <p className="uppercase text-[10px] font-bold text-[#c5a059] tracking-[0.6em] italic" data-aos="fade-up" data-aos-delay="150">07 IUNIE 2026</p>
            </div>

            <DecorativeDivider />

            <div className="max-w-4xl mx-auto px-6 space-y-24">
              <div data-aos="fade-up" data-aos-delay="400">
                <p className="text-[9px] font-sans uppercase text-[#c5a059] mb-4 font-bold tracking-[0.3em]">Vă invităm să ne fiți alături de părinții noștri</p>
                <div className="font-italianno text-4xl md:text-5xl text-[#333] space-y-1">
                  <p>Ioan & Lilia Ojog</p>
                  <p>Ioan & Elena Mihai</p>
                </div>
              </div>
              
              <div data-aos="fade-up" data-aos-delay="600">
                <p className="text-[9px] font-sans uppercase text-[#c5a059] mb-4 font-bold tracking-[0.3em]">Și nașii noștri dragi</p>
                <p className="font-italianno text-4xl md:text-5xl text-[#333]">Bogdan & Isabela Cîrligeanu</p>
              </div>
            </div>

            <DecorativeDivider />
          </section>

          <section className="py-20 text-center" data-aos="fade-up" data-aos-delay="800">
            <div className="max-w-4xl mx-auto px-6">
              <p className="font-italianno text-4xl md:text-5xl text-gray-500 mb-12 italic">
                Două inimi, un singur drum, o poveste ce începe în...
              </p>
              <CountdownTimer />
            </div>
            <DecorativeDivider />
          </section>

          <section className="py-10 text-center px-6" data-aos="fade-up">
            <div className="max-w-3xl mx-auto">
                <p className="font-italianno text-3xl md:text-4xl text-gray-600 italic leading-relaxed">
                  Iubirea nu înseamnă să te uiți unul la celălalt, ci să privești în aceeași direcție. Vă invităm să fiți martorii momentului în care direcțiile noastre devin una singură.
                </p>
            </div>
            <DecorativeDivider />
          </section>

          <section className="py-20 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
              {[
                { t: "Cununia Civilă", h: "13:00", l: "PONTON LAC, FOREST EVENTS, CUCORĂNI", url: "https://maps.app.goo.gl/ptjtXYEPSfarU9hX9" },
                { t: "Cununia Religioasă", h: "15:00", l: "BISERICA SF. APOSTOLI PETRU ȘI PAVEL", extra: "Cartier Cișmea", url: "https://maps.app.goo.gl/1RoExy17kswZstLw9" },
                { t: "Petrecerea", h: "18:00", l: "SALA MARA, RESTAURANT FOREST EVENTS", url: "https://maps.app.goo.gl/ptjtXYEPSfarU9hX9" }
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

          <section className="py-24 px-6 text-center">
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
                  <input type="text" className="w-full p-4 bg-white border border-gray-100 rounded-xl outline-none focus:border-[#c5a059]" value={formData.nume} onChange={(e) => {
                      const cap = e.target.value.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                      setFormData({...formData, nume: cap});
                  }} placeholder="Nume și Prenume" required />
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1">Număr Persoane</p>
                  <select className="w-full p-4 bg-white border border-gray-100 rounded-xl outline-none" value={formData.persoane} onChange={(e) => setFormData({...formData, persoane: e.target.value})}>
                    {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Persoană' : 'Persoane'}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1">Telefon</p>
                  <input type="tel" className={`w-full p-4 bg-white border rounded-xl outline-none transition-colors ${phoneError ? 'border-red-500 bg-red-50' : 'border-gray-100 focus:border-[#c5a059]'}`} value={formData.telefon} onChange={(e) => setFormData({...formData, telefon: e.target.value})} placeholder="07xxxxxxxx" required />
                  {phoneError && <p className="text-[9px] text-red-500 font-bold uppercase mt-1 ml-1">Introdu un număr valid (10 cifre)</p>}
                </div>
                <button type="submit" className="w-full bg-[#1a1a1a] text-[#c5a059] py-5 rounded-xl text-[11px] font-bold uppercase tracking-[0.3em] transition-all duration-500 hover:bg-[#c5a059] hover:text-[#1a1a1a]">Confirmă</button>
              </form>
            ) : (
              <div className="text-center space-y-8 py-10">
                <h3 className="font-italianno text-5xl text-gray-800 italic">Cui trimiți mesajul?</h3>
                <div className="grid grid-cols-1 gap-4">
                  {[ {id: "Catalin", num: "40741611625", label: "Cătălin"}, {id: "Geanina", num: "40755883557", label: "Geanina"} ].map((mir) => (
                    <button key={mir.id} onClick={() => handleFinalConfirm(mir.num, mir.id)} disabled={isLoading !== null} className="relative bg-[#1a1a1a] text-[#c5a059] p-5 rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] transition-all duration-500 hover:bg-[#c5a059] hover:text-[#1a1a1a] flex items-center justify-center min-h-[50px]">
                      {isLoading === mir.id ? (
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      ) : `Trimite lui ${mir.label}`}
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