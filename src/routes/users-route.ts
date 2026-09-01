import { Elysia, t } from "elysia";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  EmailAlreadyRegisteredError,
  LoginFailedError,
  UnauthorizedError,
} from "../services/users-service";

function extractBearerToken(headers: Record<string, string | undefined>): string | null {
  const authHeader = headers.authorization ?? headers.Authorization;
  return authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;
}

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
  )
  .post(
    "/api/users/current",
    async ({ headers }) => {
      const token = extractBearerToken(headers);

      try {
        if (!token) throw new UnauthorizedError();
        const result = await getCurrentUser(token);
        return result;
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          return new Response(JSON.stringify({ data: error.message }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }
        throw error;
      }
    }
  )
  .delete(
    "/api/users/logout",
    async ({ headers }) => {
      const token = extractBearerToken(headers);

      try {
        if (!token) throw new UnauthorizedError();
        const result = await logoutUser(token);
        return result;
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          return new Response(JSON.stringify({ data: error.message }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }
        throw error;
      }
    }
  );
