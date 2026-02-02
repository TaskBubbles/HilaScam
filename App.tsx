
import React, { useState, useEffect } from 'react';
import { Modal } from './components/Modal';
import { Gallery } from './components/Gallery';
import { ChaosPopup } from './components/ChaosPopup';
import { generateSystemLog } from './services/geminiService';

enum AppState {
  BAIT,
  INFECTING,
  LOCKED,
  REVEALED
}

const SCARY_MESSAGES = [
  "DELETING SYSTEM32...",
  "UPLOADING PHOTOS TO FACEBOOK...",
  "WEBCAM: ON",
  "IDENTITY THEFT: IN PROGRESS",
  "SEARCH HISTORY LEAKED",
  "EMAILING GUY YOUR SEARCH HISTORY...",
  "FORMATTING HARD DRIVE...",
  "INSTALLING: VIRUS.EXE",
  "DOWNLOADING CHILD PORN...",
  "YOUR COMPUTER IS MINE",
  "OOPS! ALL VIRUSES",
  "HAHA STUPIDDDDD"
];

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.BAIT);
  const [popups, setPopups] = useState<{id: number, top: number, left: number, msg: string}[]>([]);
  const [logText, setLogText] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);

  // Trigger the chaos
  const handleBaitClick = () => {
    setAppState(AppState.INFECTING);
    
    // Generate the scary log text immediately
    generateSystemLog().then(setLogText);

    let p = 0;
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 15);
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        triggerLockdown();
      }
      setProgress(p);
    }, 200);

    const popupInterval = setInterval(() => {
      if (p >= 100) {
        clearInterval(popupInterval);
        return;
      }
      addPopup();
    }, 150);
  };

  const addPopup = () => {
    const isMobile = window.innerWidth < 768;
    const maxLeft = isMobile ? 10 : 60; 
    
    setPopups(prev => [
      ...prev, 
      {
        id: Date.now() + Math.random(),
        top: 10 + Math.random() * 60, 
        left: 5 + Math.random() * maxLeft,
        msg: SCARY_MESSAGES[Math.floor(Math.random() * SCARY_MESSAGES.length)]
      }
    ]);
  };

  const triggerLockdown = () => {
    setAppState(AppState.LOCKED);
    setShowModal(true);
    // Continue spawning popups even when locked for extra stress, but fewer
    const endlessPopups = setInterval(() => {
      if (Math.random() > 0.8) addPopup();
    }, 800);
    
    setTimeout(() => clearInterval(endlessPopups), 6000);
  };

  const handleUnlock = () => {
    setShowModal(false);
    setPopups([]); 
    setAppState(AppState.REVEALED);
  };

  const handleDownload = () => {
    console.log("Accepted");
  };

  const containerClass = appState === AppState.INFECTING || appState === AppState.LOCKED 
    ? "shake-hard flash-bg" 
    : "bg-pink-50";

  return (
    <div className={`min-h-[100dvh] w-full overflow-hidden relative font-mono transition-colors duration-1000 ${
      appState === AppState.REVEALED ? 'bg-pink-100' : 'bg-black text-red-600'
    } ${containerClass}`}>

      {/* CRT Scanline Overlay Effect */}
      <div className="pointer-events-none fixed inset-0 z-[9999] opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
      
      {/* BAIT SCREEN */}
      {appState === AppState.BAIT && (
        <div className="flex flex-col items-center justify-center h-[100dvh] bg-pink-50 relative overflow-hidden p-4">
          <div className="absolute inset-0 opacity-20 pointer-events-none flex flex-wrap content-center justify-center gap-8 md:gap-12 text-4xl md:text-6xl text-pink-300">
             {"❤️ 💖 💘 💝 💌 💓 💗 💖 ❤️ 💘".split(" ").map((h,i) => <span key={i} className="animate-bounce" style={{animationDelay: `${i*0.1}s`}}>{h}</span>)}
          </div>

          <div className="bg-white/90 backdrop-blur p-6 md:p-10 rounded-2xl shadow-2xl text-center border-4 border-pink-200 w-full max-w-sm md:max-w-md z-10 transform transition hover:scale-105 duration-300 flex flex-col items-center mx-4">
            <div className="text-5xl md:text-6xl mb-4">💌</div>
            <h1 className="text-2xl md:text-3xl text-pink-600 font-bold mb-2 font-serif">A Special Surprise</h1>
            <p className="text-sm md:text-base text-gray-500 mb-8 italic">You have received a digital Valentine's Card!</p>
            
            <button 
              onClick={handleBaitClick}
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-3 md:py-4 px-6 rounded-xl shadow-lg transition-all animate-pulse text-base md:text-lg uppercase tracking-wider"
            >
              Open Message ❤️
            </button>
            <p className="mt-6 text-[10px] md:text-xs text-gray-300">Sent with love via CupidMail™</p>
          </div>
        </div>
      )}

      {/* CHAOS & INFECTION */}
      {appState === AppState.INFECTING && (
        <div className="h-[100dvh] flex flex-col items-center justify-center relative z-40 bg-black p-4">
           <h1 className="text-5xl md:text-9xl font-scary text-red-600 mb-8 glitch-text text-center break-words w-full leading-none" data-text="FATAL ERROR">FATAL<br/>ERROR</h1>
           <div className="w-full max-w-xl bg-gray-900 border-4 border-red-600 p-1 md:p-2">
              <div className="bg-red-600 h-6 md:h-12 transition-all duration-75" style={{ width: `${progress}%` }}></div>
           </div>
           <p className="mt-4 text-lg md:text-2xl font-bold bg-black text-red-500 px-4 text-center font-mono">
             INSTALLING: LIGMA_V2.EXE... {progress}%
           </p>
        </div>
      )}

      {/* BACKGROUND CHAOS POPUPS */}
      {(appState === AppState.INFECTING || appState === AppState.LOCKED) && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-30">
          {popups.map(p => (
            <ChaosPopup key={p.id} {...p} message={p.msg} />
          ))}
        </div>
      )}

      {/* RANSOMWARE MODAL */}
      <Modal 
        isOpen={showModal} 
        onClose={handleUnlock} 
        title="SYSTEM FAILURE"
        logText={logText || "INITIALIZING..."}
      />

      {/* REVEAL / GALLERY */}
      {appState === AppState.REVEALED && (
        <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4 bg-pink-100">
          <Gallery onDownload={handleDownload} />
        </div>
      )}

    </div>
  );
};

export default App;
