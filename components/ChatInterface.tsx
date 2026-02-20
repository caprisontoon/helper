import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

interface ChatInterfaceProps {
  onNavigate: (menuName: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: '안녕하세요! 투네이션 크리에이터 헬퍼입니다. 👋\n투네이션 설정이나 기능에 대해 궁금한 점이 있으신가요? 무엇이든 물어보세요!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for API
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const responseText = await sendMessageToGemini(input, history);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
        console.error(error);
        // Error is handled in service, but we could add a toast here.
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessageContent = (text: string) => {
    // Regex to match [다이렉트 이동: 메뉴명]
    const parts = text.split(/\[다이렉트 이동: (.*?)\]/g);
    
    return parts.map((part, index) => {
      // Even indices are text, odd indices are the captured group (menu name)
      if (index % 2 === 0) {
        // Simple newline to <br> for basic formatting
        return <span key={index} className="whitespace-pre-wrap">{part}</span>;
      } else {
        return (
          <button
            key={index}
            onClick={() => onNavigate(part)}
            className="inline-flex items-center gap-1 bg-toonation-primary text-black px-3 py-1 rounded-full text-sm font-bold hover:bg-toonation-primaryHover transition-colors my-1 mx-1 shadow-md transform hover:-translate-y-0.5"
          >
            🚀 {part} 이동하기
          </button>
        );
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-toonation-darker relative">
        {/* Header */}
        <div className="p-4 border-b border-toonation-card bg-toonation-dark flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-toonation-primary flex items-center justify-center text-black font-bold text-xl">
                    AI
                </div>
                <div>
                    <h2 className="font-bold text-lg">Toonation Helper</h2>
                    <p className="text-xs text-toonation-primary">Online • Gemini Powered</p>
                </div>
            </div>
        </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-sm
                ${msg.role === 'user' 
                  ? 'bg-toonation-primary text-black rounded-tr-none' 
                  : 'bg-toonation-card text-gray-100 rounded-tl-none border border-gray-700'}
              `}
            >
              <div className="text-sm md:text-base leading-relaxed">
                {renderMessageContent(msg.text)}
              </div>
              <div className={`text-[10px] mt-2 opacity-70 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-toonation-card p-4 rounded-2xl rounded-tl-none border border-gray-700 flex items-center gap-2">
              <div className="w-2 h-2 bg-toonation-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-toonation-primary rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-toonation-primary rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-toonation-dark border-t border-toonation-card">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="투네이션 설정에 대해 물어보세요..."
            className="flex-1 bg-toonation-card text-white border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-toonation-primary focus:outline-none placeholder-gray-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-toonation-primary text-black font-bold p-3 rounded-xl hover:bg-toonation-primaryHover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
        <p className="text-center text-xs text-gray-500 mt-2">
            AI는 실수를 할 수 있습니다. 중요한 설정은 가이드를 확인하세요.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;