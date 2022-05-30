import { useLoaderData } from "@remix-run/react";
import { Link } from "react-router-dom";
import connectDb from "~/db/connectDb.server";

import Markdown from "markdown-to-jsx";

export async function loader({ request, params }) {
  const db = await connectDb();
  const userId = params.candidateId;
  const user = await db.models.User.findById(userId);

  const posts = await db.models.Post.find({
    "user.userId": userId,
  });

  return { user, posts };
}

export default function Profile() {
  const { user, posts } = useLoaderData();

  return (
    <div className="flex gap-8 md:gap-4 flex-col md:flex-row">
      <div className=" h-full md:w-80 bg-white p-4 rounded-xl shadow-md">
        <div className=" relative">
          <img
            src={
              user?.image
                ? `/uploads/${user.image.name}`
                : "/403017_avatar_default_head_person_unknown_icon.png"
            }
            alt=""
            className=" w-64 h-64 m-auto rounded-full content object-cover bg-white "
          />
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <h2 className="text-xl font-semibold">{`${user?.firstname} ${user?.lastname}`}</h2>
          <div>
            <h3 className=" font-semibold text-lg">Bio</h3>
            <p className=" break-words">
              {user?.description
                ? user.description
                : " Looks like you haven't added a description to your profile. Go To Edit profile to add one."}
            </p>
          </div>

          <div>
            <h3 className=" font-semibold text-lg">Links</h3>
            <div className="grid grid-cols-1">
              {user.links.length > 0
                ? user.links?.map((link) => (
                    <a
                      key={link.name}
                      rel="noreferrer"
                      target="_blank"
                      href={link.url}
                      className="text-blue-500 hover:text-blue-700 underline"
                    >
                      {link.name}
                    </a>
                  ))
                : " Looks like you haven't added any links to your profile. Go To Edit profile to add some."}
            </div>
          </div>

          <div>
            <h3 className=" font-semibold text-lg">Tags</h3>
            <div className="flex gap-2 flex-wrap">
              {user.tags.length > 0
                ? user.tags?.map((tag) => (
                    <Link
                      key={tag}
                      to={`/candidates/tag/${tag}`}
                      className=" bg-green-400 rounded-full px-2 hover:bg-green-300"
                    >
                      {tag}
                    </Link>
                  ))
                : " Looks like you haven't added any tags to your profile. Go To Edit profile to add some."}
            </div>
          </div>

          <p className=" text-slate-400 text-sm">
            {user
              ? "Created: " +
                user.createdAt.slice(8, 10) +
                user.createdAt.slice(4, 8) +
                user.createdAt.slice(0, 4)
              : null}
          </p>
        </div>
      </div>
      <div className=" flex flex-col gap-4 flex-1">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white p-6 rounded-xl shadow-md h-100 h1"
            >
              <div className="rounded-lg relative">
                <div className=" h1:text-3xl">
                  <Markdown
                    options={{
                      overrides: {
                        h1: {
                          props: {
                            style: {
                              fontSize: "1.75rem",
                              lineHeight: "2rem",
                              fontWeight: "600",
                              marginBottom: "1rem",
                            },
                          },
                        },
                        h2: {
                          props: {
                            style: {
                              fontSize: "1.5rem",
                              lineHeight: "1.75rem",
                              fontWeight: "500",
                              marginBottom: "1rem",
                            },
                          },
                        },
                        h3: {
                          props: {
                            style: {
                              fontSize: "1.25rem",
                              lineHeight: "1.5rem",
                              fontWeight: "500",
                              marginBottom: "1rem",
                            },
                          },
                        },
                        img: {
                          props: {
                            className: "shadow-md rounded-lg",
                            marginBottom: "1rem",
                            marginTop: "1rem",
                            maxHeight: "200px",
                          },
                        },
                        a: {
                          props: {
                            className: "prose",
                            target: "_blank",
                            style: {
                              textDecoration: "underline",
                              color: "#2563eb",
                            },
                          },
                        },
                      },
                    }}
                  >
                    {post.body}
                  </Markdown>

                  <p className="text-slate-400">
                    {user
                      ? "Posted: " +
                        post.createdAt.slice(8, 10) +
                        post.createdAt.slice(4, 8) +
                        post.createdAt.slice(0, 4)
                      : null}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h2 className=" text-2xl font-bold">
            This user hasn't posted anything yet.
          </h2>
        )}
        {}
      </div>
    </div>
  );
}
