export default {
  theme: {
    extend: {
      colors: {
        base: {
          bg: "#F4F4F0",      // Off-white background
          ink: "#000000",     // Border & teks utama
          surface: "#FFFFFF", // Card background
        },
        accent: {
          lime: "#D4FF3F",
          pink: "#FF3F8E",
          orange: "#FF6B1A",
          blue: "#3F8EFF",    // aksen tersier untuk grafik kedua
        },
        feedback: {
          success: "#00C853",
          danger: "#FF3B30",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],  // Heading, label besar
        mono: ["'JetBrains Mono'", "monospace"],      // Angka
        body: ["'Inter'", "sans-serif"],               // Paragraf, deskripsi
      },
      boxShadow: {
        brutal: "4px 4px 0px #000000",
        "brutal-sm": "2px 2px 0px #000000",
        "brutal-lg": "8px 8px 0px #000000",
        "brutal-pressed": "1px 1px 0px #000000",
        "brutal-accent": "4px 4px 0px #D4FF3F",
      },
      borderWidth: { 3: "3px" },
      borderRadius: { brutal: "4px" },
    },
  },
};