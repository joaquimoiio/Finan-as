/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores de destaque do sistema
        receita: '#00B050',
        despesa: '#FF4444',
        saldo: '#2E75B6',
        alerta: '#ED7D31',
        investimento: '#7B68EE',
      }
    },
  },
  plugins: [],
}
