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

//TODO add delete prfile option
export async function loader({ request }) {
  await requireSession(request);
  const db = await connectDb();
  const cookie = request.headers.get("Cookie");

  const session = await getSession(cookie);
  const userId = session.get("userId");
  console.log(userId);
  const user = await db.models.User.findById(userId);
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

  const image = formData.get("image");
  if (image) {
    const imageUpload = await db.models.User.findByIdAndUpdate(userId, {
      image: image,
    });
    console.log(imageUpload.image);
  }

  const form = await request.formData();
  const firstname = formData.get("firstname");
  const lastname = formData.get("lastname");
  const email = formData.get("email");
  const description = formData.get("description");
  const tags = formData
    .get("tags")
    ?.split(",")
    .filter((tag) => tag.length > 0);

  const linksText = formData.get("links");
  const links = formData
    .get("links")
    ?.split("\n")
    .filter((link) => link.length > 0);

  const seperatedLinks = [];
  links?.forEach((link) => {
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

    await db.models.User.updateOne(
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
    submit(null, { method: "get", action: "../delete-account" });
  }

  function checkNumberOfLines(e) {
    const lines = e.target.value.split("\n").length;
    if (lines > 3) {
      e.target.value = "That's too many links, try again";
    }
  }
  function checkNumberOfCommas(e) {
    const commas = e.target.value.split(",").length;
    console.log(commas);
    if (commas > 5) {
      e.target.value = "That's too many tags, try again";
    }
  }

  return (
    <div className="flex flex-col items-center m-auto md:w-96">
      <Logo />
      <div className="text-center mt-4 flex flex-col gap-4 ">
        <h1 className=" text-2xl md:text-4xl font-bold mb-4 ">
          Time to add some more information
          <br /> to your profile?
        </h1>
      </div>

      <Form
        method="post"
        encType="multipart/form-data"
        className="flex flex-col gap-4 w-full"
        onChange={handleChange}
        reloadDocument
      >
        <div className=" relative mb-4">
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

          <button
            type="button"
            onClick={() => {
              document.getElementById("file-upload").click();
            }}
            htmlFor="file-upload"
            className=" block absolute bottom-2 right-20 rounded-full p-4 hover:shadow-md w-fit bg-white shadow-md hover:cursor-pointer"
          >
            <Plus />
          </button>

          <input id="file-upload" type="file" name="image" className="hidden" />
        </div>
      </Form>
      <Form
        method="post"
        encType="multipart/form-data"
        className="flex flex-col gap-4 w-full"
        reloadDocument
      >
        <label htmlFor="firstname" className="-my-3 px-2 text-slate-400">
          First Name
        </label>
        <input
          type="text"
          name="firstname"
          placeholder="First Name"
          className=" w-full py-2 px-4 rounded-full border border-gray-300"
          defaultValue={user.firstname}
        />
        <label htmlFor="lastname" className="-my-3 px-2 text-slate-400">
          Last Name
        </label>
        <input
          type="text"
          name="lastname"
          placeholder="Last Name"
          className=" w-full py-2 px-4 rounded-full border border-gray-300"
          defaultValue={user.lastname}
        />
        <label htmlFor="email" className="-my-3 px-2 text-slate-400">
          Email
        </label>
        <input
          type="text"
          name="email"
          placeholder="Email"
          className=" w-full py-2 px-4 rounded-full border border-gray-300"
          defaultValue={user.email}
        />
        <label htmlFor="Password" className="-my-3 px-2 text-slate-400">
          Password - Minimum 8 characters
        </label>

        <input
          type="text"
          name="Password"
          placeholder="New Password"
          className=" w-full py-2 px-4 rounded-full border border-gray-300"
        />
        <label htmlFor="PasswordRepeat" className="-my-3 px-2 text-slate-400">
          Repeat New Password
        </label>

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
          maxlength="300"
          className=" w-full py-2 px-4 rounded-lg border border-gray-300"
          placeholder="Max. 300 characters."
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
          onKeyUp={checkNumberOfCommas}
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
          onKeyUp={checkNumberOfLines}
          placeholder="Max. 3 links. Seperate with new line. Facebook;https://www.facebook.com "
          className=" w-full py-2 px-4 rounded-lg border border-gray-300"
          defaultValue={user.linksAsText}
        />
        <button
          type="submit"
          className=" bg-green-400 px-3 py-2 rounded-full hover:bg-green-300 shadow-md hover:shadow-md"
          name="_actionAfterSubmit"
          value="redirect"
        >
          Update
        </button>
        <button
          className=" bg-red-500 px-3 py-2 rounded-full hover:bg-red-400 shadow-md hover:shadow-md"
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
//TODO: make a tooltip self, code is actiong up
