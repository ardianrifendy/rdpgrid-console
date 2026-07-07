"use client";

import React, { useState } from "react";
import { useChat } from "@/context/ChatContext";

export default function OnboardingModal() {
  const { isOnboarded, setIsOnboarded, setUsername, setIsTourActive } = useChat();
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
    setIsTourActive(true);
  };

  const handleSkip = () => {
    const finalName = tempName.trim() || "User";
    setUsername(finalName);
    localStorage.setItem("rdpgrid_onboarded", "true");
    setIsOnboarded(true);
    setIsTourActive(true);
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card">
        <div className="onboarding-glow-1"></div>
        <div className="onboarding-glow-2"></div>

        {step === 1 ? (
          <div className="onboarding-content-wrapper animate-fade-in">
            {/* Unique onboarding-logo box */}
            <div className="onboarding-logo-container">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 7h16M4 12h16M4 17h16M8 4v16M16 4v16"/>
              </svg>
            </div>

            {/* Brand Title */}
            <h1 className="onboarding-title">
              BTG.AI Console
            </h1>
            
            {/* Credit developer */}
            <p className="onboarding-subtitle">
              Developed by Rifendy Ardian
            </p>

            {/* Form */}
            <div className="onboarding-field">
              <label>
                Siapa nama Anda?
              </label>
              <input 
                className="inp focus:border-signal" 
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

            {/* CTA Button */}
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
          <div className="onboarding-step2-wrapper animate-fade-in">
            <h2 className="onboarding-step2-title">
              💡 Kiat Penggunaan
            </h2>
            <p className="onboarding-step2-desc">
              Berikut beberapa kiat penting untuk memaksimalkan penggunaan BTG.AI Console:
            </p>

            {/* Guideline list */}
            <div className="onboarding-list">
              <div className="onboarding-item">
                <div className="onboarding-item-icon">
                  🤖
                </div>
                <div className="onboarding-item-text">
                  <h3>Pilihan Model AI</h3>
                  <p>
                    Gunakan tombol dropdown model di pojok kanan bawah input bar untuk berganti model secara instan.
                  </p>
                </div>
              </div>

              <div className="onboarding-item">
                <div className="onboarding-item-icon">
                  ⌨️
                </div>
                <div className="onboarding-item-text">
                  <h3>Navigasi Input</h3>
                  <p>
                    Tekan <kbd className="px-1.5 py-0.5 bg-[#252b38] rounded text-[10px] font-mono text-txt">Enter</kbd> untuk mengirim pesan, dan <kbd className="px-1.5 py-0.5 bg-[#252b38] rounded text-[10px] font-mono text-txt">Shift + Enter</kbd> untuk membuat baris baru.
                  </p>
                </div>
              </div>

              <div className="onboarding-item">
                <div className="onboarding-item-icon">
                  🖼️
                </div>
                <div className="onboarding-item-text">
                  <h3>Unggah Multi Gambar</h3>
                  <p>
                    Anda bisa mengunggah beberapa gambar sekaligus untuk dianalisis oleh model yang mendukung Vision.
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="onboarding-buttons">
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
