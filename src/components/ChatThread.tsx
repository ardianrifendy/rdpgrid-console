"use client";

import { useChat, MessageContent } from "@/context/ChatContext";
import ReactMarkdown from "react-markdown";
import { useEffect, useRef, useState } from "react";

interface SubTopic {
  emo: string;
  label: string;
  p: string;
}

interface Topic {
  key: string;
  emo: string;
  label: string;
  title: string;
  subs: SubTopic[];
}

const TOPICS: Topic[] = [
  { key: 'olahraga', emo: '⚽', label: 'Olahraga', title: 'Olahraga apa?', subs: [
    { emo: '⚽', label: 'Sepak bola', p: 'Ceritain kabar terbaru sepak bola — hasil pertandingan besar, klasemen liga top Eropa, dan pemain lagi hot.' },
    { emo: '🏍️', label: 'MotoGP / F1', p: 'Update balapan MotoGP & F1 terakhir: pemenang, klasemen pembalap, dan jadwal seri berikutnya.' },
    { emo: '🏀', label: 'Basket (NBA)', p: 'Rangkum kondisi NBA sekarang: tim di puncak klasemen, MVP race, dan pertandingan seru minggu ini.' },
    { emo: '🏸', label: 'Badminton', p: 'Update bulu tangkis: pemain Indonesia yang lagi bagus, turnamen BWF terdekat, dan ranking dunia.' },
    { emo: '🥊', label: 'Tinju / MMA', p: 'Kabar tinju & MMA terbaru: laga besar yang sudah/akan berlangsung dan juara di tiap kelas.' },
    { emo: '💪', label: 'Fitness & lari', p: 'Bikinin program latihan pemula buat naikin stamina & kekuatan, plus tips biar konsisten.' },
  ]},
  { key: 'musik', emo: '🎵', label: 'Musik', title: 'Genre / topik musik apa?', subs: [
    { emo: '🎧', label: 'Rekomendasi lagu', p: 'Rekomendasi 10 lagu enak buat nemenin kerja/santai, dari berbagai genre. Kasih alasan singkat tiap lagu.' },
    { emo: '🎸', label: 'Rock / Indie', p: 'Rekomendasi band & lagu rock/indie yang wajib didengerin, dari klasik sampai yang lagi naik daun.' },
    { emo: '🎹', label: 'Pop', p: 'Lagu pop hits terkini yang lagi viral dan enak buat playlist harian.' },
    { emo: '🎷', label: 'Jazz / Lo-fi', p: 'Rekomendasi jazz & lo-fi buat fokus kerja atau santai malam. Sebutin artis dan album-nya.' },
    { emo: '🇮🇩', label: 'Musik Indonesia', p: 'Rekomendasi lagu Indonesia terbaik lintas era — pop, indie, dangdut modern — yang wajib masuk playlist.' },
    { emo: '🎼', label: 'Belajar musik', p: 'Aku mau mulai belajar alat musik. Kasih saran alat yang cocok buat pemula dan cara mulai latihannya.' },
  ]},
  { key: 'ngoding', emo: '💻', label: 'Ngoding', title: 'Soal ngoding apa?', subs: [
    { emo: '🔌', label: 'ESP32 / Arduino', p: 'Jelasin cara bikin scanner barcode IMEI pakai ESP32 — komponen yang dibutuhin dan garis besar kodenya.' },
    { emo: '🐍', label: 'Python', p: 'Aku mau belajar/ngoprek Python. Kasih ide project kecil yang berguna dan cara mulainya.' },
    { emo: '🌐', label: 'Web / Frontend', p: 'Bantu aku bikin halaman web sederhana. Jelasin struktur HTML/CSS/JS dasarnya dengan contoh.' },
    { emo: '🐞', label: 'Perbaiki bug', p: 'Aku ada kode yang error. Aku bakal paste kodenya — bantu carikan bug dan solusinya ya.' },
    { emo: '🤖', label: 'Otomasi', p: 'Kasih ide skrip otomasi yang bisa mempercepat kerjaan sehari-hari, plus contoh implementasinya.' },
    { emo: '💡', label: 'Ide project', p: 'Kasih 5 ide project ngoding yang praktis dan bisa dipakai buat bisnis/toko, dari yang gampang sampai menantang.' },
  ]},
  { key: 'bisnis', emo: '🛒', label: 'Bisnis & Toko', title: 'Butuh bantuan apa?', subs: [
    { emo: '📣', label: 'Caption promo WA', p: 'Bikinin caption promo WhatsApp buat produk HP baru — singkat, menarik, dan bikin orang pengen tanya.' },
    { emo: '📈', label: 'Strategi jualan', p: 'Kasih strategi naikin penjualan toko HP di Shopee/Tokopedia/TikTok Shop yang praktis dan bisa langsung dipakai.' },
    { emo: '✍️', label: 'Copywriting', p: 'Bantu bikin deskripsi produk yang jualan banget buat listing marketplace. Aku kasih detail produknya.' },
    { emo: '💰', label: 'Riset harga', p: 'Bantu aku analisa strategi harga yang kompetitif tapi tetap untung buat produk elektronik.' },
    { emo: '📱', label: 'Konten sosmed', p: 'Kasih 7 ide konten TikTok/IG buat toko HP yang engaging dan gampang dieksekusi.' },
    { emo: '🤝', label: 'Balas customer', p: 'Bantu bikin template balasan chat customer yang ramah & profesional buat berbagai situasi (nawar, komplain, nanya stok).' },
  ]},
  { key: 'santai', emo: '🎯', label: 'Hobi & Santai', title: 'Mau ngobrolin apa?', subs: [
    { emo: '⌚', label: 'Jam tangan', p: 'Rekomendasi accessory buat Seiko Prospex Samurai — strap & clasp yang cocok, plus tips perawatan jam otomatis.' },
    { emo: '🎬', label: 'Film & series', p: 'Rekomendasi 5 film/series bagus yang worth ditonton akhir pekan ini, dari berbagai genre.' },
    { emo: '📚', label: 'Buku', p: 'Rekomendasi buku menarik buat nambah wawasan bisnis & teknologi, yang gampang dicerna.' },
    { emo: '🍜', label: 'Kuliner', p: 'Kasih ide masakan/kuliner enak yang gampang dibuat atau wajib dicoba.' },
    { emo: '🧠', label: 'Fakta unik', p: 'Kasih 5 fakta unik & mind-blowing hari ini yang jarang orang tahu.' },
    { emo: '✈️', label: 'Jalan-jalan', p: 'Rekomendasi tempat wisata seru yang cocok buat liburan santai. Aku kasih tahu preferensiku.' },
  ]},
  { key: 'belajar', emo: '📖', label: 'Belajar', title: 'Mau belajar apa?', subs: [
    { emo: '🔍', label: 'Jelasin konsep', p: 'Jelasin sebuah konsep yang aku sebutin dengan bahasa sederhana dan analogi yang gampang dipahami.' },
    { emo: '📝', label: 'Ringkas materi', p: 'Bantu ringkas materi/artikel panjang jadi poin-poin penting. Aku bakal paste materinya.' },
    { emo: '🌍', label: 'Bahasa asing', p: 'Aku mau belajar bahasa Inggris. Kasih tips praktis dan latihan sederhana buat mulai.' },
    { emo: '❓', label: 'Bikin kuis', p: 'Buatin kuis singkat buat nguji pemahaman soal topik yang aku sebutin.' },
    { emo: '🧮', label: 'Bantu hitung', p: 'Bantu aku hitung/analisa data. Aku bakal jelasin angkanya nanti.' },
    { emo: '💬', label: 'Tanya bebas', p: 'Halo asisten!' },
  ]},
];

function RenderMessageContent({ content }: { content: MessageContent }) {
  if (typeof content === "string") {
    return <ReactMarkdown>{content}</ReactMarkdown>;
  }

  return (
    <div className="flex flex-col gap-2">
      {content.map((item, idx) => {
        if (item.type === "text") {
          return <ReactMarkdown key={idx}>{item.text || ""}</ReactMarkdown>;
        }
        if (item.type === "image_url" && item.image_url?.url) {
          return (
            <div key={idx} className="mt-2 max-w-full rounded-lg overflow-hidden border border-line-2">
              <img 
                src={item.image_url.url} 
                alt="Vision Input" 
                className="max-h-72 object-contain"
              />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

function CopyButton({ content }: { content: MessageContent }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const textToCopy = typeof content === 'string' 
      ? content 
      : content.map(c => c.text || '').join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="p-1.5 mt-2 flex items-center gap-1.5 text-[11px] text-[var(--txt-dim)] hover:text-[var(--txt)] hover:bg-[var(--panel-2)] rounded-md transition-colors"
      title="Salin pesan"
    >
      {copied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--mint)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span style={{ color: 'var(--mint)' }}>Tersalin</span>
        </>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      )}
    </button>
  );
}

export default function ChatThread() {
  const { messages, isStreaming, model, username, setInputText } = useChat();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isStreaming]);

  const handleSubClick = (pText: string) => {
    setInputText(pText);
    const textarea = document.getElementById("input") as HTMLTextAreaElement | null;
    if (textarea) {
      textarea.focus();
      textarea.style.height = "auto";
      setTimeout(() => {
        textarea.style.height = `${Math.min(textarea.scrollHeight, 190)}px`;
      }, 50);
    }
  };

  const getGreetingName = () => {
    return (username && username.trim()) ? username.trim() : "Rifendy";
  };

  return (
    <div className="scroll" ref={scrollRef} id="scroll">
      <div className="thread" id="thread">
        
        {messages.length === 0 && (
          <div className="empty" id="empty">
            <div className="badge">
              <span className="dot on"></span>
              <span>Siap</span>
            </div>
            <h1>Halo, <span className="g">{getGreetingName()}</span>.<br/>Mau ngobrol apa hari ini?</h1>
            <p>Pilih topik di bawah, nanti muncul pilihan lebih spesifik.</p>
            
            <div className="explorer">
              <div className="cat-head">
                {selectedTopic && (
                  <button className="cat-back" onClick={() => setSelectedTopic(null)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6"/>
                    </svg>
                    Balik
                  </button>
                )}
                <span className="cat-title">
                  {selectedTopic ? `${selectedTopic.label} · ${selectedTopic.title}` : "Pilih topik"}
                </span>
              </div>

              {!selectedTopic ? (
                <div className="cat-grid">
                  {TOPICS.map((t) => (
                    <div key={t.key} className="cat-item" onClick={() => setSelectedTopic(t)}>
                      <span className="emo">{t.emo}</span>
                      <span className="lbl">{t.label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="cat-grid subs">
                  {selectedTopic.subs.map((s, idx) => (
                    <div key={idx} className="cat-item" onClick={() => handleSubClick(s.p)}>
                      <span className="emo">{s.emo}</span>
                      <span className="lbl">{s.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          return (
            <div key={index} className={`msg ${isUser ? "user" : "bot"}`}>
              <div className="av">{isUser ? "YOU" : "AI"}</div>
              <div className="bubble flex flex-col items-start">
                <div className="who">{isUser ? "Kamu" : (model || "AI")}</div>
                <div className="content">
                  <RenderMessageContent content={msg.content} />
                  {isStreaming && !isUser && index === messages.length - 1 && (
                    <span className="cursor"></span>
                  )}
                </div>
                {!isUser && (!isStreaming || index !== messages.length - 1) && (
                  <CopyButton content={msg.content} />
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
