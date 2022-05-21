import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import Logo from "../../icons/Logo";
import connectDb from "~/db/connectDb.server";
import bcrypt from "bcryptjs";
import {
  json,
  redirect,
  unstable_parseMultipartFormData,
  unstable_createFileUploadHandler,
} from "@remix-run/node";
import { getSession, requireSession } from "../../sessions.server";
import Plus from "../../icons/Plus";
import useJs from "../../hooks/useJs";

//TODO add delete prfile option
export async function loader({ request }) {
  await requireSession(request);
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

  const fileUploadHandler = unstable_createFileUploadHandler({
    directory: "./public/uploads",
    file: ({ filename }) => filename,
    filepath: ({ filename }) => `/uploads/${filename}`,
  });

  const formData = await unstable_parseMultipartFormData(
    request,
    fileUploadHandler
  );
  if (formData.get("_actionAfterSubmit") === "deleteAccount") {
    console.log("delete account");
  }

  console.log(formData.get("image")); // will return the filename
  const image = formData.get("image");
  if (image) {
    const imageUpload = await db.models.Candidate.findByIdAndUpdate(userId, {
      image: image,
    });
    console.log(imageUpload.image);
    console.log("herover");
  }

  const form = await request.formData();
  const firstname = formData.get("firstname").trim();
  const lastname = formData.get("lastname");
  const email = formData.get("email");
  const description = formData.get("description");
  const tags = formData.get("tags")?.split(",");
  const linksText = formData.get("links");
  const links = formData.get("links")?.split("\n");
  const seperatedLinks = [];
  links.forEach((link) => {
    const colon = link.split(";");
    seperatedLinks.push({
      name: colon[0],
      url: colon[1],
    });
  });

  try {
    const passwordCheck = async () => {
      if (formData.get("Password").length > 0) {
        if (formData.get("Password") !== formData.get("PasswordRepeat")) {
          console.log("password not the same");
          return json({
            errors: {
              password: "Passwords do not match",
            },
          });
        }
        return await bcrypt.hash(formData.get("Password"), 10);
      }
    };
    const password = await passwordCheck();

    await db.models.Candidate.updateOne(
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

    if (formData.get("_actionAfterSubmit") === "redirect") {
      return redirect("/profile", {
        headers: {
          status: 200,
        },
      });
    }
    return null;
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

  const submit = useSubmit();
  function handleChange(event) {
    submit(event.currentTarget, { replace: true });
  }
  function handleDelete(event) {
    submit(null, { method: "post", action: "../delete-account" });
  }

  return (
    <div className="flex flex-col items-center">
      <Logo />
      <div className="text-center mt-4 flex flex-col gap-4 ">
        <h1 className=" text-4xl font-bold mb-4 ">
          Great! <br /> Now it's time to sign up!
        </h1>
      </div>

      <Form
        method="post"
        encType="multipart/form-data"
        className="flex flex-col gap-4 w-96"
        onChange={handleChange}
        reloadDocument
      >
        <div className=" relative">
          <img
            src={
              user.image
                ? `/uploads/${user.image.name}`
                : "/403017_avatar_default_head_person_unknown_icon.png"
            }
            id="image"
            alt=""
            className=" w-64 h-64 m-auto rounded-full content object-cover bg-white  "
          />

          <label
            for="file-upload"
            className="rounded-full p-4 hover:shadow-md w-fit bg-white shadow-lg hover:cursor-pointer"
          >
            <Plus />
          </label>

          <input id="file-upload" type="file" name="image" className="hidden" />
        </div>
      </Form>
      <Form
        method="post"
        encType="multipart/form-data"
        className="flex flex-col gap-4 w-96"
        reloadDocument
      >
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
          placeholder="Max. 3 links. Seperate with new line. Facebook;https://www.facebook.com "
          className=" w-full py-2 px-4 rounded-lg border border-gray-300"
          defaultValue={user.linksAsText}
        />
        <button
          type="submit"
          className=" bg-green-400 px-3 py-2 rounded-full hover:bg-green-300 shadow-lg hover:shadow-md"
          name="_actionAfterSubmit"
          value="redirect"
        >
          Update
        </button>
        <button
          className=" bg-red-500 px-3 py-2 rounded-full hover:bg-red-400 shadow-lg hover:shadow-md"
          name="_actionAfterSubmit"
          value="deleteAccount"
          onClick={() => {
            if (confirm("Are you sure you want to delete your account?")) {
              handleDelete();
            }
          }}
        >
          Delete my user
        </button>
      </Form>
    </div>
  );
}

//TODO: move buttons and links in to a seperate component, so they can be reused in the forms
