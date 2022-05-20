import { Form, useLoaderData } from "@remix-run/react";
import Logo from "../../icons/Logo";
import connectDb from "~/db/connectDb.server";
import bcrypt from "bcryptjs";
import { json, redirect } from "@remix-run/node";
import { getSession } from "../../sessions.server";
//TODO add delete prfile option
export async function loader({ request }) {
  const db = await connectDb();
  const cookie = request.headers.get("Cookie");

  const session = await getSession(cookie);
  const userId = session.get("userId");
  console.log(userId);
  const user = await db.models.Candidate.findById(userId);
  console.log(user);
  return user;
}

export async function action({ request }) {
  const db = await connectDb();
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);
  const userId = session.get("userId");
  const form = await request.formData();
  const firstname = form.get("firstname").trim();
  const lastname = form.get("lastname");
  const email = form.get("email");
  const description = form.get("description");
  const tags = form.get("tags")?.split(",");
  const linksText = form.get("links");
  const links = form.get("links")?.split("\n");
  const seperatedLinks = [];
  links.forEach((link) => {
    const colon = link.split(":");
    seperatedLinks.push({
      name: colon[0],
      url: colon[1],
    });
  });

  try {
    const passwordCheck = async () => {
      if (form.get("Password").length > 0) {
        if (form.get("Password") !== form.get("PasswordRepeat")) {
          console.log("password not the same");
          return json({
            errors: {
              password: "Passwords do not match",
            },
          });
        }
        return await bcrypt.hash(form.get("Password"), 10);
      }
    };
    const password = await passwordCheck();

    const user = await db.models.Candidate.updateOne(
      { _id: userId },
      {
        firstname,
        email,
        lastname,
        password,
        tags,
        description,
        linksAsText: linksText,
        links: seperatedLinks,
      }
    );
    console.log(user);

    return redirect("/profile", {
      headers: {
        status: 200,
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

export default function Candidate() {
  const user = useLoaderData();
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
          defaultValue={user.firstname}
        />
        <input
          type="text"
          name="lastname"
          placeholder="Last Name"
          className=" w-full py-2 px-4 rounded-full border border-gray-300"
          defaultValue={user.lastname}
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          className=" w-full py-2 px-4 rounded-full border border-gray-300"
          defaultValue={user.email}
        />
        <p htmlFor="Password" className=" -my-3 px-2 text-slate-400">
          Minimum 8 characters
        </p>
        <input
          type="text"
          name="Password"
          placeholder="New Password"
          className=" w-full py-2 px-4 rounded-full border border-gray-300"
        />

        <input
          type="text"
          name="PasswordRepeat"
          placeholder="Repeat New Password"
          className=" w-full py-2 px-4 rounded-full border border-gray-300"
        />
        <p htmlFor="description" className=" -my-3 px-2 text-slate-400">
          Write a short description about yourself.
        </p>
        <textarea
          name="description"
          id=""
          cols="30"
          rows="4"
          className=" w-full py-2 px-4 rounded-lg border border-gray-300"
          placeholder="Max. 400 characters."
          defaultValue={user.description}
        />
        <p htmlFor="tags" className=" -my-3 px-2 text-slate-400">
          Add some tags to describe your profile.
        </p>
        <textarea
          type="text"
          name="tags"
          cols="30"
          rows="4"
          placeholder=" Max. 5 tags. Seperate with comma."
          className=" w-full py-2 px-4 rounded-lg border border-gray-300"
          defaultValue={user.tags}
        />
        <p htmlFor="Password" className=" -my-3 px-2 text-slate-400">
          Add some links to your social media profiles.
        </p>
        <textarea
          type="text"
          name="links"
          cols="30"
          rows="4"
          placeholder="Max. 3 links. Seperate with new line. Facebook:https://www.facebook.com "
          className=" w-full py-2 px-4 rounded-lg border border-gray-300"
          defaultValue={user.linksAsText}
        />
        <button
          type="submit"
          className=" bg-green-400 px-3 py-2 rounded-full hover:bg-green-300 shadow-lg hover:shadow-md"
        >
          Update
        </button>
      </Form>
    </div>
  );
}
