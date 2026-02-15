"use client"
import { useState, useEffect } from 'react';
// @ts-ignore
import AOS from 'aos';
import 'aos/dist/aos.css';

const DecorativeDivider = () => (
  <div className="relative w-full py-8">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-[#c5a059]/20"></div>
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
  const [scrollPos, setScrollPos] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState(false);
  
  const [formData, setFormData] = useState({ nume: '', persoane: '2', telefon: '' });

  useEffect(() => {
    // @ts-ignore
    AOS.init({ duration: 1800, once: false, easing: 'ease-out-back' });
    const handleScroll = () => setScrollPos(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const nameOpacity = Math.max(0, 1 - scrollPos / 900); 
  const nameTransform = `translateY(-${scrollPos * 0.12}px)`;

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
    const phoneRegex = /^07\d{8}$/;
    if (!phoneRegex.test(formData.telefon)) {
      setPhoneError(true);
      return;
    }
    setPhoneError(false);
    setIsSuccess(true);
  };

  const handleFinalConfirm = async (number: string, recipientName: string) => {
    setIsLoading(recipientName);
    const scriptURL = 'https://script.google.com/macros/s/AKfycbywyIuFGLdlni4OTmIBbIAqqiCvwy_2hfvFiz8tjdIwRReYGZIg1TCV1mMR4OIsrrUi/exec';
    
    try {
      await fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ ...formData, destinatar: recipientName }),
      });
    } catch (error) { console.error("Eroare tabel:", error); }

    setTimeout(() => {
      const message = `Bună! Familia ${formData.nume} (${formData.telefon}) confirmă prezența pentru ${formData.persoane} persoane la nuntă.`;
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      setIsLoading(null);
      closeModal();
    }, 1500);
  };

  if (!isOpen) {
    return (
      <main className="h-screen flex flex-col items-center justify-center p-6 text-center bg-[#fdfbf7]">
        <div data-aos="fade-in">
          <p className="font-italianno text-4xl text-gray-400 mb-8 italic">O poveste scrisă în stele...</p>
          <div onClick={() => setIsOpen(true)} className="relative cursor-pointer transition-all hover:scale-105 max-w-[380px] mx-auto group">
            <img src="/plic.png" alt="Plic" className="w-full h-auto drop-shadow-2xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white/90 backdrop-blur-sm px-10 py-3 rounded-full text-[10px] uppercase font-bold text-gray-600 border border-[#c5a059]/20 shadow-lg tracking-[0.3em]">Deschide</span>
            </div>
          </div>
          <h1 className="font-italianno text-6xl text-[#c5a059] mt-10">Cătălin & Geanina</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fdfbf7] relative overflow-x-hidden">
      <div className="relative w-full h-[55vh] md:h-[65vh] bg-[#fdfbf7] overflow-hidden">
        <img src="/miri1.jpeg" alt="Miri" className="w-full h-full object-cover object-top" />
      </div>

      <section className="relative z-10 bg-[#fdfbf7] -mt-10 pb-20">
        <div className="text-center px-6 w-full max-w-6xl mx-auto pt-16">
          <div style={{ opacity: nameOpacity, transform: nameTransform }} className="transition-all duration-500 ease-out mb-24 will-change-transform">
            <h1 className="font-italianno text-6xl md:text-8xl text-[#1a1a1a] leading-none mb-4 italic">
              <span className="block md:inline">Cătălin</span>
              <span className="block md:inline-block mx-4 md:mx-6 text-[#c5a059] md:text-6xl">&</span>
              <span className="block md:inline">Geanina</span>
            </h1>
            <p className="uppercase text-[10px] font-bold text-[#c5a059] tracking-[0.6em] italic">07 IUNIE 2026</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-italianno text-3xl md:text-5xl text-[#333] p-2 mt-10">
            <div data-aos="fade-right" className="flex flex-col items-center md:items-end md:pr-10">
              <p className="text-[9px] font-sans uppercase text-[#c5a059] mb-3 font-bold tracking-[0.3em]">Părinți</p>
              <p>Ioan & Lilia Ojog</p>
              <p>Ioan & Elena Mihai</p>
            </div>
            <div data-aos="fade-left" className="flex flex-col items-center md:items-start md:pl-10">
              <p className="text-[9px] font-sans uppercase text-[#c5a059] mb-3 font-bold tracking-[0.3em]">Nași</p>
              <p>Bogdan & Isabela Cîrligeanu</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 relative bg-[#fdfbf7]">
        <DecorativeDivider />
        <div className="text-center max-w-4xl mx-auto px-6 mt-10">
          <p data-aos="fade-up" className="font-italianno text-4xl md:text-5xl text-gray-500 mb-2">Momentele se scurg spre visul nostru...</p>
          <h2 data-aos="fade-up" className="uppercase text-[10px] font-bold text-[#c5a059] mb-12 tracking-[0.3em]">Numărătoare Inversă</h2>
          <div data-aos="zoom-in">
            <CountdownTimer />
          </div>
        </div>
      </section>

      {/* LOCATII ACTUALIZATE CU LINK-URILE SOLICITATE */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative bg-[#fdfbf7]">
        <DecorativeDivider />
        <div className="text-center mb-16 mt-10">
          <h2 className="uppercase text-[10px] font-bold text-[#c5a059] tracking-[0.3em]">Locații</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { t: "Cununia Civilă", h: "13:00", l: "PONTON LAC, FOREST EVENTS, CUCORĂNI", url: "https://maps.app.goo.gl/Jkb8pL1mZcWKNCi3A" },
            { t: "Cununia Religioasă", h: "15:00", l: "BISERICA SF. APOSTOLI PETRU ȘI PAVEL", extra: "Cartier Cișmea", url: "https://maps.app.goo.gl/k2bqtyEjdemgFeuG7" },
            { t: "Petrecerea", h: "18:00", l: "SALA MARA, RESTAURANT FOREST EVENTS", url: "https://maps.app.goo.gl/Jkb8pL1mZcWKNCi3A" }
          ].map((item, i) => (
            <div key={i} data-aos="zoom-in-up" className="p-10 bg-white border border-[#c5a059]/10 rounded-3xl text-center shadow-sm">
              <h3 className="text-[#c5a059] uppercase text-[10px] mb-6 font-bold tracking-[0.2em]">{item.t}</h3>
              <p className="font-italianno text-6xl mb-4 text-gray-700">{item.h}</p>
              <p className="text-[11px] uppercase text-gray-700 font-sans italic leading-relaxed">{item.l}</p>
              {item.extra && (
                <p className="text-[11px] uppercase text-gray-700 font-sans italic mt-1">{item.extra}</p>
              )}
              <div className="mt-8">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold border-b border-[#c5a059]/30 pb-1 text-[#c5a059] uppercase tracking-widest">Vezi harta</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-32 px-6 relative bg-[#fdfbf7] text-center">
        <DecorativeDivider />
        <div className="max-w-4xl mx-auto mt-10">
          <h2 className="font-italianno text-7xl md:text-8xl text-gray-700 mb-8 italic">Confirmă</h2>
          <div className="font-italianno text-5xl md:text-7xl mb-16 text-[#c5a059] italic">07.05.2026</div>
          <button onClick={openModal} className="bg-[#1a1a1a] text-[#c5a059] px-12 py-4 rounded-lg text-[11px] uppercase font-bold tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl">Confirmă acum</button>
        </div>
      </section>

      <footer className="py-20 text-center bg-[#fdfbf7] relative">
        <p className="font-italianno text-5xl text-[#c5a059] italic">Vă așteptăm cu drag!</p>
      </footer>

      {showModal && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-1000 ${animateModal ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={closeModal}></div>
          <div className={`relative bg-[#fdfbf7] w-full max-w-md rounded-2xl p-8 transition-all duration-1000 transform ${animateModal ? 'scale-100' : 'scale-95'}`}>
            {!isSuccess ? (
              <form className="space-y-6" onSubmit={validateAndProceed}>
                <h3 className="font-italianno text-5xl text-center text-gray-800 italic">Vă așteptăm!</h3>
                <div className="space-y-2">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Numele Familiei</p>
                  <input type="text" className="w-full p-4 bg-white border border-gray-100 rounded-xl outline-none focus:border-[#c5a059]" 
                    value={formData.nume} onChange={(e) => setFormData({...formData, nume: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Număr de persoane</p>
                  <select className="w-full p-4 bg-white border border-gray-100 rounded-xl"
                    value={formData.persoane} onChange={(e) => setFormData({...formData, persoane: e.target.value})}>
                    {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Persoană' : 'Persoane'}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Telefon (10 cifre)</p>
                  <input type="tel" className={`w-full p-4 bg-white border rounded-xl outline-none transition-colors ${phoneError ? 'border-red-500' : 'border-gray-100 focus:border-[#c5a059]'}`} 
                    value={formData.telefon} onChange={(e) => {setFormData({...formData, telefon: e.target.value}); setPhoneError(false);}} placeholder="07xxxxxxxx" required />
                  {phoneError && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">Introdu un număr valid (ex: 0741xxxxxx)</p>}
                </div>
                <button type="submit" className="w-full bg-[#1a1a1a] text-[#c5a059] py-5 rounded-xl text-[11px] font-bold uppercase tracking-[0.3em]">Pasul următor</button>
              </form>
            ) : (
              <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <h3 className="font-italianno text-5xl text-gray-800 italic">Cui trimiți mesajul?</h3>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { name: "Catalin", num: "40741611625", label: "Cătălin" },
                    { name: "Geanina", num: "40755883557", label: "Geanina" }
                  ].map((mir) => (
                    <button 
                      key={mir.name}
                      onClick={() => handleFinalConfirm(mir.num, mir.name)}
                      disabled={isLoading !== null}
                      className="relative bg-[#1a1a1a] text-[#c5a059] border border-[#1a1a1a] p-5 rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] transition-all duration-500 hover:bg-[#c5a059] hover:text-[#1a1a1a] flex items-center justify-center overflow-hidden"
                    >
                      {isLoading === mir.name ? (
                        <div className="w-5 h-5 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        `Trimite lui ${mir.label}`
                      )}
                    </button>
                  ))}
                </div>
                <button onClick={() => setIsSuccess(false)} className="text-[9px] uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1">Înapoi</button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}