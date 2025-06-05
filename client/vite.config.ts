import "dotenv/config";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.SERVER_URL": JSON.stringify(process.env.SERVER_URL),
  },
});
