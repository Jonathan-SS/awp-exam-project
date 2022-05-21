import { Form, useActionData } from "@remix-run/react";
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
      return json(
        {
          errors: {
            email: "No user with that email",
          },
        },
        { status: 400 }
      );
    }

    const dbPassword = user.password;
    if (!(await bcrypt.compare(password, dbPassword))) {
      console.log("wrong password");
      return json(
        {
          errors: {
            password: "Wrong password, try again.",
          },
        },
        { status: 400 }
      );
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
    console.log(Object.fromEntries(form));
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}

export default function LogIn(params) {
  const actionData = useActionData();
  console.log(actionData);
  return (
    <div className="flex flex-col items-center">
      <Logo />
      <div className="text-center mt-4 flex flex-col gap-2 ">
        <h1 className=" text-4xl font-bold mb-4 ">Great to see you again!</h1>
      </div>

      <Form method="post" className="flex flex-col gap-2 w-96">
        {actionData?.errors?.email ? (
          <p className="text-red-500 px-2">{actionData?.errors.email}</p>
        ) : (
          <p></p>
        )}
        <input
          type="text"
          name="email"
          placeholder="Email"
          className={
            "w-full py-2 px-4 rounded-full border " +
            (actionData?.errors.email
              ? "border-red-500 -mt-4"
              : "  border-gray-300 ")
          }
        />
        {actionData?.errors?.password ? (
          <p className="text-red-500 px-2">{actionData?.errors.password}</p>
        ) : (
          <p></p>
        )}

        <input
          type="text"
          name="Password"
          placeholder="Password"
          className={
            "w-full py-2 px-4 rounded-full border " +
            (actionData?.errors.password
              ? "border-red-500 -mt-4 "
              : "  border-gray-300 ")
          }
        />

        <button
          type="submit"
          className=" bg-green-400 px-3 py-2 rounded-full hover:bg-green-300 shadow-lg hover:shadow-md mt-2"
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
