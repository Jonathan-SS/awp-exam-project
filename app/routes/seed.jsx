import { Form, Link } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";

export async function loader() {
  const db = await connectDb();
  const countUsers = await db.models.User.countDocuments();
  if (countUsers > 0) {
    return redirect("/");
  }

  return null;
}

export async function action({ request }) {
  const form = await request.formData();
  const db = await connectDb();

  const _action = form.get("_action");
  if (_action === "seed") {
    try {
      await db.models.Snippet.insertMany("seedData");
      return redirect("/snippets/all");
    } catch (error) {
      throw error;
    }
  }
}

export default function Seed() {
  return (
    <>
      <div className=" h-64 min-w-200-px bg-white shadow-md  rounded-lg p-8 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
        <h2 className="text-2xl text-center ">
          It seems that your database is empty, would you like me to seed some
          data for you?
        </h2>
        <div className=" flex justify-center mt-16 gap-8">
          <Link to="/snippets/all">
            <button
              to="/snippets/all"
              className="text-xl text-white bg-red-600 hover:bg-red-800 rounded-lg px-4 py-2"
            >
              No!!😡
            </button>
          </Link>

          <Form method="post">
            <button
              name="_action"
              value="seed"
              type="submit"
              className="text-xl text-white hover:bg-green-800 bg-green-600 rounded-lg px-4 py-2"
            >
              Yes please boss😇
            </button>
          </Form>
        </div>
      </div>
    </>
  );
}
