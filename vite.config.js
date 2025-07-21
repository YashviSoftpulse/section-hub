import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    API_URL: JSON.stringify("https://sectionhub.shopiapps.in"),
    
  },
  optimizeDeps: {
    include: [
      'react-syntax-highlighter',
      'react-syntax-highlighter/dist/esm/styles/prism/darcula'
    ]
  },
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks(id) {
  //         if (id.includes('node_modules')) {
  //          return 'vendor'
  //         }
  //       },
  //       chunkFileNames: 'assets/[name]-[hash].js',
  //       entryFileNames: 'assets/[name]-[hash].js',
  //       assetFileNames: 'assets/[name]-[hash].[ext]',
  //     },
  //   },
  // },
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: () => "everything",
      },
    },
  }

});
