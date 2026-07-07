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
    connect,
    clearHistory
  } = useChat();

  const [showKey, setShowKey] = useState(false);

  if (!isSettingsOpen) return null;

  const handleConnectClick = async () => {
    await connect();
  };

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
          <div className="field">
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
          <div className="field">
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

          {/* Connect Button */}
          <button 
            className="btn primary full cursor-pointer"
            onClick={handleConnectClick}
          >
            Konek & ambil daftar model
          </button>

          <div className="divider"></div>

          {/* Model Pick Dropdown */}
          <div className="field">
            <label>Model</label>
            <select 
              className="inp cursor-pointer" 
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              {availableModels.length === 0 ? (
                <option value="">— konek dulu —</option>
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
              className="inp" 
              placeholder="Contoh: Kamu asisten toko Bagaskara Cell. Jawab santai pakai Bahasa Indonesia."
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
            />
          </div>

          {/* Temperature Slider */}
          <div className="field">
            <label>
              Temperature 
              <span className="slider-val">{temperature}</span>
            </label>
            <input 
              type="range" 
              min="0" 
              max="2" 
              step="0.1" 
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
            />
            <div className="msg-help">
              Makin rendah = makin fokus/konsisten. Makin tinggi = makin kreatif/liar.
            </div>
          </div>

          {/* Max Tokens Slider */}
          <div className="field">
            <label>
              Max Tokens 
              <span className="slider-val">{maxTokens}</span>
            </label>
            <input 
              type="range" 
              min="256" 
              max="8192" 
              step="256" 
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
            />
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
