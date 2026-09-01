import { Elysia } from "elysia";
import { usersRoute } from "./src/routes/users-route";

const app = new Elysia()
  .get("/", () => "Hello World!")
  .use(usersRoute)
  .listen(3000);

console.log(`🦊 Server running at http://localhost:${app.server?.hostname}:${app.server?.port}`);
