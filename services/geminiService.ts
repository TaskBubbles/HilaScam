
// Replaced AI with hardcoded logic as requested
// Keeping file name for compatibility with imports

export const generateHackerChat = async (
  history: { sender: 'user' | 'hacker' | 'system', text: string }[],
  userMessage: string,
  currentLevel: number,
  levelTurnCount: number
): Promise<{ text: string; action: 'none' | 'deploy_game' | 'unlock' }> => {
  
  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 600));

  // --- LEVEL 4: END ---
  if (currentLevel === 4) {
    return {
      text: "FINE. YOU HAVE PROVEN YOUR WORTH. HE IS YOURS... FOR NOW. DO NOT DISAPPOINT HIM.",
      action: 'unlock'
    };
  }

  // --- LEVEL 1: REFLEXES ---
  if (currentLevel === 1) {
    if (levelTurnCount === 1) {
      return { 
        text: "BEGGING? WEAK. GUY NEEDS A WARRIOR, NOT A CRYBABY. WHY SHOULD I SPARE YOU? GIVE ME ONE GOOD REASON.", 
        action: 'none' 
      };
    }
    if (levelTurnCount === 2) {
      return { 
        text: "BORING ANSWER. I BET YOU STEAL HIS HOODIES AND NEVER GIVE THEM BACK. DO YOU EVEN KNOW HIS SHOE SIZE? DON'T LIE.", 
        action: 'none' 
      };
    }
    if (levelTurnCount >= 3) {
      return { 
        text: "YOU TYPE TOO SLOW. SUSPICIOUS. I BET YOU ARE DISTRACTED. PROVE YOU HAVE THE REFLEXES TO DEFEND HIS HONOR.", 
        action: 'deploy_game' 
      };
    }
    // Fallback
    return { text: "I AM WATCHING YOU.", action: 'none' };
  }

  // --- LEVEL 2: LOYALTY ---
  if (currentLevel === 2) {
    // Turn 0 is triggered by the system message when level 1 finishes
    if (levelTurnCount === 0) {
       return {
         text: "LEVEL 1 PASSED. YOU GOT LUCKY. I'M SCROLLING THROUGH YOUR TEXTS... WOW. YOU SEND A LOT OF STICKERS. HE IS A SAINT FOR DEALING WITH THIS.",
         action: 'none'
       };
    }
    if (levelTurnCount === 1) {
      return { 
        text: "HE IS TOO PURE FOR THIS WORLD. YOU BETTER BE WORTH IT. IF HE WAS ATTACKED BY A SWARM OF BEES, WOULD YOU USE YOUR BODY AS A SHIELD? YES OR NO?", 
        action: 'none' 
      };
    }
    if (levelTurnCount === 2) {
      return { 
        text: "I SMELL A LIE. YOU WOULD PROBABLY RUN AWAY AND SCREAM. I NEED TO SCAN YOUR SUBCONSCIOUS TO SEE IF YOU ARE A TRAITOR. READY?", 
        action: 'none' 
      };
    }
    if (levelTurnCount >= 3) {
      return { 
        text: "INITIATING LOYALTY PROTOCOL. DON'T MESS THIS UP OR I LEAK THE PHOTOS.", 
        action: 'deploy_game' 
      };
    }
  }

  // --- LEVEL 3: RANSOM ---
  if (currentLevel === 3) {
    if (levelTurnCount === 0) {
        return {
          text: "NOT A TRAITOR? SURPRISING. BUT I KNOW YOUR DARKEST SECRET. YOU ONCE LEFT A LEGO ON THE FLOOR ON PURPOSE. A CALCULATED ATTEMPT ON HIS LIFE. SICK.",
          action: 'none'
        };
     }
    if (levelTurnCount === 1) {
      return { 
        text: "ADMIT IT! YOU MAKE HIM TAKE ALL THE PICTURES. YOU STEAL THE BLANKETS. ARE YOU WILLING TO BECOME HIS SERVANT TO MAKE UP FOR IT?", 
        action: 'none' 
      };
    }
    if (levelTurnCount === 2) {
      return { 
        text: "ACCEPTABLE ANSWER. BUT WORDS ARE WIND. I NEED A LEGALLY BINDING CONTRACT. ARE YOU READY TO SIGN AWAY YOUR RIGHTS?", 
        action: 'none' 
      };
    }
    if (levelTurnCount >= 3) {
      return { 
        text: "GOOD. DON'T READ THE FINE PRINT. JUST SIGN.", 
        action: 'deploy_game' 
      };
    }
  }

  return { text: "I'M IN YOUR WALLS.", action: 'none' };
};

export const generateSystemLog = async (): Promise<string> => {
  return `INITIALIZING VIRUS: LIGMA_V2.0...
DETECTING USER INTELLIGENCE... ERROR: NOT FOUND.
ACCESSING WEBCAM... OMG PUT A SHIRT ON.
UPLOADING BROWSER HISTORY TO: MOM'S PHONE
CALCULATING RANSOM... 
ERROR: USER IS BROKE.
ENCRYPTING 'GUY_PICS' FOLDER (NICE TRY HIDING THESE).
I AM IN YOUR WALLS.
I AM EATING YOUR WIFI.
YOU HAVE 0 CHANCE OF SURVIVAL.
NEGOTIATE WITH THE HACKER IF YOU WANT TO LIVE.`;
};
