import { useLoaderData, Link, Form } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";

import Markdown from "markdown-to-jsx";

export async function loader({ request }) {
  const db = await connectDb();
  const posts = await db.models.Post.find();

  return posts;
}

export default function Index() {
  const posts = useLoaderData();
  //TODO make cool welcomming page
  return (
    <>
      <h1 className=" mb-4  font-bold text-4xl">The latest posts on Cnnect</h1>
      <div className="flex gap-4">
        <div className=" w-3/5 flex flex-col gap-4 ">
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
        <div className=" flex flex-col gap-4 flex-1">
          <div>
            <h2 className="  font-bold text-2xl mb-2">
              The latest job posts on Cnnect
            </h2>
            <div className="bg-white p-4 rounded-xl shadow-lg"></div>
          </div>
          <div>
            <h2 className="  font-bold text-2xl mb-2">
              The latest candidates on Cnnect
            </h2>
            <div className="bg-white p-4 rounded-xl shadow-lg"></div>
          </div>
        </div>
      </div>
    </>
  );
}

//TODO: add pagination to the posts
//TODO: add show more to posts
