import { Form } from "@remix-run/react";
import Logo from "../../icons/Logo";
import connectDb from "~/db/connectDb.server";
import bcrypt from "bcryptjs";
import { json, redirect } from "@remix-run/node";

export async function action({ request }) {
  console.log("test");
  const db = await connectDb();
  const form = await request.formData();
  console.log(form);
  const firstname = form.get("firstname").trim();
  const lastname = form.get("lastname");
  const email = form.get("email");

  try {
    if (form.get("Password") !== form.get("PasswordRepeat")) {
      console.log("password not the same");
      return json({
        errors: {
          password: "Passwords do not match",
        },
      });
    }
    const password = await bcrypt.hash(form.get("Password"), 10);
    console.log(password);

    const user = await db.models.Candidate.create({
      firstname,
      email,
      lastname,
      password,
    });
    console.log(user);
    // const session = await getUserSession(request.headers.get("Cookie"));
    // session.set("userId", user.id);

    return redirect("/profile", {
      headers: {
        status: 200,
        // "Set-Cookie": await commitUserSession(session),
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

export default function candidate(params) {
  return (
    <div className="flex flex-col items-center">
      <Logo />
      <div className="text-center mt-4 flex flex-col gap-4 ">
        <h1 className=" text-4xl font-bold mb-4 ">
          Great! <br /> Now it's time to sign up!
        </h1>
      </div>

      <Form method="post" className="flex flex-col gap-4 w-96">
        <input
          type="text"
          name="firstname"
          placeholder="First Name"
          className=" w-full py-2 px-4 rounded-full border border-gray-300"
        />
        <input
          type="text"
          name="lastname"
          placeholder="Last Name"
          className=" w-full py-2 px-4 rounded-full border border-gray-300"
        />
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
        <p htmlFor="Password" className=" -my-3 px-2 text-slate-400">
          Minimum 8 characters
        </p>
        <input
          type="text"
          name="PasswordRepeat"
          placeholder="Repeat password"
          className=" w-full py-2 px-4 rounded-full border border-gray-300"
        />
        <button
          type="submit"
          className=" bg-green-400 px-3 py-2 rounded-full hover:bg-green-300 shadow-lg hover:shadow-md"
        >
          Sign up
        </button>
      </Form>
    </div>
  );
}
