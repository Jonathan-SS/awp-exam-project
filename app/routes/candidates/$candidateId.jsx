import { Form, useLoaderData } from "@remix-run/react";
import { Link } from "react-router-dom";
import connectDb from "~/db/connectDb.server";
import { getSession } from "../../sessions.server";
import Markdown from "markdown-to-jsx";

export async function loader({ request, params }) {
  const db = await connectDb();
  const userId = params.candidateId;
  const user = await db.models.Candidate.findById(userId);
  const posts = [];
  const postIds = user.get("posts");
  for (let i = 0; i < postIds.length; i++) {
    const post = await db.models.Post.findById(postIds[i]);
    posts.push(post);
  }

  return { user, posts };
}

export default function Profile() {
  const { user, posts } = useLoaderData();
  console.log(user);
  return (
    <div className="flex gap-4">
      <div className=" h-full w-80 bg-white p-4 rounded-xl">
        <div className="">
          <img
            src={
              user?.image
                ? `/uploads/${user.image.name}`
                : "/403017_avatar_default_head_person_unknown_icon.png"
            }
            alt=""
            className="w-64 h-64 m-auto rounded-full content object-cover bg-white"
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
        {posts.map((post) => (
          <div key={post._id} className="bg-white p-6 rounded-xl shadow-lg">
            <div className="rounded-lg  relative">
              <div
                className=" h1:text-2xl h1:font-bold h1:mb-4 h2:mb-2 h2:text-xl h2:font-semibold h3:text-lg h3:font-semibold h4:text-md h4:font-semibold img:max-h-64 img:shadow-md img:rounded-lg img:mb-2"
                id="markdownStyle"
              >
                <Markdown>{post.body}</Markdown>
                <Link to={`/candidates/${post.user.userId}`}>
                  <p className="text-slate-400">{`Candidate: ${post.user.userName}`}</p>
                </Link>

                <p className="text-slate-400">
                  {"Posted: " +
                    post.createdAt.slice(8, 10) +
                    post.createdAt.slice(4, 8) +
                    post.createdAt.slice(0, 4)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
