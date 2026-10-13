/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/features/**/*.{js,jsx}",
    "./src/hooks/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Light admin theme (Himalayan Teal) ──
        "admin-bg":       "#F4F5F3",  // Pale Stone — dashboard background
        "admin-sidebar":  "#202D39",  // Deep Ink Blue — sidebar
        "admin-card":     "#FFFFFF",  // Pure White — cards & surfaces
        "admin-border":   "#E2E7E5",  // Soft Gray — borders & dividers
        "admin-text":     "#25313C",  // Charcoal — primary text
        "admin-muted":    "#74808B",  // Slate Gray — secondary text

        // ── Brand & accents ──
        "gold":           "#C4654A",  // (remapped) brand accent → terracotta
        "terracotta":     "#C4654A",  // Small brand accents
        "terracotta-dark":"#8B2E1A",
        "teal":           "#327C79",  // Himalayan Teal — primary buttons
        "teal-dark":      "#25615F",  // Deep Teal — primary hover
        "mist":           "#E6F1EE",  // Mist Teal — subtle selected bg

        // ── Sidebar (dark surface — separate text tokens) ──
        "sidebar-text":   "#E6E9EF",
        "sidebar-muted":  "#8B99A8",
        "sidebar-active": "#344656",  // Blue Slate — active item
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
