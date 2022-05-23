import { redirect } from "@remix-run/node";
import { destroySession, getSession } from "../sessions.server";
import connectDb from "~/db/connectDb.server";

export async function loader({ request }) {
  const db = await connectDb();
  const cookie = request.headers.get("Cookie");

  const session = await getSession(cookie);
  const userId = session.get("userId");
  console.log(userId);
  const user = await db.models.User.deleteOne({ _id: userId });
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
