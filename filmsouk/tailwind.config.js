/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  "./src/app/**/*.{js,ts,jsx,tsx}",
  "./src/components/**/*.{js,ts,jsx,tsx}",
  "./src/pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      scrollbar: ['hidden'],
        colors: {
         "filmsouk-gold": "#D4AF37", // your logo’s gold
        "filmsouk-gray": "#A0A0A0",
        "filmsouk-black": "#000000",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
