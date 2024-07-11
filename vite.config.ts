// Importing necessary functions and types from the Vite package and the path module from Node.js
import {defineConfig, type UserConfig, Plugin} from "vite";
import path from "path";
import fs from "fs";
import checker from "vite-plugin-checker";
import {visualizer} from "rollup-plugin-visualizer";
import {exec} from "child_process";
import copy from "rollup-plugin-copy";

/* ==== CONFIGURATION ==== */

const FOUNDRY_VERSION = 10;
const NUM_CHROME_PROFILES = 1;
const PACKAGE_TYPE: "module" | "system" = "system";
const PACKAGE_ID = "kult4th";
const ENTRY_FILE_NAME = "kult4th";

/* ==== END CONFIGURATION ==== */

/* --- PORTS --- */
const foundryPort = 30000 + (FOUNDRY_VERSION * 100);
const vitePort = foundryPort + 1;
/* --- END PORTS --- */

/**
 * Custom plugin to open one or more Chrome profiles with specific flags when the Vite server starts.
 */
function openChromePlugin(): Plugin {
  return {
    name:  "open-chrome",
    apply: "serve", // Only apply this plugin during development
    configResolved(chromeConfig) {
      if (chromeConfig.command === "serve") {
        for (let i = 0; i < NUM_CHROME_PROFILES; i++) {
          const command = `start chrome --start-maximized --remote-debugging-port=${String(9222+i)} --auto-open-devtools-for-tabs --user-data-dir="D:/Projects/.CODING/FoundryVTT/ChromeDevProfile_${String(i+1)}" http://localhost:${String(chromeConfig.server.port)}`;
          exec(command, (error) => {
            if (error) {
              console.error(`Failed to open Chrome instance #${String(i+1)}:`, error);
            }
          });
        }
      }
    }
  };
}

/**
 * Custom plugin to handle the Foundry VTT module system.
 */
function foundryPlugin(): Plugin {
  const usesFoundryPlugin = Symbol("foundry-plugin");
  const externalsSourceMap = new Map([
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

      // During a production build since all of the Foundry imports are external it never even gets here, like one might expect.
      // However development doesn't completely understand external, see https://github.com/vitejs/vite/issues/6582
      if (usesFoundryPlugin in moduleInfo.meta) {
        // By default all imports (or in this case a re-export) will get recursively handled by Vite.
        // The tag `/* @vite-ignore */` is used to avoid an error when trying to resolve `id` again.
        return `export * from /* @vite-ignore */ ${JSON.stringify(id)};`;
      }

      return null;
    }
  };
}

const hbsPlugin: Plugin = {
  name: "hmr-handler",
  apply: "serve",
  handleHotUpdate(context) {
      if (context.file.startsWith("dist")) return;

      if (context.file.endsWith("en.json")) {
          const basePath = context.file.slice(context.file.indexOf("lang/"));
          fs.promises.copyFile(context.file, `dist/${basePath}`).then(() => {
              context.server.ws.send({
                  type: "custom",
                  event: "lang-update",
                  data: { path: `systems/${PACKAGE_ID}/${basePath}` },
              });
            }).catch((error: unknown) => {
                console.error(`Failed to copy file: ${String(error)}`);
            });
      } else if (context.file.endsWith(".hbs")) {
          const basePath = context.file.slice(context.file.indexOf("templates/"));
          fs.promises.copyFile(context.file, `dist/${basePath}`).then(() => {
              context.server.ws.send({
                  type: "custom",
                  event: "template-update",
                  data: { path: `systems/${PACKAGE_ID}/${basePath}` },
              });
            }).catch((error: unknown) => {
                console.error(`Failed to update file: ${String(error)}`);
            });
      }
  }
};


// Defining the Vite configuration object with specific settings for this project
const config: UserConfig = defineConfig({
  // Setting the root directory for the project to the "src" folder
  root:      "src",
  // Setting the base URL for the project when deployed
  base:      `/${PACKAGE_TYPE}s/${PACKAGE_ID}/`,
  // Specifying the directory where static assets are located
  publicDir: path.resolve(__dirname, "public"),
  // Configuration for the development server
  server:    {
    // Setting the port number for the development server
    port:  vitePort,
    // Automatically open the project in the browser when the server starts
    open:  false,
    // Configuring proxy rules for certain URLs
    proxy: {
      // Redirecting requests that do not start with "/systems/eunos-blades" to localhost:31100
      [`^(?!/${PACKAGE_TYPE}s/${PACKAGE_ID})`]: `http://localhost:${String(foundryPort)}/`,
      // Special proxy configuration for WebSocket connections used by socket.io
      "/socket.io":                             {
        target: `ws://localhost:${String(foundryPort)}`, // Target server for the proxy
        ws:     true // Enable WebSocket support
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
    outDir:        path.resolve(__dirname, "dist"),
    // Clear the output directory before building
    emptyOutDir:   true,
    // Generate source maps for the build
    sourcemap:     true,
    // Configuration for the Terser minifier
    minify:        "terser",
    terserOptions: {
      mangle:          false, // Disable mangling of variable and function names
      keep_classnames: true, // Preserve class names
      keep_fnames:     true // Preserve function names
    },
    // Temporarily disable minification for output checking
    // minify: false,
    // Configuration for building a library
    lib: {
      name:     ENTRY_FILE_NAME, // Name of the library
      entry:    path.resolve(__dirname, `src/ts/${ENTRY_FILE_NAME}.ts`), // Entry point for the library
      formats:  ["es"], // Output format(s) for the library
      fileName: "index" // Name for the output file(s)
    },
    rollupOptions: {
      external: [
        "gsap/all"
      ]
    }
  },
  resolve: {
    preserveSymlinks: true,
    alias:            {
      "gsap/all": path.resolve(__dirname, "public/scripts/greensock/esm/all.js")
    }
  },
  plugins: [
    foundryPlugin(),
    checker({typescript: true}),
    visualizer({
      gzipSize: true,
      template: "treemap"
    }),
    openChromePlugin(),
    copy({
      targets: [
        { src: 'src/templates/**/*', dest: 'dist' },
        { src: 'public/assets/**/*', dest: 'dist' }
      ],
      hook: "buildStart",
      copySync: true,
      flatten: false
    }),
    // hbsPlugin(),
    hbsPlugin,
  ].filter(Boolean)
});

// Exporting the configuration object to be used by Vite
export default config;
