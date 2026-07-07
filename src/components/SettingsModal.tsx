"use client";

import React, { useState } from "react";
import { useChat } from "@/context/ChatContext";

const SKILL_ICONS = {
  coding: (
    <svg className="w-[15px] h-[15px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  logicMath: (
    <svg className="w-[15px] h-[15px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
      <path d="M12 6v12"/>
      <path d="M8 10h8"/>
    </svg>
  ),
  creative: (
    <svg className="w-[15px] h-[15px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
    </svg>
  ),
  security: (
    <svg className="w-[15px] h-[15px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  translation: (
    <svg className="w-[15px] h-[15px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  dataAnalysis: (
    <svg className="w-[15px] h-[15px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  brainstorm: (
    <svg className="w-[15px] h-[15px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .6 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
      <path d="M9 18h6"/>
      <path d="M10 22h4"/>
    </svg>
  ),
  academic: (
    <svg className="w-[15px] h-[15px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
      <path d="M6 6h10"/>
      <path d="M6 10h10"/>
    </svg>
  )
};

export default function SettingsModal() {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    baseUrl,
    setBaseUrl,
    apiKey,
    setApiKey,
    model,
    setModel,
    systemPrompt,
    setSystemPrompt,
    temperature,
    setTemperature,
    maxTokens,
    setMaxTokens,
    username,
    setUsername,
    availableModels,
    clearHistory,
    aiSkills,
    setAiSkills
  } = useChat();

  const [showKey, setShowKey] = useState(false);
  const [isSkillsDropdownOpen, setIsSkillsDropdownOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  if (!isSettingsOpen) return null;

  const handleClearHistoryClick = () => {
    if (window.confirm("Hapus seluruh riwayat percakapan?")) {
      clearHistory();
      setIsSettingsOpen(false);
    }
  };

  return (
    <>
      {/* Background Overlay */}
      <div 
        className="overlay open" 
        onClick={() => setIsSettingsOpen(false)}
      ></div>

      {/* Drawer Panel */}
      <div className="drawer open">
        <div className="drawer-head">
          <h2>Pengaturan</h2>
          <button 
            className="icon-btn" 
            onClick={() => setIsSettingsOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="drawer-body">
          {/* User Name */}
          <div className="field">
            <label>Nama kamu</label>
            <input 
              className="inp" 
              type="text"
              placeholder="Nama buat sapaan…" 
              maxLength={24}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Base URL */}
          <div className="field" style={{ display: 'none' }}>
            <label>Base URL</label>
            <input 
              className="inp" 
              type="text"
              placeholder="https://api.rdpgrid.com" 
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
            />
          </div>

          {/* API Key */}
          <div className="field" style={{ display: 'none' }}>
            <label>API Key <span className="text-txt-faint font-normal">(Paten / Tidak Bisa Diubah)</span></label>
            <div className="key-row">
              <input 
                className="inp opacity-60 cursor-not-allowed" 
                type={showKey ? "text" : "password"}
                placeholder="sk-…" 
                value={apiKey}
                readOnly
              />
              <button 
                type="button"
                className="btn ghost flex items-center justify-center min-w-[44px] cursor-pointer" 
                onClick={() => setShowKey(!showKey)}
                title="Lihat/sembunyikan"
              >
                {showKey ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Model Pick Dropdown */}
          <div className="field">
            <label>Model</label>
            <button
              type="button"
              className="inp text-left cursor-pointer flex items-center justify-between select-none pr-[34px] font-mono text-[13px]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' stroke='%239099ab' stroke-width='2'%3E%3Cpath d='M3 5l4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
              }}
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
            >
              <span className={`truncate mr-2 ${model ? "text-[var(--txt)]" : "text-[var(--txt-dim)]"}`}>
                {model || "\u2014 mengambil model\u2026 \u2014"}
              </span>
            </button>
            {isModelDropdownOpen && (
              <div className="mt-1.5 bg-[var(--ink)] border border-[var(--line)] rounded-lg py-1 max-h-[260px] overflow-y-auto">
                {availableModels.length === 0 ? (
                  <div className="px-4 py-3 text-[13px] text-[var(--txt-faint)] font-mono">\u2014 konek & ambil model dulu \u2014</div>
                ) : (
                  availableModels.map((m) => (
                    <button key={m} type="button"
                      className="flex items-center justify-between w-full px-4 py-2.5 text-left cursor-pointer hover:bg-[#202533] transition-colors duration-150 text-[13px] font-mono select-none"
                      onClick={() => { setModel(m); setIsModelDropdownOpen(false); }}
                    >
                      <span className={m === model ? "text-[var(--signal)] font-medium" : "text-[var(--txt-dim)]"}>  {m}</span>
                      {m === model && <span className="text-[12px] font-bold text-[var(--signal)]">&check;</span>}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* System Prompt */}
          <div className="field">
            <label>System Prompt <span>(opsional — atur peran model)</span></label>
            <textarea 
              className="inp mb-2" 
              placeholder="Contoh: Kamu asisten AI yang ramah. Jawab santai pakai Bahasa Indonesia."
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={3}
            />
            
            {/* Clickable Templates */}
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button 
                type="button"
                className="flex items-center gap-2 px-3 py-2 text-[11px] rounded-lg border cursor-pointer transition-all duration-150 select-none"
                style={{ background: 'var(--ink)', borderColor: 'var(--line)', color: 'var(--txt-dim)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--signal)'; e.currentTarget.style.color = 'var(--txt)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--txt-dim)'; }}
                onClick={() => setSystemPrompt("Kamu asisten AI yang helpful dan ramah. Jawab santai pakai Bahasa Indonesia.")}
              >
                🤖 Asisten Umum
              </button>
              <button 
                type="button"
                className="flex items-center gap-2 px-3 py-2 text-[11px] rounded-lg border cursor-pointer transition-all duration-150 select-none"
                style={{ background: 'var(--ink)', borderColor: 'var(--line)', color: 'var(--txt-dim)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--signal)'; e.currentTarget.style.color = 'var(--txt)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--txt-dim)'; }}
                onClick={() => setSystemPrompt("Kamu senior software engineer. Berikan solusi kode yang efisien, bersih, dan jelaskan konsepnya secara singkat.")}
              >
                💻 Senior Dev
              </button>
              <button 
                type="button"
                className="flex items-center gap-2 px-3 py-2 text-[11px] rounded-lg border cursor-pointer transition-all duration-150 select-none"
                style={{ background: 'var(--ink)', borderColor: 'var(--line)', color: 'var(--txt-dim)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--signal)'; e.currentTarget.style.color = 'var(--txt)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--txt-dim)'; }}
                onClick={() => setSystemPrompt("Bertindak sebagai ahli bahasa Inggris. Koreksi grammar dan perbaiki kalimat saya agar terdengar lebih alami.")}
              >
                📝 Korektor Grammar
              </button>
              <button 
                type="button"
                className="flex items-center gap-2 px-3 py-2 text-[11px] rounded-lg border cursor-pointer transition-all duration-150 select-none"
                style={{ background: 'var(--ink)', borderColor: 'var(--line)', color: 'var(--txt-dim)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--signal)'; e.currentTarget.style.color = 'var(--txt)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--txt-dim)'; }}
                onClick={() => setSystemPrompt("Terjemahkan teks yang diberikan ke Bahasa Indonesia (atau sebaliknya) secara natural, akurat, dan kontekstual.")}
              >
                🌐 Penerjemah
              </button>
            </div>
          </div>

          <div className="divider"></div>

          {/* AI Skills Cards */}
          <div className="field animate-rise">
            <label>AI Skills <span>(Kemampuan Khusus Claude)</span></label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {([
                { key: 'coding' as const, icon: SKILL_ICONS.coding, label: 'Coding' },
                { key: 'logicMath' as const, icon: SKILL_ICONS.logicMath, label: 'Logika' },
                { key: 'creative' as const, icon: SKILL_ICONS.creative, label: 'Kreatif' },
                { key: 'security' as const, icon: SKILL_ICONS.security, label: 'Security' },
                { key: 'translation' as const, icon: SKILL_ICONS.translation, label: 'Translate' },
                { key: 'dataAnalysis' as const, icon: SKILL_ICONS.dataAnalysis, label: 'Data' },
                { key: 'brainstorm' as const, icon: SKILL_ICONS.brainstorm, label: 'Ide' },
                { key: 'academic' as const, icon: SKILL_ICONS.academic, label: 'Akademik' },
              ]).map((skill) => {
                const isActive = aiSkills[skill.key];
                return (
                  <button
                    key={skill.key}
                    type="button"
                    onClick={() => setAiSkills({ ...aiSkills, [skill.key]: !isActive })}
                    className="cursor-pointer select-none transition-all duration-200"
                    style={{
                      background: isActive ? 'var(--signal-soft)' : 'var(--panel)',
                      border: `1px solid ${isActive ? 'var(--signal)' : 'var(--line)'}`,
                      borderRadius: '12px',
                      padding: '14px 8px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '7px',
                      boxShadow: isActive ? '0 0 16px rgba(124,140,255,0.25)' : 'none',
                    }}
                  >
                    <span style={{ color: isActive ? 'var(--signal)' : 'var(--txt-dim)', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {skill.icon}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--txt)' : 'var(--txt-dim)',
                      lineHeight: 1.2,
                    }}>
                      {skill.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="divider"></div>

          {/* Clear History */}
          <button 
            className="btn danger full cursor-pointer"
            onClick={handleClearHistoryClick}
          >
            Hapus riwayat chat
          </button>

          <div className="msg-help">
            Key & pengaturan tersimpan otomatis di browser ini (localStorage). Nggak dikirim ke mana-mana selain proxy rdpgrid.
          </div>
        </div>
      </div>
    </>
  );
}
