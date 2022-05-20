import { redirect } from "@remix-run/node";
import { destroySession, getSession } from "../sessions.server";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
