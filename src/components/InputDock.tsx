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

  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
    // reset input to allow uploading same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const handleSend = () => {
    if (isStreaming) {
      abortStreaming();
      return;
    }

    if (!inputText.trim() && !imagePreview) return;

    sendMessage(inputText, imagePreview);
    setInputText("");
    setImagePreview(null);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const isSendDisabled = (!inputText.trim() && !imagePreview) || (!model && !isStreaming);

  return (
    <div className="composer">
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        className="hidden" 
      />

      <div className="composer-in">
        {imagePreview && (
          <div className="flex items-start mb-2.5 animate-rise">
            <div className="relative w-36 h-28 bg-[#0b0d13] border border-line rounded-xl p-3 flex flex-col justify-between">
              {/* Close button */}
              <button 
                onClick={removeImage}
                className="absolute top-2 right-2 h-5 w-5 rounded-full bg-line hover:bg-line-2 text-txt-dim hover:text-txt flex items-center justify-center text-[10px] font-bold transition-colors cursor-pointer"
                title="Hapus"
              >
                ✕
              </button>
              
              {/* File Info */}
              <div className="flex flex-col gap-0.5 overflow-hidden">
                <span className="font-mono text-[11px] font-semibold text-txt truncate pr-4" title="attachment.png">
                  attachment.png
                </span>
                <span className="text-[10px] text-txt-faint">
                  Gambar Vision
                </span>
              </div>
              
              {/* Badge & Mini Thumbnail */}
              <div className="flex items-end justify-between">
                <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-line-2 text-txt-dim uppercase">
                  IMG
                </span>
                <div className="h-8 w-8 rounded border border-line-2 overflow-hidden flex-none">
                  <img src={imagePreview} alt="Thumb" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
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
            className="icon-btn h-9 w-9 border-none bg-transparent hover:bg-panel-2 rounded-lg mr-1 cursor-pointer flex items-center justify-center"
            title="Unggah Gambar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </button>

          {/* Model Selector Dropdown */}
          <div className={`model-select ${isMenuOpen ? "open" : ""}`} ref={menuRef}>
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
