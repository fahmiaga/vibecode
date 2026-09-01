import { Elysia, t } from "elysia";
import { registerUser, EmailAlreadyRegisteredError } from "../services/users-service";

export const usersRoute = new Elysia().post(
  "/api/users",
  async ({ body }) => {
    const { name, email, password } = body;
    try {
      const result = await registerUser(name, email, password);
      return result;
    } catch (error) {
      if (error instanceof EmailAlreadyRegisteredError) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      throw error;
    }
  },
  {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      password: t.String(),
    }),
  }
);
