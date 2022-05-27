//TODO  make a new file in app/routes/create-user/recruiter.jsx
//it should be the same as app/routes/create-user/candidate.jsx
// but for recruiters
import { Form, useActionData } from "@remix-run/react";
import Logo from "../../icons/Logo";
import connectDb from "~/db/connectDb.server";
import bcrypt from "bcryptjs";
import { json, redirect } from "@remix-run/node";
import { commitSession, getSession } from "../../sessions.server";
import InputField from "../../components/InputFiled";

export async function action({ request }) {
  console.log("test");
  const db = await connectDb();
  const form = await request.formData();
  console.log(form);
  const firstname = form.get("firstname").trim();
  const lastname = form.get("lastname");
  const email = form.get("email");
  const company = form.get("company");

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

    const user = await db.models.User.create({
      company,
      firstname,
      email,
      lastname,
      password,
      userType: "recruiter",
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

export default function Recruiter() {
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
        <InputField
          name="company"
          placeholder="Company Name"
          actionData={actionData?.errors.company}
          defaultValue={actionData?.values.company}
        />
        <InputField
          name="firstname"
          placeholder="First Name"
          actionData={actionData?.errors.firstname}
          defaultValue={actionData?.values.firstname}
        />
        <InputField
          name="lastname"
          placeholder="Last Name"
          actionData={actionData?.errors.lastname}
          defaultValue={actionData?.values.lastname}
        />
        <InputField
          name="email"
          placeholder="Email"
          actionData={actionData?.errors.email}
          defaultValue={actionData?.values.email}
        />
        <InputField
          name="Password"
          placeholder="Password, minimum 8 characters"
          actionData={actionData?.errors.Password}
          defaultValue={actionData?.values.Password}
        />
        <InputField
          name="PasswordRepeat"
          placeholder="Repeat password"
          actionData={actionData?.errors.PasswordRepeat}
          defaultValue={actionData?.values.PasswordRepeat}
        />

        <button
          type="submit"
          className=" bg-green-400 px-3 py-2 rounded-full hover:bg-green-300 shadow-md hover:shadow-md"
        >
          Sign up
        </button>
      </Form>
    </div>
  );
}
//TODO refractor input fields into cpmponent
