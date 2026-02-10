
import React, { useState, useEffect, useRef } from 'react';

interface TrollGameProps {
  activeLevel: number;
  onSuccess: () => void;
}

export const TrollGame: React.FC<TrollGameProps> = ({ activeLevel, onSuccess }) => {
  const [status, setStatus] = useState<"IDLE" | "SUCCESS" | "FAIL">("IDLE");
  const [failMsg, setFailMsg] = useState("FAILURE");
  
  // --- LEVEL 1 STATE (Timing) ---
  const [cursorPos, setCursorPos] = useState(0);
  const [direction, setDirection] = useState(1);
  const requestRef = useRef<number>(0);

  // --- LEVEL 3 STATE (Ransom) ---
  const [clickCount, setClickCount] = useState(0);
  const ransomTerms = [
    "AGREE TO TERMS",
    "ADD 1x SHISHI",
    "GUY PICKS THE MOVIE",
    "ADMIT HE IS FUNNY",
    "PLEDGE ALLEGIANCE TO GUY",
    "ADD ANOTHER SHISHI"
  ];

  // --- ANIMATION LOOP (Only for Level 1) ---
  useEffect(() => {
    if (activeLevel !== 1 || status !== "IDLE") return;

    let lastTime = performance.now();
    const speed = 3.5;

    const animate = (time: number) => {
      const delta = time - lastTime;
      if (delta > 10) { 
        setCursorPos(prev => {
          let next = prev + (speed * direction * (delta / 16));
          if (next >= 100) {
            setDirection(-1);
            return 100;
          }
          if (next <= 0) {
            setDirection(1);
            return 0;
          }
          return next;
        });
        lastTime = time;
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [activeLevel, status, direction]);

  // --- HANDLERS ---

  const handleLevel1Tap = () => {
    if (status !== "IDLE") return;
    // Target zone: 40% to 65%
    if (cursorPos >= 38 && cursorPos <= 67) {
      handleLevelSuccess();
    } else {
      handleFail("FAT FINGERS DETECTED");
    }
  };

  const handleLevel2Tap = (choice: 'guy' | 'celeb') => {
    if (status !== "IDLE") return;
    if (choice === 'guy') {
      handleLevelSuccess();
    } else {
      handleFail("TRAITOR DETECTED. DISGUSTING.");
    }
  };

  const handleLevel3Tap = () => {
    if (status !== "IDLE") return;
    if (clickCount < 5) {
      setClickCount(prev => prev + 1);
    } else {
      handleLevelSuccess();
    }
  };

  const handleLevelSuccess = () => {
    setStatus("SUCCESS");
    setTimeout(() => {
      onSuccess();
    }, 1500);
  };

  const handleFail = (msg: string) => {
    setStatus("FAIL");
    setFailMsg(msg);
    setTimeout(() => {
      setStatus("IDLE");
      setCursorPos(0);
      setClickCount(0);
    }, 1500);
  };

  // --- RENDERERS ---

  const renderLevel1 = () => (
    <div className="w-full animate-in fade-in duration-500">
      <div className="text-center mb-4 font-mono text-red-300 text-xs">STEP 1: CALIBRATE REFLEXES</div>
      <div className="relative w-full h-16 bg-gray-900 border-2 border-red-500 rounded-lg mb-8 overflow-hidden shadow-[0_0_15px_rgba(255,0,0,0.5)]">
        <div className="absolute top-0 bottom-0 bg-green-500/50 border-x-2 border-green-400 z-10 left-[40%] w-[25%]">
           <div className="w-full h-full flex items-center justify-center">
             <span className="text-[10px] text-green-200 font-mono tracking-widest">TARGET</span>
           </div>
        </div>
        <div className="absolute top-0 bottom-0 w-2 bg-white shadow-[0_0_10px_white] z-20" style={{ left: `${cursorPos}%` }} />
      </div>
      <button
        onMouseDown={handleLevel1Tap}
        onTouchStart={(e) => { e.preventDefault(); handleLevel1Tap(); }}
        className="w-full h-24 bg-red-600 hover:bg-red-500 border-b-8 border-red-800 text-white font-bold text-2xl rounded-xl active:scale-95 transition-all shadow-lg uppercase tracking-widest"
      >
        STOP VIRUS
      </button>
    </div>
  );

  const renderLevel2 = () => (
    <div className="w-full flex flex-col gap-4 animate-in zoom-in-95 duration-500">
      <div className="text-center mb-1 font-mono text-red-300 text-xs">STEP 2: LOYALTY_SCANNER_V9.exe</div>
      <h3 className="text-white text-center font-bold mb-4 text-sm md:text-lg">WHO WOULD YOU SAVE FROM A FIRE?</h3>
      
      <div className="flex flex-col gap-4">
        <button
          onClick={() => handleLevel2Tap('guy')}
          className="w-full h-20 bg-blue-600 hover:bg-blue-500 border-b-8 border-blue-800 text-white font-bold text-lg rounded-xl active:scale-95 transition-all shadow-lg p-2 leading-tight flex items-center justify-center gap-2"
        >
          <span>🥰</span>
          <div>
            <div>GUY</div>
            <div className="text-[10px] font-normal opacity-80">(Your Amazing Boyfriend)</div>
          </div>
        </button>
        
        <button
          onClick={() => handleLevel2Tap('celeb')}
          className="w-full h-20 bg-pink-600 hover:bg-pink-500 border-b-8 border-pink-800 text-white font-bold text-lg rounded-xl active:scale-95 transition-all shadow-lg p-2 leading-tight relative overflow-hidden group flex items-center justify-center gap-2"
        >
          <span>🍫</span>
          <div>
            <div>חטיף שוקולד תמרים</div>
            <div className="text-[10px] font-normal opacity-80">(Seriously Delicious)</div>
          </div>
          <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 animate-pulse pointer-events-none"></div>
        </button>
      </div>
    </div>
  );

  const renderLevel3 = () => (
    <div className="w-full animate-in slide-in-from-bottom-10 duration-500">
      <div className="text-center mb-4 font-mono text-red-300 text-xs">STEP 3: RANSOM NEGOTIATION</div>
      
      <div className="bg-black/50 p-3 rounded border border-red-900/50 mb-4 text-green-400 font-mono text-xs md:text-sm h-32 overflow-y-auto space-y-2 shadow-inner">
        {clickCount > 0 && <div>[✓] AGREED: No more complaining</div>}
        {clickCount > 1 && <div>[✓] AGREED: 1x ShiShi Delivery</div>}
        {clickCount > 2 && <div>[✓] AGREED: Guy controls Spotify</div>}
        {clickCount > 3 && <div>[✓] AGREED: You admit he is funny</div>}
        {clickCount > 4 && <div>[✓] AGREED: Another ShiShi added</div>}
        {clickCount === 0 && <div className="animate-pulse text-gray-500">WAITING FOR CONCESSIONS...</div>}
      </div>
      
      <button
        onClick={handleLevel3Tap}
        className="w-full h-24 bg-yellow-600 hover:bg-yellow-500 border-b-8 border-yellow-800 text-white font-bold text-xl rounded-xl active:scale-95 transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] uppercase tracking-wide leading-none p-2 break-words"
      >
        {ransomTerms[clickCount]}
      </button>
      <div className="text-[10px] text-center mt-2 text-gray-500">
        *By clicking you legally bind your soul to Guy.
      </div>
    </div>
  );

  const renderUnlock = () => (
     <div className="w-full text-center animate-pulse">
        <h2 className="text-green-500 text-2xl font-mono mb-4">SYSTEM UNLOCKING...</h2>
        <div className="w-full bg-gray-900 h-4 rounded overflow-hidden">
           <div className="h-full bg-green-500 animate-[width_2s_ease-in-out_infinite]" style={{width: '100%'}}></div>
        </div>
        <p className="text-white text-xs mt-2">DECRYPTING FILES...</p>
     </div>
  );

  // Fallback to avoid black screen if logic error occurs
  const renderContent = () => {
    if (activeLevel === 1) return renderLevel1();
    if (activeLevel === 2) return renderLevel2();
    if (activeLevel === 3) return renderLevel3();
    return renderUnlock(); // Fallback for level 4 or invalid
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-black/95 border-4 border-red-600 relative overflow-hidden shadow-2xl max-w-md mx-auto">
      
      <div className="absolute top-0 w-full bg-red-900/30 text-center py-2 border-b border-red-600 backdrop-blur-sm z-30">
        <h2 className="text-red-500 font-horror text-2xl tracking-widest animate-pulse drop-shadow-md">
          MANUAL OVERRIDE
        </h2>
        <div className="text-[10px] font-mono text-red-300">
          SECURITY LAYER {Math.min(activeLevel, 3)} / 3
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center w-full pt-12 pb-4">
        {status === "FAIL" ? (
          <div className="text-center animate-in zoom-in duration-300">
            <div className="text-6xl mb-4">🚫</div>
            <div className="text-red-500 font-bold font-mono text-xl mb-2 shake-hard">{failMsg}</div>
            <div className="text-white text-xs">RESTARTING LAYER...</div>
          </div>
        ) : status === "SUCCESS" ? (
          <div className="text-center animate-in zoom-in duration-300">
             <div className="text-6xl mb-4">🔓</div>
             <div className="text-green-500 font-bold font-mono text-xl">ACCESS GRANTED</div>
             <div className="text-white text-xs">LOADING NEXT MODULE...</div>
          </div>
        ) : (
           renderContent()
        )}
      </div>
    </div>
  );
};
