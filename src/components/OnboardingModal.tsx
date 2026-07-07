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
    const finalName = tempName.trim() || "User";
    setUsername(finalName);
    localStorage.setItem("rdpgrid_onboarded", "true");
    setIsOnboarded(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0e1016]/75 backdrop-blur-md p-4 animate-fade-in">
      {/* Main Card */}
      <div className="w-full max-w-md bg-[#161a23] border border-[#252b38] rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.65)] flex flex-col animate-rise relative">
        
        {/* Glow effect in background */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-signal/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-signal/10 rounded-full blur-3xl pointer-events-none"></div>

        {step === 1 ? (
          <div className="w-full flex flex-col items-center text-center">
            {/* Unique onboarding-logo div to prevent global .logo conflict */}
            <div className="h-16 w-16 rounded-2xl bg-signal/10 flex items-center justify-center border border-signal/25 mb-5 shadow-[0_0_24px_rgba(124,140,255,0.15)]">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--signal)" strokeWidth="2.2" className="h-8 w-8">
                <path d="M4 7h16M4 12h16M4 17h16M8 4v16M16 4v16"/>
              </svg>
            </div>

            {/* Brand Title */}
            <h1 className="text-[26px] font-bold font-sans text-txt tracking-tight leading-none mb-2">
              BTG.AI Console
            </h1>
            
            {/* Credit developer */}
            <p className="text-[11px] text-signal font-semibold tracking-widest uppercase mb-7">
              Developed by Rifendy Ardian
            </p>

            {/* Form */}
            <div className="field w-full text-left mb-7">
              <label className="block text-[10.5px] font-bold font-mono text-txt-dim uppercase tracking-wider mb-2">
                Siapa nama Anda?
              </label>
              <input 
                className="inp w-full focus:border-signal focus:ring-2 focus:ring-signal-soft" 
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

            {/* CTA Button using core classes */}
            <button 
              onClick={handleNext}
              className="btn primary full flex items-center justify-center gap-1.5 font-semibold cursor-pointer"
            >
              Lanjut
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
                <path d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col">
            <h2 className="text-xl font-bold font-sans text-txt mb-2 flex items-center gap-2">
              💡 Kiat Penggunaan
            </h2>
            <p className="text-xs text-txt-dim mb-6 leading-relaxed">
              Berikut beberapa kiat penting untuk memaksimalkan penggunaan BTG.AI Console:
            </p>

            {/* Guideline list */}
            <div className="flex flex-col gap-4.5 mb-8">
              <div className="flex items-start gap-3.5">
                <div className="h-8 w-8 rounded-xl bg-panel-2 border border-line flex items-center justify-center flex-none text-base">
                  🤖
                </div>
                <div>
                  <h3 className="text-xs font-bold text-txt">Pilihan Model AI</h3>
                  <p className="text-[11px] text-txt-dim leading-normal mt-0.5">
                    Gunakan tombol dropdown model di pojok kanan bawah input bar untuk berganti model secara instan.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="h-8 w-8 rounded-xl bg-panel-2 border border-line flex items-center justify-center flex-none text-base">
                  ⌨️
                </div>
                <div>
                  <h3 className="text-xs font-bold text-txt">Navigasi Input</h3>
                  <p className="text-[11px] text-txt-dim leading-normal mt-0.5">
                    Tekan <kbd className="px-1.5 py-0.5 bg-[#252b38] rounded text-[10px] font-mono text-txt">Enter</kbd> untuk mengirim pesan, dan <kbd className="px-1.5 py-0.5 bg-[#252b38] rounded text-[10px] font-mono text-txt">Shift + Enter</kbd> untuk membuat baris baru.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="h-8 w-8 rounded-xl bg-panel-2 border border-line flex items-center justify-center flex-none text-base">
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

            {/* Buttons using core theme styles */}
            <div className="flex items-center gap-3">
              <button 
                onClick={handleSkip}
                className="btn ghost flex-1 flex items-center justify-center cursor-pointer text-xs font-medium"
              >
                Lewati Kiat
              </button>
              <button 
                onClick={handleFinish}
                className="btn primary flex-1 flex items-center justify-center cursor-pointer font-semibold"
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
