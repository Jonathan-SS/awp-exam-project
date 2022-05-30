import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { Link } from "react-router-dom";
import connectDb from "~/db/connectDb.server";
import { getSession, requireSession } from "../../sessions.server";
import { useRef, useEffect } from "react";
import Markdown from "markdown-to-jsx";
import Close from "../../icons/Close";
import { json } from "@remix-run/node";
import ReactTooltip from "react-tooltip";

//TODO add option to change image and add one
export async function loader({ request, params }) {
  await requireSession(request);
  const db = await connectDb();
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);
  const userId = session.get("userId");
  const user = await db.models.User.findById(userId);
  const posts = await db.models.Post.find({ "user.userId": userId });

  return { user, posts };
}

export const action = async ({ request }) => {
  const db = await connectDb();
  const form = await request.formData();
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);
  const userId = session.get("userId");
  try {
    if (form.get("_action") === "deletePost") {
      const postId = form.get("postId");
      await db.models.Post.deleteOne({ posts: postId });
      await db.models.User.updateOne(
        { _id: userId },
        { $pull: { posts: postId } }
      );
      return null;
    }

    const post = await db.models.Post.create({
      body: form.get("body"),
      user: {
        userId: userId,
        userName: form.get("userName"),
      },
      postType: form.get("postType"),
    });

    await db.models.User.updateOne(
      {
        _id: userId,
      },
      {
        $addToSet: {
          posts: post._id,
        },
      }
    );
    return null;
  } catch (error) {
    console.error(error);
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
};

export default function Profile() {
  const { user, posts } = useLoaderData();
  const actionData = useActionData();
  console.log(user.image);

  let transition = useTransition();
  let isAdding =
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "addPost";
  let formRef = useRef();

  useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset();
    }
  }, [isAdding]);

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

        <Link to="/profile/edit"> Edit profile</Link>

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
        <div className=" flex-2 bg-white p-4 rounded-xl shadow-md">
          <h2 className=" font-bold text-2xl mb-4">
            Share a Post on your profile
          </h2>
          <Form
            ref={formRef}
            method="post"
            className="flex gap-4 items-start flex-col"
          >
            <input
              type="hidden"
              name="postType"
              value={user.userType === "candidate" ? "post" : "jobPost"}
            />
            {actionData ? (
              <p className="text-red-500 px-4 -m-3 ">
                {actionData.errors?.body.message}
              </p>
            ) : (
              <p></p>
            )}
            <textarea
              className=" w-full py-2 px-4 rounded-lg border border-gray-300"
              name="body"
              id=""
              cols="20"
              rows="3"
              placeholder="Share your thoughts, a cool project, or a cool idea. "
            ></textarea>
            <p
              data-tip="(Headings: # ## ###) (Image:
              ![alt-text](Link)) (link: [title](Link)) "
              className="text-sm text-slate-400 -mt-2 px-2"
            >
              Psst...you can use <u>MarkDown formatting.</u>
            </p>
            <ReactTooltip place="bottom" type="info" effect="solid" />

            <input
              type="hidden"
              name="userName"
              value={`${user.firstname} ${user.lastname}`}
            />
            <button
              className=" bg-green-400 px-3 py-2 rounded-full hover:bg-green-300 shadow-md hover:shadow-md"
              type="submit"
              name="_action"
              value="addPost"
              disabled={transition.state === "submitting"}
            >
              Share
            </button>
          </Form>
        </div>
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white p-6 rounded-xl shadow-md h-100 h1"
          >
            <div className="rounded-lg relative hover:text-2xl ">
              <div className="">
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

                <p className="text-slate-400">
                  {user
                    ? "Posted: " +
                      post.createdAt.slice(8, 10) +
                      post.createdAt.slice(4, 8) +
                      post.createdAt.slice(0, 4)
                    : null}
                </p>
              </div>
              <Form method="post" className=" -right-4 -top-4 absolute p-2">
                <input type="hidden" name="postId" value={post._id} />
                <button
                  type="submit"
                  name="_action"
                  value="deletePost"
                  disabled={transition.state === "submitting"}
                  className="p-1 bg-red-500 rounded-full shadow-md hover:shadow-md"
                >
                  <Close className="h-4 w-4" color="white" />
                </button>
              </Form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

//TODOone set up ability to add a post to profile and delete it
//TODOone set up way to use markdown to add a post
//TODO add a profile page for recruiters where they can post jobs
