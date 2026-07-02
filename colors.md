export default {
  theme: {
    extend: {
      colors: {
        base: {
          bg: "#0C0C0C",      // Hitam pekat untuk latar belakang utama
          ink: "#FFFFFF",     // Teks utama beralih ke putih
          surface: "#1A1A1A", // Abu-abu sangat gelap untuk card background
          border: "#000000",  // Border tetap HITAM untuk mempertahankan gaya brutal
        },
        accent: {
          lime: "#E1FF66",    // Sedikit disesuaikan agar lebih menyala di latar gelap
          pink: "#FF5E9E",    // Sedikit lebih terang
          orange: "#FF7E36",  // Sedikit lebih vibrant
          blue: "#59A5FF",    // Warna biru yang disesuaikan untuk kontras gelap
        },
        feedback: {
          success: "#00E676", // Hijau neon yang kontras dengan gelap
          danger: "#FF453A",  // Merah terang standar dark mode
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        // Dalam neo-brutalisme gelap, shadow tetap menggunakan warna hitam pekat (#000000) 
        // di atas permukaan card (#1A1A1A) untuk memberikan efek kedalaman yang tegas.
        brutal: "4px 4px 0px #000000",
        "brutal-sm": "2px 2px 0px #000000",
        "brutal-lg": "8px 8px 0px #000000",
        "brutal-pressed": "1px 1px 0px #000000",
        "brutal-accent": "4px 4px 0px #E1FF66", // Menggunakan lime dark mode
        // Opsi tambahan jika ingin shadow menyala (glow/neon brutal):
        "brutal-light": "4px 4px 0px #FFFFFF", 
      },
      borderWidth: { 3: "3px" },
      borderRadius: { brutal: "4px" },
    },
  },
};