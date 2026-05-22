"use client";

import React, { useState, useRef } from "react";

export default function ChatPanel() {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: React.ReactNode}[]>([
    {
      role: 'ai',
      content: <p>Welcome to Nexus Graph. How can I assist you with your financial research today?</p>
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: <p>{inputValue}</p> }]);
    const query = inputValue;
    setInputValue("");
    setIsGenerating(true);

    // Simulate AI response delay
    setTimeout(() => {
      setIsGenerating(false);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: (
          <div className="generated-memo" ref={pdfRef}>
            <div className="memo-header">
              <h3>RESEARCH MEMO</h3>
              <p>Author: AI Analyst</p>
              <p>Date: {new Date().toLocaleDateString()}</p>
            </div>
            <h4>Subject: {query}</h4>
            <div className="memo-body">
              <p><strong>Context:</strong> The market has recently seen significant rotation out of software. We are initiating coverage to analyze potential impacts on the specified asset class.</p>
              <p><strong>Thesis Tracker:</strong></p>
              <ul>
                <li>Margin expansion potential over 12 months.</li>
                <li>Competitive positioning via Scarcity framework.</li>
                <li>Capital cycle phase indication.</li>
              </ul>
              <p><strong>Recommendation:</strong> Based on the data synthesized from our graph, we maintain a positive outlook with strict entry condition monitoring.</p>
            </div>
            
            <button className="download-btn" onClick={generatePDF}>
              Download as PDF
            </button>
          </div>
        )
      }]);
    }, 2000);
  };

  const generatePDF = async () => {
    // Dynamically import html2pdf to prevent Next.js SSR errors
    const html2pdf = (await import('html2pdf.js')).default;
    
    if (pdfRef.current) {
      // Temporarily hide the download button from the PDF
      const btn = pdfRef.current.querySelector('.download-btn') as HTMLElement;
      if (btn) btn.style.display = 'none';

      const opt = {
        margin:       1,
        filename:     'Nexus_Graph_Memo.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      } as const;

      await html2pdf().set(opt).from(pdfRef.current).save();

      // Restore button
      if (btn) btn.style.display = 'block';
    }
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <h2>Nexus Assistant</h2>
        <span className="status-dot"></span>
      </div>
      
      <div className="chat-history">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-bubble">
              {msg.content}
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="message ai">
            <div className="message-bubble typing">
              Synthesizing data from Knowledge Graph...
            </div>
          </div>
        )}
      </div>

      <div className="chat-input-area">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question or request a memo..."
        />
        <button onClick={handleSend} disabled={isGenerating}>Send</button>
      </div>
    </div>
  );
}
