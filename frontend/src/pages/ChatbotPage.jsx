import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Bot, Loader2, Send } from 'lucide-react';
import { chatbotService } from '../services/chatbotService.js';

export default function ChatbotPage({ language }) {
  const [message, setMessage] = useState('');
  const [thread, setThread] = useState([
    { role: 'bot', text: language === 'sw' ? 'Eleza tatizo lako la mtandao.' : 'Describe the cybercrime concern.' }
  ]);
  const [loading, setLoading] = useState(false);
  const [escalation, setEscalation] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  const ask = async () => {
    const text = message.trim();
    if (!text || loading) return;
    setMessage('');
    setThread((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);
    setEscalation(false);
    try {
      const answer = await chatbotService.query(text, language);
      setThread((prev) => [...prev, { role: 'bot', text: answer.reply }]);
      if (answer.escalationRecommended) setEscalation(true);
    } catch {
      const err = language === 'sw'
        ? 'Samahani, huduma haipatikani sasa hivi. Tafadhali jaribu tena.'
        : 'Sorry, the guidance service is unavailable right now. Please try again.';
      setThread((prev) => [...prev, { role: 'bot', text: err }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page narrow">
      <div className="sectionHeader">
        <span className="eyebrow">Fraud guidance</span>
        <h1>Rule-based chatbot</h1>
      </div>

      {escalation && (
        <div className="escalationBanner">
          <AlertTriangle size={20} />
          <div>
            <strong>{language === 'sw' ? 'Tatizo hili linahitaji hatua za haraka' : 'This situation may require immediate action'}</strong>
            <p>{language === 'sw'
              ? 'Wasiliana na mtoa huduma wako au mamlaka husika mara moja. Tuma ripoti rasmi hapa ili uchunguzi uanze.'
              : 'Contact your service provider or relevant authority immediately. Submit a formal report here to open an investigation.'
            }</p>
          </div>
        </div>
      )}

      <div className="chatPanel">
        {thread.map((item, i) => (
          <div className={`message ${item.role}`} key={`${item.role}-${i}`}>
            {item.role === 'bot' ? <Bot size={18} /> : null}
            <p>{item.text}</p>
          </div>
        ))}
        {loading && (
          <div className="message">
            <Bot size={18} />
            <p className="typingDots"><Loader2 size={16} className="spin" /> {language === 'sw' ? 'Inafikiri…' : 'Thinking…'}</p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chatInput">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && ask()}
          placeholder={language === 'sw' ? 'Andika swali lako…' : 'Describe your concern…'}
          disabled={loading}
        />
        <button className="button primary" onClick={ask} disabled={loading || !message.trim()}>
          {loading ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
          {language === 'sw' ? 'Tuma' : 'Send'}
        </button>
      </div>
    </section>
  );
}
