
import React, { useState } from 'react';

interface GalleryProps {
  onDownload: () => void;
}

export const Gallery: React.FC<GalleryProps> = ({ onDownload }) => {
  const [accepted, setAccepted] = useState(false);

  const handleYes = () => {
    setAccepted(true);
  };

  if (accepted) {
    return (
      <div className="w-full max-w-4xl text-center animate-bounce mt-10 px-4">
        <h1 className="text-5xl md:text-8xl mb-8">💖 YAY! 💖</h1>
        <p className="text-xl md:text-2xl text-pink-700 font-bold mb-8">
          Date Night Details Loading... <br/>
          (I'll pick you up at 7 PM)
        </p>
        <div className="text-8xl md:text-9xl">👩‍❤️‍💋‍👨</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl bg-white p-6 md:p-12 rounded-3xl shadow-[0_0_50px_rgba(255,105,180,0.5)] border-4 border-pink-300 transform rotate-1 m-4">
      <div className="text-center">
        <div className="text-5xl md:text-6xl mb-6">🥺👉👈</div>
        <h2 className="text-2xl md:text-5xl font-bold text-pink-600 mb-6 font-handwriting">
          Okay, I didn't actually hack you...
        </h2>
        <p className="text-base md:text-lg text-gray-600 mb-8 font-sans">
          But I did steal your heart (hopefully?). <br/><br/>
          Now that I have your attention...
        </p>
        
        <h1 className="text-3xl md:text-6xl font-bold text-red-500 mb-8 md:mb-12 font-horror tracking-widest leading-tight">
          WILL YOU BE MY VALENTINE?
        </h1>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-full">
          <button 
            onClick={handleYes}
            className="w-full md:w-auto bg-pink-500 hover:bg-pink-600 text-white text-lg md:text-xl font-bold py-4 px-12 rounded-full shadow-lg transform transition hover:scale-110 active:scale-95"
          >
            YES! 💖
          </button>
          <button 
            onClick={handleYes}
            className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white text-lg md:text-xl font-bold py-4 px-12 rounded-full shadow-lg transform transition hover:scale-110 active:scale-95"
          >
            ABSOLUTELY YES! 🌹
          </button>
        </div>
        <p className="mt-6 text-gray-400 text-xs md:text-sm italic">
          (There is no 'No' button because I deleted it with the virus)
        </p>
      </div>
    </div>
  );
};
