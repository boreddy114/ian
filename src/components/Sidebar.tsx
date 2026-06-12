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
  companies = [],
  skills = [],
  selectedTicker,
  setSelectedTicker,
  selectedSkillId,
  setSelectedSkillId,
  onSelectorChange,
  onLogout,
  activeMobileView,
  webSearchActive,
  setWebSearchActive
}: any) {
  const [activeTab, setActiveTab] = useState<'chat' | 'files' | 'info'>('chat');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    "30_Companies (EquityVault)": true,
    "Generated Research Memos": true
  });
  
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [designerSearch, setDesignerSearch] = useState("");
  const [designerOpen, setDesignerOpen] = useState(false);
  const designerComboRef = useRef<HTMLDivElement>(null);

  const [financeSearch, setFinanceSearch] = useState("");
  const [financeOpen, setFinanceOpen] = useState(false);
  const financeComboRef = useRef<HTMLDivElement>(null);

  // Sync designer search query
  useEffect(() => {
    const current = companies.find((c: any) => c.ticker === selectedTicker);
    if (current) {
      setDesignerSearch(`${current.ticker} - ${current.name}`);
    } else {
      setDesignerSearch(selectedTicker || "");
    }
  }, [selectedTicker, companies]);

  // Sync finance search query
  useEffect(() => {
    const current = companies.find((c: any) => c.ticker === selectedTicker);
    if (current) {
      setFinanceSearch(`${current.ticker} - ${current.name}`);
    } else {
      setFinanceSearch(selectedTicker || "");
    }
  }, [selectedTicker, companies]);

  // Handle click outside for comboboxes
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (designerComboRef.current && !designerComboRef.current.contains(event.target as Node)) {
        setDesignerOpen(false);
        const current = companies.find((c: any) => c.ticker === selectedTicker);
        if (current) setDesignerSearch(`${current.ticker} - ${current.name}`);
      }
      if (financeComboRef.current && !financeComboRef.current.contains(event.target as Node)) {
        setFinanceOpen(false);
        const current = companies.find((c: any) => c.ticker === selectedTicker);
        if (current) setFinanceSearch(`${current.ticker} - ${current.name}`);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedTicker, companies]);

  const filteredDesignerCompanies = companies.filter((c: any) => 
    c.ticker.toLowerCase().includes(designerSearch.toLowerCase()) || 
    c.name.toLowerCase().includes(designerSearch.toLowerCase())
  );

  const filteredFinanceCompanies = companies.filter((c: any) => 
    c.ticker.toLowerCase().includes(financeSearch.toLowerCase()) || 
    c.name.toLowerCase().includes(financeSearch.toLowerCase())
  );

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
    onSend(prompt, webSearchActive);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setIsTyping(true);
    onSend(suggestion, webSearchActive);
  };

  const toggleFolder = (name: string) => {
    setExpanded(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const generatedMemos = Object.entries(memos)
    .filter(([id]) => id.startsWith("new_memo"))
    .map(([id, memo]: any) => ({ name: memo.title, type: "file", memoId: id }));
  const companyFolders = companies.map((company: any) => {
    const children = [];
    if (company.hasCard) {
      children.push({ name: "Company_Card.md", type: "file", memoId: `real_card_${company.ticker}`, ticker: company.ticker, fileType: 'card' });
    }
    if (company.hasLog) {
      children.push({ name: "Thesis_Log.md", type: "file", memoId: `real_log_${company.ticker}`, ticker: company.ticker, fileType: 'log' });
    }
    return {
      name: `${company.ticker} - ${company.name}`,
      type: "folder",
      children
    };
  });
  const vaultStructure = [
    { name: "30_Companies (EquityVault)", type: "folder", children: companyFolders },
    { name: "Generated Research Memos", type: "folder", children: generatedMemos }
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
              if (node.type === 'file' && node.memoId) {
                if (node.ticker && node.fileType) {
                  setSelectedTicker(node.ticker);
                  fetch(`/api/companies?ticker=${node.ticker}&file=${node.fileType}`)
                    .then(res => res.json())
                    .then(data => {
                      if (data.memo) {
                        memos[node.memoId] = data.memo;
                        onSelectMemo(node.memoId);
                      }
                    })
                    .catch(err => console.error("Error fetching card/log content:", err));
                } else {
                  onSelectMemo(node.memoId);
                }
              }
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
    "Search web for SpaceX valuation updates",
    "Deconstruct SpaceX Starlink launch growth & revenue drivers",
    "Compare SpaceX launch costs vs ULA & Blue Origin",
    "Graph SpaceX Starship payload capacity & test flights",
    "Explain SpaceX valuation sensitivity to launch frequency"
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
        <button className={activeTab === 'info' ? 'active' : ''} onClick={() => setActiveTab('info')}>Info</button>
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

        {activeTab === 'info' && (
          <div className="info-container">
            {/* Core Operating System / Agent details */}
            <div className="info-section">
              <div className="info-title">🔍 Vince Analyst Agent</div>
              <div className="info-item">
                <div className="info-item-title">
                  <span className="info-tag">Agent Name</span> Vince
                </div>
                <div className="info-item-desc">
                  An institutional-grade buy-side equity research assistant running via OpenClaw.
                </div>
              </div>
              <div className="info-item">
                <div className="info-item-title">
                  <span className="info-tag">Identity & Soul</span> Direct & Opinionated
                </div>
                <div className="info-item-desc">
                  Vince is programmed (via <code>SOUL.md</code> and <code>IDENTITY.md</code>) to avoid superficial hand-waving, be concise when needed, thorough when it matters, and maintain investment-grade analytical rigor.
                </div>
              </div>
              <div className="info-item">
                <div className="info-item-title">
                  <span className="info-tag">Operating Rules</span> Agent Contract
                </div>
                <div className="info-item-desc">
                  Under <code>AGENTS.md</code>, Vince can only read/write in <code>EquityVault</code>. Destructive operations require explicit user approval and must use macOS <code>trash</code> rather than <code>rm</code>. Updates to investment memos (<code>IC_Memo.md</code>) require a corresponding entry in the <code>Thesis_Log.md</code>.
                </div>
              </div>
            </div>

            {/* Folder Structure mapping */}
            <div className="info-section">
              <div className="info-title">📁 EquityVault Folder Structure</div>
              <div className="info-item">
                <div className="info-item-title">
                  <span className="info-tag folder-tag">00_Templates</span> Standardization
                </div>
                <div className="info-item-desc">
                  Contains company card, memo, and thesis templates to enforce consistent, professional formatting across coverage.
                </div>
              </div>
              <div className="info-item">
                <div className="info-item-title">
                  <span className="info-tag folder-tag">20_Library</span> Research Assets
                </div>
                <div className="info-item-desc">
                  Repository for raw files, external studies, earnings call transcripts, and expert network reference PDFs.
                </div>
              </div>
              <div className="info-item">
                <div className="info-item-title">
                  <span className="info-tag folder-tag">30_Companies</span> Per-Ticker Coverage
                </div>
                <div className="info-item-desc">
                  The primary workspace where per-ticker research lives, including <code>Company_Card.md</code> (firm metrics) and <code>Thesis_Log.md</code> (incremental belief deltas).
                </div>
              </div>
              <div className="info-item">
                <div className="info-item-title">
                  <span className="info-tag folder-tag">40_Themes</span> Thesis Synthesis
                </div>
                <div className="info-item-desc">
                  Synthesis layers for cross-company research (e.g. AI themes, SaaS metrics, and macro capital cycles).
                </div>
              </div>
              <div className="info-item">
                <div className="info-item-title">
                  <span className="info-tag folder-tag">70_Conversations</span> Session Audits
                </div>
                <div className="info-item-desc">
                  Logs structured end-of-session summaries tracking decisions, belief adjustments, and follow-ups.
                </div>
              </div>
            </div>

            {/* Research Skills mapping */}
            <div className="info-section">
              <div className="info-title">⚡ Analyst Research Skills</div>
              <div className="info-item">
                <div className="info-item-title">
                  <span className="info-tag file-tag">catalini-moat-screen</span>
                </div>
                <div className="info-item-desc">
                  The central orchestrator that guides full classical vs. agentic moat scoring, tier placement, and pricing gap analysis.
                </div>
              </div>
              <div className="info-item">
                <div className="info-item-title">
                  <span className="info-tag file-tag">moat-pressure-test</span>
                </div>
                <div className="info-item-desc">
                  Pressure tests moat scores against expert transcript evidence from tools like AlphaSense to identify bias or blind spots.
                </div>
              </div>
              <div className="info-item">
                <div className="info-item-title">
                  <span className="info-tag file-tag">network-moat-skill</span>
                </div>
                <div className="info-item-desc">
                  Evaluates network effects, liquidity thickness, coordination locks, and artificial/slop injection risk.
                </div>
              </div>
              <div className="info-item">
                <div className="info-item-title">
                  <span className="info-tag file-tag">system-of-record-skill</span>
                </div>
                <div className="info-item-desc">
                  Evaluates SaaS system-of-record status, switching cost bifurcation, and vulnerability to AI-automated migrations.
                </div>
              </div>
              <div className="info-item">
                <div className="info-item-title">
                  <span className="info-tag file-tag">ground-truth-skill</span>
                </div>
                <div className="info-item-desc">
                  Examines proprietary datasets, feedback flywheels, and model performance convergence.
                </div>
              </div>
              <div className="info-item">
                <div className="info-item-title">
                  <span className="info-tag file-tag">talent-moat-skill</span>
                </div>
                <div className="info-item-desc">
                  Analyzes codifier's curse, talent scale requirements, and organizational structure reorganization.
                </div>
              </div>
              <div className="info-item">
                <div className="info-item-title">
                  <span className="info-tag file-tag">non-measurable-skill</span>
                </div>
                <div className="info-item-desc">
                  Assesses brand premiums, status positional lock-ins, and agent-mediated procurement resilience.
                </div>
              </div>
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

            {/* Target Ticker selector removed globally from the top */}

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
              {assistantType === 'designer' && (
                <div className="selectors-panel" style={{ marginBottom: '16px', padding: '0' }}>
                  <div className="selector-group">
                    <label className="selector-label">Target Company</label>
                    <div className="premium-combobox" ref={designerComboRef} style={{ position: 'relative', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                        <input 
                          type="text"
                          className="premium-select"
                          value={designerSearch}
                          onChange={(e) => {
                            setDesignerSearch(e.target.value);
                            setDesignerOpen(true);
                          }}
                          onFocus={() => setDesignerOpen(true)}
                          placeholder="Search company..."
                          style={{ width: '100%', paddingRight: '30px' }}
                        />
                        <button 
                          type="button" 
                          onClick={() => setDesignerOpen(!designerOpen)}
                          style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '10px', outline: 'none' }}
                        >
                          ▼
                        </button>
                      </div>
                      
                      {designerOpen && (
                        <div 
                          className="combobox-dropdown"
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: '#0a0a14',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            marginTop: '4px',
                            maxHeight: '180px',
                            overflowY: 'auto',
                            zIndex: 100,
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                          }}
                        >
                          {filteredDesignerCompanies.length > 0 ? (
                            filteredDesignerCompanies.map((c: any) => (
                              <div 
                                key={c.ticker}
                                onClick={() => {
                                  setSelectedTicker(c.ticker);
                                  setDesignerSearch(`${c.ticker} - ${c.name}`);
                                  setDesignerOpen(false);
                                }}
                                style={{
                                  padding: '8px 12px',
                                  cursor: 'pointer',
                                  fontSize: '13px',
                                  color: selectedTicker === c.ticker ? 'var(--accent-secondary)' : 'var(--text-normal)',
                                  background: selectedTicker === c.ticker ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
                                  borderBottom: '1px solid rgba(255,255,255,0.02)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = selectedTicker === c.ticker ? 'rgba(56, 189, 248, 0.08)' : 'transparent'}
                              >
                                {c.ticker} - {c.name}
                              </div>
                            ))
                          ) : (
                            <div style={{ padding: '8px 12px', fontSize: '13px', color: 'var(--text-muted)' }}>No companies found</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="suggestions-title">
                {assistantType === 'designer' ? "Select Memo Type to Generate" : "Suggested Queries"}
              </div>
              <div className="suggestions-container">
                {assistantType === 'designer' ? (
                  skills.map((skill: any) => (
                    <button 
                      key={skill.id} 
                      className={`suggestion-chip ${selectedSkillId === skill.id ? 'active-skill-chip' : ''}`}
                      onClick={() => onSelectorChange && onSelectorChange(selectedTicker, skill.id)}
                      disabled={isTyping}
                      title={skill.description}
                    >
                      {skill.name}
                    </button>
                  ))
                ) : (
                  suggestions.map((s: string, idx: number) => (
                    <button 
                      key={idx} 
                      className="suggestion-chip" 
                      onClick={() => handleSuggestionClick(s)}
                      disabled={isTyping}
                    >
                      {s}
                    </button>
                  ))
                )}
              </div>
            </div>
            
            <div className="chat-input">
              {assistantType === 'finance' && (
                <div className="selector-group-bottom" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
                  <span className="selector-label-bottom" style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', minWidth: '85px' }}>Target Focus:</span>
                  <div className="premium-combobox" ref={financeComboRef} style={{ position: 'relative', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                      <input 
                        type="text"
                        className="premium-select-small"
                        value={financeSearch}
                        onChange={(e) => {
                          setFinanceSearch(e.target.value);
                          setFinanceOpen(true);
                        }}
                        onFocus={() => setFinanceOpen(true)}
                        placeholder="Search company..."
                        style={{ 
                          width: '100%', 
                          background: 'var(--bg-secondary)', 
                          border: '1px solid var(--border-color)', 
                          borderRadius: '6px', 
                          color: '#fff', 
                          fontSize: '12px', 
                          padding: '4px 24px 4px 8px', 
                          outline: 'none', 
                          cursor: 'pointer' 
                        }}
                      />
                      <button 
                        type="button" 
                        onClick={() => setFinanceOpen(!financeOpen)}
                        style={{ position: 'absolute', right: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '8px', outline: 'none' }}
                      >
                        ▼
                      </button>
                    </div>
                    
                    {financeOpen && (
                      <div 
                        className="combobox-dropdown"
                        style={{
                          position: 'absolute',
                          bottom: '100%',
                          left: 0,
                          right: 0,
                          background: '#0a0a14',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          marginBottom: '4px',
                          maxHeight: '180px',
                          overflowY: 'auto',
                          zIndex: 100,
                          boxShadow: '0 -10px 30px rgba(0,0,0,0.5)'
                        }}
                      >
                        {filteredFinanceCompanies.length > 0 ? (
                          filteredFinanceCompanies.map((c: any) => (
                            <div 
                              key={c.ticker}
                              onClick={() => {
                                setSelectedTicker(c.ticker);
                                setFinanceSearch(`${c.ticker} - ${c.name}`);
                                setFinanceOpen(false);
                              }}
                              style={{
                                padding: '8px 12px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                color: selectedTicker === c.ticker ? 'var(--accent-secondary)' : 'var(--text-normal)',
                                background: selectedTicker === c.ticker ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
                                borderBottom: '1px solid rgba(255,255,255,0.02)'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = selectedTicker === c.ticker ? 'rgba(56, 189, 248, 0.08)' : 'transparent'}
                            >
                              {c.ticker} - {c.name}
                            </div>
                          ))
                        ) : (
                          <div style={{ padding: '8px 12px', fontSize: '13px', color: 'var(--text-muted)' }}>No companies found</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
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
                  type="button"
                  className={`web-search-toggle-btn ${webSearchActive ? 'active' : ''}`}
                  onClick={() => setWebSearchActive(!webSearchActive)}
                  title={webSearchActive ? "Web Research & AI Generation Active" : "Enable Web Research & AI Generation Mode"}
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '50%',
                    marginRight: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    color: webSearchActive ? 'var(--accent-secondary)' : 'var(--text-muted)'
                  }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{
                    filter: webSearchActive ? 'drop-shadow(0 0 6px var(--accent-secondary))' : 'none',
                    animation: webSearchActive ? 'pulseGlow 2s infinite' : 'none'
                  }}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </button>
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
