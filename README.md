<div align="center">
  <h1>🚀 BTG.AI - Little LLM Console</h1>
  <p><strong>Console LLM Paling Estetik, Simetris, & Sat-Set buat Local Workspace Kamu! 🌟</strong></p>
  
  <p>
    <a href="#-kenapa-harus-btgai">Kenapa BTG.AI?</a> •
    <a href="#-fitur-utama-yang-bikin-candu">Fitur Utama</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-cara-menjalankan">Cara Install</a>
  </p>
</div>

---

## 🔥 Kenapa Harus BTG.AI?

Bosan dengan UI AI yang kaku dan gitu-gitu aja? **BTG.AI (Little LLM Console)** hadir buat ngasih kamu *experience* ala ChatGPT / Gemini versi premium tapi langsung jalan di komputer lokal kamu!

UI-nya dirancang dengan obsesi tingkat tinggi terhadap **simetri** dan **estetika**. Gak cuma enak dilihat, aplikasinya juga sangat responsif, mendukung riwayat chat (*persistent history*), dan siap meladeni teks maupun gambar (*multimodal-ready*) lewat API LiteLLM.

## ✨ Fitur Utama yang Bikin Candu

- 🎨 **Layout Ala Gemini (Super Clean!):** Mengusung desain *sidebar* modern yang bisa di-*collapse*, memberikan ruang obrolan yang lega tanpa menghilangkan akses kontrol.
- 💾 **Riwayat Chat Abadi:** Gak sengaja ketutup tab-nya? Tenang! Semua sesi *chat* kamu otomatis tersimpan di memori *browser* (*local storage*). Lanjut ngobrol kapan aja!
- 📋 **Satu Klik, Beres:** Nemu kode atau balasan AI yang bagus? Klik aja tombol "Copy" di bawah pesannya. Ada animasi centang kecil yang *satisfying* pas di-klik! ✅
- 📸 **Multimodal Vision:** Tarik gambar ke dalam obrolan, dan biarkan AI menganalisanya secara visual (menggunakan model VLM).
- 📐 **Simetri Sempurna:** *Button* rekomendasi topik dan *grid settings* dibuat sejajar sempurna. *Chef's kiss!* 🤌
- ⚡ **Tanpa Lemot:** *React Context* dan *Next.js Turbopack* bikin perpindahan sesi dan pengiriman pesan terasa instan tanpa interupsi *loading* yang ngeselin.

## 🛠 Tech Stack

Bukan asal bikin, aplikasinya ditenagai oleh tumpukan teknologi modern:
- **Core:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Bahasa:** [TypeScript](https://www.typescriptlang.org/) (Biar minim error & gampang di-maintain)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + Custom CSS Variables ala RDPGrid
- **State:** React Context API (Ringan, tanpa *Redux* yang ribet)
- **AI Engine:** Kompatibel penuh dengan *endpoint* OpenAI / LiteLLM

---

## 🎮 Cara Menjalankan

Gampang banget kok, cukup 4 langkah simpel ini:

1. **Clone repository ini** ke komputer kamu:
   ```bash
   git clone https://github.com/ardianrifendy/rdpgrid-console.git
   cd rdpgrid-console
   ```
2. **Install semua library-nya:**
   ```bash
   npm install
   ```
3. **Nyalakan mesin roketnya (Dev Server):**
   ```bash
   npm run dev
   ```
4. **Gas Ngobrol!** Buka [http://localhost:3000](http://localhost:3000) di browser favorit kamu dan nikmati interaksinya! 🎉

---

## 🔮 Rencana ke Depan (Roadmap)
- [ ] Opsi penggantian Model/Engine AI langsung dari UI
- [ ] Sinkronisasi riwayat chat via *Cloud* (Firebase/Supabase)
- [ ] Kustomisasi *Persona AI* sesuai selera

<br/>

<div align="center">
  <sub>Dibangun dengan ❤️ dan obsesi untuk <i>UI/UX</i> yang sempurna.</sub>
</div>
