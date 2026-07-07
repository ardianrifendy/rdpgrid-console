"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type MessageContent = string | { type: "text" | "image_url"; text?: string; image_url?: { url: string } }[];

export interface Message {
  role: "system" | "user" | "assistant";
  content: MessageContent;
}

interface ChatConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  username: string;
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
  
  setBaseUrl: (val: string) => void;
  setApiKey: (val: string) => void;
  setModel: (val: string) => void;
  setSystemPrompt: (val: string) => void;
  setTemperature: (val: number) => void;
  setMaxTokens: (val: number) => void;
  setUsername: (val: string) => void;
  setIsSettingsOpen: (val: boolean) => void;
  setInputText: (val: string) => void;
  
  connect: () => Promise<void>;
  sendMessage: (text: string, imageBase64: string | null) => Promise<void>;
  clearHistory: () => void;
  abortStreaming: () => void;
}

const DEFAULT_CONFIG: ChatConfig = {
  baseUrl: "https://api.rdpgrid.com",
  apiKey: "sk--VRdOaGubw--X7km0Bnvcw",
  model: "",
  systemPrompt: "",
  temperature: 0.7,
  maxTokens: 2048,
  username: ""
};

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [baseUrl, setBaseUrl] = useState(DEFAULT_CONFIG.baseUrl);
  const [apiKey, setApiKey] = useState(DEFAULT_CONFIG.apiKey);
  const [model, setModel] = useState(DEFAULT_CONFIG.model);
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_CONFIG.systemPrompt);
  const [temperature, setTemperature] = useState(DEFAULT_CONFIG.temperature);
  const [maxTokens, setMaxTokens] = useState(DEFAULT_CONFIG.maxTokens);
  const [username, setUsername] = useState(DEFAULT_CONFIG.username);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [statusState, setStatusState] = useState<"" | "on" | "err">("");
  const [statusText, setStatusText] = useState("Belum konek");
  const [inputText, setInputText] = useState("");
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rdpgrid_cfg");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.baseUrl !== undefined) setBaseUrl(parsed.baseUrl);
        if (parsed.apiKey !== undefined) setApiKey(parsed.apiKey);
        if (parsed.model !== undefined) setModel(parsed.model);
        if (parsed.system !== undefined) setSystemPrompt(parsed.system);
        if (parsed.temp !== undefined) setTemperature(Number(parsed.temp));
        if (parsed.maxTokens !== undefined) setMaxTokens(Number(parsed.maxTokens));
        if (parsed.username !== undefined) setUsername(parsed.username);
      }
    } catch (e) {
      console.error("Failed to load local storage configurations", e);
    }
  }, []);

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
  const handleSetApiKey = (val: string) => { setApiKey(val); saveConfig("apiKey", val); };
  const handleSetModel = (val: string) => { setModel(val); saveConfig("model", val); };
  const handleSetSystemPrompt = (val: string) => { setSystemPrompt(val); saveConfig("systemPrompt", val); };
  const handleSetTemperature = (val: number) => { setTemperature(val); saveConfig("temperature", val); };
  const handleSetMaxTokens = (val: number) => { setMaxTokens(val); saveConfig("maxTokens", val); };
  const handleSetUsername = (val: string) => { setUsername(val); saveConfig("username", val); };

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
  };

  const abortStreaming = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  const sendMessage = async (text: string, imageBase64: string | null) => {
    if ((!text.trim() && !imageBase64) || isStreaming) return;

    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    let contentPayload: MessageContent = text;
    if (imageBase64) {
      contentPayload = [
        { type: "text", text: text || "What is this image?" },
        { type: "image_url", image_url: { url: imageBase64 } }
      ];
    }

    const newUserMsg: Message = { role: "user", content: contentPayload };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setIsStreaming(true);

    const controller = new AbortController();
    setAbortController(controller);

    // Build standard payload
    const payload: Message[] = [];
    if (systemPrompt.trim()) {
      payload.push({ role: "system", content: systemPrompt });
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
      
      setBaseUrl: handleSetBaseUrl,
      setApiKey: handleSetApiKey,
      setModel: handleSetModel,
      setSystemPrompt: handleSetSystemPrompt,
      setTemperature: handleSetTemperature,
      setMaxTokens: handleSetMaxTokens,
      setUsername: handleSetUsername,
      setIsSettingsOpen,
      setInputText,
      
      connect,
      sendMessage,
      clearHistory,
      abortStreaming
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
