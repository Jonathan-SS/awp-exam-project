import { Form, useActionData } from "@remix-run/react";
import Logo from "../../icons/Logo";
import connectDb from "~/db/connectDb.server";
import bcrypt from "bcryptjs";
import { json, redirect } from "@remix-run/node";
import { commitSession, getSession } from "../../sessions.server";

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
      return json(
        {
          errors: {
            password: "Passwords do not match.",
          },
        },
        { status: 400 }
      );
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

export default function Candidate(params) {
  const actionData = useActionData();
  console.log(actionData);
  return (
    <div className="flex flex-col items-center">
      <Logo />
      <div className="text-center mt-4 flex flex-col gap-4 ">
        <h1 className=" text-4xl font-bold mb-4 ">
          Great! <br /> Now it's time to sign up!
        </h1>
      </div>

      <Form method="post" className="flex flex-col gap-2 w-96">
        {actionData?.errors?.firstname?.message ? (
          <p className="text-red-500 px-2">
            {actionData.errors.firstname.message}
          </p>
        ) : (
          <p className=" -mb-2 px-2 text-slate-400 ">First Name</p>
        )}
        <input
          type="text"
          name="firstname"
          placeholder="First Name"
          defaultValue={actionData?.values?.firstname}
          className={
            "w-full py-2 px-4 rounded-full border " +
            (actionData?.errors?.firstname?.message
              ? "border-red-500"
              : "  border-gray-300 ")
          }
        />
        {actionData?.errors?.lastname ? (
          <p className="text-red-500 px-2">
            {actionData.errors?.lastname.message}
          </p>
        ) : (
          <p className=" -mb-2 px-2 text-slate-400 ">Last Name</p>
        )}
        <input
          type="text"
          name="lastname"
          placeholder="Last Name"
          defaultValue={actionData?.values?.lastname}
          className={
            "w-full py-2 px-4 rounded-full border " +
            (actionData?.errors.lastname
              ? "border-red-500"
              : "  border-gray-300 ")
          }
        />
        {actionData?.errors?.email ? (
          <p className="text-red-500 px-2">
            {actionData.errors?.email.message}
          </p>
        ) : (
          <p className=" -mb-2 px-2 text-slate-400 ">Email</p>
        )}
        <input
          type="text"
          name="email"
          placeholder="Email"
          defaultValue={actionData?.values?.email}
          className={
            "w-full py-2 px-4 rounded-full border " +
            (actionData?.errors.email ? "border-red-500" : "  border-gray-300 ")
          }
        />
        <p htmlFor="Password" className=" -mb-2 px-2 text-slate-400 ">
          Password, minimum 8 characters
        </p>
        <input
          type="text"
          name="Password"
          placeholder="Password"
          defaultValue={actionData?.values?.Password}
          className={
            "w-full py-2 px-4 rounded-full border " +
            (actionData?.errors.password
              ? "border-red-500"
              : "  border-gray-300 ")
          }
        />

        {actionData?.errors?.password ? (
          <p className="text-red-500 px-2">{actionData.errors.password}</p>
        ) : (
          <p className=" -mb-2 px-2 text-slate-400 ">Repeat password</p>
        )}
        <input
          type="text"
          name="PasswordRepeat"
          placeholder="Repeat password"
          defaultValue={actionData?.values?.PasswordRepeat}
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
