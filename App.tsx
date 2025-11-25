import React, { useState, useEffect, useCallback } from 'react';
import { UserMode, PetState, Message, UserStats, PetAppearance, Species, Outfit, ColorTheme, Attachment } from './types';
import PetAvatar from './components/PetAvatar';
import ChatInterface from './components/ChatInterface';
import StatsPanel from './components/StatsPanel';
import { sendMessageToGemini } from './services/geminiService';

const App: React.FC = () => {
  // --- State ---
  const [mode, setMode] = useState<UserMode>(UserMode.STUDENT);
  const [petState, setPetState] = useState<PetState>(PetState.IDLE);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init-1', role: 'model', text: 'Hello friend! I am so happy to see you! (◕‿◕)', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [selectedFile, setSelectedFile] = useState<Attachment | null>(null);
  
  // Customization
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [petAppearance, setPetAppearance] = useState<PetAppearance>({
    name: 'Chiichan',
    species: 'bear',
    outfit: 'everyday',
    primaryColor: 'pink'
  });
  
  const [stats, setStats] = useState<UserStats>({
    intimacy: 30,
    level: 3,
    sessionTimeMinutes: 0,
    healthScore: 100
  });

  const [notification, setNotification] = useState<string | null>(null);

  // --- Logic ---

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => {
        const newTime = prev.sessionTimeMinutes + 1;
        let newHealth = prev.healthScore;
        
        // Health check
        if (newTime % 45 === 0 && newTime > 0) {
           newHealth = Math.max(0, newHealth - 10);
           setNotification("Time to stretch! Let's wiggle! 🎵");
           setPetState(PetState.WORRIED);
           setTimeout(() => setPetState(PetState.IDLE), 5000);
        }

        return {
          ...prev,
          sessionTimeMinutes: newTime,
          healthScore: newHealth,
          intimacy: Math.min(100, prev.intimacy)
        };
      });
    }, 60000); 

    return () => clearInterval(timer);
  }, []);

  const handleModeChange = (newMode: UserMode) => {
    setMode(newMode);
    const systemMsg: Message = {
      id: Date.now().toString(),
      role: 'model',
      text: `Let's switch to ${newMode} Mode! I'll do my best! ✨`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemMsg]);
  };

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setSelectedFile({
          mimeType: file.type,
          data: e.target.result as string,
          name: file.name
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim() && !selectedFile) return;

    const currentAttachments = selectedFile ? [selectedFile] : undefined;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date(),
      attachments: currentAttachments
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setSelectedFile(null); // Clear file after sending
    setIsThinking(true);
    setPetState(PetState.THINKING);

    const responseText = await sendMessageToGemini(messages, inputText, mode, currentAttachments);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsThinking(false);
    setPetState(PetState.HAPPY);
    
    setStats(prev => ({
        ...prev,
        intimacy: Math.min(100, prev.intimacy + 2),
        level: Math.floor((prev.intimacy + 2) / 20) + 1
    }));

    setTimeout(() => {
      setPetState(PetState.IDLE);
    }, 4000);

  }, [inputText, messages, mode, selectedFile]);

  // --- Render ---

  return (
    <div className="min-h-screen bg-background text-textMain flex flex-col md:flex-row overflow-hidden relative font-sans selection:bg-pink-200">
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         {/* Cute Clouds */}
         <div className="absolute top-10 right-20 text-6xl opacity-20 animate-float">☁️</div>
         <div className="absolute top-40 left-10 text-6xl opacity-20 animate-float" style={{animationDelay: '1s'}}>☁️</div>
         <div className="absolute bottom-20 right-40 text-6xl opacity-20 animate-float" style={{animationDelay: '2s'}}>☁️</div>
         
         {/* Polka Dot Pattern */}
         <div className="absolute inset-0 opacity-[0.4]" 
              style={{ backgroundImage: 'radial-gradient(#fecdd3 2px, transparent 2px)', backgroundSize: '30px 30px' }}>
         </div>
      </div>

      {/* Notification Bubble */}
      {notification && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white border-2 border-primary text-textMain px-6 py-4 rounded-3xl shadow-[0_10px_20px_rgba(251,113,133,0.3)] z-50 animate-bounce-gentle flex items-center gap-3">
            <span className="text-2xl">⏰</span>
            <div className="flex flex-col">
               <span className="text-xs font-black text-primary uppercase tracking-wider">Reminder</span>
               <span className="font-bold text-sm">{notification}</span>
            </div>
            <button onClick={() => setNotification(null)} className="ml-4 text-gray-400 hover:text-primary font-bold bg-gray-50 w-6 h-6 rounded-full flex items-center justify-center">✕</button>
        </div>
      )}

      {/* Customization Modal */}
      {isCustomizing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 w-full max-w-md border-4 border-white ring-4 ring-secondary/30 animate-bounce-gentle relative overflow-hidden">
             
             {/* Header */}
             <div className="text-center mb-6">
                <h2 className="text-3xl font-black text-textMain mb-1">Dressing Room</h2>
                <p className="text-sm font-bold text-textSub">Make them cute! ✨</p>
             </div>

             {/* Name */}
             <div className="mb-4">
                <label className="block text-xs font-black text-textSub uppercase mb-2 ml-1">Name</label>
                <input 
                  type="text" 
                  value={petAppearance.name}
                  onChange={(e) => setPetAppearance({...petAppearance, name: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-secondary font-bold text-lg text-center text-primary"
                />
             </div>

             {/* Species */}
             <div className="mb-4">
                <label className="block text-xs font-black text-textSub uppercase mb-2 ml-1">Character Type</label>
                <div className="flex gap-2">
                   {(['bear', 'cat', 'rabbit'] as Species[]).map(s => (
                     <button 
                       key={s}
                       onClick={() => setPetAppearance({...petAppearance, species: s})}
                       className={`flex-1 py-3 rounded-xl text-sm font-bold capitalize transition-all border-2 ${
                         petAppearance.species === s 
                           ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/30 transform scale-105' 
                           : 'bg-white text-textSub border-gray-100 hover:bg-gray-50'
                       }`}
                     >
                       {s === 'bear' ? '🐻 Bear' : s === 'cat' ? '🐱 Cat' : '🐰 Bun'}
                     </button>
                   ))}
                </div>
             </div>

             {/* Outfit */}
             <div className="mb-4">
                <label className="block text-xs font-black text-textSub uppercase mb-2 ml-1">Outfit</label>
                <div className="flex gap-2">
                   {(['everyday', 'pajama', 'hero'] as Outfit[]).map(o => (
                     <button 
                       key={o}
                       onClick={() => setPetAppearance({...petAppearance, outfit: o})}
                       className={`flex-1 py-3 rounded-xl text-xs font-bold capitalize transition-all border-2 ${
                         petAppearance.outfit === o 
                           ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30 transform scale-105' 
                           : 'bg-white text-textSub border-gray-100 hover:bg-gray-50'
                       }`}
                     >
                       {o}
                     </button>
                   ))}
                </div>
             </div>

             {/* Color */}
             <div className="mb-8">
                <label className="block text-xs font-black text-textSub uppercase mb-2 ml-1">Favorite Color</label>
                <div className="flex gap-3 justify-center">
                   {(['pink', 'blue', 'yellow', 'purple'] as ColorTheme[]).map(c => (
                     <button 
                       key={c}
                       onClick={() => setPetAppearance({...petAppearance, primaryColor: c})}
                       className={`w-12 h-12 rounded-full border-4 transition-all hover:scale-110 ${
                         petAppearance.primaryColor === c ? 'border-textMain scale-110 shadow-xl' : 'border-white shadow-md'
                       }`}
                       style={{ backgroundColor: 
                          c === 'pink' ? '#fb7185' : 
                          c === 'blue' ? '#38bdf8' : 
                          c === 'yellow' ? '#facc15' : '#c084fc' 
                       }}
                     />
                   ))}
                </div>
             </div>

             <button 
               onClick={() => setIsCustomizing(false)}
               className="w-full bg-textMain text-white font-black py-4 rounded-2xl hover:bg-black transition-all text-lg shadow-xl"
             >
               Finished!
             </button>
          </div>
        </div>
      )}

      {/* Sidebar (Left) */}
      <div className="w-full md:w-80 bg-white/60 backdrop-blur-md p-6 flex flex-col gap-6 z-10 border-r-2 border-white/50 h-full overflow-y-auto relative shadow-sm">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
           <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl shadow-lg rotate-3 transform">
             🐾
           </div>
           <div>
              <h1 className="text-2xl font-black text-textMain tracking-tight">Nexus</h1>
              <div className="text-xs font-bold bg-secondary text-white px-2 py-0.5 rounded-full inline-block">VPet Ver 2.0</div>
           </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-4 border-2 border-gray-50 shadow-sm flex flex-col gap-3 group hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
               <div className="font-black text-lg text-textMain">{petAppearance.name}</div>
               <button 
                 onClick={() => setIsCustomizing(true)}
                 className="w-10 h-10 flex items-center justify-center bg-blueSoft rounded-full text-secondary hover:bg-secondary hover:text-white transition-all font-bold"
               >
                 ✎
               </button>
            </div>
            <div className="flex gap-2 text-xs font-bold text-textSub uppercase">
               <span className="bg-gray-100 px-2 py-1 rounded-lg">Lv. {stats.level}</span>
               <span className="bg-gray-100 px-2 py-1 rounded-lg">{petAppearance.species}</span>
            </div>
        </div>

        {/* Mode Toggles */}
        <div className="space-y-3">
          <label className="text-xs font-black text-textSub uppercase tracking-widest pl-1">Current Mood</label>
          <div className="grid grid-cols-1 gap-3">
            {[
               { m: UserMode.STUDENT, icon: '📚', label: 'Study Time', color: 'bg-blue-100 text-blue-600' },
               { m: UserMode.WORK, icon: '💼', label: 'Work Focus', color: 'bg-green-100 text-green-600' },
               { m: UserMode.LEISURE, icon: '🎮', label: 'Play Time', color: 'bg-pink-100 text-pink-600' }
            ].map((item) => (
              <button
                key={item.m}
                onClick={() => handleModeChange(item.m)}
                className={`px-4 py-4 rounded-2xl flex items-center gap-3 transition-all border-2 ${
                  mode === item.m 
                    ? 'bg-white border-primary shadow-lg scale-[1.02]' 
                    : 'bg-white/50 border-transparent hover:bg-white hover:scale-[1.01]'
                }`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center ${item.color} text-lg`}>{item.icon}</span>
                <span className="font-bold text-sm text-textMain">{item.label}</span>
                {mode === item.m && <span className="ml-auto text-primary">●</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-auto">
           <StatsPanel stats={stats} />
        </div>
      </div>

      {/* Main Stage */}
      <div className="flex-1 flex flex-col md:flex-row p-4 md:p-8 gap-8 items-center justify-center relative">
         
         {/* The Pet Room */}
         <div className="flex-1 w-full h-full max-h-[700px] relative flex flex-col items-center justify-center">
            
            {/* The Rug */}
            <div className="absolute bottom-[20%] w-64 h-32 bg-pinkSoft rounded-[100%] transform -rotate-2 border-4 border-white border-dashed opacity-80"></div>
            
            {/* The Pet */}
            <div className="relative z-10 transform scale-125 hover:scale-130 transition-transform duration-500 cursor-pointer" onClick={() => {
                setPetState(PetState.HAPPY);
                setTimeout(() => setPetState(PetState.IDLE), 1000);
            }}>
               <PetAvatar state={petState} appearance={petAppearance} />
            </div>

            {/* Shadow */}
            <div className="w-32 h-4 bg-black/10 rounded-full blur-sm mt-[-10px]"></div>

            {/* Floating Room Decor */}
            <div className="absolute top-10 right-10 animate-bounce-slow">
               <div className="bg-white p-3 rounded-2xl shadow-sm rotate-6 border-2 border-gray-50">
                  <span className="text-2xl">🪴</span>
               </div>
            </div>
            
            <div className="absolute top-20 left-20 animate-wiggle">
               <div className="bg-white p-3 rounded-full shadow-sm -rotate-12 border-2 border-gray-50">
                  <span className="text-2xl">⏰</span>
               </div>
            </div>

         </div>

         {/* Chat Panel */}
         <div className="w-full md:w-[450px] h-[50vh] md:h-[85vh] relative z-20">
             <ChatInterface 
               messages={messages} 
               input={inputText} 
               setInput={setInputText} 
               onSend={handleSendMessage}
               isThinking={isThinking}
               onFileSelect={handleFileSelect}
               selectedFile={selectedFile}
               clearFile={() => setSelectedFile(null)}
             />
         </div>
      </div>

    </div>
  );
};

export default App;