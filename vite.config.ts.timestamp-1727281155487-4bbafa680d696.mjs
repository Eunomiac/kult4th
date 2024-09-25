// vite.config.ts
import { defineConfig } from "file:///D:/Projects/.CODING/FoundryVTT/FoundryV12DevData/Data/systems/kult4th/node_modules/vite/dist/node/index.js";
import path from "path";
import fs from "fs";
import checker from "file:///D:/Projects/.CODING/FoundryVTT/FoundryV12DevData/Data/systems/kult4th/node_modules/vite-plugin-checker/dist/esm/main.js";
import { visualizer } from "file:///D:/Projects/.CODING/FoundryVTT/FoundryV12DevData/Data/systems/kult4th/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import { exec } from "child_process";
import copy from "file:///D:/Projects/.CODING/FoundryVTT/FoundryV12DevData/Data/systems/kult4th/node_modules/rollup-plugin-copy/dist/index.commonjs.js";
var __vite_injected_original_dirname = "D:\\Projects\\.CODING\\FoundryVTT\\FoundryV12DevData\\Data\\systems\\kult4th";
var FOUNDRY_VERSION = 12;
var NUM_CHROME_PROFILES = parseInt(process.env.NUM_CHROME_PROFILES ?? "1", 10);
var PACKAGE_TYPE = "system";
var PACKAGE_ID = "kult4th";
var ENTRY_FILE_NAME = "kult4th";
var foundryPort = 3e4 + FOUNDRY_VERSION * 100;
var vitePort = foundryPort + 1;
function openChromePlugin() {
  return {
    name: "open-chrome",
    apply: "serve",
    // Only apply this plugin during development
    configResolved(chromeConfig) {
      if (chromeConfig.command === "serve") {
        for (let i = 0; i < NUM_CHROME_PROFILES; i++) {
          const command = `start chrome --start-maximized --remote-debugging-port=${String(9222 + i)} --auto-open-devtools-for-tabs --user-data-dir="D:/Projects/.CODING/FoundryVTT/ChromeDevProfile_${String(i + 1)}" http://localhost:${String(chromeConfig.server.port)}`;
          exec(command, (error) => {
            if (error) {
              console.error(`Failed to open Chrome instance #${String(i + 1)}:`, error);
            }
          });
        }
      }
    }
  };
}
function foundryPlugin() {
  const usesFoundryPlugin = Symbol("foundry-plugin");
  const externalsSourceMap = /* @__PURE__ */ new Map([
    ["gsap", "scripts/greensock/esm/all.js"]
  ]);
  console.log("ACTIVATING FOUNDRY PLUGIN");
  return {
    name: "foundry-plugin",
    resolveId(source) {
      if (externalsSourceMap.has(source)) {
        const id = externalsSourceMap.get(source);
        if (id) {
          return {
            id,
            // This is used to make sure that there's no later transformations during production.
            external: "absolute",
            meta: {
              [usesFoundryPlugin]: true
            }
          };
        }
      }
      return null;
    },
    load(id) {
      const moduleInfo = this.getModuleInfo(id);
      if (moduleInfo == null) {
        return null;
      }
      if (usesFoundryPlugin in moduleInfo.meta) {
        return `export * from /* @vite-ignore */ ${JSON.stringify(id)};`;
      }
      return null;
    }
  };
}
var hbsPlugin = {
  name: "hmr-handler",
  apply: "serve",
  handleHotUpdate(context) {
    if (context.file.startsWith("dist"))
      return;
    if (context.file.endsWith("en.json")) {
      const basePath = context.file.slice(context.file.indexOf("lang/"));
      fs.promises.copyFile(context.file, `dist/${basePath}`).then(() => {
        context.server.ws.send({
          type: "custom",
          event: "lang-update",
          data: { path: `systems/${PACKAGE_ID}/${basePath}` }
        });
      }).catch((error) => {
        console.error(`Failed to copy file: ${String(error)}`);
      });
    } else if (context.file.endsWith(".hbs")) {
      const basePath = context.file.slice(context.file.indexOf("templates/"));
      fs.promises.copyFile(context.file, `dist/${basePath}`).then(() => {
        context.server.ws.send({
          type: "custom",
          event: "template-update",
          data: { path: `systems/${PACKAGE_ID}/${basePath}` }
        });
      }).catch((error) => {
        console.error(`Failed to update file: ${String(error)}`);
      });
    }
  }
};
var config = defineConfig({
  // Setting the root directory for the project to the "src" folder
  root: "src",
  // Setting the base URL for the project when deployed
  base: `/${PACKAGE_TYPE}s/${PACKAGE_ID}/`,
  // Specifying the directory where static assets are located
  publicDir: path.resolve(__vite_injected_original_dirname, "public"),
  // Configuration for the development server
  server: {
    // Setting the port number for the development server
    port: vitePort,
    // Automatically open the project in the browser when the server starts
    open: false,
    // Configuring proxy rules for certain URLs
    proxy: {
      // Redirecting requests that do not start with "/systems/eunos-blades" to localhost:31100
      [`^(?!/${PACKAGE_TYPE}s/${PACKAGE_ID})`]: `http://localhost:${String(foundryPort)}/`,
      // Special proxy configuration for WebSocket connections used by socket.io
      "/socket.io": {
        target: `ws://localhost:${String(foundryPort)}`,
        // Target server for the proxy
        ws: true
        // Enable WebSocket support
      }
    },
    warmup: {
      clientFiles: [
        "./src/ts/libraries.ts",
        "./src/ts/scripts/utilities.ts"
      ]
    }
  },
  // Configuration for the build process
  build: {
    // Directory where the build output will be placed
    outDir: path.resolve(__vite_injected_original_dirname, "dist"),
    // Clear the output directory before building
    emptyOutDir: true,
    // Generate source maps for the build
    sourcemap: true,
    // Configuration for the Terser minifier
    minify: "terser",
    terserOptions: {
      mangle: false,
      // Disable mangling of variable and function names
      keep_classnames: true,
      // Preserve class names
      keep_fnames: true
      // Preserve function names
    },
    // Temporarily disable minification for output checking
    // minify: false,
    // Configuration for building a library
    lib: {
      name: ENTRY_FILE_NAME,
      // Name of the library
      entry: path.resolve(__vite_injected_original_dirname, `src/ts/${ENTRY_FILE_NAME}.ts`),
      // Entry point for the library
      formats: ["es"],
      // Output format(s) for the library
      fileName: "index"
      // Name for the output file(s)
    },
    rollupOptions: {
      external: [
        "gsap/all"
      ]
    }
  },
  resolve: {
    preserveSymlinks: true,
    alias: {
      "gsap/all": path.resolve(__vite_injected_original_dirname, "public/scripts/greensock/esm/all.js")
    }
  },
  plugins: [
    foundryPlugin(),
    checker({ typescript: true }),
    visualizer({
      gzipSize: true,
      template: "treemap"
    }),
    openChromePlugin(),
    copy({
      targets: [
        { src: "src/templates/**/*", dest: "dist" },
        { src: "public/assets/**/*", dest: "dist" }
      ],
      hook: "buildStart",
      copySync: true,
      flatten: false
    }),
    // hbsPlugin(),
    hbsPlugin
  ].filter(Boolean)
});
var vite_config_default = config;
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFwuQ09ESU5HXFxcXEZvdW5kcnlWVFRcXFxcRm91bmRyeVYxMkRldkRhdGFcXFxcRGF0YVxcXFxzeXN0ZW1zXFxcXGt1bHQ0dGhcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFByb2plY3RzXFxcXC5DT0RJTkdcXFxcRm91bmRyeVZUVFxcXFxGb3VuZHJ5VjEyRGV2RGF0YVxcXFxEYXRhXFxcXHN5c3RlbXNcXFxca3VsdDR0aFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovUHJvamVjdHMvLkNPRElORy9Gb3VuZHJ5VlRUL0ZvdW5kcnlWMTJEZXZEYXRhL0RhdGEvc3lzdGVtcy9rdWx0NHRoL3ZpdGUuY29uZmlnLnRzXCI7Ly8gSW1wb3J0aW5nIG5lY2Vzc2FyeSBmdW5jdGlvbnMgYW5kIHR5cGVzIGZyb20gdGhlIFZpdGUgcGFja2FnZSBhbmQgdGhlIHBhdGggbW9kdWxlIGZyb20gTm9kZS5qc1xyXG5pbXBvcnQge2RlZmluZUNvbmZpZywgdHlwZSBVc2VyQ29uZmlnLCBQbHVnaW59IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCBmcyBmcm9tIFwiZnNcIjtcclxuaW1wb3J0IGNoZWNrZXIgZnJvbSBcInZpdGUtcGx1Z2luLWNoZWNrZXJcIjtcclxuaW1wb3J0IHt2aXN1YWxpemVyfSBmcm9tIFwicm9sbHVwLXBsdWdpbi12aXN1YWxpemVyXCI7XHJcbmltcG9ydCB7ZXhlY30gZnJvbSBcImNoaWxkX3Byb2Nlc3NcIjtcclxuaW1wb3J0IGNvcHkgZnJvbSBcInJvbGx1cC1wbHVnaW4tY29weVwiO1xyXG5cclxuLyogPT09PSBDT05GSUdVUkFUSU9OID09PT0gKi9cclxuXHJcbmNvbnN0IEZPVU5EUllfVkVSU0lPTiA9IDEyO1xyXG5jb25zdCBOVU1fQ0hST01FX1BST0ZJTEVTID0gcGFyc2VJbnQocHJvY2Vzcy5lbnYuTlVNX0NIUk9NRV9QUk9GSUxFUyA/PyBcIjFcIiwgMTApO1xyXG5jb25zdCBQQUNLQUdFX1RZUEU6IFwibW9kdWxlXCIgfCBcInN5c3RlbVwiID0gXCJzeXN0ZW1cIjtcclxuY29uc3QgUEFDS0FHRV9JRCA9IFwia3VsdDR0aFwiO1xyXG5cclxuY29uc3QgRU5UUllfRklMRV9OQU1FID0gXCJrdWx0NHRoXCI7XHJcblxyXG4vKiA9PT09IEVORCBDT05GSUdVUkFUSU9OID09PT0gKi9cclxuXHJcbi8qIC0tLSBQT1JUUyAtLS0gKi9cclxuY29uc3QgZm91bmRyeVBvcnQgPSAzMDAwMCArIChGT1VORFJZX1ZFUlNJT04gKiAxMDApO1xyXG5jb25zdCB2aXRlUG9ydCA9IGZvdW5kcnlQb3J0ICsgMTtcclxuLyogLS0tIEVORCBQT1JUUyAtLS0gKi9cclxuXHJcbi8qKlxyXG4gKiBDdXN0b20gcGx1Z2luIHRvIG9wZW4gb25lIG9yIG1vcmUgQ2hyb21lIHByb2ZpbGVzIHdpdGggc3BlY2lmaWMgZmxhZ3Mgd2hlbiB0aGUgVml0ZSBzZXJ2ZXIgc3RhcnRzLlxyXG4gKi9cclxuZnVuY3Rpb24gb3BlbkNocm9tZVBsdWdpbigpOiBQbHVnaW4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiAgXCJvcGVuLWNocm9tZVwiLFxyXG4gICAgYXBwbHk6IFwic2VydmVcIiwgLy8gT25seSBhcHBseSB0aGlzIHBsdWdpbiBkdXJpbmcgZGV2ZWxvcG1lbnRcclxuICAgIGNvbmZpZ1Jlc29sdmVkKGNocm9tZUNvbmZpZykge1xyXG4gICAgICBpZiAoY2hyb21lQ29uZmlnLmNvbW1hbmQgPT09IFwic2VydmVcIikge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTlVNX0NIUk9NRV9QUk9GSUxFUzsgaSsrKSB7XHJcbiAgICAgICAgICBjb25zdCBjb21tYW5kID0gYHN0YXJ0IGNocm9tZSAtLXN0YXJ0LW1heGltaXplZCAtLXJlbW90ZS1kZWJ1Z2dpbmctcG9ydD0ke1N0cmluZyg5MjIyK2kpfSAtLWF1dG8tb3Blbi1kZXZ0b29scy1mb3ItdGFicyAtLXVzZXItZGF0YS1kaXI9XCJEOi9Qcm9qZWN0cy8uQ09ESU5HL0ZvdW5kcnlWVFQvQ2hyb21lRGV2UHJvZmlsZV8ke1N0cmluZyhpKzEpfVwiIGh0dHA6Ly9sb2NhbGhvc3Q6JHtTdHJpbmcoY2hyb21lQ29uZmlnLnNlcnZlci5wb3J0KX1gO1xyXG4gICAgICAgICAgZXhlYyhjb21tYW5kLCAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgRmFpbGVkIHRvIG9wZW4gQ2hyb21lIGluc3RhbmNlICMke1N0cmluZyhpKzEpfTpgLCBlcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDdXN0b20gcGx1Z2luIHRvIGhhbmRsZSB0aGUgRm91bmRyeSBWVFQgbW9kdWxlIHN5c3RlbS5cclxuICovXHJcbmZ1bmN0aW9uIGZvdW5kcnlQbHVnaW4oKTogUGx1Z2luIHtcclxuICBjb25zdCB1c2VzRm91bmRyeVBsdWdpbiA9IFN5bWJvbChcImZvdW5kcnktcGx1Z2luXCIpO1xyXG4gIGNvbnN0IGV4dGVybmFsc1NvdXJjZU1hcCA9IG5ldyBNYXAoW1xyXG4gICAgW1wiZ3NhcFwiLCBcInNjcmlwdHMvZ3JlZW5zb2NrL2VzbS9hbGwuanNcIl1cclxuICBdKTtcclxuICBjb25zb2xlLmxvZyhcIkFDVElWQVRJTkcgRk9VTkRSWSBQTFVHSU5cIik7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiBcImZvdW5kcnktcGx1Z2luXCIsXHJcblxyXG4gICAgcmVzb2x2ZUlkKHNvdXJjZSkge1xyXG4gICAgICBpZiAoZXh0ZXJuYWxzU291cmNlTWFwLmhhcyhzb3VyY2UpKSB7XHJcbiAgICAgICAgY29uc3QgaWQgPSBleHRlcm5hbHNTb3VyY2VNYXAuZ2V0KHNvdXJjZSk7XHJcbiAgICAgICAgaWYgKGlkKSB7XHJcbiAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBpZCxcclxuXHJcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgdXNlZCB0byBtYWtlIHN1cmUgdGhhdCB0aGVyZSdzIG5vIGxhdGVyIHRyYW5zZm9ybWF0aW9ucyBkdXJpbmcgcHJvZHVjdGlvbi5cclxuICAgICAgICAgICAgZXh0ZXJuYWw6IFwiYWJzb2x1dGVcIixcclxuXHJcbiAgICAgICAgICAgIG1ldGE6IHtcclxuICAgICAgICAgICAgICBbdXNlc0ZvdW5kcnlQbHVnaW5dOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH0sXHJcbiAgICBsb2FkKGlkKSB7XHJcbiAgICAgIGNvbnN0IG1vZHVsZUluZm8gPSB0aGlzLmdldE1vZHVsZUluZm8oaWQpO1xyXG5cclxuICAgICAgaWYgKG1vZHVsZUluZm8gPT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBEdXJpbmcgYSBwcm9kdWN0aW9uIGJ1aWxkIHNpbmNlIGFsbCBvZiB0aGUgRm91bmRyeSBpbXBvcnRzIGFyZSBleHRlcm5hbCBpdCBuZXZlciBldmVuIGdldHMgaGVyZSwgbGlrZSBvbmUgbWlnaHQgZXhwZWN0LlxyXG4gICAgICAvLyBIb3dldmVyIGRldmVsb3BtZW50IGRvZXNuJ3QgY29tcGxldGVseSB1bmRlcnN0YW5kIGV4dGVybmFsLCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3ZpdGVqcy92aXRlL2lzc3Vlcy82NTgyXHJcbiAgICAgIGlmICh1c2VzRm91bmRyeVBsdWdpbiBpbiBtb2R1bGVJbmZvLm1ldGEpIHtcclxuICAgICAgICAvLyBCeSBkZWZhdWx0IGFsbCBpbXBvcnRzIChvciBpbiB0aGlzIGNhc2UgYSByZS1leHBvcnQpIHdpbGwgZ2V0IHJlY3Vyc2l2ZWx5IGhhbmRsZWQgYnkgVml0ZS5cclxuICAgICAgICAvLyBUaGUgdGFnIGAvKiBAdml0ZS1pZ25vcmUgKi9gIGlzIHVzZWQgdG8gYXZvaWQgYW4gZXJyb3Igd2hlbiB0cnlpbmcgdG8gcmVzb2x2ZSBgaWRgIGFnYWluLlxyXG4gICAgICAgIHJldHVybiBgZXhwb3J0ICogZnJvbSAvKiBAdml0ZS1pZ25vcmUgKi8gJHtKU09OLnN0cmluZ2lmeShpZCl9O2A7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuXHJcbmNvbnN0IGhic1BsdWdpbjogUGx1Z2luID0ge1xyXG4gIG5hbWU6IFwiaG1yLWhhbmRsZXJcIixcclxuICBhcHBseTogXCJzZXJ2ZVwiLFxyXG4gIGhhbmRsZUhvdFVwZGF0ZShjb250ZXh0KSB7XHJcbiAgICAgIGlmIChjb250ZXh0LmZpbGUuc3RhcnRzV2l0aChcImRpc3RcIikpIHJldHVybjtcclxuXHJcbiAgICAgIGlmIChjb250ZXh0LmZpbGUuZW5kc1dpdGgoXCJlbi5qc29uXCIpKSB7XHJcbiAgICAgICAgICBjb25zdCBiYXNlUGF0aCA9IGNvbnRleHQuZmlsZS5zbGljZShjb250ZXh0LmZpbGUuaW5kZXhPZihcImxhbmcvXCIpKTtcclxuICAgICAgICAgIGZzLnByb21pc2VzLmNvcHlGaWxlKGNvbnRleHQuZmlsZSwgYGRpc3QvJHtiYXNlUGF0aH1gKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICBjb250ZXh0LnNlcnZlci53cy5zZW5kKHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogXCJjdXN0b21cIixcclxuICAgICAgICAgICAgICAgICAgZXZlbnQ6IFwibGFuZy11cGRhdGVcIixcclxuICAgICAgICAgICAgICAgICAgZGF0YTogeyBwYXRoOiBgc3lzdGVtcy8ke1BBQ0tBR0VfSUR9LyR7YmFzZVBhdGh9YCB9LFxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyb3I6IHVua25vd24pID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBjb3B5IGZpbGU6ICR7U3RyaW5nKGVycm9yKX1gKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5maWxlLmVuZHNXaXRoKFwiLmhic1wiKSkge1xyXG4gICAgICAgICAgY29uc3QgYmFzZVBhdGggPSBjb250ZXh0LmZpbGUuc2xpY2UoY29udGV4dC5maWxlLmluZGV4T2YoXCJ0ZW1wbGF0ZXMvXCIpKTtcclxuICAgICAgICAgIGZzLnByb21pc2VzLmNvcHlGaWxlKGNvbnRleHQuZmlsZSwgYGRpc3QvJHtiYXNlUGF0aH1gKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICBjb250ZXh0LnNlcnZlci53cy5zZW5kKHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogXCJjdXN0b21cIixcclxuICAgICAgICAgICAgICAgICAgZXZlbnQ6IFwidGVtcGxhdGUtdXBkYXRlXCIsXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IHsgcGF0aDogYHN5c3RlbXMvJHtQQUNLQUdFX0lEfS8ke2Jhc2VQYXRofWAgfSxcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSkuY2F0Y2goKGVycm9yOiB1bmtub3duKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gdXBkYXRlIGZpbGU6ICR7U3RyaW5nKGVycm9yKX1gKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5cclxuLy8gRGVmaW5pbmcgdGhlIFZpdGUgY29uZmlndXJhdGlvbiBvYmplY3Qgd2l0aCBzcGVjaWZpYyBzZXR0aW5ncyBmb3IgdGhpcyBwcm9qZWN0XHJcbmNvbnN0IGNvbmZpZzogVXNlckNvbmZpZyA9IGRlZmluZUNvbmZpZyh7XHJcbiAgLy8gU2V0dGluZyB0aGUgcm9vdCBkaXJlY3RvcnkgZm9yIHRoZSBwcm9qZWN0IHRvIHRoZSBcInNyY1wiIGZvbGRlclxyXG4gIHJvb3Q6ICAgICAgXCJzcmNcIixcclxuICAvLyBTZXR0aW5nIHRoZSBiYXNlIFVSTCBmb3IgdGhlIHByb2plY3Qgd2hlbiBkZXBsb3llZFxyXG4gIGJhc2U6ICAgICAgYC8ke1BBQ0tBR0VfVFlQRX1zLyR7UEFDS0FHRV9JRH0vYCxcclxuICAvLyBTcGVjaWZ5aW5nIHRoZSBkaXJlY3Rvcnkgd2hlcmUgc3RhdGljIGFzc2V0cyBhcmUgbG9jYXRlZFxyXG4gIHB1YmxpY0RpcjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJwdWJsaWNcIiksXHJcbiAgLy8gQ29uZmlndXJhdGlvbiBmb3IgdGhlIGRldmVsb3BtZW50IHNlcnZlclxyXG4gIHNlcnZlcjogICAge1xyXG4gICAgLy8gU2V0dGluZyB0aGUgcG9ydCBudW1iZXIgZm9yIHRoZSBkZXZlbG9wbWVudCBzZXJ2ZXJcclxuICAgIHBvcnQ6ICB2aXRlUG9ydCxcclxuICAgIC8vIEF1dG9tYXRpY2FsbHkgb3BlbiB0aGUgcHJvamVjdCBpbiB0aGUgYnJvd3NlciB3aGVuIHRoZSBzZXJ2ZXIgc3RhcnRzXHJcbiAgICBvcGVuOiAgZmFsc2UsXHJcbiAgICAvLyBDb25maWd1cmluZyBwcm94eSBydWxlcyBmb3IgY2VydGFpbiBVUkxzXHJcbiAgICBwcm94eToge1xyXG4gICAgICAvLyBSZWRpcmVjdGluZyByZXF1ZXN0cyB0aGF0IGRvIG5vdCBzdGFydCB3aXRoIFwiL3N5c3RlbXMvZXVub3MtYmxhZGVzXCIgdG8gbG9jYWxob3N0OjMxMTAwXHJcbiAgICAgIFtgXig/IS8ke1BBQ0tBR0VfVFlQRX1zLyR7UEFDS0FHRV9JRH0pYF06IGBodHRwOi8vbG9jYWxob3N0OiR7U3RyaW5nKGZvdW5kcnlQb3J0KX0vYCxcclxuICAgICAgLy8gU3BlY2lhbCBwcm94eSBjb25maWd1cmF0aW9uIGZvciBXZWJTb2NrZXQgY29ubmVjdGlvbnMgdXNlZCBieSBzb2NrZXQuaW9cclxuICAgICAgXCIvc29ja2V0LmlvXCI6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgdGFyZ2V0OiBgd3M6Ly9sb2NhbGhvc3Q6JHtTdHJpbmcoZm91bmRyeVBvcnQpfWAsIC8vIFRhcmdldCBzZXJ2ZXIgZm9yIHRoZSBwcm94eVxyXG4gICAgICAgIHdzOiAgICAgdHJ1ZSAvLyBFbmFibGUgV2ViU29ja2V0IHN1cHBvcnRcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHdhcm11cDoge1xyXG4gICAgICBjbGllbnRGaWxlczogW1xyXG4gICAgICAgIFwiLi9zcmMvdHMvbGlicmFyaWVzLnRzXCIsXHJcbiAgICAgICAgXCIuL3NyYy90cy9zY3JpcHRzL3V0aWxpdGllcy50c1wiXHJcbiAgICAgIF1cclxuICAgIH1cclxuICB9LFxyXG4gIC8vIENvbmZpZ3VyYXRpb24gZm9yIHRoZSBidWlsZCBwcm9jZXNzXHJcbiAgYnVpbGQ6IHtcclxuICAgIC8vIERpcmVjdG9yeSB3aGVyZSB0aGUgYnVpbGQgb3V0cHV0IHdpbGwgYmUgcGxhY2VkXHJcbiAgICBvdXREaXI6ICAgICAgICBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcImRpc3RcIiksXHJcbiAgICAvLyBDbGVhciB0aGUgb3V0cHV0IGRpcmVjdG9yeSBiZWZvcmUgYnVpbGRpbmdcclxuICAgIGVtcHR5T3V0RGlyOiAgIHRydWUsXHJcbiAgICAvLyBHZW5lcmF0ZSBzb3VyY2UgbWFwcyBmb3IgdGhlIGJ1aWxkXHJcbiAgICBzb3VyY2VtYXA6ICAgICB0cnVlLFxyXG4gICAgLy8gQ29uZmlndXJhdGlvbiBmb3IgdGhlIFRlcnNlciBtaW5pZmllclxyXG4gICAgbWluaWZ5OiAgICAgICAgXCJ0ZXJzZXJcIixcclxuICAgIHRlcnNlck9wdGlvbnM6IHtcclxuICAgICAgbWFuZ2xlOiAgICAgICAgICBmYWxzZSwgLy8gRGlzYWJsZSBtYW5nbGluZyBvZiB2YXJpYWJsZSBhbmQgZnVuY3Rpb24gbmFtZXNcclxuICAgICAga2VlcF9jbGFzc25hbWVzOiB0cnVlLCAvLyBQcmVzZXJ2ZSBjbGFzcyBuYW1lc1xyXG4gICAgICBrZWVwX2ZuYW1lczogICAgIHRydWUgLy8gUHJlc2VydmUgZnVuY3Rpb24gbmFtZXNcclxuICAgIH0sXHJcbiAgICAvLyBUZW1wb3JhcmlseSBkaXNhYmxlIG1pbmlmaWNhdGlvbiBmb3Igb3V0cHV0IGNoZWNraW5nXHJcbiAgICAvLyBtaW5pZnk6IGZhbHNlLFxyXG4gICAgLy8gQ29uZmlndXJhdGlvbiBmb3IgYnVpbGRpbmcgYSBsaWJyYXJ5XHJcbiAgICBsaWI6IHtcclxuICAgICAgbmFtZTogICAgIEVOVFJZX0ZJTEVfTkFNRSwgLy8gTmFtZSBvZiB0aGUgbGlicmFyeVxyXG4gICAgICBlbnRyeTogICAgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgYHNyYy90cy8ke0VOVFJZX0ZJTEVfTkFNRX0udHNgKSwgLy8gRW50cnkgcG9pbnQgZm9yIHRoZSBsaWJyYXJ5XHJcbiAgICAgIGZvcm1hdHM6ICBbXCJlc1wiXSwgLy8gT3V0cHV0IGZvcm1hdChzKSBmb3IgdGhlIGxpYnJhcnlcclxuICAgICAgZmlsZU5hbWU6IFwiaW5kZXhcIiAvLyBOYW1lIGZvciB0aGUgb3V0cHV0IGZpbGUocylcclxuICAgIH0sXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIGV4dGVybmFsOiBbXHJcbiAgICAgICAgXCJnc2FwL2FsbFwiXHJcbiAgICAgIF1cclxuICAgIH1cclxuICB9LFxyXG4gIHJlc29sdmU6IHtcclxuICAgIHByZXNlcnZlU3ltbGlua3M6IHRydWUsXHJcbiAgICBhbGlhczogICAgICAgICAgICB7XHJcbiAgICAgIFwiZ3NhcC9hbGxcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJwdWJsaWMvc2NyaXB0cy9ncmVlbnNvY2svZXNtL2FsbC5qc1wiKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgZm91bmRyeVBsdWdpbigpLFxyXG4gICAgY2hlY2tlcih7dHlwZXNjcmlwdDogdHJ1ZX0pLFxyXG4gICAgdmlzdWFsaXplcih7XHJcbiAgICAgIGd6aXBTaXplOiB0cnVlLFxyXG4gICAgICB0ZW1wbGF0ZTogXCJ0cmVlbWFwXCJcclxuICAgIH0pLFxyXG4gICAgb3BlbkNocm9tZVBsdWdpbigpLFxyXG4gICAgY29weSh7XHJcbiAgICAgIHRhcmdldHM6IFtcclxuICAgICAgICB7IHNyYzogJ3NyYy90ZW1wbGF0ZXMvKiovKicsIGRlc3Q6ICdkaXN0JyB9LFxyXG4gICAgICAgIHsgc3JjOiAncHVibGljL2Fzc2V0cy8qKi8qJywgZGVzdDogJ2Rpc3QnIH1cclxuICAgICAgXSxcclxuICAgICAgaG9vazogXCJidWlsZFN0YXJ0XCIsXHJcbiAgICAgIGNvcHlTeW5jOiB0cnVlLFxyXG4gICAgICBmbGF0dGVuOiBmYWxzZVxyXG4gICAgfSksXHJcbiAgICAvLyBoYnNQbHVnaW4oKSxcclxuICAgIGhic1BsdWdpbixcclxuICBdLmZpbHRlcihCb29sZWFuKVxyXG59KTtcclxuXHJcbi8vIEV4cG9ydGluZyB0aGUgY29uZmlndXJhdGlvbiBvYmplY3QgdG8gYmUgdXNlZCBieSBWaXRlXHJcbmV4cG9ydCBkZWZhdWx0IGNvbmZpZztcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVEsb0JBQTRDO0FBQ3BELE9BQU8sVUFBVTtBQUNqQixPQUFPLFFBQVE7QUFDZixPQUFPLGFBQWE7QUFDcEIsU0FBUSxrQkFBaUI7QUFDekIsU0FBUSxZQUFXO0FBQ25CLE9BQU8sVUFBVTtBQVBqQixJQUFNLG1DQUFtQztBQVd6QyxJQUFNLGtCQUFrQjtBQUN4QixJQUFNLHNCQUFzQixTQUFTLFFBQVEsSUFBSSx1QkFB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
