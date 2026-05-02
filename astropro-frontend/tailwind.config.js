/** @type {import('tailwindcss').Config} */
module.exports = {
  // This line is CRITICAL. It tells Tailwind to look for the 'dark' 
  // class on the <html> tag that your ThemeContext provides.
  darkMode: 'class', 
  
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // You can add your custom animations here to keep the 
      // CosmicBackground component clean and fast.
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};