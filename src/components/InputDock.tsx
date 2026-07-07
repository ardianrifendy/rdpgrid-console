"use client";

import React, { useRef, useState, useEffect } from "react";
import { useChat } from "@/context/ChatContext";

export default function InputDock() {
  const {
    model,
    isStreaming,
    sendMessage,
    abortStreaming,
    availableModels,
    setModel,
    inputText,
    setInputText
  } = useChat();

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    autoGrow();
  };

  const autoGrow = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 190)}px`;
    }
  };

  // Run autoGrow when inputText changes from parent (Explorer suggestions)
  useEffect(() => {
    autoGrow();
  }, [inputText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreviews((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    // reset input to allow uploading same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (idxToRemove: number) => {
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleSend = () => {
    if (isStreaming) {
      abortStreaming();
      return;
    }

    if (!inputText.trim() && imagePreviews.length === 0) return;

    sendMessage(inputText, imagePreviews);
    setInputText("");
    setImagePreviews([]);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const isSendDisabled = (!inputText.trim() && imagePreviews.length === 0) || (!model && !isStreaming);

  return (
    <div className="composer">
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        className="hidden" 
        multiple
      />

      <div className="composer-in">
        {imagePreviews.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 animate-rise">
            {imagePreviews.map((preview, idx) => (
              <div key={idx} className="inline-flex items-center gap-2 bg-[#0b0d13] border border-line rounded-lg px-2.5 py-1 text-xs">
                {/* File Type Icon */}
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--signal)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 flex-none">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                
                {/* Filename */}
                <span className="font-mono text-txt truncate max-w-[150px]" title={`gambar-${idx + 1}.png`}>
                  gambar-{idx + 1}.png
                </span>
                
                {/* Close Button */}
                <button 
                  onClick={() => removeImage(idx)}
                  className="h-4 w-4 rounded-full hover:bg-line-2 text-txt-dim hover:text-txt flex items-center justify-center text-[9px] font-bold transition-colors cursor-pointer ml-1"
                  title="Hapus"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <textarea 
          id="input" 
          ref={textareaRef}
          rows={1} 
          placeholder="Ketik pesan…  (Enter kirim, Shift+Enter baris baru)"
          value={inputText}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
        />

        <div className="composer-bar">
          {/* File Upload Trigger */}
          <button 
            onClick={handleFileClick}
            type="button"
            id="tour-file-btn"
            className="icon-btn h-9 w-9 border-none bg-transparent hover:bg-panel-2 rounded-lg mr-1 cursor-pointer flex items-center justify-center"
            title="Unggah Gambar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </button>

          {/* Model Selector Dropdown */}
          <div className={`model-select ${isMenuOpen ? "open" : ""}`} ref={menuRef} id="tour-model-select">
            <div 
              className="model-select-btn" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="mdot"></span>
              <span>{model || "— pilih model —"}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>

            {isMenuOpen && (
              <div className="model-menu block">
                {availableModels.length === 0 ? (
                  <div className="model-opt text-txt-faint cursor-default">
                    — konek & ambil model dulu —
                  </div>
                ) : (
                  availableModels.map((m) => (
                    <div 
                      key={m} 
                      className={`model-opt ${m === model ? "active" : ""}`}
                      onClick={() => {
                        setModel(m);
                        setIsMenuOpen(false);
                      }}
                    >
                      <svg className="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                      <span>{m}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Send / Stop Button */}
          <button 
            className={`send ${isStreaming ? "stop" : ""}`} 
            disabled={isSendDisabled}
            onClick={handleSend}
          >
            {isStreaming ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="hint">
        <span>model: {model || "—"}</span>
        <span>Enter kirim · Shift+Enter baris baru</span>
      </div>
    </div>
  );
}
