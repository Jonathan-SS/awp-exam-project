import { useLoaderData, Link, Form, useSubmit } from "@remix-run/react";
import { useState, useEffect } from "react";

import connectDb from "~/db/connectDb.server.js";
import useJs from "../../hooks/useJs";
import Chat from "../../icons/Chat";
import { getSession } from "../../sessions.server";

export async function loader({ params, request }) {
  const db = await connectDb();
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);
  const userId = session.get("userId");
  const url = new URL(request.url);
  const name = url.searchParams.get("name");
  const tag = url.searchParams.get("tag");
  const sort = url.searchParams.get("sort");
  const allParams = { name, tag, sort };
  const allTags = await db.models.User.find({}, { tags: 1, _id: 0 });
  const allTagsArray = allTags.map(({ tags }) => tags).flat();
  const allTagsArrayUnique = [...new Set(allTagsArray)].sort((a, b) =>
    a.localeCompare(b)
  );
  console.log(tag);
  console.log(sort);
  console.log(name);

  if (tag) {
    return {
      candidates: await db.models.User.find(
        name
          ? {
              $or: [
                {
                  $and: [
                    { firstname: { $regex: new RegExp(name, "i") } },
                    { tags: tag },
                    { userType: "candidate" },
                    { _id: { $ne: userId } },
                  ],
                },
                {
                  $and: [
                    { lastname: { $regex: new RegExp(name, "i") } },
                    { tags: tag },
                    { userType: "candidate" },
                    { _id: { $ne: userId } },
                  ],
                },
              ],
            }
          : {
              tags: tag,
              userType: "candidate",
              _id: { $ne: userId },
            }
      ).sort({ sort: 1 }),
      allParams: allParams,
      tags: allTagsArrayUnique,
    };
  }
  return {
    candidates: await db.models.User.find(
      name
        ? {
            $or: [
              {
                $and: [
                  { firstname: { $regex: new RegExp(name, "i") } },
                  { userType: "candidate" },
                  { _id: { $ne: userId } },
                ],
              },
              {
                $and: [
                  { lastname: { $regex: new RegExp(name, "i") } },
                  { userType: "candidate" },
                  { _id: { $ne: userId } },
                ],
              },
            ],
          }
        : {
            userType: "candidate",
            _id: { $ne: userId },
          }
    ).sort({ sort: 1 }),
    allParams: allParams,
    tags: allTagsArrayUnique,
  };
}

export default function Candidates() {
  const submit = useSubmit();

  const hasJs = useJs();
  const { candidates, allParams, tags } = useLoaderData();
  function handleChange(event) {
    submit(event.currentTarget, { replace: true });
  }
  return (
    <div>
      <h1 className="text-3xl font-bold mb-3">All of our IT cadidates</h1>
      <div>
        <Form
          className="grid items-center gap-4 grid-cols-2 md:flex md:items-center"
          method="get"
          onChange={handleChange}
        >
          <div>
            <input
              className=" p-2 rounded-full mr-2"
              type="search"
              name="name"
              placeholder="Search..."
              defaultValue={allParams.name}
            />
            {!hasJs && (
              <button
                type="submit"
                className="  bg-green-400 px-3 py-2 rounded-full hover:bg-green-300 shadow-md hover:shadow-md mr-4"
              >
                Search
              </button>
            )}
          </div>
          <div className="flex justify-end">
            <select
              name="sort"
              type="sort"
              className="p-2 rounded-full  md:mr-2  "
              defaultValue={{ label: allParams.sort, value: allParams.sort }}
            >
              <option value="">Sort by</option>
              <option value="firstname">First Name</option>
              <option value="lastname">Last Name</option>
              <option value="createdAt">Date</option>
            </select>
            {!hasJs && (
              <button
                type="submit"
                className=" bg-green-400 px-3 py-2 rounded-full hover:bg-green-300 shadow-md hover:shadow-md mr-4"
              >
                Sort
              </button>
            )}
          </div>
          <div>
            <select
              name="tag"
              type="tag"
              id=""
              className="p-2 rounded-full mr-2"
              defaultValue={{ label: allParams.tag, value: allParams.tag }}
            >
              <option value="">Technology</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
            {!hasJs && (
              <button
                type="submit"
                className=" bg-green-400 px-3 py-2 rounded-full hover:bg-green-300 shadow-md hover:shadow-md mr-4"
              >
                Apply
              </button>
            )}
          </div>
        </Form>
      </div>
      <ul className=" py-2 pt-4 gap-4 justify-start grid grid-cols-1 md:grid-cols-3">
        {candidates.map((candidate) => (
          <li
            key={candidate._id}
            className=" bg-white p-4 rounded-xl grow max-w-md shadow-md "
          >
            <div className="flex gap-2 items-center">
              <Link to={`/candidates/${candidate._id}`} className="z-10 flex-1">
                <img
                  src={
                    candidate?.image
                      ? `/uploads/${candidate.image.name}`
                      : "/403017_avatar_default_head_person_unknown_icon.png"
                  }
                  alt=""
                  className="w-full h-auto rounded-full mr-4"
                />
              </Link>
              <div className=" w-2/3 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <Link to={`/candidates/${candidate._id}`} className="z-10">
                    <h2 className="text-xl font-semibold">
                      {`${candidate.firstname} ${candidate.lastname}`}
                    </h2>
                  </Link>
                  <Form
                    method="post"
                    action="/chat/chat-overview/chat-conversation"
                  >
                    <button
                      className=" bg-green-400 p-2 rounded-full hover:bg-green-300 "
                      type="submit"
                      title="Chat with this candidate"
                    >
                      <Chat />
                    </button>
                    <input
                      type="hidden"
                      name="participantId"
                      value={candidate._id}
                    />
                  </Form>
                </div>

                <ul className="flex gap-2 flex-wrap">
                  {candidate.tags?.map((tag) => (
                    <li key={tag}>
                      <Link
                        title="View all candidates with this technology"
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

            <div className="pt-2 flex flex-col gap-2">
              <p>
                {candidate.description &&
                  candidate.description?.slice(0, 100) + "..."}
              </p>

              <p className=" text-slate-400 text-sm">
                {"Created: " +
                  candidate.createdAt.slice(8, 10) +
                  candidate.createdAt.slice(4, 8) +
                  candidate.createdAt.slice(0, 4)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
// TODO: add a way to show all tags from every user
// TODO: fix the bios of the users
