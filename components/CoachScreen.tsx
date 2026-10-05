import React, { useState, useRef, useEffect } from 'react';
import { AnalysisResult, CoachMessage, Language } from '../types';
import { translations } from '../services/i18n';
import { askCoach } from '../services/aiAnalysisService';

interface CoachScreenProps {
  lang: Language;
  latestAnalysis?: AnalysisResult | null;
  initialTopic?: string;
}

export const CoachScreen: React.FC<CoachScreenProps> = ({
  lang,
  latestAnalysis,
  initialTopic,
}) => {
  const t = translations[lang];
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: 'init_1',
      sender: 'coach',
      text: t.coachWelcome,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionChips = [
    t.chipPrompt1,
    t.chipPrompt2,
    t.chipPrompt3,
    t.chipPrompt4,
    t.chipPrompt5,
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialTopic) {
      handleSendMessage(`Can you give me deeper advice on "${initialTopic}" based on my latest scan?`);
    }
  }, [initialTopic]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: CoachMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await askCoach(textToSend, messages, latestAnalysis);
      const coachMsg: CoachMessage = {
        id: `coach_${Date.now()}`,
        sender: 'coach',
        text: reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, coachMsg]);
    } catch (e) {
      const errorMsg: CoachMessage = {
        id: `coach_err_${Date.now()}`,
        sender: 'coach',
        text: "I'm always here to help you refine your grooming, hairstyle, and habits. Let's tackle one specific area today!",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto h-[calc(100vh-130px)] flex flex-col justify-between text-white animate-fade-in px-4">
      {/* Coach Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 mb-3 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center font-black text-sm text-slate-950 shadow-md shadow-cyan-500/20">
            BP
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white">{t.coachTitle}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
              {latestAnalysis ? `Context: ${latestAnalysis.faceProfile.faceShape} Face` : 'Personal Aesthetics Advisor'}
            </p>
          </div>
        </div>

        {latestAnalysis && (
          <span className="text-[11px] font-mono text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            Scan Linked
          </span>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1 no-scrollbar">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-br-2xs'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-2xs'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <span className="block text-[9px] text-slate-400 mt-1.5 text-right font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing Animation */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-xs text-cyan-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="text-slate-400">BP Coach is analyzing recommendations...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Prompt Chips */}
      <div className="py-2 shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {suggestionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-slate-300 font-medium whitespace-nowrap transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="pt-1 pb-2 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-2xl p-1.5 focus-within:border-cyan-500/60 transition-colors"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.coachInputPlaceholder}
            className="flex-1 bg-transparent px-3 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 font-bold flex items-center justify-center transition-colors disabled:text-slate-600"
          >
            ↑
          </button>
        </form>
      </div>
    </div>
  );
};
