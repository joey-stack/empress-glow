'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
}

export function AdminAiSidekick() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: `Hello Empress! ✨ I am your **Empress Formulator & Compliance Copilot**.

I can verify NAFDAC claims, check variant stock levels, draft WhatsApp customer consultations, and analyze customer RFM retention tiers.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        '⚖️ Check NAFDAC Copy for Fruity Soap',
        '📦 Which variants have low stock?',
        '💬 Draft WhatsApp Dark Knuckles Consultation',
        '📊 Show Store GMV & Conversion',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Cmd+J or Ctrl+J to toggle drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const handleSend = async (messageToSend?: string) => {
    const text = messageToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const assistantMsg: ChatMessage = {
          id: `ast_${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: data.suggestions,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || 'Failed to process prompt');
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ Error contacting Copilot: ${err.message || 'Please retry in a moment.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* 1. Floating Launch Trigger Pill (Bottom-Right) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-40 bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] border border-[#131010] hover:border-[#2d5508] px-4 py-2.5 shadow-2xl flex items-center gap-2.5 transition-all transform hover:scale-105 group"
      >
        <span className="w-2 h-2 rounded-full bg-[#5a8210] animate-pulse" />
        <span className="font-mono text-xs uppercase tracking-[0.18em] font-semibold">
          ✦ Empress AI Copilot
        </span>
        <span className="font-mono text-[9px] bg-white/10 px-1.5 py-0.5 rounded border border-white/20 text-[#e5dcd0] hidden sm:inline">
          Ctrl+J
        </span>
      </button>

      {/* 2. Slide-Out Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 3. Slide-Out Drawer Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white border-l border-[#e5dcd0] shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 bg-[#faf8f5] border-b border-[#e5dcd0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 bg-[#5a8210] rounded-full animate-pulse" />
            <div>
              <h3 className="font-serif text-base text-[#131010] font-normal leading-tight">
                Empress AI Formulator &amp; Copilot
              </h3>
              <p className="font-mono text-[10px] text-[#7b7366] uppercase tracking-wider">
                Regulatory NAFDAC, Inventory &amp; Consultation Intelligence
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center text-[#7b7366] hover:text-[#131010] hover:bg-[#e5dcd0]/40 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="flex items-center gap-2 px-1">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#7b7366]">
                    {isUser ? 'You' : '✦ Copilot'}
                  </span>
                  <span className="font-mono text-[9px] text-[#7b7366]">
                    {msg.timestamp}
                  </span>
                </div>

                <div
                  className={`p-3.5 max-w-[92%] rounded-sm text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#131010] text-[#f7f1e8] font-sans'
                      : 'bg-[#faf8f5] border border-[#e5dcd0] text-[#131010] font-sans shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {!isUser && (
                    <div className="mt-2.5 pt-2 border-t border-[#e5dcd0]/60 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="font-mono text-[10px] uppercase tracking-wider text-[#2d5508] hover:underline flex items-center gap-1 font-semibold"
                      >
                        {copiedId === msg.id ? '✓ Copied' : '⧉ Copy Response'}
                      </button>
                      <span className="font-mono text-[9px] text-[#7b7366]">
                        Empress Guard v1.0
                      </span>
                    </div>
                  )}
                </div>

                {/* Follow-up suggestion pills */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 pt-1 max-w-[92%]">
                    {msg.suggestions.map((sugg, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSend(sugg)}
                        className="text-[10px] font-mono px-2.5 py-1 bg-[#faf6f0] hover:bg-[#e5dcd0] text-[#131010] border border-[#e5dcd0] transition-colors text-left"
                      >
                        {sugg}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#7b7366] font-mono p-3 bg-[#faf8f5] border border-[#e5dcd0] max-w-[80%]">
              <span className="animate-spin text-sm">✦</span>
              Analyzing botanical catalog &amp; regulatory guidelines...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#faf8f5] border-t border-[#e5dcd0]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask Copilot, check NAFDAC claims, draft replies..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={loading}
              className="flex-1 px-3 py-2.5 bg-white border border-[#e5dcd0] text-xs text-[#131010] placeholder:text-[#7b7366] focus:outline-none focus:border-[#2d5508]"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="px-4 py-2.5 bg-[#131010] hover:bg-[#2d5508] disabled:bg-[#7b7366] text-white font-mono text-xs uppercase tracking-wider transition-colors"
            >
              Send
            </button>
          </form>
          <div className="flex items-center justify-between mt-2 font-mono text-[9px] text-[#7b7366]">
            <span>Press Enter to send</span>
            <span>NAFDAC Act Cap N1 LFN 2004 Compliant</span>
          </div>
        </div>
      </div>
    </>
  );
}
