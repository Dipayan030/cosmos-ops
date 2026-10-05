/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        syne: ["Syne_400Regular"],
        "syne-bold": ["Syne_700Bold"],
      },
    },
  },
  plugins: [],
}

