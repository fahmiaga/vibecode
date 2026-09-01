import { eq } from "drizzle-orm";
import { compare, hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db";
import { users, sessions } from "../db/schema";

export class EmailAlreadyRegisteredError extends Error {
  constructor() {
    super("Email sudah terdaftar");
    this.name = "EmailAlreadyRegisteredError";
  }
}

export class LoginFailedError extends Error {
  constructor() {
    super("Email atau password salah");
    this.name = "LoginFailedError";
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length > 0) {
    throw new EmailAlreadyRegisteredError();
  }

  const hashedPassword = await hash(password, 10);

  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  return { data: "ok" };
}

export async function loginUser(email: string, password: string) {
  const user = await db
    .select({ id: users.id, password: users.password })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const found = user[0];
  if (!found) {
    throw new LoginFailedError();
  }

  const passwordMatches = await compare(password, found.password);
  if (!passwordMatches) {
    throw new LoginFailedError();
  }

  const token = uuidv4();

  await db.insert(sessions).values({
    token,
    userId: found.id,
  });

  return { data: token };
}

export async function getCurrentUser(token: string) {
  const session = await db
    .select({ userId: sessions.userId })
    .from(sessions)
    .where(eq(sessions.token, token))
    .limit(1);

  const foundSession = session[0];
  if (!foundSession) {
    throw new UnauthorizedError();
  }

  const user = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, foundSession.userId))
    .limit(1);

  const foundUser = user[0];
  if (!foundUser) {
    throw new UnauthorizedError();
  }

  return {
    data: {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      created_at: foundUser.createdAt,
    },
  };
}

export async function logoutUser(token: string) {
  const session = await db
    .select({ id: sessions.id })
    .from(sessions)
    .where(eq(sessions.token, token))
    .limit(1);

  const foundSession = session[0];
  if (!foundSession) {
    throw new UnauthorizedError();
  }

  await db.delete(sessions).where(eq(sessions.id, foundSession.id));

  return { data: "ok" };
}
