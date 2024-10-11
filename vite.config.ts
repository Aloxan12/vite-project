import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import federation from "@originjs/vite-plugin-federation";

// https://vitejs.dev/config/
export default defineConfig({
  // base: '/vite-project/',
  plugins: [
    react(),
    // federation({
    //   name: "todoList",
    //   filename: "remoteEntry.js",
    //   exposes: {
    //     "./TodoList": "./src/App",
    //     "./components": "./src/components/Checkbox/AppCheckbox.tsx",
    //   },
    //   shared: ["react", "react-dom", 'mobx', 'axios', 'mobx-react'],
    // }),
  ],
  build: {
    outDir: 'dist',
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
})
