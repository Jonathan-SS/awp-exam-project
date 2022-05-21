import { Form, useLoaderData } from "@remix-run/react";
import { Link } from "react-router-dom";
import connectDb from "~/db/connectDb.server";
import { getSession } from "../../sessions.server";
//TODO add option to change image and add one
export async function loader({ request, params }) {
  const db = await connectDb();
  const userId = params.candidateId;

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
                    <a
                      key={link.name}
                      rel="noreferrer"
                      target="_blank"
                      href={link.url}
                    >
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
        <div className=" bg-white p-4 rounded-xl">
          <div className="rounded-lg border border-slate-300 p-4 relative">
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
