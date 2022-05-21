import { Form, useLoaderData } from "@remix-run/react";
import { Link } from "react-router-dom";
import connectDb from "~/db/connectDb.server";
import { getSession, requireSession } from "../../sessions.server";
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

export default function Profile() {
  const user = useLoaderData();
  console.log(user);
  return (
    <div className="flex gap-8">
      <div className=" h-full w-80 bg-white p-4 rounded-xl">
        <div className="">
          <img
            src="/403017_avatar_default_head_person_unknown_icon.png"
            alt=""
          />
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
