import { module } from "@prisma/composer";
import web from "./service.ts";

// The module name picks the Prisma project the deploy goes to.
// No database is declared here: the app uses the Prisma Postgres database that
// already exists in that project, through DATABASE_URL.
export default module("smalllink", ({ provision }) => {
  provision(web);
});
