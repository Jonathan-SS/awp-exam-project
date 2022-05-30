import { useLoaderData, Link, Form } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";

import Markdown from "markdown-to-jsx";
import { redirect } from "@remix-run/node";

export async function loader({ request }) {
  const db = await connectDb();
  const countUsers = await db.models.User.countDocuments();
  console.log("count", countUsers);
  if (countUsers <= 0) {
    return redirect("/seed");
  }
  const url = new URL(request.url);
  let page = url.searchParams.get("p");
  if (!page) {
    page = 1;
  }
  console.log("herunder");
  console.log(page);
  const posts = await db.models.Post.find({
    postType: "post",
  })
    .limit(3)
    .skip(3 * (page - 1))
    .sort({ createdAt: -1 });
  const totalPages = await db.models.Post.countDocuments({ postType: "post" });
  console.log(totalPages);
  const jobPosts = await db.models.Post.find({
    postType: "jobPost",
  }).limit(4);
  const candidates = await db.models.User.find({
    userType: "candidate",
  }).limit(4);

  console.log(candidates);

  return { posts, jobPosts, candidates, totalPages };
}

export default function Index() {
  const { posts, jobPosts, candidates, totalPages } = useLoaderData();

  //TODOne make cool welcomming page
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
                  <Markdown
                    options={{
                      overrides: {
                        h1: {
                          props: {
                            style: {
                              fontSize: "1.75rem",
                              lineHeight: "2rem",
                              fontWeight: "600",
                            },
                          },
                        },
                        h2: {
                          props: {
                            style: {
                              fontSize: "1.5rem",
                              lineHeight: "1.75rem",
                              fontWeight: "500",
                            },
                          },
                        },
                        h3: {
                          props: {
                            style: {
                              fontSize: "1.25rem",
                              lineHeight: "1.5rem",
                              fontWeight: "500",
                            },
                          },
                        },
                        img: {
                          props: {
                            className: "shadow-md rounded-lg",
                          },
                        },
                        a: {
                          props: {
                            className: "prose",
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
          <Form className=" flex w-full items-center justify-center gap-6">
            {[...Array(totalPages)].map((e, i) =>
              i * 3 < totalPages ? (
                <button key={i + 1} type="page" name="p" value={i + 1}>
                  {i + 1}
                </button>
              ) : null
            )}
          </Form>
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
                  className="bg-white p-4 rounded-xl shadow-md 1:text-2xl h1:font-bold h2:text-xl h2:font-semibold h3:text-lg h3:font-semibold h4:text-md h4:font-semibold img:max-h-64 img:shadow-md img:rounded-lg"
                >
                  <Markdown
                    options={{
                      overrides: {
                        h1: {
                          props: {
                            style: {
                              fontSize: "1.75rem",
                              lineHeight: "2rem",
                              fontWeight: "600",
                            },
                          },
                        },
                        h2: {
                          props: {
                            style: {
                              fontSize: "1.5rem",
                              lineHeight: "1.75rem",
                              fontWeight: "500",
                            },
                          },
                        },
                        h3: {
                          props: {
                            style: {
                              fontSize: "1.25rem",
                              lineHeight: "1.5rem",
                              fontWeight: "500",
                            },
                          },
                        },
                        img: {
                          props: {
                            className: "shadow-md rounded-lg",
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
                    {jobPost.body.slice(0, 150)}
                  </Markdown>
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
                      className="w-32 h-32 rounded-full mb-2 object-cover"
                    />
                  </Link>
                  <div>
                    <Link to={`/candidates/${candidate._id}`} className="z-10">
                      <h2 className="text-xl font-semibold text-center">
                        {`${candidate.firstname} ${candidate.lastname}`}
                      </h2>
                    </Link>

                    <ul className="flex gap-2 flex-wrap align">
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
