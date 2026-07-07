"use client";

import React, { useState } from "react";
import { useChat } from "@/context/ChatContext";

export default function Sidebar() {
  const { clearHistory, messages, sessions, currentSessionId, loadSession } = useChat();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div 
      className={`${isCollapsed ? 'w-[68px]' : 'w-[280px]'} flex-none border-r border-[var(--line)] bg-[var(--panel)] flex flex-col transition-all duration-300 ease-in-out overflow-hidden z-10 relative`}
    >
      {/* Header / Collapse */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-[14px] flex-none border-b border-[var(--line)] h-[59px] transition-all duration-300`}>
        {!isCollapsed && (
          <div className="brand flex-none" style={{ gap: '10px' }}>
            <div className="logo" style={{ width: '28px', height: '28px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16M8 4v16M16 4v16"/>
              </svg>
            </div>
            <div style={{ lineHeight: '1.2' }}>
              <span style={{ fontSize: '15px' }}>BTG.AI</span><br/>
              <small style={{ fontSize: '9px', marginTop: 0 }}>Little LLM Console</small>
            </div>
          </div>
        )}
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-[var(--panel-2)] rounded-lg text-[var(--txt-dim)] hover:text-[var(--txt)] transition-colors flex-none"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className={`flex-1 flex flex-col transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'} w-[280px]`}>
        {/* New Chat Button */}
        <div className="p-4 flex-none">
          <button 
            onClick={clearHistory}
            className="w-[248px] flex items-center gap-3 px-4 py-2.5 bg-[#1e2330] hover:bg-[#2b334d] border border-[var(--line)] rounded-full text-[13px] font-medium text-[var(--txt)] transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Chat Baru
          </button>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto px-2 pb-4 w-[280px]">
          <div className="px-3 pb-2 text-[11px] font-mono text-[var(--txt-faint)] uppercase tracking-wider mt-2">
            Riwayat
          </div>
          
          <div className="flex flex-col gap-1 w-[264px]">
          {/* Real History */}
          {sessions.length > 0 ? (
            sessions.map(session => {
              const isActive = session.id === currentSessionId;
              return (
                <button 
                  key={session.id}
                  onClick={() => loadSession(session.id)}
                  className={`w-full text-left px-3 py-2 text-[13px] rounded-lg font-medium truncate flex items-center gap-2 transition-colors ${isActive ? 'bg-[var(--signal-soft)] text-[var(--signal)]' : 'hover:bg-[var(--panel-2)] text-[var(--txt-dim)] hover:text-[var(--txt)]'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`flex-none ${!isActive && 'opacity-50'}`}>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  {session.title}
                </button>
              );
            })
          ) : (
            <div className="px-3 py-4 text-center text-[12px] text-[var(--txt-faint)] italic">
              Belum ada riwayat
            </div>
          )}
          </div>
        </div>

        {/* Bottom Action (Add Workspace / Settings) */}
        <div className="p-3 border-t border-[var(--line)] flex-none w-[280px]">
          <button className="w-[256px] flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--panel-2)] transition-colors text-left">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[var(--warn)] to-[#d97706] flex items-center justify-center text-white font-bold text-[12px] flex-none">
              R
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[13px] font-medium text-[var(--txt)] truncate">RDP Workspace</span>
              <span className="text-[11px] text-[var(--txt-dim)] font-mono">Pro Plan</span>
            </div>
            <div className="ml-auto opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
