import { useLoaderData, Link, Form } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";

import Markdown from "markdown-to-jsx";

export async function loader({ request }) {
  const db = await connectDb();
  const posts = await db.models.Post.find({
    postType: "post",
  });
  const jobPosts = await db.models.Post.find({
    postType: "jobPost",
  }).limit(4);
  const candidates = await db.models.User.find({
    userType: "candidate",
  }).limit(4);

  console.log(candidates);

  return { posts, jobPosts, candidates };
}

export default function Index() {
  const { posts, jobPosts, candidates } = useLoaderData();

  //TODO make cool welcomming page
  return (
    <>
      <h1 className=" mb-4  font-bold text-2xl md:text-4xl">
        The latest posts on Cnnect
      </h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div className=" md:w-3/5 md:flex flex-col gap-4 ">
          {posts.map((post) => (
            <div key={post._id} className="bg-white p-4 rounded-xl shadow-md">
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
            <h2 className="  font-bold text-xl md:text-2xl mb-2 px-1">
              The latest job posts on Cnnect
            </h2>

            <div className=" grid grid-cols-2 gap-4 mb-2 ">
              {jobPosts.map((jobPost) => (
                <div
                  key={jobPost._id}
                  className="bg-white p-4 rounded-xl shadow-md"
                >
                  <Markdown>{jobPost.body}</Markdown>
                </div>
              ))}
            </div>
            <Link className="px-1" to="/job-posts">
              See more
            </Link>
          </div>
          <div>
            <h2 className="  font-bold text-xl md:text-2xl  mb-2 px-1">
              The latest candidates on Cnnect
            </h2>

            <div className=" grid grid-cols-2 gap-4 mb-2 ">
              {candidates.map((candidate) => (
                <div
                  key={candidate._id}
                  className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center"
                >
                  <Link to={`/candidates/${candidate._id}`} className="z-10">
                    <img
                      src={
                        candidate?.image
                          ? `/uploads/${candidate.image.name}`
                          : "/403017_avatar_default_head_person_unknown_icon.png"
                      }
                      alt=""
                      className="w-32 h-32 rounded-full mb-2"
                    />
                  </Link>
                  <div>
                    <Link to={`/candidates/${candidate._id}`} className="z-10">
                      <h2 className="text-xl font-semibold text-center">
                        {`${candidate.firstname} ${candidate.lastname}`}
                      </h2>
                    </Link>

                    <ul className="flex gap-2 flex-wrap">
                      {candidate.tags?.map((tag) => (
                        <li key={tag}>
                          <Link
                            to={`/candidates/tag/${tag}`}
                            className=" bg-green-400 rounded-full px-2 hover:bg-green-300 z-20"
                          >
                            {tag}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/candidates">See more</Link>
          </div>
        </div>
      </div>
    </>
  );
}

//TODO: add pagination to the posts
//TODO: add show more to posts
//TODO: set up messaging system
