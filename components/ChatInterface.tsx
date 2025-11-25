import React, { useRef, useEffect } from 'react';
import { Message, Attachment } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  isThinking: boolean;
  onFileSelect: (file: File) => void;
  selectedFile: Attachment | null;
  clearFile: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  input, 
  setInput, 
  onSend, 
  isThinking,
  onFileSelect,
  selectedFile,
  clearFile
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
    // Reset input value so same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-[2rem] border-4 border-white shadow-[0_8px_30px_rgb(0,0,0,0.05)] overflow-hidden ring-4 ring-pinkSoft">
      {/* Header */}
      <div className="bg-pinkSoft p-4 border-b-2 border-white flex items-center justify-center space-x-2 relative">
        {/* Stitching effect */}
        <div className="absolute bottom-[-2px] left-0 w-full border-b-2 border-dashed border-white/50"></div>
        
        <span className="text-2xl">💬</span>
        <span className="font-bold text-lg text-textMain tracking-wide font-sans">Chat Log</span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-blueSoft/30 relative">
         {/* Notebook lines background */}
         <div className="absolute inset-0 pointer-events-none opacity-10" 
              style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 2rem' }}>
         </div>

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-textSub space-y-4 opacity-70">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl shadow-sm">
              📝
            </div>
            <p className="text-lg font-bold text-textMain">Say something nice!</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-3xl px-6 py-4 text-sm font-medium shadow-sm transition-all relative ${
                msg.role === 'user' 
                  ? 'bg-secondary text-white rounded-br-none' 
                  : 'bg-white text-textMain border-2 border-gray-100 rounded-bl-none'
              }`}
            >
              {/* Attachments Display in History */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mb-3">
                  {msg.attachments.map((att, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden mb-2 border-2 border-white/20">
                      {att.mimeType.startsWith('image/') ? (
                        <img src={att.data} alt="attachment" className="max-w-full h-auto max-h-40 object-cover" />
                      ) : (
                        <div className="bg-black/10 p-3 flex items-center gap-2 text-xs">
                          <span>📄</span>
                          <span className="truncate max-w-[150px]">{att.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {msg.text}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex justify-start">
             <div className="bg-white border-2 border-gray-100 rounded-3xl rounded-bl-none px-5 py-4 flex space-x-2 items-center shadow-sm">
               <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-75"></div>
               <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t-2 border-gray-100">
        {/* File Preview */}
        {selectedFile && (
          <div className="flex items-center gap-3 mb-3 bg-blueSoft p-2 rounded-2xl border-2 border-white shadow-sm w-fit">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden">
               {selectedFile.mimeType.startsWith('image/') ? (
                 <img src={selectedFile.data} alt="preview" className="w-full h-full object-cover" />
               ) : (
                 <span className="text-xl">📄</span>
               )}
            </div>
            <div className="text-xs font-bold text-textMain max-w-[120px] truncate">
              {selectedFile.name}
            </div>
            <button 
              onClick={clearFile}
              className="w-6 h-6 bg-red-400 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex space-x-2 relative">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/png, image/jpeg, image/webp, image/heic, image/heif, application/pdf"
          />
          
          <button 
            onClick={triggerFileSelect}
            className="bg-gray-100 hover:bg-gray-200 text-textSub w-12 h-12 rounded-full transition-all flex items-center justify-center"
            title="Attach image or PDF"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 6.182l-10.543 10.543c-.331.331-.781.52-1.25.52H6.75c-.69 0-1.372-.12-2.008-.344" />
            </svg>
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isThinking}
            placeholder="Ask me anything..."
            className="flex-1 bg-gray-50 text-textMain rounded-full px-5 py-3 focus:outline-none focus:ring-4 focus:ring-secondary/20 text-sm border-2 border-gray-100 placeholder-gray-400 transition-all font-bold"
          />
          <button
            onClick={onSend}
            disabled={(!input.trim() && !selectedFile) || isThinking}
            className="bg-primary hover:bg-rose-500 text-white w-12 h-12 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-primary/30 transform active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;