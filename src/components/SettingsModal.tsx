"use client";

import React, { useState } from "react";
import { useChat } from "@/context/ChatContext";

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
    clearHistory
  } = useChat();

  const [showKey, setShowKey] = useState(false);

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
            <select 
              className="inp cursor-pointer" 
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              {availableModels.length === 0 ? (
                <option value="">— mengambil model… —</option>
              ) : (
                availableModels.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* System Prompt */}
          <div className="field">
            <label>System Prompt <span>(opsional — atur peran model)</span></label>
            <textarea 
              className="inp mb-2" 
              placeholder="Contoh: Kamu asisten toko Bagaskara Cell. Jawab santai pakai Bahasa Indonesia."
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={3}
            />
            
            {/* Clickable Templates */}
            <div className="flex flex-wrap gap-1.5 mt-1">
              <button 
                type="button"
                className="px-2 py-0.5 text-[10px] rounded bg-[#1e2330] hover:bg-[#2b3245] border border-line text-txt-dim hover:text-txt cursor-pointer transition-colors"
                onClick={() => setSystemPrompt("Kamu asisten toko Bagaskara Cell. Jawab santai pakai Bahasa Indonesia.")}
              >
                🤖 Asisten Toko
              </button>
              <button 
                type="button"
                className="px-2 py-0.5 text-[10px] rounded bg-[#1e2330] hover:bg-[#2b3245] border border-line text-txt-dim hover:text-txt cursor-pointer transition-colors"
                onClick={() => setSystemPrompt("Kamu senior software engineer. Berikan solusi kode yang efisien, bersih, dan jelaskan konsepnya secara singkat.")}
              >
                💻 Senior Dev
              </button>
              <button 
                type="button"
                className="px-2 py-0.5 text-[10px] rounded bg-[#1e2330] hover:bg-[#2b3245] border border-line text-txt-dim hover:text-txt cursor-pointer transition-colors"
                onClick={() => setSystemPrompt("Bertindak sebagai ahli bahasa Inggris. Koreksi grammar dan perbaiki kalimat saya agar terdengar lebih alami.")}
              >
                📝 Korektor Grammar
              </button>
              <button 
                type="button"
                className="px-2 py-0.5 text-[10px] rounded bg-[#1e2330] hover:bg-[#2b3245] border border-line text-txt-dim hover:text-txt cursor-pointer transition-colors"
                onClick={() => setSystemPrompt("Terjemahkan teks yang diberikan ke Bahasa Indonesia (atau sebaliknya) secara natural, akurat, dan kontekstual.")}
              >
                🌐 Penerjemah
              </button>
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
