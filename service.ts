import nextjs from "@prisma/composer/nextjs";
import { compute } from "@prisma/composer-prisma-cloud";

// The whole app is one Next.js service. Its settings (DATABASE_URL, BETTER_AUTH_SECRET,
// BETTER_AUTH_URL) come from the project's production environment variables and
// reach the server as plain environment variables.
export default compute({
  name: "web",
  deps: {},
  build: nextjs({ module: import.meta.url, appDir: "." }),
});
