import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        "surface-hover": "var(--surface-hover)",
        "surface-pressed": "var(--surface-pressed)",
        border: "var(--border)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary": "var(--text-tertiary)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
      },
      backgroundColor: {
        glass: "var(--glass-background)",
      },
      borderColor: {
        glass: "var(--glass-border)",
      },
      boxShadow: {
        glass: "var(--glass-shadow)",
      },
      borderRadius: {
        apple: "var(--radius)",
        "apple-sm": "var(--radius-sm)",
        "apple-lg": "var(--radius-lg)",
        "apple-xl": "var(--radius-xl)",
      },
    },
  },
  plugins: [typography],
};

export default config;
