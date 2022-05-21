import { redirect } from "@remix-run/node";
import { destroySession, getSession } from "../sessions.server";
import connectDb from "~/db/connectDb.server";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
}
