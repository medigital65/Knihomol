
import React, { useState, useRef, useEffect } from 'react';
import { MediaData, ChatMessage } from '../types';
import { createChatSession } from '../services/geminiService';
import { SendIcon, ArrowLeftIcon } from './Icons';
import { Chat, GenerateContentResponse } from "@google/genai";

interface ChatInterfaceProps {
  mediaData: MediaData;
  customSystemInstruction?: string;
  onBack: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ mediaData, customSystemInstruction, onBack }) => {
  const typeLabel = mediaData.type === 'Film' ? 'filmu' : 'knize';
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Ahoj! Jsem připraven odpovídat na otázky o ${typeLabel} "${mediaData.title}". Co tě zajímá?`, timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Use a ref to persist the chat session instance across renders
  const chatSessionRef = useRef<Chat | null>(null);

  useEffect(() => {
    // Initialize chat session on mount or if mediaData changes (which essentially implies a new session context)
    // Note: We don't recreate session just because customSystemInstruction changes mid-chat, only on init.
    if (!chatSessionRef.current) {
        chatSessionRef.current = createChatSession(mediaData, customSystemInstruction);
    }
    scrollToBottom();
  }, [mediaData]); // Removed customSystemInstruction dependency to avoid resetting chat mid-session if props update

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || !chatSessionRef.current) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const result: GenerateContentResponse = await chatSessionRef.current.sendMessage({
          message: userMsg.text
      });
      
      const responseText = result.text || "Omlouvám se, nerozuměl jsem.";

      setMessages(prev => [...prev, {
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: "Došlo k chybě při komunikaci. Zkuste to prosím znovu.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-indigo-600 p-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
             <button 
                onClick={onBack}
                className="p-2 text-indigo-100 hover:text-white bg-white/10 rounded-full hover:bg-white/20 transition flex items-center gap-1"
                title="Zpět na detaily"
            >
                <ArrowLeftIcon className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">Zpět</span>
            </button>
            <div className="text-white border-l border-white/20 pl-3">
              <h3 className="font-bold text-lg leading-tight truncate max-w-[200px]">{mediaData.title}</h3>
              <p className="text-xs opacity-80">{mediaData.author}</p>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Zeptejte se na něco..."
            className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
