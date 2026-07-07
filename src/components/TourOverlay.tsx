"use client";

import React, { useState, useEffect } from "react";
import { useChat } from "@/context/ChatContext";

export default function TourOverlay() {
  const { isTourActive, setIsTourActive } = useChat();
  const [step, setStep] = useState(1);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const steps = [
    {
      id: "tour-model-select",
      title: "🤖 Pilihan Model AI",
      desc: "Gunakan menu dropdown ini untuk memilih model LLM yang ingin Anda gunakan. Anda bisa berganti model secara instan kapan saja.",
    },
    {
      id: "tour-file-btn",
      title: "📎 Unggah Gambar/File",
      desc: "Klik tombol klip kertas ini untuk mengunggah gambar/file. Anda bisa mengunggah beberapa gambar sekaligus jika model yang dipilih mendukung Vision.",
    },
    {
      id: "tour-settings-btn",
      title: "⚙️ Pengaturan Console",
      desc: "Klik tombol gir ini untuk menyesuaikan API Endpoint, system prompt, temperatur respon, token maksimum, dan preferensi lainnya.",
    },
  ];

  const currentStepData = steps[step - 1];

  // Dynamic layout rect updater
  useEffect(() => {
    if (!isTourActive || !currentStepData) return;

    const updateRect = () => {
      const el = document.getElementById(currentStepData.id);
      if (el) {
        setRect(el.getBoundingClientRect());
      }
    };

    updateRect();
    
    // Check periodically to handle rendering/movement delay
    const interval = setInterval(updateRect, 150);
    window.addEventListener("resize", updateRect);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", updateRect);
    };
  }, [isTourActive, step, currentStepData]);

  if (!isTourActive) return null;

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      setIsTourActive(false);
      setStep(1);
    }
  };

  const handleSkip = () => {
    setIsTourActive(false);
    setStep(1);
  };

  const maskStyle = rect ? {
    boxShadow: "0 0 0 9999px rgba(10, 12, 16, 0.78)",
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    borderRadius: "10px",
    border: "2.5px solid var(--signal)",
    boxShadowColor: "rgba(10, 12, 16, 0.78)",
    position: "fixed" as const,
    zIndex: 99999,
    transition: "all 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
    pointerEvents: "auto" as const
  } : {};

  // Default tooltip styling
  let tooltipStyle: React.CSSProperties = {
    position: "fixed",
    width: "300px",
    zIndex: 100000,
    background: "#161a23",
    border: "1px solid #252b38",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7)",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    transition: "all 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  if (rect) {
    if (currentStepData.id === "tour-settings-btn") {
      // Top right settings icon - place tooltip below and to the left
      tooltipStyle.top = `${rect.bottom + 14}px`;
      tooltipStyle.right = `${window.innerWidth - rect.right}px`;
    } else {
      // Bottom buttons - place tooltip above them
      tooltipStyle.bottom = `${window.innerHeight - rect.top + 14}px`;
      tooltipStyle.left = `${rect.left}px`;

      if (rect.left + 300 > window.innerWidth) {
        tooltipStyle.left = "auto";
        tooltipStyle.right = "16px";
      }
    }
  } else {
    tooltipStyle.top = "50%";
    tooltipStyle.left = "50%";
    tooltipStyle.transform = "translate(-50%, -50%)";
  }

  return (
    <div className="fixed inset-0 z-[99998] pointer-events-none">
      {/* Click outside backdrop handler */}
      <div className="absolute inset-0 pointer-events-auto bg-transparent" onClick={handleSkip}></div>

      {/* Spotlight Punch Hole */}
      {rect && (
        <div style={maskStyle} className="shadow-[0_0_0_9999px_rgba(10,12,16,0.78)]" />
      )}

      {/* Tooltip Card */}
      <div style={tooltipStyle} className="pointer-events-auto">
        <div>
          <h3 className="text-sm font-bold text-txt mb-1.5 flex items-center gap-1.5">
            {currentStepData.title}
          </h3>
          <p className="text-[11.5px] text-txt-dim leading-relaxed">
            {currentStepData.desc}
          </p>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between mt-1 pt-3.5 border-t border-line">
          <span className="text-[10px] font-mono text-txt-faint">
            Langkah {step} dari {steps.length}
          </span>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSkip} 
              className="px-2.5 py-1 text-[11px] font-medium text-txt-dim hover:text-txt transition-colors cursor-pointer"
            >
              Lewati
            </button>
            <button 
              onClick={handleNext} 
              className="btn primary py-1 px-3.5 text-[11.5px] font-semibold flex items-center gap-1 cursor-pointer"
            >
              {step === steps.length ? "Selesai" : "Lanjut"}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3 w-3">
                <path d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
