/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        syne: ["Syne_400Regular"],
        "syne-bold": ["Syne_700Bold"],
        "space-grotesk": ["SpaceGrotesk_400Regular"],
        "space-grotesk-bold": ["SpaceGrotesk_700Bold"]
      },
    },
  },
  plugins: [],
}

