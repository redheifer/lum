import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@babel/runtime/helpers/esm/extends": path.resolve(__dirname, "./src/utils/babel-helpers/extends.js"),
      "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose": path.resolve(__dirname, "./src/utils/babel-helpers/objectWithoutPropertiesLoose.js"),
      "@babel/runtime/helpers/esm/inheritsLoose": path.resolve(__dirname, "./src/utils/babel-helpers/inheritsLoose.js"),
      "@babel/runtime/helpers/esm/assertThisInitialized": path.resolve(__dirname, "./src/utils/babel-helpers/assertThisInitialized.js"),
      'react-transition-group': path.resolve(__dirname, 'node_modules/react-transition-group/cjs/index.js')
    },
  },
  optimizeDeps: {
    include: ['react-transition-group'],
    esbuildOptions: {
      external: [
        '@babel/runtime/helpers/esm/inheritsLoose',
        '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose',
        '@babel/runtime/helpers/esm/extends',
        '@babel/runtime/helpers/esm/assertThisInitialized'
      ]
    }
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase the warning limit to 1000kb
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react', 
            'react-dom', 
            'react-router-dom',
            '@tanstack/react-query'
          ],
          ui: [
            '@radix-ui/react-avatar',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-select',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast'
          ],
          charts: ['recharts']
        }
      }
    }
  }
}));
