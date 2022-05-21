import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { sessionCookie } from "./cookies.server";
export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({ cookie: sessionCookie });

export async function requireSession(request) {
  // get the session
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);
  if (!session.has("userId")) {
    throw redirect("/login", 302);
  }

  return session;
}
//TODO fix requireSession som ot doesn't crash site
