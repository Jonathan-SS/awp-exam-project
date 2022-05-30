import { useLoaderData, Link, Form, useSubmit } from "@remix-run/react";
import { useState, useEffect } from "react";
import Markdown from "markdown-to-jsx";

import connectDb from "~/db/connectDb.server.js";
import useJs from "../../hooks/useJs";

export async function loader({ params, request }) {
  const db = await connectDb();
  const url = new URL(request.url);
  const body = url.searchParams.get("body");
  const sort = url.searchParams.get("sort");
  const allParams = { body, sort };

  return {
    jobPosts: await db.models.Post.find(
      body
        ? {
            $and: [
              { body: { $regex: new RegExp(body, "i") } },
              { postType: "jobPost" },
            ],
          }
        : { postType: "jobPost" }
    ).sort({ createdAt: 1 }),
    allParams: allParams,
  };
}

export default function Candidates() {
  const submit = useSubmit();
  const hasJs = useJs();
  const { jobPosts, allParams } = useLoaderData();
  function handleChange(event) {
    submit(event.currentTarget, { replace: true });
  }
  return (
    <div>
      <h1 className="text-2xl md:text-4xl font-bold mb-3">
        All of our job posts
      </h1>
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
              className="  bg-green-400 px-3 py-2 rounded-full hover:bg-green-300 shadow-md hover:shadow-md mr-4"
            >
              Search
            </button>
          )}
        </Form>
      </div>
      <ul className=" py-2 pt-4 gap-4 justify-start grid grid-cols-1 md:grid-cols-3">
        {jobPosts.map((jobPost) => (
          <li
            key={jobPost._id}
            className=" bg-white p-4 rounded-xl grow max-w-md shadow-md "
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
              {jobPost.body}
            </Markdown>
            <div>
              <p className=" text-slate-400 text-sm">
                {"Created: " +
                  jobPost.createdAt.slice(8, 10) +
                  jobPost.createdAt.slice(4, 8) +
                  jobPost.createdAt.slice(0, 4)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
//TODO limit desciptions on both posttypes
//TODO add view and hide on passwords
//TODO add ability for recruiters to save candidates
//TODO research how to update chats and the chat icon in the nav
//TODO responsive design
