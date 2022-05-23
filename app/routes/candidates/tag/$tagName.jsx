import { useLoaderData, Link, Form, useSubmit } from "@remix-run/react";
import { useState, useEffect } from "react";

import connectDb from "~/db/connectDb.server.js";
import useJs from "../../../hooks/useJs";

export async function loader({ params, request }) {
  const db = await connectDb();
  const url = new URL(request.url);
  const name = url.searchParams.get("name");
  const sort = url.searchParams.get("sort");
  const tag = params.tagName;
  const allParams = { name, tag, sort };

  console.log(name);

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
                ],
              },
              {
                $and: [
                  { lastname: { $regex: new RegExp(name, "i") } },
                  { tags: tag },
                  { userType: "candidate" },
                ],
              },
            ],
          }
        : {
            tags: tag,
          }
    ).sort({ [sort]: -1 }),
    allParams: allParams,
  };
}

export default function Tag() {
  const submit = useSubmit();

  const hasJs = useJs();
  const { candidates, allParams } = useLoaderData();
  function handleChange(event) {
    submit(event.currentTarget, { replace: true });
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-3">All of our IT cadidates</h1>
      <div className="flex items-center gap-4">
        <Form method="get" onChange={handleChange}>
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
              className="  bg-green-400 px-3 py-2 rounded-full hover:bg-green-300 shadow-lg hover:shadow-md mr-4"
            >
              Search
            </button>
          )}

          <select
            name="sort"
            type="sort"
            className="p-2 rounded-full mr-2  "
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
              className=" bg-green-400 px-3 py-2 rounded-full hover:bg-green-300 shadow-lg hover:shadow-md mr-4"
            >
              Sort
            </button>
          )}

          <select
            name="tag"
            type="tag"
            id=""
            className="p-2 rounded-full mr-2"
            defaultValue={{ label: allParams.tag, value: allParams.tag }}
          >
            <option value="">Technology</option>
            <option value="WP">WP</option>
            <option value="vue">Vue</option>
          </select>
          {!hasJs && (
            <button
              type="submit"
              className=" bg-green-400 px-3 py-2 rounded-full hover:bg-green-300 shadow-lg hover:shadow-md mr-4"
            >
              Apply
            </button>
          )}
        </Form>
      </div>
      <ul className="flex py-2 pt-4 gap-4 flex-wrap justify-start">
        {candidates.map((candidate) => (
          <li
            key={candidate._id}
            className="w-72 bg-white p-4 rounded-xl grow min-w-xs max-w-xs "
          >
            <Link to={`/candidates/${candidate._id}`} className="z-10">
              <div className="flex">
                <img
                  src="/403017_avatar_default_head_person_unknown_icon.png"
                  alt=""
                  className="w-24 h-24 rounded-full mr-4"
                />
                <div>
                  <h2 className="text-xl font-semibold">
                    {`${candidate.firstname} ${candidate.lastname}`}
                  </h2>
                  <div className="flex gap-2 flex-wrap">
                    {candidate.tags?.map((tag) => (
                      <Link
                        key={tag}
                        to={`/candidates/tag/${tag}`}
                        className=" bg-green-400 rounded-full px-2 hover:bg-green-300 z-20"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <p>{candidate.description}</p>
                <div className="flex gap-2"></div>
                <p className=" text-slate-400 text-sm">
                  {"Created: " +
                    candidate.createdAt.slice(8, 10) +
                    candidate.createdAt.slice(4, 8) +
                    candidate.createdAt.slice(0, 4)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
// add a way to show all tags from every user
