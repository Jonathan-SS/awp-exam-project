import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { Link } from "react-router-dom";
import connectDb from "~/db/connectDb.server";
import { getSession, requireSession } from "../../sessions.server";
import Plus from "../../icons/Plus";
import useJs from "../../hooks/useJs";
import {
  unstable_parseMultipartFormData,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
} from "@remix-run/node";
//TODO add option to change image and add one
export async function loader({ request, params }) {
  requireSession(request);
  const db = await connectDb();
  const cookie = request.headers.get("Cookie");

  const session = await getSession(cookie);
  const userId = session.get("userId");
  console.log(userId);
  const user = await db.models.Candidate.findById(userId);
  console.log(user);
  return user;
}

// export async function action({ request }) {
//   const db = await connectDb();

//   const uploadHandler = unstable_composeUploadHandlers(
//     unstable_createFileUploadHandler({
//       uploadDir: "./uploads",
//       uploadUrl: "/uploads",
//     })
//   );

//   const formData = await unstable_parseMultipartFormData(
//     request,
//     uploadHandler
//   );
//   const file = formData.get("image");
//   console.log(file);
//   return null;
// }

export const action = async ({ request }) => {
  const cookie = request.headers.get("Cookie");

  const session = await getSession(cookie);
  const userId = session.get("userId");
  const db = await connectDb();
  const fileUploadHandler = unstable_createFileUploadHandler({
    directory: "./public/uploads",
    file: ({ filename }) => filename,
  });

  const formData = await unstable_parseMultipartFormData(
    request,
    fileUploadHandler
  );
  console.log(formData.get("image")); // will return the filename
  const image = formData.get("image");
  await db.models.Candidate.findByIdAndUpdate(userId, { image: image });
  //TODO image is in uploads folder, maybe thats okay?, but need to change the name og th efile
  return null;
};

export default function Profile() {
  const user = useLoaderData();
  const submit = useSubmit();
  const hasJs = useJs();
  console.log(user);
  function handleChange(event) {
    submit(event.currentTarget, { replace: true });
  }
  return (
    <div className="flex gap-8">
      <div className=" h-full w-80 bg-white p-4 rounded-xl">
        <div className=" relative">
          <img
            src="/403017_avatar_default_head_person_unknown_icon.png"
            alt=""
          />
          <Form
            className=" absolute flex bottom-2 
          w-full justify-end "
            method="post"
            onChange={handleChange}
            encType="multipart/form-data"
          >
            {!hasJs ? (
              <button
                type="submit"
                className="bg-green-400 px-3 py-2 rounded-full hover:bg-green-300 shadow-lg hover:shadow-md mr-4"
              >
                Apply image
              </button>
            ) : null}

            <label
              for="file-upload"
              className="rounded-full p-4 hover:shadow-md w-fit bg-white shadow-lg hover:cursor-pointer"
            >
              <Plus />
            </label>
            <input type="hidden" name="action" value="profileImage" />
            <input
              id="file-upload"
              type="file"
              name="image"
              className="hidden"
            />
          </Form>
        </div>

        <Link to="/profile/edit"> Edit profile</Link>

        <div className="pt-2 flex flex-col gap-2">
          <h2 className="text-xl font-semibold">{`${user.firstname} ${user.lastname}`}</h2>
          <div>
            <h3 className=" font-semibold text-lg">Bio</h3>
            <p>
              {user.description
                ? user.description
                : " Looks like you haven't added a description your profile. Go To Edit profile to add one."}
            </p>
          </div>

          <div>
            <h3 className=" font-semibold text-lg">Links</h3>
            <div>
              {user.links
                ? user.links?.map((link) => (
                    <a key={link.name} href={link.url}>
                      {link.name}
                    </a>
                  ))
                : null}
            </div>
          </div>

          <div>
            <h3 className=" font-semibold text-lg">Tags</h3>
            <div className="flex gap-2">
              {user.tags.length > 0
                ? user.tags?.map((tag) => (
                    <p
                      key={tag}
                      className=" bg-green-400 rounded-full px-2 hover:bg-green-300"
                    >
                      {tag}
                    </p>
                  ))
                : " Looks like you haven't added any tags to your profile. Go To Edit profile to add some."}
            </div>
          </div>

          <p className=" text-slate-400 text-sm">
            {"Created: " +
              user.createdAt.slice(8, 10) +
              user.createdAt.slice(4, 8) +
              user.createdAt.slice(0, 4)}
          </p>
        </div>
      </div>
      <div className=" flex flex-col gap-8 flex-1">
        <div className=" flex-2 bg-white p-4 rounded-xl">
          <h2 className=" font-bold text-2xl mb-4">
            Share a Post on your profile
          </h2>
          <Form method="post" className="flex gap-4 items-start flex-col">
            <textarea
              className=" w-full py-2 px-4 rounded-lg border border-gray-300"
              name="post"
              id=""
              cols="20"
              rows="3"
            ></textarea>
            <button
              className=" bg-green-400 px-3 py-2 rounded-full hover:bg-green-300 shadow-lg hover:shadow-md"
              type="submit"
            >
              Share
            </button>
          </Form>
        </div>
        <div className=" flex-1 bg-white p-4 rounded-xl">
          <div className="rounded-lg border border-slate-300 p-4 relative">
            <Form method="post" className=" absolute right-0">
              <button>Delete post</button>
            </Form>
            <div>
              <h3 className=" font-bold text-xl mb-4">This is a post</h3>
              <p>This is the text of the post</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
