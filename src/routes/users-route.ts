import { Elysia, t } from "elysia";
import {
  registerUser,
  loginUser,
  EmailAlreadyRegisteredError,
  LoginFailedError,
} from "../services/users-service";

export const usersRoute = new Elysia()
  .post(
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
  )
  .post(
    "/api/login",
    async ({ body }) => {
      const { email, password } = body;
      try {
        const result = await loginUser(email, password);
        return result;
      } catch (error) {
        if (error instanceof LoginFailedError) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }
        throw error;
      }
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  );
