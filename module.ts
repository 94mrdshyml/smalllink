import { module } from "@prisma/composer";
import web from "./service.ts";

// The module name picks the Prisma project the deploy goes to.
// It is not "smalllink" because that project holds the Prisma Postgres database,
// and a deploy refuses a project with resources it did not create. The app reaches
// the database through DATABASE_URL instead.
export default module("smalllink-app", ({ provision }) => {
  provision(web);
});
