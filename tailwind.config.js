/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './features/**/*.{js,ts,jsx,tsx}', './components/components/**/*.{js,ts,jsx,tsx}', './node_modules/@heathmont/moon-core-tw/**/*.{js,ts,jsx,tsx}', './node_modules/@heathmont/moon-table-tw/**/*.{js,ts,jsx,tsx}'],
  presets: [require('@heathmont/moon-core-tw/lib/private/presets/ds-moon-preset.js')],
  theme: {
    extend: {
      minHeight: {
        'full-min-header': 'calc(100vh - 80px)'
      },
      backgroundColor: {
        brief: 'rgba(31, 31, 31, 1)'
      },
      textColor: {
        brief: 'rgba(31, 31, 31, 1)'
      },
      screens: {
        xs: '460px'
      }
    }
  }
};
