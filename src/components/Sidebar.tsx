"use client";

import React, { useState, useRef, useEffect } from "react";
import InlineChart from "./InlineChart";

export default function Sidebar({ 
  activeMemoId, 
  onSelectMemo, 
  assistantType, 
  setAssistantType, 
  designerMessages, 
  financeMessages, 
  onSend,
  memos,
  onLogout,
  activeMobileView
}: any) {
  const [activeTab, setActiveTab] = useState<'chat' | 'files'>('chat');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    "30_Companies": true,
    "Generated": true
  });
  
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const prevMessagesLength = useRef({ designer: 0, finance: 0 });

  // Auto-scroll and toggle typing indicators when message lengths change
  useEffect(() => {
    if (designerMessages.length > prevMessagesLength.current.designer || 
        financeMessages.length > prevMessagesLength.current.finance) {
      setIsTyping(false);
    }
    prevMessagesLength.current = {
      designer: designerMessages.length,
      finance: financeMessages.length
    };
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [designerMessages, financeMessages]);

  // Adjust scroll when typing state or active assistant changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isTyping, assistantType]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const prompt = inputValue;
    setInputValue("");
    setIsTyping(true);
    onSend(prompt);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setIsTyping(true);
    onSend(suggestion);
  };

  const toggleFolder = (name: string) => {
    setExpanded(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const generatedMemos = Object.entries(memos)
    .filter(([id]) => id.startsWith("new_memo"))
    .map(([id, memo]: any) => ({ name: memo.title, type: "file", memoId: id }));

  const vaultStructure = [
    { name: "30_Companies", type: "folder", children: [
      { name: "AAPL_Initiation.docx", type: "file", memoId: "aapl_q3" },
      { name: "MSFT_Earnings.docx", type: "file", memoId: "msft_q1" }
    ]},
    { name: "Generated Research", type: "folder", children: generatedMemos }
  ];

  const renderTree = (nodes: any[], depth = 0) => {
    return nodes.map((node) => {
      if (node.type === 'file' && searchQuery && !node.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return null;
      }
      return (
        <div key={node.name}>
          <div 
            className={`tree-item ${node.type === 'folder' ? 'folder' : 'file'} ${activeMemoId === node.memoId ? 'active' : ''}`}
            style={{ paddingLeft: `${depth * 14 + 16}px` }}
            onClick={() => {
              if (node.type === 'folder') toggleFolder(node.name);
              if (node.type === 'file' && node.memoId) onSelectMemo(node.memoId);
            }}
          >
            {node.type === 'folder' && <span className={`arrow ${expanded[node.name] ? 'open' : ''}`}>▶</span>}
            <span className="name">{node.name}</span>
          </div>
          {node.type === 'folder' && expanded[node.name] && node.children && (
            <div className="folder-children">{renderTree(node.children, depth + 1)}</div>
          )}
        </div>
      );
    });
  };

  const activeMessages = assistantType === 'designer' ? designerMessages : financeMessages;

  const designerSuggestions = [
    "Build initiation memo for Apple (AAPL)",
    "Build earnings update memo for Microsoft (MSFT)",
    "Build conviction memo for Tesla (TSLA) auto margins",
    "Add regulatory risk bullet to active memo",
    "Upgrade active memo rating to Buy",
    "Add valuation sensitivity chart to active memo"
  ];

  const financeSuggestions = [
    "Show Apple services vs hardware revenue",
    "Show Azure YoY growth rate over last 5 quarters",
    "Compare CY2026 growth rates of megacap tech",
    "Generate Apple Inc. Financial Performance Report",
    "Explain EV/NTM Revenue Multiple sensitivity"
  ];

  const suggestions = assistantType === 'designer' ? designerSuggestions : financeSuggestions;

  return (
    <div className={`nexus-sidebar mobile-view-pane ${activeMobileView === 'assistant' ? 'active-mobile-pane' : ''}`}>
      <div className="sidebar-header">
        <div className="vault-name">Nexus<span className="brand-highlight">Finance</span>.AI</div>
        {onLogout && (
          <button className="logout-btn-sidebar" onClick={onLogout} title="Sign Out">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="sidebar-tabs">
        <button className={activeTab === 'chat' ? 'active' : ''} onClick={() => setActiveTab('chat')}>Assistant</button>
        <button className={activeTab === 'files' ? 'active' : ''} onClick={() => setActiveTab('files')}>Files</button>
      </div>

      <div className="sidebar-content">
        {activeTab === 'files' && (
          <div className="files-container">
            <div className="search-bar-container">
              <input 
                type="text" 
                placeholder="Search research..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="sidebar-tree">
              {renderTree(vaultStructure)}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="chat-interface">
            {/* Assistant Selector Toggle */}
            <div className="assistant-toggle-wrapper">
              <div className="assistant-toggle">
                <button 
                  className={assistantType === 'designer' ? 'active' : ''} 
                  onClick={() => setAssistantType('designer')}
                  title="Generate and conversationally edit structured investment memos"
                >
                  <span className="icon">📄</span> Memo Builder
                </button>
                <button 
                  className={assistantType === 'finance' ? 'active' : ''} 
                  onClick={() => setAssistantType('finance')}
                  title="Conversational advisor for detailed explanations & charts"
                >
                  <span className="icon">💬</span> Finance Copilot
                </button>
              </div>
            </div>

            <div className="chat-messages">
              {activeMessages.map((msg: any, idx: number) => (
                <div key={idx} className={`message ${msg.role}`}>
                  <div className="bubble">
                    <div className="message-text whitespace-pre-wrap">{msg.content}</div>
                    {msg.chart && <InlineChart data={msg.chart} />}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="message ai">
                  <div className="bubble typing">
                    {assistantType === 'designer' ? 'Synthesizing research...' : 'Running the numbers...'}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestions Chips */}
            <div className="suggestions-wrapper">
              <div className="suggestions-title">Suggested Queries</div>
              <div className="suggestions-container">
                {suggestions.map((s: string, idx: number) => (
                  <button 
                    key={idx} 
                    className="suggestion-chip" 
                    onClick={() => handleSuggestionClick(s)}
                    disabled={isTyping}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="chat-input">
              <div className="chat-input-wrapper">
                <input 
                  type="text" 
                  placeholder={assistantType === 'designer' ? "Type memo instruction..." : "Ask Copilot a finance query..."} 
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  disabled={isTyping}
                  className="premium-chat-input"
                />
                <button 
                  className="send-btn" 
                  onClick={handleSend} 
                  disabled={isTyping || !inputValue.trim()} 
                  title="Send query"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
