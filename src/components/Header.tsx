"use client";

import { useChat } from "@/context/ChatContext";

export default function Header() {
  const { statusState, statusText, setIsSettingsOpen, isMobileSidebarOpen, setIsMobileSidebarOpen } = useChat();

  return (
    <header className="flex items-center justify-between px-4 md:px-5 h-[59px] border-b border-[var(--line)] bg-[rgba(14,16,22,0.72)] backdrop-blur-md relative z-10 w-full">
      {/* Mobile Branding & Hamburger */}
      <div className="flex items-center gap-3 md:hidden">
        <button 
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-1.5 hover:bg-[var(--panel-2)] rounded-lg text-[var(--txt-dim)] hover:text-[var(--txt)] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div className="brand flex items-center" style={{ gap: '8px' }}>
          <div className="logo flex-none" style={{ width: '24px', height: '24px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16M8 4v16M16 4v16"/>
            </svg>
          </div>
          <div style={{ lineHeight: '1.2' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>BTG.AI</span>
          </div>
        </div>
      </div>

      {/* Spacer for Desktop */}
      <div className="hidden md:block flex-1"></div>

      <div className="status">
        <span className={`dot ${statusState === "on" ? "on" : statusState === "err" ? "err" : ""}`}></span>
        <span>{statusText}</span>
      </div>
      
      <button 
        className="icon-btn" 
        id="tour-settings-btn" 
        title="Pengaturan" 
        onClick={() => setIsSettingsOpen(true)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
        </svg>
      </button>
    </header>
  );
}
