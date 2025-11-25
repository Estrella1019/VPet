import React from 'react';
import { PetState, PetAppearance } from '../types';

interface PetAvatarProps {
  state: PetState;
  appearance: PetAppearance;
}

const PetAvatar: React.FC<PetAvatarProps> = ({ state, appearance }) => {
  // Theme Color Logic
  const getColors = () => {
    switch (appearance.primaryColor) {
      case 'pink': return { main: '#fb7185', light: '#fce7f3', dark: '#be123c' };
      case 'blue': return { main: '#38bdf8', light: '#e0f2fe', dark: '#0369a1' };
      case 'yellow': return { main: '#facc15', light: '#fef9c3', dark: '#a16207' };
      case 'purple': return { main: '#c084fc', light: '#f3e8ff', dark: '#7e22ce' };
      default: return { main: '#fb7185', light: '#fce7f3', dark: '#be123c' };
    }
  };
  const colors = getColors();

  // --- SVG Parts ---

  // 1. Ears based on Species
  const Ears = () => {
    if (appearance.species === 'cat') {
      // Hachiware-ish Pointy Ears
      return (
        <g>
          {/* Left Ear */}
          <path d="M 120 130 L 100 60 L 170 100" fill="white" stroke="#422006" strokeWidth="6" strokeLinejoin="round" />
          {/* Right Ear */}
          <path d="M 280 130 L 300 60 L 230 100" fill="white" stroke="#422006" strokeWidth="6" strokeLinejoin="round" />
          
          {/* Color Markings on Ears/Head for Cat */}
          <path d="M 120 130 L 100 60 L 140 85 Z" fill={colors.main} stroke="none" />
          <path d="M 280 130 L 300 60 L 260 85 Z" fill={colors.main} stroke="none" />
        </g>
      );
    } 
    if (appearance.species === 'rabbit') {
      // Usagi-ish Long Ears
      return (
        <g>
           {/* Left Ear */}
           <path d="M 130 110 Q 110 0 160 20 Q 180 80 170 110" fill="white" stroke="#422006" strokeWidth="6" />
           {/* Right Ear */}
           <path d="M 270 110 Q 290 0 240 20 Q 220 80 230 110" fill="white" stroke="#422006" strokeWidth="6" />
           
           {/* Inner Ear Color */}
           <path d="M 135 100 Q 125 30 155 40" fill="none" stroke={colors.light} strokeWidth="15" strokeLinecap="round" />
           <path d="M 265 100 Q 275 30 245 40" fill="none" stroke={colors.light} strokeWidth="15" strokeLinecap="round" />
        </g>
      );
    }
    // Bear (Default Chiikawa) - Small Round Ears
    return (
      <g>
        <circle cx="110" cy="110" r="35" fill="white" stroke="#422006" strokeWidth="6" />
        <circle cx="290" cy="110" r="35" fill="white" stroke="#422006" strokeWidth="6" />
        {/* Inner Ear pinkish */}
        <circle cx="110" cy="110" r="15" fill="#fecdd3" opacity="0.6" />
        <circle cx="290" cy="110" r="15" fill="#fecdd3" opacity="0.6" />
      </g>
    );
  };

  // 2. Body Shape (Squishy Blob)
  const Body = () => (
    <path 
      d="M 130 100 
         C 130 80, 270 80, 270 100 
         L 270 120
         C 300 120, 340 160, 340 240
         C 340 340, 300 360, 200 360
         C 100 360, 60 340, 60 240
         C 60 160, 100 120, 130 120 Z" 
      fill="white" 
      stroke="#422006" 
      strokeWidth="6"
    />
  );

  // 3. Face Expressions
  const Face = () => {
    // Cheeks
    const Cheeks = () => (
      <>
        <ellipse cx="120" cy="240" rx="20" ry="12" fill="#fca5a5" opacity="0.6" />
        <ellipse cx="280" cy="240" rx="20" ry="12" fill="#fca5a5" opacity="0.6" />
        {/* Cheek Scratch marks */}
        <path d="M 110 235 L 120 245 M 115 235 L 125 245" stroke="#f472b6" strokeWidth="2" />
        <path d="M 275 235 L 285 245 M 280 235 L 290 245" stroke="#f472b6" strokeWidth="2" />
      </>
    );

    // Eyes
    let EyeLeft, EyeRight;
    
    if (state === PetState.HAPPY) {
      // ^ ^ Eyes
      EyeLeft = <path d="M 140 200 L 155 185 L 170 200" fill="none" stroke="#422006" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />;
      EyeRight = <path d="M 230 200 L 245 185 L 260 200" fill="none" stroke="#422006" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />;
    } else if (state === PetState.CRYING || state === PetState.WORRIED) {
      // T_T Eyes or Wavy tears
      EyeLeft = (
        <g>
          <circle cx="155" cy="200" r="8" fill="#422006" />
          <path d="M 145 210 Q 155 240 165 210" fill="#38bdf8" opacity="0.8" />
        </g>
      );
      EyeRight = (
         <g>
          <circle cx="245" cy="200" r="8" fill="#422006" />
          <path d="M 235 210 Q 245 240 255 210" fill="#38bdf8" opacity="0.8" />
        </g>
      );
    } else if (state === PetState.SLEEPING) {
      // - - Eyes
      EyeLeft = <line x1="140" y1="200" x2="170" y2="200" stroke="#422006" strokeWidth="6" strokeLinecap="round" />;
      EyeRight = <line x1="230" y1="200" x2="260" y2="200" stroke="#422006" strokeWidth="6" strokeLinecap="round" />;
    } else {
      // Standard Dot Eyes
      EyeLeft = <circle cx="155" cy="200" r="10" fill="#422006" />;
      EyeRight = <circle cx="245" cy="200" r="10" fill="#422006" />;
    }

    // Mouth
    let Mouth;
    if (state === PetState.HAPPY || state === PetState.IDLE) {
      // 'w' mouth
      Mouth = <path d="M 180 230 Q 190 240 200 230 Q 210 240 220 230" fill="none" stroke="#422006" strokeWidth="5" strokeLinecap="round" />;
    } else if (state === PetState.THINKING) {
      // Small 'o' mouth
      Mouth = <circle cx="200" cy="240" r="5" fill="#422006" />;
    } else if (state === PetState.WORRIED || state === PetState.CRYING) {
      // Wavy mouth
      Mouth = <path d="M 185 240 Q 200 230 215 240" fill="none" stroke="#422006" strokeWidth="5" strokeLinecap="round" />;
    }

    return (
      <g>
        <Cheeks />
        {EyeLeft}
        {EyeRight}
        {Mouth}
      </g>
    );
  };

  // 4. Arms & Legs
  const Limbs = () => (
    <g>
      {/* Arms - Nubby */}
      <path d="M 80 240 Q 50 260 80 280" fill="white" stroke="#422006" strokeWidth="6" />
      <path d="M 320 240 Q 350 260 320 280" fill="white" stroke="#422006" strokeWidth="6" />
      
      {/* Legs - Nubby */}
      <path d="M 160 350 L 160 370 Q 170 380 180 370 L 180 350" fill="white" stroke="#422006" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 220 350 L 220 370 Q 230 380 240 370 L 240 350" fill="white" stroke="#422006" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );

  // 5. Outfit / Accessories
  const Clothes = () => {
    if (appearance.outfit === 'pajama') {
      return (
        <g>
           {/* Pajama Suit Overlay - clipping to body shape roughly or just overlaying */}
           <path 
              d="M 100 200 Q 200 220 300 200 L 320 300 Q 300 350 200 350 Q 100 350 80 300 Z" 
              fill={colors.light} stroke="#422006" strokeWidth="4" 
           />
           {/* Polka Dots */}
           <circle cx="150" cy="250" r="8" fill="white" opacity="0.7" />
           <circle cx="250" cy="250" r="8" fill="white" opacity="0.7" />
           <circle cx="200" cy="300" r="8" fill="white" opacity="0.7" />
           
           {/* Night Cap */}
           <path d="M 150 100 Q 100 80 80 150" fill={colors.light} stroke="#422006" strokeWidth="5" />
           <circle cx="80" cy="150" r="12" fill="white" stroke="#422006" strokeWidth="4" />
        </g>
      );
    }
    if (appearance.outfit === 'hero') {
      return (
        <g>
           {/* Cape */}
           <path d="M 120 240 Q 60 300 50 380 L 350 380 Q 340 300 280 240" fill={colors.main} stroke="#422006" strokeWidth="4" opacity="0.8" />
           {/* Sasumata Weapon (Held in hand) */}
           <g transform="translate(280, 220) rotate(-20)">
             <rect x="0" y="0" width="10" height="100" fill="#e2e8f0" stroke="#422006" strokeWidth="3" rx="5" />
             <path d="M -15 0 Q 5 20 25 0" fill="none" stroke="#f472b6" strokeWidth="8" strokeLinecap="round" />
           </g>
        </g>
      );
    }
    // Everyday - Pouch
    return (
      <g>
         {/* Strap */}
         <path d="M 120 200 L 280 320" stroke="#422006" strokeWidth="5" />
         {/* Pouch */}
         <circle cx="260" cy="300" r="25" fill={colors.main} stroke="#422006" strokeWidth="4" />
         {/* Button */}
         <circle cx="260" cy="295" r="5" fill="white" />
      </g>
    );
  };

  return (
    <div className={`relative w-80 h-80 flex items-center justify-center transition-all duration-500`}>
      <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible drop-shadow-xl">
        {/* Shadow blob at bottom */}
        <ellipse cx="200" cy="370" rx="100" ry="15" fill="#000" opacity="0.1" className="animate-pulse-soft" />

        {/* Character Group */}
        <g className={`${state === PetState.HAPPY ? 'animate-bounce-fast' : 'animate-bounce-slow'} origin-bottom`}>
          <Ears />
          <Body />
          <Limbs />
          <Face />
          <Clothes />
        </g>

        {/* Floating Emotes */}
        {state === PetState.HAPPY && (
           <g className="animate-float">
             <text x="320" y="100" fontSize="40">🎵</text>
             <text x="50" y="150" fontSize="40">✨</text>
           </g>
        )}
        {state === PetState.THINKING && (
           <g className="animate-pulse">
             <text x="300" y="120" fontSize="50">💭</text>
             <text x="325" y="125" fontSize="30" fill="#422006">...</text>
           </g>
        )}
        {state === PetState.CRYING && (
           <g className="animate-float">
             <text x="80" y="100" fontSize="40">💦</text>
           </g>
        )}
      </svg>
    </div>
  );
};

export default PetAvatar;