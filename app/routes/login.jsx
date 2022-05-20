import { Form } from "@remix-run/react";
import Logo from "../icons/Logo";
import connectDb from "~/db/connectDb.server";
import bcrypt from "bcryptjs";
import { json, redirect } from "@remix-run/node";
import { Link } from "react-router-dom";
import { commitSession, getSession } from "../sessions.server";
//TODO: add logout funcitonality
export async function action({ request }) {
  console.log("test");
  const db = await connectDb();
  const form = await request.formData();
  const password = form.get("Password");
  const email = form.get("email");

  try {
    const user = await db.models.Candidate.findOne({ email: email });
    if (!user) {
      return json({
        errors: {
          email: "No user found with this email",
        },
      });
    }
    const dbPassword = user.password;
    if (!(await bcrypt.compare(password, dbPassword))) {
      return json({
        errors: {
          password: "Wrong password",
        },
      });
    }

    const session = await getSession(request.headers.get("Cookie"));
    session.set("userId", user.id);

    return redirect("/profile", {
      headers: {
        status: 200,
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    console.log(error);
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}

export default function logIn(params) {
  return (
    <div className="flex flex-col items-center">
      <Logo />
      <div className="text-center mt-4 flex flex-col gap-4 ">
        <h1 className=" text-4xl font-bold mb-4 ">Great to see you again!</h1>
      </div>

      <Form method="post" className="flex flex-col gap-4 w-96">
        <input
          type="text"
          name="email"
          placeholder="Email"
          className=" w-full py-2 px-4 rounded-full border border-gray-300"
        />
        <input
          type="text"
          name="Password"
          placeholder="Password"
          className=" w-full py-2 px-4 rounded-full border border-gray-300"
        />

        <button
          type="submit"
          className=" bg-green-400 px-3 py-2 rounded-full hover:bg-green-300 shadow-lg hover:shadow-md"
        >
          Log In
        </button>
      </Form>
      <Link className=" w-96 text-left px-2 mt-2" to="/create-user">
        Sign up!
      </Link>
    </div>
  );
}
//TODO: style alle Links
