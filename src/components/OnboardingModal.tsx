"use client";

import React, { useState } from "react";
import { useChat } from "@/context/ChatContext";

export default function OnboardingModal() {
  const { isOnboarded, setIsOnboarded, setUsername } = useChat();
  const [step, setStep] = useState<1 | 2>(1);
  const [tempName, setTempName] = useState("");

  if (isOnboarded) return null;

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    }
  };

  const handleFinish = () => {
    const finalName = tempName.trim() || "User";
    
    // Save to context
    setUsername(finalName);
    
    // Persist to local storage under rdpgrid_cfg
    try {
      const saved = localStorage.getItem("rdpgrid_cfg");
      const current = saved ? JSON.parse(saved) : {};
      current.username = finalName;
      localStorage.setItem("rdpgrid_cfg", JSON.stringify(current));
    } catch (e) {
      console.error(e);
    }

    // Mark as onboarded
    localStorage.setItem("rdpgrid_onboarded", "true");
    setIsOnboarded(true);
  };

  const handleSkip = () => {
    // Directly finish with default user or empty
    const finalName = tempName.trim() || "User";
    setUsername(finalName);
    localStorage.setItem("rdpgrid_onboarded", "true");
    setIsOnboarded(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      {/* Main Card */}
      <div className="w-full max-w-md bg-panel border border-line rounded-2xl p-6 shadow-2xl flex flex-col animate-rise relative overflow-hidden">
        
        {/* Glow effect in background */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-signal/15 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-signal/15 rounded-full blur-2xl pointer-events-none"></div>

        {step === 1 ? (
          <div className="flex flex-col items-center text-center">
            {/* Logo */}
            <div className="logo h-14 w-14 rounded-xl bg-signal/10 flex items-center justify-center border border-signal/20 mb-4 shadow-[0_0_20px_rgba(var(--signal-rgb),0.1)]">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--signal)" strokeWidth="2.2" className="h-7 w-7">
                <path d="M4 7h16M4 12h16M4 17h16M8 4v16M16 4v16"/>
              </svg>
            </div>

            {/* Brand Title */}
            <h1 className="text-2xl font-bold font-sans text-txt tracking-tight">
              BTG.AI Console
            </h1>
            
            {/* Credit developer */}
            <p className="text-xs text-signal font-semibold tracking-wider uppercase mt-1.5 mb-6">
              Developed by Rifendy Ardian
            </p>

            {/* Form */}
            <div className="field w-full text-left mb-6">
              <label className="block text-xs font-semibold text-txt-dim uppercase tracking-wider mb-2">
                Siapa nama Anda?
              </label>
              <input 
                className="inp w-full" 
                type="text"
                placeholder="Masukkan nama sapaan Anda..." 
                maxLength={24}
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNext();
                }}
                autoFocus
              />
            </div>

            {/* CTA */}
            <button 
              onClick={handleNext}
              className="btn primary w-full flex items-center justify-center gap-1 cursor-pointer font-semibold py-2.5 rounded-lg"
            >
              Lanjut
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
                <path d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            <h2 className="text-xl font-bold font-sans text-txt mb-2 flex items-center gap-2">
              💡 Kiat Penggunaan
            </h2>
            <p className="text-xs text-txt-dim mb-6 leading-relaxed">
              Berikut beberapa kiat penting untuk memaksimalkan penggunaan BTG.AI Console:
            </p>

            {/* Guideline list */}
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-lg bg-panel-2 border border-line flex items-center justify-center flex-none text-sm">
                  🤖
                </div>
                <div>
                  <h3 className="text-xs font-bold text-txt">Pilihan Model AI</h3>
                  <p className="text-[11px] text-txt-dim leading-normal mt-0.5">
                    Gunakan tombol dropdown model di pojok kanan bawah input bar untuk berganti model secara instan.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-lg bg-panel-2 border border-line flex items-center justify-center flex-none text-sm">
                  ⌨️
                </div>
                <div>
                  <h3 className="text-xs font-bold text-txt">Navigasi Input</h3>
                  <p className="text-[11px] text-txt-dim leading-normal mt-0.5">
                    Tekan <kbd className="px-1 py-0.5 bg-line-2 rounded text-[10px] font-mono text-txt">Enter</kbd> untuk mengirim pesan, dan <kbd className="px-1 py-0.5 bg-line-2 rounded text-[10px] font-mono text-txt">Shift + Enter</kbd> untuk membuat baris baru.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-lg bg-panel-2 border border-line flex items-center justify-center flex-none text-sm">
                  🖼️
                </div>
                <div>
                  <h3 className="text-xs font-bold text-txt">Unggah Multi Gambar</h3>
                  <p className="text-[11px] text-txt-dim leading-normal mt-0.5">
                    Anda bisa mengunggah beberapa gambar sekaligus untuk dianalisis oleh model yang mendukung Vision.
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button 
                onClick={handleSkip}
                className="btn ghost flex-1 flex items-center justify-center cursor-pointer text-xs font-medium py-2 rounded-lg"
              >
                Lewati Kiat
              </button>
              <button 
                onClick={handleFinish}
                className="btn primary flex-1 flex items-center justify-center cursor-pointer font-semibold py-2.5 rounded-lg"
              >
                Mulai Chat
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
