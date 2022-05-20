import { useLoaderData, Link, Form, useSubmit } from "@remix-run/react";
import { useState, useEffect } from "react";

import connectDb from "~/db/connectDb.server.js";

export async function loader({ params, request }) {
  const db = await connectDb();
  const url = new URL(request.url);
  const name = url.searchParams.get("name");
  const tag = url.searchParams.get("tag");
  const sort = url.searchParams.get("sort");
  const allParams = { name, tag, sort };

  console.log(name);

  if (tag) {
    return {
      candidates: await db.models.Candidate.find(
        name
          ? {
              $or: [
                {
                  $and: [
                    { firstname: { $regex: new RegExp(name, "i") } },
                    { tags: tag },
                  ],
                },
                {
                  $and: [
                    { lastname: { $regex: new RegExp(name, "i") } },
                    { tags: tag },
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

  return {
    candidates: await db.models.Candidate.find(
      name
        ? {
            $or: [
              {
                $and: [{ firstname: { $regex: new RegExp(name, "i") } }],
              },
              {
                $and: [{ lastname: { $regex: new RegExp(name, "i") } }],
              },
            ],
          }
        : {}
    ).sort({ [sort]: -1 }),
    allParams: allParams,
  };
}

export default function Candidates() {
  const submit = useSubmit();
  const [hasJs, setHasJs] = useState(false);
  const { candidates, allParams } = useLoaderData();
  function handleChange(event) {
    submit(event.currentTarget, { replace: true });
  }

  useEffect(() => {
    setHasJs(true);
  }, []);

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
              className=" bg-green-400 px-3 py-2 rounded-full  mr-4"
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
            <option value="" selected>
              Sort by
            </option>
            <option value="firstname">First Name</option>
            <option value="lastname">Last Name</option>
            <option value="createdAt">Date</option>
          </select>
          {!hasJs && (
            <button
              type="submit"
              className=" bg-green-400 px-3 py-2 rounded-full mr-4"
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
            <option value="" selected>
              Technology
            </option>
            <option value="WP">WP</option>
            <option value="vue">Vue</option>
          </select>
          {!hasJs && (
            <button
              type="submit"
              className=" bg-green-400 px-3 py-2 rounded-full  mr-4"
            >
              Apply
            </button>
          )}
        </Form>
      </div>
      <ul className="flex py-2 pt-4 gap-4">
        {candidates.map((candidate) => (
          <li key={candidate._id} className=" w-72 bg-white p-4 rounded-xl">
            <Link to="">
              <div className="">
                <img
                  src="/403017_avatar_default_head_person_unknown_icon.png"
                  alt=""
                />
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <h2 className="text-xl font-semibold">
                  {`${candidate.firstname} ${candidate.lastname}`}
                </h2>

                <p>{candidate.description}</p>
                <div className="flex gap-2">
                  <div className="flex gap-2">
                    {candidate.tags.length > 0
                      ? candidate.tags?.map((tag) => (
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
