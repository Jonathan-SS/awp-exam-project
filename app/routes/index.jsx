import { useLoaderData, Link, Form } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";
import { requireSession } from "../sessions.server.js";

export async function loader({ request }) {
  requireSession(request);
  const db = await connectDb();
  const cadidates = await db.models.Candidate.find();
  return cadidates;
}

export default function Index() {
  const candidates = useLoaderData();
  //TODO make cool welcomming page
  return <div></div>;
}
