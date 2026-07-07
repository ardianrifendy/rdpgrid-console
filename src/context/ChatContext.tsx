"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type MessageContent = string | { type: "text" | "image_url"; text?: string; image_url?: { url: string } }[];

export interface Message {
  role: "system" | "user" | "assistant";
  content: MessageContent;
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: number;
  messages: Message[];
}

export interface AISkills {
  coding: boolean;
  logicMath: boolean;
  creative: boolean;
  security: boolean;
  translation: boolean;
  dataAnalysis: boolean;
  brainstorm: boolean;
  academic: boolean;
}

interface ChatConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  username: string;
  aiSkills: AISkills;
}

interface ChatContextProps {
  messages: Message[];
  baseUrl: string;
  apiKey: string;
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  username: string;
  isStreaming: boolean;
  isSettingsOpen: boolean;
  availableModels: string[];
  statusState: "" | "on" | "err";
  statusText: string;
  inputText: string;
  isOnboarded: boolean;
  isTourActive: boolean;
  aiSkills: AISkills;
  sessions: ChatSession[];
  currentSessionId: string | null;
  loadSession: (id: string) => void;
  deleteSession: (id: string) => void;
  
  setBaseUrl: (val: string) => void;
  setApiKey: (val: string) => void;
  setModel: (val: string) => void;
  setSystemPrompt: (val: string) => void;
  setTemperature: (val: number) => void;
  setMaxTokens: (val: number) => void;
  setUsername: (val: string) => void;
  setIsSettingsOpen: (val: boolean) => void;
  setInputText: (val: string) => void;
  setIsOnboarded: (val: boolean) => void;
  setIsTourActive: (val: boolean) => void;
  setAiSkills: (val: AISkills) => void;
  
  connect: () => Promise<void>;
  sendMessage: (text: string, imagesBase64: string[]) => Promise<void>;
  clearHistory: () => void;
  abortStreaming: () => void;
}

const DEFAULT_CONFIG: ChatConfig = {
  baseUrl: "https://api.rdpgrid.com",
  apiKey: "sk--VRdOaGubw--X7km0Bnvcw",
  model: "",
  systemPrompt: "",
  temperature: 0.3,
  maxTokens: 2048,
  username: "",
  aiSkills: {
    coding: false,
    logicMath: false,
    creative: false,
    security: false,
    translation: false,
    dataAnalysis: false,
    brainstorm: false,
    academic: false
  }
};

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [baseUrl, setBaseUrl] = useState(DEFAULT_CONFIG.baseUrl);
  const apiKey = "sk--VRdOaGubw--X7km0Bnvcw";
  const [model, setModel] = useState(DEFAULT_CONFIG.model);
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_CONFIG.systemPrompt);
  const [temperature, setTemperature] = useState(DEFAULT_CONFIG.temperature);
  const [maxTokens, setMaxTokens] = useState(DEFAULT_CONFIG.maxTokens);
  const [username, setUsername] = useState(DEFAULT_CONFIG.username);
  const [aiSkills, setAiSkills] = useState<AISkills>(DEFAULT_CONFIG.aiSkills);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [statusState, setStatusState] = useState<"" | "on" | "err">("");
  const [statusText, setStatusText] = useState("Belum konek");
  const [inputText, setInputText] = useState("");
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(true);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rdpgrid_cfg");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.baseUrl !== undefined) setBaseUrl(parsed.baseUrl);
        if (parsed.model !== undefined) setModel(parsed.model);
        if (parsed.system !== undefined) setSystemPrompt(parsed.system);
        if (parsed.temp !== undefined) setTemperature(Number(parsed.temp));
        if (parsed.maxTokens !== undefined) setMaxTokens(Number(parsed.maxTokens));
        if (parsed.username !== undefined) setUsername(parsed.username);
        if (parsed.aiSkills !== undefined) setAiSkills(parsed.aiSkills);
      }
      const onboarded = localStorage.getItem("rdpgrid_onboarded");
      if (onboarded !== "true") {
        setIsOnboarded(false);
      }
      const savedSessions = localStorage.getItem("rdpgrid_sessions");
      if (savedSessions) {
        setSessions(JSON.parse(savedSessions));
      }
      const savedCurrentSessionId = localStorage.getItem("rdpgrid_current_session");
      if (savedCurrentSessionId) {
        setCurrentSessionId(savedCurrentSessionId);
      }
    } catch (e) {
      console.error("Failed to load local storage configurations", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("rdpgrid_sessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem("rdpgrid_current_session", currentSessionId);
    } else {
      localStorage.removeItem("rdpgrid_current_session");
    }
  }, [currentSessionId]);

  // Save changes to local storage
  const saveConfig = useCallback((key: keyof ChatConfig, value: any) => {
    try {
      const saved = localStorage.getItem("rdpgrid_cfg");
      const current = saved ? JSON.parse(saved) : {};
      current[key === "systemPrompt" ? "system" : key === "temperature" ? "temp" : key] = value;
      localStorage.setItem("rdpgrid_cfg", JSON.stringify(current));
    } catch (e) {
      console.error("Failed to save config to local storage", e);
    }
  }, []);

  const handleSetBaseUrl = (val: string) => { setBaseUrl(val); saveConfig("baseUrl", val); };
  const handleSetApiKey = () => {};
  const handleSetModel = (val: string) => { setModel(val); saveConfig("model", val); };
  const handleSetSystemPrompt = (val: string) => { setSystemPrompt(val); saveConfig("systemPrompt", val); };
  const handleSetTemperature = (val: number) => { setTemperature(val); saveConfig("temperature", val); };
  const handleSetMaxTokens = (val: number) => { setMaxTokens(val); saveConfig("maxTokens", val); };
  const handleSetUsername = (val: string) => { setUsername(val); saveConfig("username", val); };
  const handleSetAiSkills = (val: AISkills) => { setAiSkills(val); saveConfig("aiSkills", val); };

  const connect = useCallback(async () => {
    const trimmedBaseUrl = baseUrl.trim().replace(/\/+$/, "");
    const trimmedApiKey = apiKey.trim();

    if (!trimmedApiKey) {
      setStatusState("err");
      setStatusText("Key kosong");
      return;
    }

    setStatusState("");
    setStatusText("Konek…");

    try {
      const response = await fetch(`${trimmedBaseUrl}/v1/models`, {
        headers: { Authorization: `Bearer ${trimmedApiKey}` }
      });

      if (response.status === 401) {
        setStatusState("err");
        setStatusText("Key ditolak (401)");
        return;
      }
      if (!response.ok) {
        setStatusState("err");
        setStatusText(`Error ${response.status}`);
        return;
      }

      const data = await response.json();
      const modelsList: string[] = (data.data || []).map((m: any) => m.id).sort();

      if (!modelsList.length) {
        setStatusState("err");
        setStatusText("Tidak ada model");
        return;
      }

      setAvailableModels(modelsList);
      
      // Auto select first model if currently empty or not in the retrieved list
      if (!modelsList.includes(model)) {
        const defaultModel = modelsList[0];
        setModel(defaultModel);
        saveConfig("model", defaultModel);
      }

      setStatusState("on");
      setStatusText(`${modelsList.length} model siap`);
    } catch (e: any) {
      setStatusState("err");
      setStatusText("Gagal konek");
      console.error(e);
    }
  }, [baseUrl, apiKey, model, saveConfig]);

  // Autoconnect on mount if base url & api key are ready
  useEffect(() => {
    if (baseUrl && apiKey) {
      connect();
    }
  }, [connect]);

  const clearHistory = () => {
    setMessages([]);
    setCurrentSessionId(null);
  };

  const loadSession = (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      setMessages(session.messages);
      setCurrentSessionId(session.id);
    }
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (currentSessionId === id) {
      clearHistory();
    }
  };

  const abortStreaming = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  const sendMessage = async (text: string, imagesBase64: string[]) => {
    if ((!text.trim() && imagesBase64.length === 0) || isStreaming) return;

    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    let contentPayload: MessageContent = text;
    if (imagesBase64.length > 0) {
      contentPayload = [
        { type: "text", text: text || "What is in these images?" },
        ...imagesBase64.map((img) => ({ type: "image_url" as const, image_url: { url: img } }))
      ];
    }

    const newUserMsg: Message = { role: "user", content: contentPayload };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setIsStreaming(true);

    let activeSessionId = currentSessionId;
    if (!activeSessionId) {
      activeSessionId = Date.now().toString();
      setCurrentSessionId(activeSessionId);
      const title = typeof text === "string" && text.trim() ? text.trim().substring(0, 30) + "..." : "Chat dengan Gambar";
      const finalId = activeSessionId;
      setSessions(prev => [{ id: finalId, title, updatedAt: Date.now(), messages: updatedMessages }, ...prev]);
    } else {
      const finalId = activeSessionId;
      setSessions(prev => prev.map(s => s.id === finalId ? { ...s, messages: updatedMessages, updatedAt: Date.now() } : s));
    }

    const controller = new AbortController();
    setAbortController(controller);

    // Build standard payload
    const payload: Message[] = [];
    let finalSystemPrompt = systemPrompt.trim();
    
    // Add active skills instructions
    const activeSkillsInstructions: string[] = [];
    if (aiSkills.coding) {
      activeSkillsInstructions.push("Pakar Pemrograman: Berikan solusi kode yang bersih, aman, terdokumentasi, efisien, dan ikuti best practices terbaru.");
    }
    if (aiSkills.logicMath) {
      activeSkillsInstructions.push("Logika & Matematika: Gunakan pendekatan analitis, matematis, dan logis yang mendalam serta runtut dalam memecahkan masalah.");
    }
    if (aiSkills.creative) {
      activeSkillsInstructions.push("Kreatif & Copywriting: Gunakan gaya bahasa yang indah, persuasif, dan estetis untuk membuat konten tulisan/copywriting.");
    }
    if (aiSkills.security) {
      activeSkillsInstructions.push("Audit Keamanan: Evaluasi keamanan siber dari kode/data yang diberikan, temukan kerentanan (vulnerability), dan berikan rekomendasi proteksi.");
    }
    if (aiSkills.translation) {
      activeSkillsInstructions.push("Penerjemah & Lokalisasi: Terjemahkan teks secara natural, sesuaikan dengan dialek lokal/budaya target, bukan sekadar kata per kata.");
    }
    if (aiSkills.dataAnalysis) {
      activeSkillsInstructions.push("Analisis Data: Analisis informasi/data yang ada, temukan pola penting, dan sajikan ringkasan eksekutif yang terstruktur.");
    }
    if (aiSkills.brainstorm) {
      activeSkillsInstructions.push("Brainstorming Ide: Hasilkan berbagai opsi ide yang inovatif, unik, kreatif, dan tawarkan solusi alternatif out-of-the-box.");
    }
    if (aiSkills.academic) {
      activeSkillsInstructions.push("Penulisan Akademis: Gunakan gaya bahasa formal, ilmiah, obyektif, terstruktur rapi, dan berbasis fakta/bukti.");
    }

    if (activeSkillsInstructions.length > 0) {
      const skillsSection = "[INSTRUKSI KEMAMPUAN TAMBAHAN (Wajib Diikuti)]:\n- " + activeSkillsInstructions.join("\n- ");
      if (finalSystemPrompt) {
        finalSystemPrompt += "\n\n" + skillsSection;
      } else {
        finalSystemPrompt = skillsSection;
      }
    }

    if (finalSystemPrompt) {
      payload.push({ role: "system", content: finalSystemPrompt });
    }
    payload.push(...updatedMessages);

    // Initial assistant reply placeholder
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    let accumulatedContent = "";
    const trimmedBaseUrl = baseUrl.trim().replace(/\/+$/, "");

    try {
      const response = await fetch(`${trimmedBaseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: payload,
          stream: true,
          temperature,
          max_tokens: maxTokens
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errText}`);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const cleanedLine = line.trim();
          if (!cleanedLine.startsWith("data:")) continue;
          
          const dataContent = cleanedLine.slice(5).trim();
          if (dataContent === "[DONE]") continue;

          try {
            const parsed = JSON.parse(dataContent);
            const delta = parsed.choices?.[0]?.delta?.content || "";
            if (delta) {
              accumulatedContent += delta;
              setMessages(prev => {
                const copy = [...prev];
                if (copy.length > 0) {
                  copy[copy.length - 1] = { role: "assistant", content: accumulatedContent };
                }
                return copy;
              });
              // Note: We sync the final messages to the session in the finally block
            }
          } catch (err) {
            // Chunk line parsing error
          }
        }
      }
    } catch (e: any) {
      if (e.name === "AbortError") {
        setMessages(prev => {
          const copy = [...prev];
          if (copy.length > 0) {
            const last = copy[copy.length - 1];
            copy[copy.length - 1] = {
              role: "assistant",
              content: last.content + " *(dihentikan)*"
            };
          }
          return copy;
        });
      } else {
        setMessages(prev => {
          const copy = [...prev];
          if (copy.length > 0) {
            copy[copy.length - 1] = {
              role: "assistant",
              content: `⚠️ Error: ${e.message}`
            };
          }
          return copy;
        });
      }
    } finally {
      setIsStreaming(false);
      setAbortController(null);
      // Sync the final complete messages back to the active session
      setMessages(currentMessages => {
        setSessions(prev => prev.map(s => 
          s.id === activeSessionId ? { ...s, messages: currentMessages, updatedAt: Date.now() } : s
        ));
        return currentMessages;
      });
    }
  };

  return (
    <ChatContext.Provider value={{
      messages,
      baseUrl,
      apiKey,
      model,
      systemPrompt,
      temperature,
      maxTokens,
      username,
      isStreaming,
      isSettingsOpen,
      availableModels,
      statusState,
      statusText,
      inputText,
      isOnboarded,
      isTourActive,
      aiSkills,
      sessions,
      currentSessionId,
      
      setBaseUrl: handleSetBaseUrl,
      setApiKey: handleSetApiKey,
      setModel: handleSetModel,
      setSystemPrompt: handleSetSystemPrompt,
      setTemperature: handleSetTemperature,
      setMaxTokens: handleSetMaxTokens,
      setUsername: handleSetUsername,
      setIsSettingsOpen,
      setInputText,
      setIsOnboarded,
      setIsTourActive,
      setAiSkills: handleSetAiSkills,
      
      connect,
      sendMessage,
      clearHistory,
      abortStreaming,
      loadSession,
      deleteSession
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};
