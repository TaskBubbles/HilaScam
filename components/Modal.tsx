
import React, { useState, useRef, useEffect } from 'react';
import { generateHackerChat } from '../services/geminiService';
import { TrollGame } from './TrollGame';
import { TypewriterText } from './TypewriterText';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  logText: string;
}

interface Message {
  sender: 'user' | 'hacker' | 'system';
  text: string;
  isAction?: boolean;
  actionLabel?: string;
  actionDone?: boolean;
}

const getResponseOptions = (level: number, turn: number): string[] => {
  // Level 1: Reflexes/Intro
  if (level === 1) {
    if (turn === 0) return ["PLEASE DON'T! I LOVE HIM!", "NOOOO! MY MEMORIES!", "NOT THE DICK PICS!!"];
    if (turn === 1) return ["I MAKE HIM LAUGH.", "I BUY HIM FOOD.", "I AM HIS QUEEN."];
    if (turn === 2) return ["42... I THINK?", "mmmmfgh.. feet 🤤", "I STEAL HIS SOCKS TOO."];
  }
  // Level 2: Loyalty
  if (level === 2) {
    if (turn === 0) return ["HE LOVES MY STICKERS!", "IT'S CALLED ROMANCE.", "HEY! PRIVATE!"];
    if (turn === 1) return ["YES, ABSOLUTELY!", "I'D USE HIM AS A SHIELD", "HE IS STRONGER THAN A FEW BEES."];
    if (turn === 2) return ["ME, OBVIOUSLY.", "HIS COMPUTER?", "PROMPTING."];
  }
  // Level 3: Ransom
  if (level === 3) {
    if (turn === 0) return ["IT WAS AN ACCIDENT!", "I'M SORRY!", "HE SURVIVED!"];
    if (turn === 1) return ["HE'S A GOOD PHOTOGRAPHER!", "I CAN'T HELP BEING CUTE.", "OKAY, MAYBE A LITTLE."];
    if (turn === 2) return ["I'LL SIGN ANYTHING.", "DO I GET A LAWYER?", "YES, MASTER."];
  }
  return []; // Return empty if waiting for game or unknown state
};

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, logText }) => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'hacker', text: "I'M ABOUT TO DELETE ALL YOUR PHOTOS WITH GUY. 😈 BEG FOR MERCY." }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  
  // Game State
  const [showMinigameOverlay, setShowMinigameOverlay] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1); // 1, 2, 3
  const [levelTurnCount, setLevelTurnCount] = useState(0); // Tracks conversation depth per level
  
  const [phase, setPhase] = useState<'logs' | 'chat'>('logs');
  const [logsFinished, setLogsFinished] = useState(false);
  
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, phase]);

  const handleSendMessage = async (textToSend: string, isSystem: boolean = false) => {
    if (!textToSend.trim()) return;
    
    // Increment turn count for this level if it's a user message
    const currentTurns = isSystem ? levelTurnCount : levelTurnCount + 1;
    if (!isSystem) setLevelTurnCount(prev => prev + 1);
    
    // Add message
    setMessages(prev => [...prev, { sender: isSystem ? 'system' : 'user', text: textToSend }]);
    
    // If it's a system message (invisible to user logic mostly, but used for context), allow AI to reply
    setIsTyping(true);
    const delay = isSystem ? 500 : 800 + Math.random() * 800;

    setTimeout(async () => {
      const { text, action } = await generateHackerChat(messages, textToSend, currentLevel, currentTurns);
      
      let newMessages: Message[] = [{ sender: 'hacker', text }];
      
      if (action === 'deploy_game') {
        newMessages.push({
            sender: 'system',
            text: `SECURITY CHALLENGE: LEVEL ${currentLevel}`,
            isAction: true,
            actionLabel: `LAUNCH PROTOCOL V${currentLevel}.0`,
            actionDone: false
        });
      }

      setMessages(prev => [...prev, ...newMessages]);
      setIsTyping(false);

      if (action === 'unlock') {
        setIsUnlocking(true);
        setTimeout(() => {
          onClose();
        }, 2500);
      }
    }, delay);
  };

  // Trigger level transition chat when level changes
  useEffect(() => {
    if (currentLevel > 1) {
       const timer = setTimeout(() => {
         handleSendMessage(`[SYSTEM ALERT: USER PASSED LEVEL ${currentLevel - 1}. INITIATING LEVEL ${currentLevel} PROTOCOLS.]`, true);
       }, 500);
       return () => clearTimeout(timer);
    }
  }, [currentLevel]);

  const startChat = () => {
    setPhase('chat');
  };

  const handleActionClick = (index: number) => {
    // Mark action as done so it can't be clicked again
    setMessages(prev => prev.map((m, i) => i === index ? { ...m, actionDone: true } : m));
    setShowMinigameOverlay(true);
  };

  const handleGameSuccess = () => {
    setShowMinigameOverlay(false);
    setIsTyping(true);
    // Advance level
    const nextLevel = currentLevel + 1;
    setCurrentLevel(nextLevel);
    
    // Reset conversation turns for the new level so AI talks again
    setLevelTurnCount(0);
  };

  if (!isOpen) return null;

  const currentOptions = getResponseOptions(currentLevel, levelTurnCount);
  const showOptions = !isTyping && !showMinigameOverlay && !isUnlocking && currentOptions.length > 0 && phase === 'chat';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-0 md:p-6 lg:p-10 cursor-crosshair backdrop-blur-sm">
      <div className={`w-full h-[100dvh] md:h-full md:max-w-6xl bg-red-950 border-0 md:border-4 border-red-600 shadow-[0_0_100px_rgba(255,0,0,0.5)] flex flex-col relative overflow-hidden transition-all duration-1000 ${isUnlocking ? 'scale-110 opacity-0' : 'scale-100'}`}>
        
        {/* Scary Header */}
        <div className="bg-red-800 text-white p-3 md:p-4 font-bold tracking-widest uppercase flex items-center justify-between shrink-0 border-b-4 border-red-950 z-20 shadow-md">
          <span className="font-horror tracking-widest text-lg md:text-3xl flex items-center gap-2">
            <span className="animate-pulse">☠️</span> {title}
          </span>
          <span className="text-[10px] md:text-xs font-mono opacity-80 border border-white/20 px-2 py-1 rounded">ERR_ID: 10T</span>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 relative overflow-hidden md:flex">
          
          {/* LEFT PANEL / SYSTEM LOGS */}
          <div className={`
            relative flex flex-col bg-black transition-all duration-500
            ${phase === 'logs' ? 'w-full h-full' : 'hidden md:flex md:w-1/3 border-r border-red-900'}
          `}>
             <div className="flex-1 p-4 md:p-6 font-mono text-green-500 overflow-y-auto text-sm md:text-base leading-relaxed relative">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 z-0">
                   <span className="text-9xl">🔒</span>
                </div>
                
                <div className="relative z-10">
                  <TypewriterText 
                    text={logText} 
                    speed={20} 
                    onComplete={() => setLogsFinished(true)}
                  />
                  {logsFinished && phase === 'logs' && (
<div className="mt-8 animate-pulse text-red-500 font-bold border-t border-red-900 pt-4">
  &gt; SYSTEM COMPROMISED.<br/>
  &gt; ALL DATA WILL BE ERASED.<br/>
  &gt; AWAITING INPUT...
</div>
                  )}
                </div>
             </div>

             {/* THE BIG BUTTON */}
             {logsFinished && phase === 'logs' && (
               <div className="p-6 bg-red-900/20 border-t border-red-900 animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-forwards">
                 <button 
                   onClick={startChat}
                   className="w-full bg-red-600 hover:bg-red-500 text-white font-bold text-xl md:text-3xl py-6 rounded-none border-4 border-double border-red-950 shadow-[0_0_30px_rgba(255,0,0,0.6)] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all animate-pulse"
                 >
                   BEG FOR MERCY 🥺
                 </button>
               </div>
             )}
          </div>

          {/* RIGHT PANEL / CHAT */}
          <div className={`
             bg-gray-900 flex-col h-full border-l border-red-900 relative
             ${phase === 'chat' ? 'flex flex-1 animate-in slide-in-from-right duration-500' : 'hidden'}
          `}>
            
            {/* The Game Overlay */}
            {showMinigameOverlay && !isUnlocking && (
              <div className="absolute inset-0 z-[60] bg-black/95 flex items-center justify-center animate-in zoom-in-95 duration-300">
                <TrollGame activeLevel={currentLevel} onSuccess={handleGameSuccess} />
              </div>
            )}

            {/* Chat Header */}
            <div className="bg-black p-3 text-red-500 font-mono text-xs md:text-sm border-b border-red-800 flex justify-between items-center shrink-0 shadow-lg z-10">
              <span className="font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                CONNECTION ESTABLISHED
              </span>
              <span className="text-[10px] uppercase font-mono bg-red-900/40 px-2 rounded">
                 {isUnlocking ? 'DECRYPTING...' : `LEVEL ${currentLevel}/3`}
              </span>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-xs md:text-sm bg-gray-900/95 scroll-smooth">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.sender === 'system' && !m.isAction ? null : ( /* Hide raw system logs unless they are actions */
                  <div className={`max-w-[85%] relative group ${m.isAction ? 'w-full' : ''}`}>
                    {/* Standard Bubble */}
                    {!m.isAction && (
                      <div className={`p-3 rounded-lg shadow-md ${
                        m.sender === 'user' 
                          ? 'bg-blue-900/80 text-blue-100 border border-blue-700 rounded-br-none' 
                          : 'bg-red-900/80 text-red-100 border border-red-700 rounded-bl-none'
                      }`}>
                        <span className="block text-[8px] opacity-60 mb-1 font-bold uppercase tracking-wider">
                          {m.sender === 'user' ? 'HiliBily' : 'Ligma_V2'}
                        </span>
                        {m.text}
                      </div>
                    )}

                    {/* Action Button Bubble */}
                    {m.isAction && (
                      <div className="my-2 border-2 border-dashed border-red-500/50 bg-red-900/20 p-4 rounded-xl text-center">
                        <div className="text-red-400 text-xs mb-2 font-bold uppercase tracking-widest">{m.text}</div>
                        <button 
                           onClick={() => handleActionClick(i)}
                           disabled={m.actionDone}
                           className={`
                             w-full py-3 px-6 font-bold text-sm md:text-lg uppercase tracking-widest rounded transition-all transform
                             ${m.actionDone 
                               ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' 
                               : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(255,0,0,0.6)] animate-pulse hover:scale-105 active:scale-95'
                             }
                           `}
                        >
                           {m.actionDone ? 'TEST PASSED' : m.actionLabel || "CLICK ME"}
                        </button>
                      </div>
                    )}
                  </div>
                  )}
                </div>
              ))}
              {isTyping && (
                 <div className="flex justify-start">
                    <div className="bg-red-900/50 text-red-100 border border-red-700 p-2 rounded-lg rounded-bl-none">
                      <span className="animate-pulse">Typing...</span>
                    </div>
                 </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Options / Input Area */}
            <div className="p-3 bg-black border-t border-red-800 shrink-0 sticky bottom-0 z-20 pb-[env(safe-area-inset-bottom,20px)] min-h-[80px] flex items-center justify-center">
              {showOptions ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                  {currentOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(opt)}
                      className="bg-gray-900 hover:bg-red-900 border border-red-600 text-red-100 py-3 px-4 rounded text-xs md:text-sm font-mono uppercase tracking-wider shadow-[0_0_10px_rgba(255,0,0,0.2)] hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] transition-all active:scale-95 text-center flex items-center justify-center"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 font-mono text-xs py-2 animate-pulse w-full">
                  {isTyping ? "LIGMA_V2 IS TYPING..." : (isUnlocking ? "SYSTEM UNLOCKING..." : "AWAITING SYSTEM ACTION...")}
                </div>
              )}
            </div>
          </div>

        </div>
        
        {/* Background Binary Noise */}
        <div className="absolute inset-0 pointer-events-none opacity-5 font-mono text-[8px] text-red-500 overflow-hidden break-all p-2 z-0">
          {Array(400).fill(0).map((_, i) => (
            <span key={i}>{Math.random() > 0.5 ? '1' : '0'} </span>
          ))}
        </div>
      </div>
    </div>
  );
};
